# PROJECT_NOTES.md — Todo App with Authentication

## Project goal
Ek simple Todo app jisme user apna account bana sake (username + password) aur sirf apne todos manage kar sake (add, complete toggle, delete, list). Beginner-friendly learning project.

## Tech stack & why
- **Next.js 16 (App Router) + TypeScript** — frontend + backend ek hi codebase mein; type safety.
- **Tailwind CSS v4** — fast styling, utility classes.
- **Prisma 7 + SQLite** — type-safe DB queries; SQLite local file DB (no separate DB server needed).
- **Auth:** username + password, bcrypt hash, DB-backed session cookie.
- **Font:** Geist Sans / Geist Mono (Next.js default).

## Folder structure
- `app/` — Next.js pages & API routes
- `app/api/auth/` — signup, login, logout, me
- `app/api/todos/` — todo CRUD
- `app/api/admin/` — admin-only stats, users list, user detail
- `app/login/page.tsx`, `app/signup/page.tsx`, `app/dashboard/page.tsx`, `app/admin/page.tsx` — pages
- `lib/prisma.ts` — Prisma client singleton (adapter-based for Prisma 7)
- `lib/session.ts` — DB-backed session (7-day, HMAC-signed cookie)
- `lib/auth.ts` — getAuthUserId, isAdminUserId, getAdminUserId
- `prisma/schema.prisma` — User + Todo + Session models
- `prisma/migrations/` — DB migration history
- `prisma.config.ts` — Prisma 7 config (DB url for migrate)
- `.env` — secrets (DATABASE_URL, SESSION_SECRET) — gitignored
- `dev.db` — SQLite database file — gitignored
- `AGENTS.md` — agent guide (Roman Urdu)

## How the app works (main flow)
1. User signup karta hai → User table mein row (password hashed).
2. Login → session cookie set.
3. Dashboard → sirf us user ke todos list hote hain.
4. Add/Toggle/Delete → API route → Prisma → DB.

## Decisions taken
- Prisma 7 chosen (latest) despite complex config; user approved.
- Auth: username + password (no email) — user choice.
- Todos: basic features (add, toggle, delete, list own) — user choice.
- Styling: Tailwind — user choice.
- DB: SQLite (local) — simple setup.
- Admin identity: fixed username from env (ADMIN_USERNAME=admin); no role column. Admin must signup with that username.
- Session tracking: DB Session table (7-day expiry, HMAC-signed cookie) to count logged-in users.
- Admin login: separate endpoint/page flow (`/api/admin/login`), rejects non-admin credentials.

## Done
- Step 1: Next.js 16 + TypeScript + Tailwind v4 + ESLint init. Build passes.
- Step 2: Prisma 7 setup, User/Todo schema, migration applied, dev.db created.
- Step 3: Auth APIs (signup/login/logout) + session cookie (HMAC signed) + bcrypt. Tested OK.
- Step 4: Todo CRUD APIs (GET/POST list+create, PATCH toggle, DELETE) user-scoped with ownership check. Tested OK.
- Step 5: Frontend pages (signup, login, dashboard) + Tailwind UI + client fetch. Build passes.
- Polish: light theme only (no invisible text), root `/` redirects to `/login`.
- Step 6: README updated; final docs complete. Typecheck + lint + build pass.
- Step 8: Separate admin login. `/admin` shows its own Admin Login form (`/api/admin/login`, admin-only); normal `/login` unchanged. Non-admin blocked.
- Step 9: Landing page at `/` (welcome + Login/Sign up buttons); logged-in users auto-redirect to `/dashboard`. `export const instant = false` for session check.
- Step 10: Login & Signup pages par "Back to home" link add kiya (Link component). Admin login UI manual styling tweaks preserve kiye. AGENTS.md mein manual-changes preserve rule add kiya.
- User manual UI polish: rounded-2xl inputs/cards, zinc-100 bg, red logout, input/li styling — preserved (no revert).

## In progress
- (none)

## Next
- (none)

## How to run & test
- Install: `npm install`
- Dev server: `npm run dev` → http://localhost:3000
- Lint: `npm run lint`
- Build: `npm run build`
- DB view: `npx prisma studio`
- Typecheck: `npx tsc --noEmit`

## Glossary
- **ORM:** Object Relational Mapper — code se DB queries without raw SQL.
- **Migration:** DB structure change ka SQL file + history.
- **Adapter (Prisma 7):** DB driver bridge (better-sqlite3).
- **Session cookie:** login state store karne ka browser cookie.
- **Session table:** DB rows for active login sessions (for logged-in count + validation).