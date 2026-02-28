# Gadget Review & Compare

Full-stack CRUD web application for reviewing and comparing gadgets (Phones, Laptops, Headphones).

## Tech Stack

- **Frontend:** React 18, TypeScript, TailwindCSS, Vite
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma

## Prerequisites

- Node.js 18+
- PostgreSQL
- npm or yarn

## Setup

### 1. Database

Create a PostgreSQL database and set its URL in the backend environment:

```bash
cd backend
cp .env.example .env
# Edit .env and set DATABASE_URL and JWT_SECRET
```

Example `.env`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/gadget_review_db?schema=public"
JWT_SECRET="your-secret-key"
PORT=4000
```

### 2. Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

API runs at `http://localhost:4000`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173` and proxies `/api` to the backend.

## Seed Data

- **Categories:** Phones, Laptops, Headphones
- **Brands:** Apple, Samsung, Google, Dell, Sony, Bose
- **Gadgets:** Sample phones, laptops, and headphones with specs and ratings
- **Demo user:** `demo@gadgetreview.com` / `password123`

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List categories |
| GET | `/api/brands?categoryId=` | List brands (optional filter) |
| GET | `/api/gadgets?categoryId=&brandId=&minRating=&search=&sortBy=` | List gadgets with filters/sort |
| GET | `/api/gadgets/:id` | Get gadget with reviews |
| POST | `/api/auth/register` | Register (name, email, password) |
| POST | `/api/auth/login` | Login (email, password) |
| POST | `/api/reviews/gadget/:gadgetId` | Add review (auth, rating, comment) |

Sort options: `price_asc`, `price_desc`, `rating_asc`, `rating_desc`.

## Project Structure

```
backend/
  prisma/schema.prisma   # DB schema
  prisma/seed.ts         # Seed script
  src/
    index.ts             # Express app
    controllers/
    routes/
    services/
    middleware/
frontend/
  src/
    api/client.ts        # API client
    components/          # Reusable UI
    context/             # Auth context
    pages/
    types.ts
```
