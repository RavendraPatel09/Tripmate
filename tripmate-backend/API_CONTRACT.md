# TripMate API Contract

Reverse-engineered from `RavendraPatel09/Tripmate` (Next.js App Router frontend) on 2026-09-24.

## Discovery notes

The frontend currently has **zero real network calls**. There is no `fetch`, `axios`,
`VITE_API_URL`/`NEXT_PUBLIC_API_URL`, or any env-driven API client anywhere in `src/`.
Every page fakes network latency with `setTimeout` and reads/writes local Zustand stores
(`useUserStore`, `useTripStore`, `useExtensionStore`) seeded from `src/data/mockData.ts`.
Data shapes below come from `src/types/index.ts`, `mockData.ts`, and every page/store file.

This contract is what a real backend for this UI needs — not a 1:1 dump of the mocks.
Where the mocks don't imply a real endpoint (see **Assumptions**), I made the smallest
sensible product decision and documented it rather than guessing silently.

## Auth model

- `POST` responses set an **httpOnly, Secure, SameSite=strict** `refreshToken` cookie.
- Access token (JWT, 15 min) is returned in the JSON body; the frontend sends it as
  `Authorization: Bearer <token>`. Never stored in a cookie or localStorage by the backend's contract.
- All `/api/**` routes except those explicitly marked **Public** require a valid access token.
- Admin routes additionally require `role = ADMIN`, checked server-side from the DB on every request.

## Assumptions (confirm or accept as documented)

1. **Trip entity introduced.** The mocks have no `Trip` model — only a flat, global,
   unscoped `packingItems`/`expenses`/`notifications` per user and a `Destination[]`
   wishlist/saved list. A real multi-trip travel app needs a `Trip` to hang budget,
   packing, expenses, and group members off of. Added `Trip`, kept `tripId` **optional**
   on `PackingItem`/`Expense` so today's "flat global list" UX still works unmodified,
   while supporting per-trip scoping later without a breaking change.
2. **AI Trip Builder (`/ai-generator`) is stubbed, not a real LLM integration** — per your
   instruction. `POST /api/ai/generate-itinerary` returns a deterministic, template-based
   itinerary from `budget`/`days`/`origin`/`destination`. No external API key, no per-call cost.
