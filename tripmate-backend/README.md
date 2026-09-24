# TripMate Backend

Production-grade REST API for the [TripMate](https://github.com/RavendraPatel09/Tripmate) frontend.
Node.js + TypeScript + Express + PostgreSQL (Prisma) + Redis.

See [`API_CONTRACT.md`](./API_CONTRACT.md) for the full endpoint list, data model, and the
product assumptions made while reverse-engineering this contract from the (fully mocked)
frontend. See [`SECURITY_CHECKLIST.md`](./SECURITY_CHECKLIST.md) for a line-by-line mapping of
every security requirement to where it's implemented.

## Stack

- **Runtime:** Node.js 20 LTS + TypeScript
- **Framework:** Express
- **Database:** PostgreSQL via Prisma (parameterized queries only)
- **Cache / rate limiting:** Redis
- **Auth:** JWT access token (15 min) + rotating refresh token in an httpOnly/Secure/SameSite=strict cookie
- **Passwords:** argon2id
- **Validation:** Zod on every body/query/param
- **Logging:** pino (structured, redacted)
- **Tests:** Jest + Supertest

## Quick start (Docker — one command)

```bash
cp .env.example .env
# edit .env: at minimum set real values for JWT_ACCESS_SECRET / JWT_REFRESH_SECRET
docker compose up --build
```

This starts Postgres, Redis, and the API (migrations run automatically on container start).
The API listens on `http://localhost:4000`.

## Quick start (local npm, no Docker)

Prerequisites: Node 20+, a local PostgreSQL server, a local Redis server.

```bash
npm install
cp .env.example .env
# edit .env — DATABASE_URL / REDIS_URL should point at your local instances,
# and set real JWT_ACCESS_SECRET / JWT_REFRESH_SECRET (see below)

npx prisma migrate dev   # creates the DB schema
npm run prisma:seed      # optional: seeds catalog data + an admin user

npm run dev               # http://localhost:4000
```

### Generating strong secrets

```bash
openssl rand -base64 64   # run twice — JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must differ
```

## Environment variables

All variables are documented with placeholders in [`.env.example`](./.env.example). Copy it to
`.env` and fill in real values — `.env` is gitignored and must never be committed.

## Running tests

Tests need their own Postgres database (kept separate from your dev DB) and Redis.

```bash
createdb tripmate_test   # one-time, if using a local Postgres install
cp .env.example .env.test
# edit .env.test: DATABASE_URL should point at tripmate_test, NODE_ENV=test

npm test   # runs `prisma migrate deploy` against the test DB, then the Jest suite
```

What's covered (see `tests/`):

- **`auth.test.ts`** — register/login/refresh/logout, generic invalid-credentials message,
  account lockout, no user-enumeration via forgot-password, refresh-token rotation + reuse
  detection, unauthenticated access to a protected route is rejected.
- **`ownership.test.ts`** — IDOR protection: user A creates a trip/packing item/expense; user B
  cannot read, modify, or delete them by ID (404, not 403 — existence isn't confirmed either).
- **`admin.test.ts`** — every `/api/admin/*` route rejects unauthenticated and non-admin callers;
  a client-supplied role header/body field is ignored; promoting a user via the DB immediately
  grants access (proving the JWT's own role claim is never trusted); an admin can't demote themselves.
- **`validation.test.ts`** — invalid email/password/enum/amount/UUID all rejected with a generic
  400; unknown body fields rejected (mass-assignment protection); malformed JSON never leaks a
  stack trace.

## Database

```bash
npx prisma studio          # browse data
npx prisma migrate dev     # create a new migration after changing prisma/schema.prisma
npm run prisma:seed        # re-seed catalog data (destinations, foods, events, ...) + admin user
```

The seed script creates one admin user (`admin@tripmate.dev`). Set `ADMIN_SEED_PASSWORD` in your
environment before seeding, or a random one-time password is generated and printed to the
console (never stored in the repo).

## Pointing the frontend at this backend

The frontend currently has no real network calls (see `API_CONTRACT.md` for details) — every
page reads mock/local Zustand state. To wire it up:

1. Add `NEXT_PUBLIC_API_URL=http://localhost:4000/api` to the frontend's `.env.local`.
2. Add `CORS_ORIGINS=http://localhost:3000` (the frontend's dev origin) to this backend's `.env`.
3. Replace the frontend's mocked store actions with real `fetch`/axios calls against
   `NEXT_PUBLIC_API_URL`, sending the access token as `Authorization: Bearer <token>` and
   `credentials: 'include'` so the httpOnly refresh cookie round-trips.

## Project layout

```
src/
  config/env.ts          # zod-validated environment, fails fast on boot
  lib/                   # prisma client, redis client, jwt, password hashing, logger, cookies
  middleware/            # auth, requireRole, validate, rateLimiters, errorHandler, ...
  modules/<name>/        # routes + schemas (+ service for auth/planner) per resource
  routes/index.ts        # mounts every module router under /api
  utils/                 # AppError, ownership-check helpers, shared zod schemas
  app.ts                 # express app factory (used by tests)
  server.ts              # process entrypoint
prisma/
  schema.prisma
  migrations/
  seed.ts
tests/                   # Jest + Supertest
```

## Known limitations / deliberate scope decisions

See "Assumptions" in `API_CONTRACT.md` — most notably: the AI itinerary generator and the
budget estimator are deterministic/rule-based stubs (no external LLM or paid API is wired up),
and a few purely presentational frontend pages (`/offline`, `/replay`) have no backend endpoint
because there's nothing real to persist yet.
