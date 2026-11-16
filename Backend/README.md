# ShabadSetu — Backend

Production-ready backend API for **ShabadSetu**, built with Node.js, Express.js (ES modules), PostgreSQL 18, and iGranth API.

## Core Features

- **Gurbani Reader & Search (Public Access):** Guests and authenticated users can browse Angs, Shabads, verses, Nitnem, Sunder Gutka, Mahan Kosh dictionary, and text conversion without login barriers.
- **Robust Authentication:**
  - Secure registration with bcrypt password hashing (12 work factor).
  - Cryptographically secure 6-digit OTP delivery (Terminal/Console mode for dev; Gmail OAuth2 API ready for prod).
  - 5-minute expiration, 5-attempt brute-force cap, 60-second cooldown protection.
  - Dual-token session security (Short-lived 15m in-memory access token, 7d HttpOnly refresh token cookie).
  - Refresh token rotation with automatic reuse detection (revokes entire token family).
  - Instant JTI token revocation upon logout.
- **Personal Library & Cross-Device Sync:**
  - User Profiles (Display name, bio, avatar).
  - Bookmarks (Ang, Shabad, Line, Bani).
  - Personal Collections & Custom Categorization.
  - Personal Notes per verse/shabad.
  - Reading Progress tracking (Akhand Paath / Sehaj Paath page tracking & completed cycles).
  - Reading History logs.
  - User Reading Preferences (Theme, font size, Larivaar, Punjabi Teeka, English translation).
- **Security & Reliability:**
  - Helmet HTTP security headers.
  - Strict CORS origin whitelisting.
  - Express rate limiting (Authentication, OTP, and General API tiers).
  - Centralized operational error handling without sensitive leakages in production.
  - Native PostgreSQL connection pooling and transaction helpers.
  - Health check endpoint (`GET /api/v1/health`).

---

## Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node.js 24)
- PostgreSQL 18+

### 2. Environment Configuration
Copy `.env.example` to `.env` and verify your settings:
```bash
cp .env.example .env
```

Key environment variables:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://shabadsetu_app:your_password@localhost:5432/shabadsetu
JWT_ACCESS_SECRET=your_jwt_access_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
CORS_ORIGIN=http://localhost:5173

IGRANTH_BASE_URL=https://api.igranth.net
IGRANTH_API_KEY=your_igranth_api_key

OTP_DELIVERY_MODE=console

# Production Gmail OAuth2 Configuration (Optional in development)
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REDIRECT_URI=
GMAIL_REFRESH_TOKEN=
GMAIL_SENDER_EMAIL=
```

### 3. Database Migrations
Run database migrations using `node-pg-migrate`:
```bash
npm run migrate:up
```

To roll back migrations:
```bash
npm run migrate:down
```

### 4. Run the Server
Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Default server port: `http://localhost:3000`  
Health check endpoint: `http://localhost:3000/api/v1/health`

---

## Running Automated Tests

Run the full test suite using Node's native test runner:
```bash
npm test
```

Tests cover:
- Database connectivity & pool query execution.
- Full registration & OTP lifecycle (generation, expiration, 60s cooldown, 5-attempt limit).
- Account activation & login.
- Refresh token rotation & reuse detection.
- Logout session & JTI revocation.
- Protected route verification.
- Mocked iGranth upstream client with error code mappings (401, 404, 429, 502).
- Personal library (bookmarks, collections, notes, progress, preferences).
- Input validators and error response handling.

---

## Documentation
- [API Reference](docs/API.md)
- [Database Schema](docs/DATABASE.md)
- [Implementation Progress](docs/PROGRESS.md)
