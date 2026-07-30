# API Testing Reference

Manual testing notes and example requests/responses for each route group, verified in Postman. Kept separate from `CHANGELOG.md` so the changelog stays a quick-scan history while this stays the detailed reference.

## Authentication

All routes below (except `/api/auth/register` and `/api/auth/login`) require a JWT from the login/register response, passed as a Bearer token:

| Key | Value |
|:----|:------|
| Authorization | `Bearer eyJhbGciOiJIUzI1...` |

---

## Habits

Base route: `http://localhost:8000/api/habits`

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

### Delete Habit — `DELETE /api/habits/:id`

Returns a success message:
```json
{
    "message": "Habit deleted"
}
```

---

## Logs

Base route: `http://localhost:8000/api/logs`

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

### Get Heatmap — `GET /api/logs/heatmap`

Returns the last 90 days, with today as the last entry:
```json
[
    { "...": "..." },
    { "date": "2026-07-28", "count": 0 },
    { "date": "2026-07-29", "count": 1 }
]
```

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

### Unmark Complete — `DELETE /api/logs/`

Takes the same body shape as Mark Complete:
```json
{ "habitId": "6a699c76184261089a49e112" }
```

Returns:
```json
{ "message": "Unmarked" }
```

> **Known issue:** this currently doesn't delete the log entry — see the v0.5.0 changelog note. Re-test with `GET /api/logs/today` after calling this to confirm once fixed.