# ArabDiving — Full Project Audit

_Date: 2026-06-15 · Scope: `backend/` (Express + MongoDB) and `frontend/` (Next.js 16, React 19)_

## How this was run

A full live boot was **not possible inside the sandbox** (environment limits, not code faults):

- **Backend** — `MONGO_URI` points to `mongodb://127.0.0.1:27017/arabdiving`; there is no local MongoDB in the sandbox, so the server hangs on connect. The code itself loads fine.
- **Frontend** — `next build`/`next dev` need to download the Linux SWC binary from npm, and outbound network to `registry.npmjs.org` is blocked; the installed `node_modules` only has the Windows binary.

What **was** verified:

- `tsc --noEmit` across the whole frontend → **passes, 0 errors** (after re-syncing the edited files).
- esbuild JSX parse of all changed files → **clean**.
- Full manual read of every controller, model, route, middleware, and page.

To run locally: start MongoDB (or point `MONGO_URI` at Atlas), `cd backend && npm run dev`, then `cd frontend && npm run dev`.

---

## Critical (fix before any public launch)

**C1 — Anyone can create dive sites (no auth).**
`backend/src/routes/diveSiteRoutes.js`: `router.post("/", createDiveSite)` has no `protect`/`adminOnly`, and `createDiveSite` does `DiveSite.create(req.body)`. Any unauthenticated user can inject records. A properly protected admin version already exists at `POST /api/admin/dive-sites`.
→ Remove the public POST (or guard it with `protect, adminOnly`).

**C2 — Secrets committed, no backend `.gitignore`.**
`backend/.env` holds `MONGO_URI`, `JWT_SECRET`, and Cloudinary key/secret, and there is **no `backend/.gitignore`**. If this repo is ever pushed/shared, all secrets leak.
→ Add `backend/.gitignore` (ignore `.env`, `node_modules`), rotate the JWT secret and Cloudinary keys, keep a `.env.example` with blank values.

**C3 — API URL hardcoded to `http://localhost:5000` in 12 frontend files.**
`register`, `login`, `dive-sites`, `dive-sites/[id]`, `logbook`, `profile`, `profile/edit`, `members`, `members/[id]`, `ReviewForm`, `FeaturedDiveSites` all hardcode localhost. Only `community/page.tsx` uses `NEXT_PUBLIC_API_URL`. The app will be completely non-functional once deployed.
→ Create one `lib/api.ts` exporting `const API = process.env.NEXT_PUBLIC_API_URL` and replace every hardcoded string.

---

## High

**H1 — Logged-in users can't see their session or log out.**
The active navbar is `components/layout/Navbar.tsx` (static — always shows "تسجيل الدخول / انضم الآن"). A second, auth-aware `components/Navbar.tsx` (reads `user` from localStorage, has logout) exists but is **never imported** — it's dead code.
→ Switch the layout to the auth-aware navbar (and add the new الشباب/النساء/الأطفال links there), then delete the unused one.

**H2 — JWT stored in `localStorage`.**
Token is kept in localStorage in 8 places, making it stealable via any XSS. 30-day expiry widens the window.
→ Prefer httpOnly cookies; at minimum keep React strictly escaping user content and shorten token life.

**H3 — No CORS restriction, rate limiting, or security headers.**
`app.use(cors())` allows every origin; `/api/auth/login` has no throttling (brute-force) and there's no `helmet`.
→ Restrict CORS to your domain, add `express-rate-limit` on auth routes, add `helmet`.

**H4 — No input validation on auth.**
`registerUser`/`loginUser` don't check presence/format of fields, password length, and don't lowercase email — so `A@x.com` and `a@x.com` bypass the unique index as different users.
→ Validate (e.g. `zod`/`express-validator`) and normalize email to lowercase.

**H5 — Auth & account pages are in English, breaking the Arabic-first experience.**
`login`, `register`, `profile/edit`, and `members` use English labels/messages ("Register", "Members Directory", "Loading…", "View Profile", "Login successful ✅"). This clashes with the RTL Arabic site and the Gulf audience goal.
→ Translate all UI strings to Arabic.

---

## Medium

**M1 — Register is a dead end.** Backend returns no token on register and the frontend shows a message but never redirects or logs in. → Auto-login on register (return a token) or redirect to `/login`.

**M2 — Duplicate reviews allowed.** No unique `(user, diveSite)` constraint, so one user can review a site repeatedly and skew `averageRating`. → Add a unique compound index or upsert-per-user.

**M3 — User schema/field mismatches.** `getAllUsers` selects `bio` and `certifications`, which **don't exist** on the `User` schema (it has `certificationLevel`, no `bio`). Member cards render blank fields. → Align field names across schema, controller, and UI.

**M4 — Debug `console.log`s left in code.** `server.js` ("COMMENT ROUTES IMPORTED"), `models/Post.js` ("POST MODEL LOADED"), `routes/commentRoutes.js`, `postController` (`SCHEMA=`, `NEW POST=`), `userController` (`FILE=`, `BODY=`). → Remove or replace with a logger.

**M5 — Homepage stats are fake.** `Stats.tsx` hardcodes "2500+ عضو, 120+ موقع, 12 دولة, 15000+ غوصة". Misleading at launch. → Wire to `/api/admin/dashboard` or a public stats endpoint, or soften the copy.

**M6 — No pagination.** `getPosts`, `getAllUsers`, `getDiveSites`, `getReviewsBySite` return everything. → Add `limit`/`skip` (or cursor) pagination.

---

## Low / polish

- **L1 — Inconsistent API response shapes.** Most endpoints return `{success, ...}`, but `getAllUsers` returns a raw array and `getUserById` returns a spread object. Standardize.
- **L2 — `req.user.id` vs `req.user._id`** mixed across controllers (both work via Mongoose, but pick one).
- **L3 — `reviewController` requires `DiveSite` mid-function;** move the import to the top.
- **L4 — Thin error/loading states.** e.g. `dive-sites/page.tsx` does `setSites(data.data)` with no `.catch`; if the API is down the page breaks silently.
- **L5 — Image source inconsistency.** Dive-site images render from `/images/${site.image}` (local `public/`), but uploads go to Cloudinary (absolute URLs). Pick one strategy.
- **L6 — `FeaturedDiveSites`** is a server component fetching localhost with `no-store`; in production it must use an absolute env URL and handle fetch failure.

---

## Goal alignment (drawing Gulf divers to Egypt's Red Sea)

The platform mechanics are solid, but nothing yet speaks to the **specific** goal of pulling Saudi / Kuwaiti / Omani / Qatari divers toward Egypt:

- Messaging is generic pan-Arab. Consider Gulf-specific framing (direct flights from Riyadh/Kuwait/Doha, ease of travel, weekend trip packages, prices in SAR/KWD).
- Dive sites are DB-driven and the DB is empty without seeding. **Add a seed script** with real Red Sea sites (Ras Mohammed, Thistlegorm, Blue Hole Dahab, Elphinstone, Brothers Islands, Abu Dabbab, etc.) so the site isn't empty on first run.
- The new الشباب / النساء / الأطفال pages already tie each audience back to the Red Sea — good foundation to build trip/community content on.

---

## Suggested order of work

1. C1, C2, C3 (security + deployability) — these block a real launch.
2. H1, H5 (logout + Arabic UI) — most visible to users.
3. H3, H4, H2 (hardening).
4. M1–M5 + a dive-site seed script.
5. Low-priority polish.
