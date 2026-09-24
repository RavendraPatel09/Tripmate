# Security Checklist

Every hard requirement from the build spec, mapped to exactly where it's implemented, for
self-audit.

## 1. Server-side authentication only

- `src/middleware/auth.ts` → `requireAuth`: verifies the JWT signature + expiry
  (`verifyAccessToken`), then **re-fetches the user (and role) from the DB** on every single
  request (`prisma.user.findUnique`). The token's own `role` claim is decoded but never used for
  authorization — only its `sub` (user id) is trusted, and only to look up the live DB row.
- Proven by `tests/admin.test.ts` → `"allows an ADMIN-role user through"`: a user is promoted to
  ADMIN *after* their access token was already issued, and the **same, unmodified token**
  immediately gets admin access — because every request re-checks the DB, not the token's claim.

## 2. Strict data ownership / no cross-user data access

- `src/utils/ownership.ts` → `findOwnedOrThrow` / `updateOwnedOrThrow` / `deleteOwnedOrThrow`: the
  single reusable pattern every user-owned resource goes through. Ownership is enforced **inside
  the WHERE clause** (`{ id, userId }`), never as a post-fetch check on the response body, and a
  mismatch returns 404 (not 403) so existence can't be inferred either.
- Used by: `src/modules/trips/trips.routes.ts`, `src/modules/packing/packing.routes.ts`,
  `src/modules/expenses/expenses.routes.ts`, `src/modules/notifications/notifications.routes.ts`,
  `src/modules/savedDestinations/savedDestinations.routes.ts` (wishlist/saved trips),
  `src/modules/community/community.routes.ts` (post delete scoped by `authorId`).
