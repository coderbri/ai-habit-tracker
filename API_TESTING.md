# API Testing Reference

Manual testing notes and example requests/responses for each route group, verified in Postman. Kept separate from `CHANGELOG.md` so the changelog stays a quick-scan history while this stays the detailed reference.

## Table of Contents

- [Authentication](#authentication)
- [Habits](#habits)
  - [Create Habit](#create-habit) — `POST /api/habits/`
  - [Get All Habits](#get-all-habits) — `GET /api/habits/`
  - [Update Habit](#update-habit) — `PUT /api/habits/:id`
  - [Archive Habit (toggle)](#archive-habit) — `PUT /api/habits/:id/archive`
  - [Delete Habit](#delete-habit) — `DELETE /api/habits/:id`
- [Logs](#logs)
  - [Mark Complete](#mark-complete) — `POST /api/logs/`
  - [Get Today](#get-today) — `GET /api/logs/today`
  - [Get Heatmap](#get-heatmap) — `GET /api/logs/heatmap`
  - [Get All Stats](#get-all-stats) — `GET /api/logs/stats`
  - [Unmark Complete](#unmark-complete) — `DELETE /api/logs/`
- [AI](#ai)
  - [Generate Weekly Report](#weekly-report) — `POST /api/ai/weekly-report`
  - [Suggest Habits](#suggest-habits) — `POST /api/ai/suggest-habits`
  - [Chat with AI](#chat-with-ai) — `POST /api/ai/chat`

<a id="authentication"></a>
## Authentication

All routes below (except `/api/auth/register` and `/api/auth/login`) require a JWT from the login/register response, passed as a Bearer token:

| Key | Value |
|:----|:------|
| Authorization | `Bearer eyJhbGciOiJIUzI1...` |

---

<a id="habits"></a>
## Habits

Base route: `http://localhost:8000/api/habits`

<a id="create-habit"></a>
### Create Habit — `POST /api/habits/`

Request body:
```json
{
    "name": "Drink 2L of water",
    "description": "Stay hydrated throughout the day.",
    "category": "Health",
    "frequency": "daily",
    "targetDays": 7,
    "color": "#0ea5e9",
    "icon": " 💧 "
}
```

Returns `201` with the created habit:
```json
{
    "userId": "6a6415c1ea27f02dc34f6aaa",
    "name": "Drink 2L of water",
    "description": "Stay hydrated throughout the day.",
    "category": "Health",
    "frequency": "daily",
    "targetDays": 7,
    "color": "#0ea5e9",
    "icon": " 💧 ",
    "isArchived": false,
    "order": 0,
    "_id": "6a65523442bf6b14ed5d6429",
    "createdAt": "2026-07-26T00:17:56.118Z",
    "updatedAt": "2026-07-26T00:17:56.118Z",
    "__v": 0
}
```

<a id="get-all-habits"></a>
### Get All Habits — `GET /api/habits/`

Returns habits as an array:
```json
[
    {
        "_id": "6a65523442bf6b14ed5d6429",
        "userId": "6a6415c1ea27f02dc34f6aaa",
        "name": "Drink 2L of water",
        "description": "Stay hydrated throughout the day.",
        "category": "Health",
        "frequency": "daily",
        "targetDays": 7,
        "color": "#0ea5e9",
        "icon": " 💧 ",
        "isArchived": false,
        "order": 0,
        "createdAt": "2026-07-26T00:17:56.118Z",
        "updatedAt": "2026-07-26T00:17:56.118Z",
        "__v": 0
    }
]
```

<a id="update-habit"></a>
### Update Habit — `PUT /api/habits/:id`

Replace `:id` with an id from the habits list. Include only the fields you want to edit.

Request body:
```json
{
    "description": "Drink water consistently throughout the day.",
    "targetDays": 6
}
```

Returns `201` with the updated habit:
```json
{
    "_id": "6a65523442bf6b14ed5d6429",
    "userId": "6a6415c1ea27f02dc34f6aaa",
    "name": "Drink 2L of water",
    "description": "Drink water consistently throughout the day.",
    "category": "Health",
    "frequency": "daily",
    "targetDays": 6,
    "color": "#0ea5e9",
    "icon": " 💧 ",
    "isArchived": false,
    "order": 0,
    "createdAt": "2026-07-26T00:17:56.118Z",
    "updatedAt": "2026-07-26T00:40:55.607Z",
    "__v": 0
}
```

<a id="archive-habit"></a>
### Archive Habit (toggle) — `PUT /api/habits/:id/archive`

No request body needed — only the Authorization header.

This is a **toggle**, not a one-way action: calling it again on an already-archived habit unarchives it.

Returns `201` with `isArchived` flipped to `true`:
```json
{
    "_id": "6a65523442bf6b14ed5d6429",
    "userId": "6a6415c1ea27f02dc34f6aaa",
    "name": "Drink 2L of water",
    "description": "Drink water consistently throughout the day.",
    "category": "Health",
    "frequency": "daily",
    "targetDays": 6,
    "color": "#0ea5e9",
    "icon": " 💧 ",
    "isArchived": true,
    "order": 0,
    "createdAt": "2026-07-26T00:17:56.118Z",
    "updatedAt": "2026-07-26T00:47:45.317Z",
    "__v": 0
}
```

After archiving, `GET /api/habits` returns an empty array by default, since it filters to active habits only.

To include archived habits, add the `?includeArchived=true` query parameter: `http://localhost:8000/api/habits?includeArchived=true`
```json
[
    {
        "_id": "6a65523442bf6b14ed5d6429",
        "userId": "6a6415c1ea27f02dc34f6aaa",
        "name": "Drink 2L of water",
        "description": "Drink water consistently throughout the day.",
        "category": "Health",
        "frequency": "daily",
        "targetDays": 6,
        "color": "#0ea5e9",
        "icon": " 💧 ",
        "isArchived": true,
        "order": 0,
        "createdAt": "2026-07-26T00:17:56.118Z",
        "updatedAt": "2026-07-26T00:47:45.317Z",
        "__v": 0
    }
]
```

<a id="delete-habit"></a>
### Delete Habit — `DELETE /api/habits/:id`

Returns a success message:
```json
{
    "message": "Habit deleted"
}
```

---

<a id="logs"></a>
## Logs

Base route: `http://localhost:8000/api/logs`

<a id="mark-complete"></a>
### Mark Complete — `POST /api/logs/`

Request body:
```json
{
    "habitId": "6a699c76184261089a49e112"
}
```

Returns `201` with the created (or existing, if already marked) log entry:
```json
{
    "_id": "6a699cbc61e6975abf3a9df8",
    "completedDate": "2026-07-29",
    "habitId": "6a699c76184261089a49e112",
    "userId": "6a6415c1ea27f02dc34f6aaa",
    "__v": 0,
    "createdAt": "2026-07-29T06:25:00.169Z",
    "notes": "",
    "updatedAt": "2026-07-29T06:25:00.169Z"
}
```

<a id="get-today"></a>
### Get Today — `GET /api/logs/today`

Returns completed habits for the current day (empty array if nothing's been marked yet):
```json
[
    {
        "_id": "6a699cbc61e6975abf3a9df8",
        "completedDate": "2026-07-29",
        "habitId": "6a699c76184261089a49e112",
        "userId": "6a6415c1ea27f02dc34f6aaa",
        "__v": 0,
        "createdAt": "2026-07-29T06:25:00.169Z",
        "notes": "",
        "updatedAt": "2026-07-29T06:25:00.169Z"
    }
]
```

<a id="get-heatmap"></a>
### Get Heatmap — `GET /api/logs/heatmap`

Returns the last 90 days, with today as the last entry:
```json
[
    { "...": "..." },
    { "date": "2026-07-28", "count": 0 },
    { "date": "2026-07-29", "count": 1 }
]
```

<a id="get-all-stats"></a>
### Get All Stats — `GET /api/logs/stats`

Returns per-habit 30-day stats plus the list of days covered:
```json
{
    "perHabit": [
        {
            "habitId": "6a699c76184261089a49e112",
            "name": "Drink 2L of water",
            "icon": " 💧 ",
            "color": "#0ea5e9",
            "category": "Health",
            "completions30d": 1,
            "currentStreak": 1,
            "longestStreak": 1
        }
    ],
    "days": ["2026-06-30", "2026-07-01", "...", "2026-07-29"]
}
```

<a id="unmark-complete"></a>
### Unmark Complete — `DELETE /api/logs/`

Takes the same body shape as Mark Complete:
```json
{ "habitId": "6a699c76184261089a49e112" }
```

Returns:
```json
{ "message": "Unmarked" }
```

> **Resolved:** this originally used `findOneAndUpdate` with no update document, so the log entry was never actually removed — see the v0.5.0 changelog note. Fixed by switching to `findOneAndDelete`; confirmed working by checking `GET /api/logs/today` no longer returns the unmarked entry.

---

<a id="ai"></a>
## AI

Base route: `http://localhost:8000/api/ai`

> **Setup note:** if requests fail with a `404` mentioning the model is "no longer available to new users," `GEMINI_MODEL` in `.env` (and the fallback default in `utils/aiService.js`) needs to point at a current Gemini model — `gemini-2.5-flash` was deprecated for new users as of this testing session.

<a id="weekly-report"></a>
### Generate Weekly Report — `POST /api/ai/weekly-report`

No request body needed — only the Authorization header.

Returns:
```json
{
    "content": "Hey there! Taking a look back at your past week, it looks like \"Drink 2L of water\" had a quiet seven days with no logged completions against your 7-day target. First off, please don't beat yourself up over an empty log. Showing up right now to check in and reset is a genuine win in itself!\n\nIt seems like life might have gotten extra busy, or perhaps tracking your progress simply fell off your radar this week. When a habit goes unrecorded, it's usually a gentle pattern indicating that the routine felt a bit too friction-heavy or detached from your daily flow.\n\nHere is my encouragement for you: treat today as a completely clean slate! You don't need a perfect streak to build momentum with hydration. Try placing a filled water bottle right on your desk or kitchen counter first thing in the morning so \"Drink 2L of water\" stays top-of-mind without extra effort. \n\nYou've got this, and I'm right here cheering you on for the week ahead!"
}
```

> **Known issue:** unlike the other four AI endpoints, `weeklyReport` never calls `AIInsight.create()` — the route responds successfully, but nothing gets persisted to MongoDB. Found by comparing against `suggestHabits`/`chatAnalysis`, which do save.
>
> **Related known issue:** `buildWeeklyContext` computes each habit's actual 7-day completion count but never returns it — the per-habit object it builds still carries an unused `completedDate` field instead. The report above still reads plausibly because the model works around vague input, but it isn't actually being generated from real completion numbers yet. See changelog v0.6.1.

<a id="suggest-habits"></a>
### Suggest Habits — `POST /api/ai/suggest-habits`

Request body:
```json
{
    "goals": "Build a stronger fitness routine and read more books.",
    "productiveTime": "Early mornings before work.",
    "struggles": "Late-night journaling and weekend gym sessions."
}
```

**Before the fix** (v0.6.0 bug — the parsed AI response was computed but never assigned to `suggestions`, so every call silently returned the hardcoded fallback set regardless of input):
```json
{
    "suggestions": [
        { "name": "10-minute morning walk", "category": "Fitness" },
        { "name": "Read 5 pages", "category": "Learning" },
        { "name": "2 minutes of mindful breathing", "category": "Mindfulness" }
    ]
}
```

**After the fix** — `parsed.suggestion` is now correctly assigned, and the response reflects the submitted goals/time/struggles:
```json
{
    "suggestions": [
        {
            "name": "Weekday Morning Workout",
            "description": "Complete a 30-minute workout right after waking up on weekday mornings.",
            "frequency": "daily",
            "category": "Fitness",
            "icon": "🏋️",
            "reason": "Capitalizes on your peak early morning focus and moves fitness away from tricky weekend routines."
        },
        {
            "name": "Morning Coffee Reading",
            "description": "Read 15 pages of a book with your morning beverage before starting your workday.",
            "frequency": "daily",
            "category": "Learning",
            "icon": "📖",
            "reason": "Embeds reading into your most productive window when your mind is clear and refreshed."
        },
        {
            "name": "Night-Before Gear Setup",
            "description": "Lay out your workout clothing and book on your nightstand in under 2 minutes before bed.",
            "frequency": "daily",
            "category": "Productivity",
            "icon": "🌙",
            "reason": "Replaces heavy late-night tasks with a quick setup that makes early morning execution effortless."
        }
    ]
}
```

<a id="chat-with-ai"></a>
### Chat with AI — `POST /api/ai/chat`

Request body:
```json
{
    "question": "Which day of the week am I most consistent?"
}
```

Returns:
```json
{
    "content": "Based on your data for \"Drink 2L of water\", you are tied for most consistent on **Tuesday** and **Friday**. \n\nYou completed your habit 1 time on Tuesday and 1 time on Friday (each representing 50% of your total completions). Sunday, Monday, Wednesday, Thursday, and Saturday all have 0 completions. \n\nNote that with only 2 total completions out of 30 days (a 6.7% overall success rate), the available data is very limited."
}
```