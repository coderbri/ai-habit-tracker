# AI Habit Tracker — Changelog

All notable changes to the AI Habit Tracker project will be documented in this file.

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