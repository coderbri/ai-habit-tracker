# AI Habit Tracker — Changelog

All notable changes to the AI Habit Tracker project will be documented in this file.

## v0.6.0 – Building AI APIs with Google Gemini
**Release Date:** July 31, 2026

- Integrated Google's Gemini model to power 5 AI features:
  - **Weekly report** — personalized review of the past 7 days
  - **Habit suggestions** — 3 personalized habits based on the user's goals
  - **Streak recovery plan** — a 3-day comeback plan when a streak breaks
  - **Habit chat** — natural-language Q&A grounded in the user's habit data
  - **Morning motivation** — a short personalized message each morning
- Built the `AIInsight` model to persist every AI response:
  - `type` is constrained to `["weekly", "suggestion", "recovery", "chat", "morning"]`, useful for filtering by content type later
  `meta` is a flexible field for extra context per type (e.g. the question asked, or the habit id behind a recovery plan)
  - Persisting insights matters for three reasons: (1) gives users a history to look back on, (2) enables caching to avoid re-calling the API for the same content, and (3) is real usage data to improve prompts later
- Built the Gemini client wrapper (`utils/aiService.js`):
  - Lazily initializes the `GoogleGenAI` client only on first use, and only if `GEMINI_API_KEY` is set — so the app doesn't crash on startup when the key is missing
  - `isAIEnabled()` checks whether the key is configured
  - `parseJSON()` strips markdown code fences (````json ... ````) from model output before parsing, for endpoints that expect structured JSON back
  - `chatCompletion()` wraps the actual Gemini call; if AI is disabled or the request fails, it returns a graceful fallback message instead of throwing
  - `SYSTEM_PROMPTS` holds one system instruction per feature, controlling tone, length, and (for suggestions) the expected JSON shape
- Built `aiController.js` with `weeklyReport`, `suggestHabits`, `recoveryPlan`, `chatAnalysis`, and `morningMotivation`, each assembling the relevant habit/log context and calling `chatCompletion` with the matching system prompt
- Wired everything through new `/api/ai` routes, protected by the existing JWT middleware, and mounted them in `server.js`

> Known issues (deferred to next session, which will focus on Postman testing):
> - `buildWeeklyContext` computes a habit's 7-day completion count but never uses it — the returned object still carries an unused/undefined `completedDate` field instead, so weekly reports currently reference the wrong data per habit.
> - `suggestHabits` parses the AI's JSON response but never assigns it to `suggestions`, so this endpoint currently always falls back to the hard-coded default habits regardless of what Gemini returns.

### Files created/modified:

- `server/models/AIInsight.js` (created)
- `server/utils/aiService.js` (created)
- `server/controllers/aiController.js` (created)
- `server/routes/ai.js` (created)
- `server/server.js` (modified — mounted /api/ai routes)

---

## v0.5.0 – Building the Habit Log API & Date Helpers
**Release Date:** July 30, 2026

- Implemented habit completions — the check-offs that drive streaks and heatmaps — as one HabitLog record per habit per day
- Built `logController.js` covering `markComplete`, `unmarkComplete`, `getToday`, `getRange`, `getHeatmap`, `getHabitStats`, and `getAllStats`
  - `markComplete` is an idempotent upsert (via `$setOnInsert`), so marking the same habit complete twice in one day is safe
  - `unmarkComplete` uses `DELETE` rather than a more typical `PATCH`/body flag — unusual, but keeps the mark/unmark pair symmetric as two clear actions on the same route
- Built `utils/dateHelpers.js` for date-key formatting and streak math: `todayKey`, `last90Days`, `currentWeekKeys`, `lastNDays`, and `calcStreak` (walks completion dates to compute current and longest streaks)
- Wired everything through new `/api/logs` routes, protected by the existing JWT middleware, and mounted them in `server.js`
- Tested in Postman with an Authorization: `Bearer <token>` header on every request; see [`API_TESTING.md`](./API_TESTING.md) for full request/response examples

> Known issue: unmarkComplete currently calls `findOneAndUpdate` without an update document, so the log entry isn't actually removed — needs to be `findOneAndDelete`. Flagged for a fix next session.

### Files created/modified:

- `server/controllers/logController.js` (created)
- `server/utils/dateHelpers.js` (created)
- `server/routes/logs.js` (created)
- `server/server.js` (modified — mounted /api/logs routes)

