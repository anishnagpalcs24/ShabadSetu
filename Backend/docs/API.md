# ShabadSetu Backend API Documentation

Base URL: `http://localhost:3000/api/v1`

All responses follow a unified JSON envelope:

### Success Response Format
```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "A user-friendly error message",
  "errors": []
}
```

---

## 1. System Health

### GET `/health`
Returns operational and database connectivity status.
- **Auth:** None (Public)
- **Response:**
  ```json
  {
    "success": true,
    "message": "ShabadSetu backend is healthy and running",
    "data": {
      "status": "healthy",
      "timestamp": "2026-11-14T08:44:42.184Z",
      "uptimeSeconds": 6,
      "database": "connected"
    }
  }
  ```

---

## 2. Authentication & Account Management (`/auth`)

### POST `/auth/register`
Accepts registration details, hashes password, generates a cryptographically secure 6-digit OTP, stores pending verification, and dispatches code.
- **Auth:** None (Rate limited: 20 req / 15 min)
- **Body:**
  ```json
  {
    "name": "Gurmukh Singh",
    "email": "user@example.com",
    "password": "StrongPassword123!"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "A 6-digit verification code has been sent to your email."
  }
  ```

### POST `/auth/verify-email`
Verifies OTP, consumes verification record, creates active user in PostgreSQL transaction, provisions default profile & preferences, and issues tokens.
- **Auth:** None (Rate limited: 10 req / 15 min)
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "otp": "862327"
  }
  ```
- **Response (201 Created):**
  - Sets HttpOnly `refreshToken` cookie (path: `/api/v1/auth`, 7 days expiry).
  - Returns `accessToken` (15 min expiry) in response body.
  ```json
  {
    "success": true,
    "message": "Email verified successfully and account activated.",
    "data": {
      "user": {
        "id": "36cb2c62-d3d8-49e3-b412-fb07813c1654",
        "email": "user@example.com",
        "name": "Gurmukh Singh",
        "isVerified": true
      },
      "accessToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
  ```

### POST `/auth/resend-otp`
Enforces 60-second cooldown, invalidates previous OTP, generates new OTP, and dispatches.
- **Auth:** None (Rate limited: 10 req / 15 min)
- **Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```

### POST `/auth/login`
Authenticates verified users and issues access token + HttpOnly refresh token cookie.
- **Auth:** None (Rate limited: 20 req / 15 min)
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "StrongPassword123!"
  }
  ```

### POST `/auth/refresh`
Rotates refresh token and detects reuse.
- **Auth:** Refresh Token Cookie (`refreshToken`)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Session token refreshed successfully.",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "user": { "id": "...", "email": "...", "name": "..." }
    }
  }
  ```

### POST `/auth/logout`
Revokes active refresh token session and clears cookie.
- **Auth:** Refresh Token Cookie or Bearer Access Token

### GET `/auth/me`
Retrieves current authenticated user and profile.
- **Auth:** Bearer Access Token (`Authorization: Bearer <token>`)

### POST `/auth/forgot-password`
Initiates password reset OTP flow.
- **Auth:** None

### POST `/auth/reset-password`
Validates OTP, updates password, and revokes active sessions.
- **Auth:** None
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "otp": "123456",
    "newPassword": "NewStrongPassword123!"
  }
  ```

---

## 3. Gurbani Reader (`/gurbani`)

All reader endpoints are public (no authentication required). If an Authorization header is provided by a logged-in user, their reading progress and history are automatically updated.

- **GET `/gurbani/ang/:page/g/:source`**: Retrieve an Ang (page) from specified Granth source (e.g. `G` for Guru Granth Sahib).
- **GET `/gurbani/shabad/:id`**: Retrieve full Shabad by ID.
- **GET `/gurbani/line/:id`**: Retrieve specific line/verse by ID.

---

## 4. Search (`/search`)

Public endpoint. Maximum 100 results per request.

- **GET `/search/:query`**:
  - `type`: 0 (First letter start), 1 (First letter anywhere), 2 (Full Gurmukhi word/line), 3 (English translations), 4 (All Gurmukhi words), 5 (All English words), 6 (Any Gurmukhi words), 7 (Any English words).
  - `source`: Granth code (`G`, `D`, `B`, etc.)
  - `ang`: Ang number
  - `writer`: Writer ID
  - `raag`: Raag ID
  - `results`: Number of results (1 to 100, default 50)
  - `skip`: Offset for pagination

---

## 5. Nitnem & Sunder Gutka (`/nitnem`)

Public endpoints.

- **GET `/nitnem/sundergutka`**: List all Sunder Gutka sections.
- **GET `/nitnem/sundergutka/:id`**: Retrieve Sunder Gutka section details.
- **GET `/nitnem/bani`**: List all available Banis.
- **GET `/nitnem/bani/:id`**: Retrieve Bani by ID (optional query: `?maryada=...`).
- **GET `/nitnem/sundergutka/:sg_id/bani/:bani_id`**: Retrieve specific Bani inside a Sunder Gutka collection.

---

## 6. Mahan Kosh (`/dictionary`)

Public Gurbani dictionary endpoints.

- **GET `/dictionary/letter`**: List all dictionary index letters.
- **GET `/dictionary/letter/:letter`**: List entries starting with letter.
- **GET `/dictionary/search/:word`**: Search word in Mahan Kosh.
- **GET `/dictionary/:id`**: Get full definition by ID.

---

## 7. GurbaniAkhar Converter (`/converter`)

Public script conversion endpoint.

- **GET `/converter/:type/:text`**: Convert text using documented converter type (e.g. `unicode`, `ascii`).

---

## 8. User Personal Library (`/users`)

All `/users` endpoints require `Authorization: Bearer <token>`.

### Profile
- `GET /users/profile`: Get current profile.
- `PATCH /users/profile`: Update display name, bio, avatar URL.

### Bookmarks
- `GET /users/bookmarks`: List user bookmarks (supports `?type=`, `?limit=`, `?offset=`).
- `POST /users/bookmarks`: Create bookmark (`type`, `source`, `pageNumber`, `shabadId`, `lineId`, `title`, `note`).
- `DELETE /users/bookmarks/:id`: Delete bookmark.

### Collections & Items
- `GET /users/collections`: List collections with items count.
- `POST /users/collections`: Create collection (`title`, `description`).
- `GET /users/collections/:id`: Get collection with items.
- `PATCH /users/collections/:id`: Update collection title/description.
- `DELETE /users/collections/:id`: Delete collection and items.
- `POST /users/collections/:id/items`: Add item (`shabadId`, `lineId`, `source`, `position`, `note`).
- `DELETE /users/collections/:id/items/:itemId`: Remove item from collection.

### Personal Notes
- `GET /users/notes`: List notes (supports `?shabadId=`, `?limit=`, `?offset=`).
- `POST /users/notes`: Create note (`content`, `shabadId`, `lineId`, `source`).
- `GET /users/notes/:id`: Get note by ID.
- `PATCH /users/notes/:id`: Update note content.
- `DELETE /users/notes/:id`: Delete note.

### Reading Progress & History
- `GET /users/progress?source=G`: Get reading progress.
- `POST /users/progress`: Update progress (`source`, `currentPage`, `totalPages`, `completedCycles`).
- `GET /users/history`: Get reading history list.
- `DELETE /users/history`: Clear reading history.

### Preferences
- `GET /users/preferences`: Get reading settings (theme, fontSize, larivaar, translations, etc.).
- `PATCH /users/preferences`: Update preferences.
