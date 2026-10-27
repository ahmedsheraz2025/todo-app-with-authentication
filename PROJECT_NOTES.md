# PROJECT_NOTES.md — Todo App with Authentication

## Project goal
Ek simple Todo app jisme user apna account bana sake (username + password) aur sirf apne todos manage kar sake (add, complete toggle, delete, list). Beginner-friendly learning project.

## Tech stack & why
- **Next.js 16 (App Router) + TypeScript** — frontend + backend ek hi codebase mein; type safety.
- **Tailwind CSS v4** — fast styling, utility classes.
- **Prisma 7 + SQLite** — type-safe DB queries; SQLite local file DB (no separate DB server needed).
- **Auth (planned):** username + password, bcrypt hash, session cookie.
- **Font:** Geist Sans / Geist Mono (Next.js default).

## Folder structure
- `app/` — Next.js pages & API routes
- `app/api/auth/` — (planned) signup, login, logout
- `app/api/todos/` — (planned) todo CRUD
- `app/login/page.tsx`, `app/signup/page.tsx`, `app/dashboard/page.tsx` — (planned)
- `lib/prisma.ts` — Prisma client singleton (adapter-based for Prisma 7)
- `prisma/schema.prisma` — User + Todo models
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
- Git repo: separate repo in project folder; pushed to GitHub (main branch).

## Done
- Step 1: Next.js 16 + TypeScript + Tailwind v4 + ESLint init. Build passes.
- Step 2: Prisma 7 setup, User/Todo schema, migration applied, dev.db created.
- Git repo init + initial commit + push to GitHub.

## In progress
- (none)

## Next
- Step 3: Auth APIs (signup/login/logout) + session cookie + bcrypt.
- Step 4: Todo CRUD APIs.
- Step 5: Frontend pages (login, signup, dashboard) + Tailwind UI.
- Step 6: Test + final docs.

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
- **App Router:** Next.js 13+ routing system (folder-based).