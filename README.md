# HomeBites

A single-restaurant food ordering platform — browse the menu by category, add items to your cart, check out, and track your order.

## Structure

```
frontend/   React 19 + Vite + Tailwind + Redux Toolkit (RTK Query) SPA
backend/    Node.js + Express + Prisma REST API (SQLite for local dev)
```

## Running locally

Two terminals, both need Node.js installed.

**Backend** (http://localhost:3001)

```sh
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Copy `backend/.env.example` to `backend/.env` first if it doesn't already exist, and adjust `JWT_SECRET`/`CORS_ORIGIN` as needed.

A demo account is seeded for testing: `demo@homebites.app` / `password123`.

**Frontend** (http://localhost:5173)

```sh
cd frontend
npm install
npm run dev
```

`frontend/.env` points the app at the backend via `VITE_API_URL` (defaults to `http://localhost:3001/api`).

## Stack

- **Frontend**: React, React Router, Redux Toolkit + RTK Query, redux-persist, Tailwind CSS, Radix UI primitives
- **Backend**: Express, Prisma ORM, JWT auth, bcrypt