- Nested resource (trip members / group splitter): `trips.routes.ts` confirms the parent `Trip`
  is owned by `req.user.id` **before** touching any `TripMember` row (defense in depth for a
  resource that isn't itself directly keyed by `userId`).
- UUIDs everywhere: every `@id` in `prisma/schema.prisma` is `@default(uuid())` — no sequential
  integer ids anywhere in the public API.
- Automated proof: `tests/ownership.test.ts` — user A creates a trip/packing item/expense; user B
  is proven unable to GET/PUT/DELETE/PATCH them by real, valid IDs (all 404).

## 3. Admin routes properly protected

- `src/modules/admin/admin.routes.ts`, line: `adminRouter.use(requireAuth, requireRole('ADMIN'))`
  — applied **once, at the router level**, before any sub-route is mounted. No admin route is
  reachable without passing both middlewares first; there is no per-controller admin check
  anywhere else in the codebase.
- `src/middleware/requireRole.ts` → `requireRole(...roles)`: reads only the already-DB-verified
  `req.user.role` set by `requireAuth`. Never reads a client-supplied header/body/query field for
  role (see `admin.test.ts` → `"ignores a client-supplied role claim/header..."`, which sends
  `X-Role: ADMIN` and `{ role: 'ADMIN' }` in the body and still gets 403).
- Automated proof: `tests/admin.test.ts` — every admin route is exercised unauthenticated (401)
  and as a logged-in non-admin (403); an admin can reach them (200/201).

## 4. No verbose/leaky error messages

- `src/middleware/errorHandler.ts` — the single centralized error handler. Operational errors
  (`AppError`) return their own safe status + message; anything else (bugs, unexpected DB errors)
  returns a generic `{ error: "Something went wrong" }`. Full detail (stack, Prisma error,
  message) is logged via `logger.error(...)` with a `requestId`, **never in both dev and prod** —
  there is deliberately no "verbose in development" branch, so this can't regress by accident.
- `src/middleware/requestId.ts`: every request gets a correlation id (`X-Request-Id` header +
  present in every error body) so a generic message can still be traced back to full server logs.
- `src/lib/logger.ts`: pino `redact` config strips `password`, `passwordHash`, tokens, and the
  `Authorization`/`Cookie` headers from every log line.
- Proven by `tests/validation.test.ts` → `"never leaks a stack trace or SQL detail..."` and every
  auth test asserting `res.body.stack` is `undefined`.

## 5. No SQL injection

- All data access goes through Prisma's query builder (`prisma.<model>.findFirst/updateMany/...`)
  with structured `where`/`data` objects — grep the codebase for `$queryRawUnsafe`: **zero
  results**. The only raw SQL in the entire repo is `tests/setup.ts`'s `$executeRawUnsafe` for
  `TRUNCATE TABLE` between tests, which is unavoidable (table identifiers can't be bound
  parameters) and safe: the table names come from Postgres's own `pg_tables` catalog, never from
  request input, and it only ever runs against the test database — it's test scaffolding, not
  part of the request-handling code path.

## 6. No hardcoded secrets / exposed credentials

- `src/config/env.ts`: every secret (`DATABASE_URL`, `REDIS_URL`, `JWT_ACCESS_SECRET`,
  `JWT_REFRESH_SECRET`) is required from `process.env` via a Zod schema that **fails the process
  at boot** if missing/too short, and asserts the two JWT secrets aren't equal.
- `.env.example` ships only placeholder values; `.gitignore` excludes `.env*` (every env file,
  including `.env.test`) except `.env.example`.
- `prisma/seed.ts`: never hardcodes an admin password — reads `ADMIN_SEED_PASSWORD` from the
  environment, or generates and prints a random one-time password if unset.
- Self-check performed before finishing this build: grepped all tracked source for API-key/
  private-key/connection-string shapes (`sk-...`, `AKIA...`, `-----BEGIN...KEY-----`,
  `user:pass@host` URLs). The only match is the well-known local `docker-compose.yml` default
  (`tripmate:tripmate@postgres`) — the same trivial local-only credential the same file already
  sets for the Postgres container two lines above; not a secret, and never valid outside your own
  `docker compose up`.

## 7. Nothing sensitive shipped to the frontend/browser

- `src/modules/auth/auth.service.ts` → `toPublicUser()`: the **only** shape ever returned for a
  user is `{ id, name, email, avatar }` — never `passwordHash`, `role`, `failedLoginAttempts`, or
  `lockedUntil`. Every route that returns a user (`/auth/register`, `/auth/login`,
  `/auth/refresh`, `/auth/me`, `/users/me`, admin user list) explicitly `select`s only safe
  columns — Prisma's default `findMany`/`findUnique` would otherwise return the full row
  including `passwordHash`.
- The JWT access token itself carries only `{ sub, role }` — no PII, no secrets. It's returned in
  the JSON body (frontend keeps it in memory), never in a non-httpOnly cookie.
- The refresh token is httpOnly + Secure (env-aware) + SameSite=strict
  (`src/lib/cookies.ts` → `setRefreshTokenCookie`) — inaccessible to any frontend JavaScript.

## 8. Input validation everywhere

- `src/middleware/validate.ts` → `validate({ body, query, params })`: every route in every module
  wraps its handler with this. Every body schema uses Zod's `.strict()` — unknown fields are
  **rejected**, not silently dropped (mass-assignment protection); see
  `tests/validation.test.ts` → `"rejects an unknown/extra field..."`.
- Path params are validated as UUIDs before ever reaching Prisma
  (`src/utils/commonSchemas.ts` → `uuidParam`/`uuidParams`) — a malformed id 400s instead of
  round-tripping to the database.
- Types/lengths/formats/enums are explicit in every `*.schemas.ts` file (e.g. email format,
  password complexity, date coercion, category enums, numeric ranges).

## 9. Additional hardening

- **Rate limiting on auth endpoints:** `src/middleware/rateLimiters.ts` — separate, tighter
  Redis-backed limiters for `/login`, `/register`, `/refresh`, `/forgot-password`, and
  `/ai/generate-itinerary`, plus a general API-wide limiter as defense in depth.
- **Account lockout:** `src/modules/auth/auth.service.ts` → `registerFailedLoginAttempt` /
  `login()` — after `LOGIN_LOCKOUT_MAX_ATTEMPTS` failures, `User.lockedUntil` is set for
  `LOGIN_LOCKOUT_MINUTES`; a locked account gets the same generic "Invalid credentials" response
  (no distinct "account locked" message that would leak account existence/state).
- **HTTPS-only, secure, SameSite cookies:** `src/lib/cookies.ts`, `COOKIE_SECURE` env flag
  (defaults must be explicitly enabled for production HTTPS).
- **Helmet:** `src/app.ts` → `app.use(helmet())`.
- **CORS locked to explicit origins:** `src/app.ts` — `cors({ origin: ... })` checks against
  `env.corsOrigins` (parsed from `CORS_ORIGINS`), never `*`, with `credentials: true`.
- **Password complexity:** enforced in both the Zod schema (`auth.schemas.ts`) *and* again at the
  hashing layer (`src/lib/password.ts` → `isPasswordComplexEnough`) so it can't be bypassed by
  calling the service directly.
- **Timing-consistent auth failures:** `auth.service.ts` → `login()` always runs
  `argon2.verify` — against the real hash if the user exists, or a precomputed dummy hash
  (`getDummyHash()`) if not — so a nonexistent email and a wrong password cost the same, and a
  locked account still runs the same verify before responding. Proven by
  `tests/auth.test.ts` → `"returns the identical error for a non-existent email..."`.
  (Network-level timing jitter isn't eliminated — see "Not done" below.)
- **Dependency audit:** `npm audit` → **0 vulnerabilities** (the one moderate finding, in the
  `uuid` package, was resolved by removing the dependency entirely — it was unused; the codebase
  uses `crypto.randomUUID()` and Prisma's own `@default(uuid())` instead).

## Not done / explicitly out of scope

- **CSRF tokens:** not added. The refresh cookie is `SameSite=strict`, which already blocks it
  being sent on cross-site requests (the primary vector CSRF tokens defend against for this
  cookie). All *mutating* state changes additionally require the `Authorization: Bearer` access
  token, which a cross-site page cannot read or attach. A double-submit CSRF token would be
  defense in depth on top of this, but wasn't added to avoid over-building for this project's size.
- **Nanosecond-level timing-attack resistance:** the login path is timing-*consistent* (same code
  path/hash cost either way, see above), but no explicit constant-time delay/jitter was added
  beyond what argon2's own verify already provides.
