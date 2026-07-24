# AI Habit Tracker — Changelog

All notable changes to the AI Habit Tracker project will be documented in this file.

## v0.1.0 - Project Structure Setup
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