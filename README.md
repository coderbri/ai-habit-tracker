# AI Habit Tracker

A full-stack, AI-powered habit tracking application built with the MERN stack. Users can build and maintain daily habits with streak tracking, a 90-day GitHub-styled activity heatmap, weekly insights, and five AI features powered by Google Gemini 3.6 Flash.

> **Note:** This is a personal tutorial/learning project used to practice implementing patterns and features for future personal projects. It is not intended for public deployment.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Pages & Functionality](#pages--functionality)
- [Implementation Notes](#implementation-notes)
- [Known Issues](#known-issues)
- [Roadmap](#roadmap)

## Features

- Secure user authentication (registration/login) with hashed passwords and JWT-based sessions
- Daily habit check-offs with streak tracking
- 90-day GitHub-styled consistency heatmap
- Weekly insights dashboard with themed charts
- Light/dark mode with persisted theme preference
- Confetti celebrations on habit and daily completions
- Five AI features powered by Gemini 3.6 Flash:
  - Personalized weekly report
  - Habit suggestion wizard
  - Streak recovery coach
  - AI habit data chat
  - Morning motivation messages

## Tech Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS v4 (theme tokens, glass utilities, dark mode via `@custom-variant`)
- React Router
- Context API (`AuthContext`, `ThemeContext`)
- Recharts for data visualization
- Custom-built heatmap component
- react-markdown for rendering AI responses
- canvas-confetti for completion celebrations

**Backend**
- Node.js + Express (REST API)
- MongoDB Atlas + Mongoose
  - Models: `User`, `Habit`, `HabitLog`, `AIInsight`
- Authentication: JWT + bcrypt.js
- date-fns for date math and heatmap generation

**AI**
- Google Gemini 3.6 Flash

## Project Structure

```
ai-habit-tracker/
├── frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── api/           # axios.js — configured Axios client (JWT auto-attach, 401 redirect)
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/       # AuthContext, ThemeContext
│   │   ├── pages/
│   │   ├── utils/
│   │   └── ...
│   ├── .env
│   └── ...
├── backend/               # Node.js + Express backend
│   ├── config/            # db.js — MongoDB Atlas connection
│   ├── controllers/       # authController, habitController, logController, aiController
│   ├── middleware/        # auth.js (JWT protect), errorHandler.js
│   ├── models/            # User, Habit, HabitLog, AIInsight
│   ├── routes/            # auth, habits, logs, ai
│   ├── scripts/           # empty — reserved for the `seed` script (see Getting Started)
│   ├── utils/             # dateHelpers.js (streak math), aiService.js (Gemini wrapper)
│   └── ...
├── API_TESTING.md
├── CHANGELOG.md
└── README.md
```

> Update this structure as directories are finalized during development.

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm
- A MongoDB Atlas cluster (or local MongoDB instance)
- A Google Gemini API key

### Installation

1. Clone the repository
   ```bash
   git clone <repo-url>
   cd ai-habit-tracker
   ```
2. Install backend dependencies
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies
   ```bash
   cd ../frontend
   npm install
   ```
4. Configure environment variables (see below)
5. Seed the database (optional)
   ```bash
   cd ../backend
   npm run seed
   ```
6. Run the development servers
   ```bash
   # from /backend
   npm run dev

   # from /frontend
   npm run dev
   ```

## Environment Variables

### Backend

Create a `.env` file in the `backend/` directory with the following:

```
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=
GEMINI_API_KEY=
GEMINI_MODEL=
CLIENT_URL=
PORT=
```

- `MONGO_URI` — MongoDB Atlas (or local) connection string
- `JWT_SECRET` — signing secret for auth tokens
- `JWT_EXPIRES_IN` — optional, defaults to `30d`
- `GEMINI_API_KEY` — enables the 5 AI features; app runs fine without it, AI routes just return a graceful fallback message
- `GEMINI_MODEL` — optional, defaults to a current Gemini model in code; override here if Google deprecates the default
- `CLIENT_URL` — comma-separated list of allowed frontend origins for CORS; `localhost`/`127.0.0.1` origins are always allowed in development regardless of this value
- `PORT` — optional, defaults to `8000`

### Frontend

Create a `.env` file in the `frontend/` directory with the following:

```
VITE_API_URL=
```

- `VITE_API_URL` — base URL the Axios client points requests at (e.g. `http://localhost:8000/api`). Vite only exposes variables prefixed with `VITE_` to the app via `import.meta.env`, and the dev server must be restarted after changing this file for the new value to be picked up.

## Pages & Functionality

### Landing Page
Glassmorphism design with light/dark mode, quick access to authentication, two feature preview cards, a four-feature overview, and a call-to-action.

### Dashboard
- Sidebar navigation: Dashboard, Habits, Weekly, Insights, Statistics, theme picker, and a settings modal (update display name, toggle morning motivation)
- User profile + logout
- New Habit modal (name, description, category, frequency, target day, icon, color)
- Suggest a Habit: 3-step AI wizard that recommends a tailored habit and auto-fills the form based on user goals, productivity windows, and struggles
- AI motivational message
- Streak recovery card (AI-generated recovery plan for habits broken 7+ days)
- Summary cards: total habits, active streaks, best streak, weekly completion rate
- Habit list with category chips, streak counts, and confetti on completion
- AI-generated weekly report (120–180 words)
- Weekly grid (current week, color-coded per habit) and 90-day heatmap

### Habit Management
Extended habit stats (current streak, longest streak, 90-day completions) with edit, archive, and delete actions. Archived habits retain full history but are hidden from the daily list.

### Weekly Overview
Week navigation (past weeks browsable, future weeks disabled), summary cards (week rate, total completions, best day, top habit), and a weekly completion grid.

### Insights
- AI weekly reports, auto-generated on first visit per week and cached locally by week start date (regenerate button available to force a refresh)
- Summary cards with week-over-week delta indicators
- Charts: completions by day, this week vs. last week, completions by category, habit performance (done vs. target), and an active streaks board

### Statistics
- All-time highest and longest streak highlights, and a "needs attention" flag for the most struggling habit
- 7-day and 30-day completion charts
- Category distribution pie chart
- Top habits progress list (ranked by 30-day completions)
- Full habit list with icon, streak, and completion stats
- Floating AI chat bubble for querying personal habit data (context built server-side from habit history and passed to Gemini), rendered with markdown support

## Implementation Notes

Places where this project intentionally diverges from tutorial instruction, tracked here along with the reasoning for future reference.

- **Unmarking habit completions (`unmarkComplete`):** the tutorial used `findOneAndUpdate` to "unmark" a habit, but this was changed to `findOneAndDelete`. A `HabitLog` document has no `completed: Boolean` field to flip — the mere existence of the row for a given habit and date *is* the completion signal. Deleting the row is what actually reverts that day to incomplete, and it mirrors how `markComplete` creates the row in the first place.

## Known Issues

- **Frontend `baseURL` may not be reading `VITE_API_URL` yet** — as of the last session, `axios.js`'s `baseURL` was still hardcoded to `http://localhost:8000/api` instead of `import.meta.env.VITE_API_URL`, even though the `.env` variable is in place. It currently works only because the hardcoded value happens to match. A fix (`baseURL: import.meta.env.VITE_API_URL`) is staged for verification during the upcoming end-to-end testing session — update this note once confirmed.

## Roadmap

- [x] Finalize backend route/controller structure
- [x] Connect frontend to live API
- [ ] Implement authentication flow end-to-end
- [x] Wire up Gemini AI features
- [ ] Polish responsive design across breakpoints

---
<section align="center">
  <code>coderBri © 2026</code>
</section>