# Gadget Review & Compare

A full-stack web app for browsing, filtering, and reviewing gadgets across categories like Phones, Laptops, and Headphones. Users can register, log in, and submit authenticated reviews with ratings and comments.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, TypeScript, TailwindCSS, Vite |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Auth | JWT (Bearer token) |

## Prerequisites

- Node.js 18+
- PostgreSQL (local or hosted)
- npm

## Local Setup

### 1. Clone & configure environment

```bash
git clone <repo-url>
cd gadget_review_site

cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/gadget_review_db?schema=public"
JWT_SECRET="your-secret-key"
PORT=4000
```

### 2. Start the backend

```bash
cd backend
npm install
npm run db:generate   # Generate Prisma client
npm run db:push       # Apply schema to DB
npm run db:seed       # Seed categories, brands, gadgets, demo user
npm run dev           # Start with hot-reload on port 4000
```

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev           # Vite dev server on port 5173
```

The frontend proxies all `/api/*` requests to `localhost:4000` — no additional config needed.

## Seed Data

| Type | Values |
|------|--------|
| Categories | Phones, Laptops, Headphones |
| Brands | Apple, Samsung, Google, Dell, Sony, Bose |
| Gadgets | Sample devices with specs and ratings |
| Demo user | `demo@gadgetreview.com` / `password123` |

## API Overview

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register (name, email, password) |
| POST | `/api/auth/login` | — | Login (email, password) |
| PATCH | `/api/auth/change-password` | Required | Change password |
| DELETE | `/api/auth/account` | Required | Delete account |

### Categories
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/categories` | — | List all categories |
| GET | `/api/categories/:id` | — | Get category by ID |

### Brands
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/brands?categoryId=` | — | List brands (optional category filter) |
| POST | `/api/brands` | Required | Create a brand |

### Gadgets
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/gadgets?categoryId=&brandId=&minRating=&search=&sortBy=` | — | List gadgets with filters/sort |
| GET | `/api/gadgets/:id` | — | Get gadget by ID |
| POST | `/api/gadgets` | — | Create a gadget |
| PATCH | `/api/gadgets/:id` | — | Update a gadget |
| DELETE | `/api/gadgets/:id` | — | Delete a gadget |

### Reviews
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/reviews/user/me` | Required | List reviews by current user |
| GET | `/api/reviews/gadget/:gadgetId` | — | List reviews for a gadget |
| POST | `/api/reviews/gadget/:gadgetId` | Required | Add review (rating, comment) |
| PATCH | `/api/reviews/:id` | Required | Update a review |
| DELETE | `/api/reviews/:id` | Required | Delete a review |

Sort options: `price_asc`, `price_desc`, `rating_asc`, `rating_desc`.

## Project Structure

```
gadget_review_site/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # DB models (User, Gadget, Review, Category, Brand)
│   │   └── seed.ts             # Seed script
│   └── src/
│       ├── index.ts            # Express app, CORS, route mounting
│       ├── controllers/        # HTTP request/response handling
│       ├── routes/             # Route definitions
│       ├── services/           # Business logic & Prisma queries
│       └── middleware/         # JWT auth middleware
└── frontend/
    └── src/
        ├── App.tsx             # Router setup
        ├── types.ts            # Shared TypeScript interfaces
        ├── api/client.ts       # Fetch wrapper with auth headers
        ├── context/            # Global auth state (AuthContext)
        ├── components/         # Reusable UI components
        └── pages/              # Page-level components
```

## Development Scripts

### Backend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot-reload (tsx watch) |
| `npm run build` | Compile TypeScript |
| `npm run db:generate` | Regenerate Prisma client after schema changes |
| `npm run db:push` | Push schema to DB (no migration history) |
| `npm run db:migrate` | Create and apply a migration |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio UI |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (port 5173) |
| `npm run build` | Type-check + build production bundle |
| `npm run preview` | Preview production build |