3. **Budget estimator is a rule-based split, not "AI-powered"** (the mock UI's copy says
   "AI-powered" but it's marketing copy over a hardcoded object). Implemented as a
   deterministic percentage-based allocator, consistent with decision #2.
4. **Planner routes are computed, not persisted.** `MOCK_ROUTES` in the frontend represents
   route-finding output, not stored data — no third-party transit/flight API is wired (would
   need keys). `POST /api/planner/routes` returns 2–4 deterministic synthetic route options.
5. **Catalog data is public-read, admin-write.** `Destination`, `FoodItem`, `HiddenGem`,
   `EventItem`, `EmergencyContact` are reference data, not user-owned — matches the frontend
   (none of `/explore`, `/food`, `/hidden-gems`, `/events`, `/emergency` are behind the
   `isAuthenticated` redirect that `/dashboard` uses). Mutating them is the admin surface used
   to satisfy the admin-route security requirements.
6. **Achievements are catalog + per-user progress**, split into two tables server-side
   (`Achievement` catalog, `UserAchievement` progress) but merged into one flat object in the
   API response so it matches the frontend's `Achievement` interface exactly.
7. **Notifications return an ISO `createdAt`**, not a pre-formatted string like `"2 hours ago"`.
   Relative-time formatting is a display concern; the mock's `date: "2 hours ago"` bakes
   formatting into data, which a backend shouldn't do.
8. **Community feed is public-read, write requires auth.** `/community` isn't behind the
   `isAuthenticated` gate today, so `GET` stays public; posting/liking/commenting requires login.
   **Follow / Bookmark / Share are left as UI-only** for this pass — they'd need a follow graph
   and notification fan-out that add real complexity with no corresponding page-level need yet
   (buttons exist but no page consumes "following" state). Flagging this as descoped, not silently dropped.
9. **Group expense splitting (`/expenses/split`) is modeled as `TripMember` + a manual `settle`
   action** (adjust balance directly), not a full ledger/debt-simplification engine. The mock's
   "Suggested Transfer" cards are a nice-to-have UI computation the frontend can derive from
   member balances; no backend endpoint added for it to avoid over-building.
10. **`/offline` and `/replay` pages get no dedicated endpoints.** Both are static, hardcoded
    presentational mockups (fake file sizes, fake photo counts, fake timeline) with no state
    that needs a server — there's nothing real to persist yet.
11. **UUIDs everywhere.** All public-facing IDs are UUIDs (Prisma `@default(uuid())`), never
    sequential integers, per the security requirements.
12. **Forgot-password never reveals whether an email exists** (`202 Accepted` always) —
    prevents user enumeration. No real email provider is wired (would need third-party
    credentials); in dev, the reset link/token is written to the server log only.
13. **`PATCH /api/users/me`** was added even though the frontend's dashboard "Settings" button
    is currently a no-op — trivial to support and the button already implies the need.

---

## Endpoints

### Auth — `/api/auth` (public unless noted)

| Method | Path | Body | Notes |
|---|---|---|---|
| POST | `/register` | `{ name, email, password, confirmPassword }` | Creates user (role=USER), returns `{ user, accessToken }` + sets refresh cookie |
| POST | `/login` | `{ email, password }` | Rate-limited + lockout after repeated failures. Generic `Invalid credentials` on any failure |
| POST | `/refresh` | *(reads refresh cookie)* | Rotates refresh token, returns new `{ accessToken }` |
| POST | `/logout` | *(reads refresh cookie)* | Revokes refresh token, clears cookie |
| POST | `/forgot-password` | `{ email }` | Always `202`, never leaks user existence |
| POST | `/reset-password` | `{ token, newPassword }` | Consumes single-use reset token |
| GET | `/me` | — | **Auth.** Returns `{ id, name, email, avatar }` |

### Users — `/api/users` (auth required)

| Method | Path | Body |
|---|---|---|
| PATCH | `/me` | `{ name?, avatar? }` |

### Trips — `/api/trips` (auth required, owner-only)

| Method | Path | Body |
|---|---|---|
| GET | `/` | list own trips |
| POST | `/` | `{ title, destinationName, originName?, startDate, endDate, budgetTotal?, travelers? }` |
| GET | `/:tripId` | owner only |
| PUT | `/:tripId` | owner only |
| DELETE | `/:tripId` | owner only |

### Trip members (group splitter) — `/api/trips/:tripId/members` (auth, trip-owner only)

| Method | Path | Body |
|---|---|---|
| GET | `/` | list members + balances |
| POST | `/` | `{ name, avatar? }` |
| PATCH | `/:memberId/settle` | `{ amount }` → adjusts balance |
| DELETE | `/:memberId` | remove member |

### Wishlist & saved trips — `/api/me/wishlist`, `/api/me/saved-trips` (auth, owner-scoped)

| Method | Path | Body |
|---|---|---|
| GET | `/api/me/wishlist` | — |
| POST | `/api/me/wishlist` | `{ destinationId }` |
| DELETE | `/api/me/wishlist/:destinationId` | — |
| GET | `/api/me/saved-trips` | — |
| POST | `/api/me/saved-trips` | `{ destinationId }` |
| DELETE | `/api/me/saved-trips/:destinationId` | — |

### Packing — `/api/packing-items` (auth, owner-scoped)

| Method | Path | Body |
|---|---|---|
| GET | `/` | optional `?tripId=` |
| POST | `/` | `{ name, category, tripId? }` |
| PATCH | `/:id` | `{ isPacked?, name?, category? }` |
| DELETE | `/:id` | — |

### Expenses — `/api/expenses` (auth, owner-scoped)

| Method | Path | Body |
|---|---|---|
| GET | `/` | optional `?tripId=` |
| GET | `/summary` | totals by category |
| POST | `/` | `{ amount, category, description, date, tripId? }` |
| DELETE | `/:id` | — |

### Budget — `/api/budget` (auth)

| Method | Path | Body |
|---|---|---|
| POST | `/estimate` | `{ destination, totalBudget, travelers, days }` → `BudgetEstimate` (stateless, not persisted) |

### Planner — `/api/planner` (auth)

| Method | Path | Body |
|---|---|---|
| POST | `/routes` | `{ origin, destination, date? }` → `RouteOption[]` (stateless) |

### AI generator — `/api/ai` (auth, rate-limited)

| Method | Path | Body |
|---|---|---|
| POST | `/generate-itinerary` | `{ origin, budget, days, destination? }` → templated itinerary text (stub, see Assumption 2) |

### Achievements — `/api/achievements` (auth, owner-scoped progress)

| Method | Path |
|---|---|
| GET | `/` — catalog merged with caller's progress |

### Notifications — `/api/notifications` (auth, owner-scoped)

| Method | Path | Body |
|---|---|---|
| GET | `/` | — |
| PATCH | `/:id/read` | — |
| PATCH | `/read-all` | — |
| DELETE | `/:id` | — |

### Community — `/api/community/posts`

| Method | Path | Auth | Body |
|---|---|---|---|
| GET | `/` | Public | paginated feed |
| POST | `/` | Auth | `{ content, image?, location? }` |
| DELETE | `/:id` | Auth, owner-only | — |
| POST | `/:id/like` | Auth | toggle like |
| GET | `/:id/comments` | Public | — |
| POST | `/:id/comments` | Auth | `{ content }` |

### Catalog (public read) — admin-write via `/api/admin/*`

| Method | Path | Auth |
|---|---|---|
| GET | `/api/destinations`, `/api/destinations/:id` | Public |
| GET | `/api/foods` | Public |
| GET | `/api/hidden-gems` | Public |
| GET | `/api/events` | Public |
| GET | `/api/emergency-contacts` | Public, optional `?city=` |

### Admin — `/api/admin/*` (auth + `role=ADMIN`, enforced once at router level)

| Method | Path |
|---|---|
| GET | `/users` (list, no password hashes) |
| PATCH | `/users/:id/role` `{ role: "USER"\|"ADMIN" }` |
| POST/PUT/DELETE | `/destinations`, `/foods`, `/hidden-gems`, `/events`, `/emergency-contacts`, `/achievements` |

---

## Data model → Prisma (see `prisma/schema.prisma` for the authoritative version)

`User`, `RefreshToken`, `PasswordResetToken`, `Trip`, `TripMember`, `Destination`, `FoodItem`,
`HiddenGem`, `EventItem`, `EmergencyContact`, `SavedDestination` (wishlist/saved, discriminated
by `listType`), `PackingItem`, `Expense`, `Achievement`, `UserAchievement`, `Notification`,
`CommunityPost`, `PostLike`, `PostComment`.
