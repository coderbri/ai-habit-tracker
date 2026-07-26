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