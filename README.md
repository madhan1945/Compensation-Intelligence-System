# CompensationIQ — Compensation Intelligence System

A full-stack, type-safe compensation intelligence dashboard designed to help software engineers discover and compare real compensation data across major tech companies, financial institutions, and high-growth startups in India and globally.

## 🚀 Live Demo
The application is ready for deployment. Follow the Vercel instructions below to deploy and set up your production database.

---

## 🛠️ Tech Stack & Versions

- **Framework**: Next.js 16.2 (App Router, Turbopack)
- **Language**: TypeScript
- **Database**: PostgreSQL (Prisma Dev Local Server / Production Neon Serverless)
- **ORM**: Prisma 7.8 (with Direct Driver Adapters)
- **Styling**: Tailwind CSS v4.0 (CSS-first engine)
- **Authentication**: NextAuth.js v4.24 (Credentials provider + hashed passwords with `bcryptjs`)
- **Data Visualization**: Recharts v3.8 (responsive bar, line, and layout charts)
- **Validation**: Zod v4.4
- **Attribution**: Built by `madhan1945`

---

## 🏗️ Architecture decisions
Key design decisions are recorded in the [ADR.md](file:///D:/Projects/compensation-intel/ADR.md):
1. **Next.js API Routes** for backend logic to maintain single-repo simplicity.
2. **PostgreSQL & Prisma** for relational data safety and type-safe schema queries.
3. **Neon Serverless** for edge-optimized PostgreSQL deployment.
4. **Canonical Name Normalization** to merge variations like "Google LLC" and "Alphabet" under a single company profile.
5. **Computed & Indexed TC** to ensure total compensation queries are fast and performant.

---

## ✨ Key Features

1. **Precision Dark UI**: Bloomberg-fintech inspired dark interface with a monospace typeface for all numerical compensation data.
2. **Dynamic Browse Table**: Sortable, filterable table view by company, location, level, and years of experience, completely synced with the URL.
3. **Company Profiles**: Full analytics pages highlighting avg/median base, bonus, stock values, and distribution charts for levels, years of experience, and cities.
4. **Side-by-Side Comparison**: Compare 2 to 3 companies side-by-side with color-coded high/low indicators.
5. **Multi-Step Form**: Under-2-minute submission page with autocomplete suggestions, city normalization preview, and live Total Comp calculations.
6. **Robust Validation**: Zod-based schemas filtering inputs, IP rate-limiting, and XSS string sanitizations.

---

## 💻 Local Setup & Development

### 1. Clone the repository
Clone or navigate to the directory on your drive.

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env` file in the root directory:
```env
# Prisma local database server proxy URL (used for schema push/generate)
DATABASE_URL="prisma+postgres://localhost:51213/?api_key=..."

# Direct database connection URL (used for direct pool connections in pg driver)
DIRECT_DATABASE_URL="postgres://postgres:postgres@localhost:51214/template1?sslmode=disable"
```

Create a `.env.local` file for Next.js:
```env
NEXTAUTH_SECRET="f2a1b9c8d7e6f5a4b3c2d1e0f9a8b7c6"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Start the database server
Prisma 7 includes a built-in development database command. Start it in the background:
```bash
npx prisma dev --detach
```

### 5. Synchronize schema and seed data
```bash
# Push schema migrations
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed 200+ realistic salary entries
npx prisma db seed
```

### 6. Run local dev server
```bash
npm run dev
```
Open `http://localhost:3000` to browse the app.

---

## 🔮 Production Deployment (Vercel + Neon)

### 1. Neon Database Setup
1. Create a free account at [Neon.tech](https://neon.tech).
2. Create a project `compensation-intel-prod`.
3. Copy the **Pooled Connection String**.

### 2. Vercel Deployment
Deploy the app using Vercel CLI:
```bash
npm install -g vercel
vercel login
vercel --prod
```
Set the following environment variables in the Vercel dashboard:
- `DATABASE_URL`: Your Neon Pooled Connection String.
- `NEXTAUTH_SECRET`: A secure random string (e.g. generated via `openssl rand -base64 32`).
- `NEXTAUTH_URL`: Your deployed Vercel domain (e.g. `https://your-app.vercel.app`).

### 3. Deploy Migrations
Run production migrations and seed:
```bash
npx prisma migrate deploy
npx prisma db seed
```

---

## 🚧 Known Limitations & Future Improvements
- **Verification System**: Future phases can add file uploads (W-2s, paystubs, offer letters) to verify salary data and mark entries with a verified checkmark.
- **SSO Authentication**: Integrate Google & GitHub OAuth providers via NextAuth for frictionless login.
- **Search Autocomplete Expansion**: Migrate local autocomplete queries to an external service (like Clearbit autocomplete API) for international company validation.