---

## v0.4.0 – Habits CRUD
**Release Date:** July 25, 2026

- Built the `Habit` model: name, description, category (enum), frequency (`daily`/`weekly`), target days, color, icon, an `isArchived` soft-delete flag, and an `order` field for manual drag-and-drop reordering
- Built the `HabitLog` model for daily completions, storing `completedDate` as a `"YYYY-MM-DD"` string to avoid timezone offset issues, with a compound unique index on `userId` + `habitId` + `completedDate` to prevent duplicate completions per day
- Built `habitController.js` covering `getHabits`, `createHabit`, `updateHabit`, `deleteHabit`, `archiveHabit`, and `reorderHabits`; deleting a habit cascades to remove its associated `HabitLog` entries
- Wired everything through new `/api/habits` routes, all protected by the existing `protect` JWT middleware, and mounted them in `server.js`
- Tested the full CRUD flow in Postman using an `Authorization: Bearer <token>` header on every request; see [API_TESTING.md](./API_TESTING.md) for full request/response examples

### Files created/modified:

- `server/models/Habit.js` (created)
- `server/models/HabitLog.js` (created)
- `server/controllers/habitController.js` (created)
- `server/routes/habits.js` (created)
- `server/server.js` (modified — mounted /api/habits routes)

---

## v0.3.0 – Establishing User Model and Authentication
**Released:** July 24, 2026

- Built the `User` model with pre-save password hashing, an instance method to compare passwords on login, and a `toJSON` override to strip the password hash from any response
- Built `protect` middleware to verify JWTs from the `Authorization` header and attach the authenticated user to `req.user`
- Built `authController.js` covering registration, login, fetching the current user, and profile updates, each issuing/expecting a signed JWT
- Wired all of the above through new `/api/auth` routes and mounted them in `server.js`
- Tested registration and login end-to-end in Postman

### Files created/modified:

- `server/models/User.js` (created)
- `server/middleware/auth.js` (created)
- `server/controllers/authController.js` (created)
- `server/routes/auth.js` (created)
- `server/server.js` (modified — mounted `/api/auth` routes)

---

## v0.2.0 – Setting up Environmental Variables and Backend Server
**Released:** July 24, 2026

- Created a MongoDB Atlas cluster and retrieved the connection API key
- Retrieved a Gemini API key from Google AI Studio
- Generated a `JWT_SECRET` using a 64-byte random hex string:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```

- Completed `.env` file setup with the above credentials
- Set up database configuration and server error-handling middleware
  - **`config/db.js`**: connects to MongoDB Atlas via Mongoose using `MONGO_URI`, exits the process on connection failure
  - **`middleware/errorHandler.js`**: notFound handler for unmatched routes, errorHandler for consistent JSON error responses
  - **`server.js`**: Express app setup with CORS (allows localhost in development plus explicit origins via `CLIENT_URL`), JSON body parsing, a `/api/health` check route, and error-handling middleware; server only starts listening after a successful DB connection

- Verified server connection via the `/api/health` route:
  ```json
  {"status":"ok","time":"2026-07-24T20:40:48.769Z"}
  ```

### Files created/modified:

- `server/config/db.js` (created)
- `server/middleware/errorHandler.js` (created)
- `server/server.js` (created)
- `server/.env` (updated with `MONGO_URI`, `JWT_SECRET`, Gemini API key)

---

## v0.1.0 – Project Structure Setup
**Released:** July 24, 2026

- Set up the frontend by cloning a boilerplate for initial structure and mock data
  - Frontend still requires configuration to be fully functional
- Initialized the backend and replaced the default `package.json` with the dependencies needed for the project
  - Added `"type": "module"` to enable modern `import`/`export` syntax
  - Added `nodemon` for auto-restarting the server during development
  - Added a `start` script for running the server in production
  - Added a `seed` script for populating sample data into the database
  - Added dependencies: `@google/genai`, `bcryptjs`, `cors`, `date-fns`, `dotenv`, `express`, `jsonwebtoken`, `mongoose`
- Prepared backend dependencies and directory structure
- Prepared environment variables for local development

**Files created/modified:**
- `backend/package.json` (replaced)
- `backend/.env` (created)
- Backend directory scaffolding (created)
- Frontend boilerplate (cloned, mock data in place)

---
<section align="center">
  <code>coderBri © 2026</code>
</section>