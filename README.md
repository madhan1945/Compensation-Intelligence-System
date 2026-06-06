# CompensationIQ — Compensation Intelligence System

A full-stack, type-safe compensation intelligence dashboard designed to help software engineers discover and compare real compensation data across major tech companies, financial institutions, and high-growth startups in India and globally.

---

## 📊 Competitive Analysis & Key Observations

To build a premium compensation system, we analyzed existing market leaders to identify features and data normalization approaches:

### Feature Comparison Sheet

| Feature | Levels.fyi | 6figr | AmbitionBox | Glassdoor | Build? (Status in CompensationIQ) |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Salary by role + level** | Yes | Yes | Partial | Partial | **Yes** (Enforced in database and filters) |
| **TC breakdown (base/bonus/equity)** | Yes | Yes | Partial | Partial | **Yes** (Base, bonus, signing, and stock) |
| **Location normalization** | Yes | Yes | Yes | Yes | **Yes** (City normalization utility) |
| **Company pages** | Yes | Yes | Yes | Yes | **Yes** (With charts & recent entries) |
| **YoE filtering** | Yes | Yes | Yes | Yes | **Yes** (Interactive filters in UI) |
| **Side-by-side comparison** | Yes | Partial | No | No | **Yes** (Compare 2-3 companies side-by-side) |
| **Salary trend charts** | Yes | Partial | Yes | Yes | **Yes** (TC by YoE and level charts) |
| **Anonymous submission** | Yes | Yes | Yes | Yes | **Yes** (Default mode for all users) |
| **Verification system** | Yes | Partial | Partial | Partial | **No** (Planned on roadmap) |
| **Search autocomplete** | Yes | Yes | Yes | Yes | **Yes** (Autocomplete for company select) |

### Key Observations: Why Levels Matter More Than Job Titles

In the modern tech industry, **job titles are highly misleading**. A "Senior Software Engineer" at one company can mean something completely different at another, both in terms of responsibilities and compensation.

*   **The Equivalency Gap:**
    *   **Google L5** (Senior Software Engineer) has an average total compensation of ~₹65L - ₹90L+ in India.
    *   **TCS Senior Consultant / Senior Engineer** has an average salary of ~₹15L - ₹22L in India.
    *   Both carry the word "Senior" in their titles, but the compensation difference is **3x to 4x**.
*   **Standardizing by Levels:**
    *   Leading tech companies use structured engineering levels (e.g., L3/SDE-1, L4/SDE-2, L5/Senior, L6/Staff).
    *   Mapping compensation to these levels allows job seekers to compare their offers accurately across peer companies (e.g., comparing Google L4 with Microsoft L61 or Amazon L5).
    *   Standardizing by level, rather than job title, removes the noise and surfaces the true market rate for a specific level of scope and impact.
    *   Our platform **enforces levels** on submission and offers filtering based on normalized level groups (L3, L4, L5, L6) to provide high-fidelity insights.

---

## 📂 Repository File Structure

Below is the directory layout showing only the essential source code files:

```
├── app/                  # Next.js App Router Pages & API Routes
│   ├── (auth)/           # Authentication routes (Login / Register / split-screen design)
│   ├── (public)/         # Public client pages (Dashboard, Compare, Submit, Profiles)
│   ├── api/              # Core API endpoints (Salaries, Compare, Auth handlers)
│   ├── globals.css       # Global design system & HSL theme variables (:root)
│   └── layout.tsx        # Global root layout with theme hydration handling
├── components/           # Reusable UI & Layout Components
│   ├── layout/           # Shared page elements (Navbar, Footer, SearchBar, AuthGate)
│   ├── salary/           # Salary tables, details, filters, charts
│   └── ui/               # Lower-level elements (Badge, Skeleton, CookieConsent)
├── lib/                  # Utility Functions & Configuration Singletons
│   ├── auth.ts           # NextAuth configuration, providers, and authorize logics
│   ├── prisma.ts         # Prisma Client edge-optimized connection manager
│   ├── normalize.ts      # Normalization utilities (companies & cities)
│   ├── tc-calculator.ts  # Total Compensation (TC) calculation rules
│   └── validations.ts    # Zod schemas for input validation and sanitation
└── prisma/               # Database Schema & Data Seeding
    ├── schema.prisma     # Prisma schema defining tables and indexes
    └── seed.ts           # Seeding script populating 200+ realistic salary entries
```

---

## 🛠️ Tech Stack & Versions

- **Framework:** Next.js 16.2 (App Router, Webpack build engine)
- **Language:** TypeScript
- **Database:** PostgreSQL (Edge-optimized connection pooling)
- **ORM:** Prisma 7.8 (with Direct Driver Adapters)
- **Styling:** Tailwind CSS v4.0 (CSS-first engine)
- **Authentication:** NextAuth.js v4.24 (Credentials provider + hashed passwords with `bcryptjs`)
- **Data Visualization:** Recharts v3.8 (responsive bar, line, and layout charts)
- **Validation:** Zod v4.4
- **Attribution:** Built by `madhan1945`

---

## 💻 Local Setup & Development

### 1. Install dependencies
```bash
npm install
```

### 2. Setup environment variables
Create a `.env` file in the root directory:
```env
# Prisma database server connection URL
DATABASE_URL="your-postgresql-connection-string"

# Direct database connection URL (used for direct pool connections in pg driver)
DIRECT_DATABASE_URL="your-postgresql-direct-connection-string"
```

Create a `.env.local` file for Next.js:
```env
# Secure random string used for session tokens
NEXTAUTH_SECRET="your-secure-random-nextauth-secret"

# Local NextAuth address
NEXTAUTH_URL="http://localhost:3000"

# Optional: Google OAuth Credentials
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Start the database server
Prisma includes a dev database command. Start it in the background:
```bash
npx prisma dev --detach
```

### 4. Synchronize schema and seed data
```bash
# Push schema migrations
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed 200+ realistic salary entries
npx prisma db seed
```

### 5. Run local dev server
We run the development server with the `--webpack` flag to bypass native worker crashes on Windows:
```bash
npm run dev
```
Open `http://localhost:3000` to browse the app.

---

## 🚧 Roadmap & Future Scope
- **Verification System:** Add file uploads (W-2s, paystubs, offer letters) to verify salary data and mark entries with a verified checkmark.
- **SSO Authentication:** Full integration of Google & GitHub OAuth login flows.
- **Search Autocomplete Expansion:** Migrate local autocomplete queries to an external service (like Clearbit autocomplete API) for international company validation.
