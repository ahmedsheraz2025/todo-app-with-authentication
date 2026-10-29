# Todo App with Authentication

Simple todo app where users create an account (username + password) and manage their own todos (add, toggle complete, delete, list).

## Tech stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Prisma 7 + SQLite
- bcryptjs password hashing + HMAC-signed session cookie

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` in project root:
   ```env
   DATABASE_URL="file:./dev.db"
   SESSION_SECRET="any-long-random-string"
   ```
3. Apply database migrations:
   ```bash
   npx prisma migrate dev
   ```

## Run
```bash
npm run dev
```
Open http://localhost:3000 (redirects to /login).

## Pages
- `/signup` — create account
- `/login` — login
- `/dashboard` — manage your todos

## Scripts
- `npm run lint` — lint
- `npm run build` — production build
- `npx tsc --noEmit` — typecheck
- `npx prisma studio` — browse database
