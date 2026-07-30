# AI Habit Tracker

A full-stack, AI-powered habit tracking application built with the MERN stack. Users can build and maintain daily habits with streak tracking, a 90-day GitHub-styled activity heatmap, weekly insights, and five AI features powered by Google Gemini 2.5 Flash.

> **Note:** This is a personal tutorial/learning project used to practice implementing patterns and features for future personal projects. It is not intended for public deployment.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Pages & Functionality](#pages--functionality)
- [Implementation Notes](#implementation-notes)
- [Roadmap](#roadmap)

## Features

- Secure user authentication (registration/login) with hashed passwords and JWT-based sessions
- Daily habit check-offs with streak tracking
- 90-day GitHub-styled consistency heatmap
- Weekly insights dashboard with themed charts
- Light/dark mode with persisted theme preference
- Confetti celebrations on habit and daily completions
- Five AI features powered by Gemini 2.5 Flash:
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
- Google Gemini 2.5 Flash

## Project Structure

```
ai-habit-tracker/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/        # AuthContext, ThemeContext
│   │   ├── pages/
│   │   └── ...
│   └── ...
├── backend/                # Node.js + Express backend
│   ├── models/             # User, Habit, HabitLog, AIInsight
│   ├── routes/
│   ├── controllers/
│   └── ...
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
   cd server
   npm install
   ```
3. Install frontend dependencies
   ```bash
   cd ../client
   npm install
   ```
4. Configure environment variables (see below)
5. Seed the database (optional)
   ```bash
   cd ../server
   npm run seed
   ```
6. Run the development servers
   ```bash
   # from /server
   npm run dev

   # from /client
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the `server/` directory with the following:

```
MONGODB_URI=
JWT_SECRET=
GEMINI_API_KEY=
PORT=
```

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

## Roadmap

- [ ] Finalize backend route/controller structure
- [ ] Connect frontend to live API (currently mock data)
- [ ] Implement authentication flow end-to-end
- [ ] Wire up Gemini AI features
- [ ] Polish responsive design across breakpoints

---
<section align="center">
  <code>coderBri © 2026</code>
</section>