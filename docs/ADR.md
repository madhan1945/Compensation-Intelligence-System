# Architecture Decision Record (ADR)

This document records the key architectural decisions made for the **Compensation Intelligence System** (CompensationIQ).

## 1. API Framework: Next.js API Routes (App Router) over NestJS
- **Context**: The project is a full-stack dashboard with minimal background job requirements.
- **Decision**: Use Next.js API routes under `/api` in the same repository rather than a standalone NestJS backend.
- **Justification**: 
  - Simplicity and speed: Single repository deployment (Next.js is Vercel-native) reduces ops overhead.
  - Development speed: Small engineering team benefits from shared TypeScript types across frontend and backend.
  - NestJS introduces unnecessary layer complexity (modules, controllers, decorators) for a simple CRUD + aggregation backend.

## 2. Database & ORM: PostgreSQL + Prisma over MongoDB
- **Context**: Compensation data involves structured, relational records (e.g., matching submissions to normalized companies, calculating averages, side-by-side comparison tables).
- **Decision**: Use PostgreSQL as the relational database and Prisma as the ORM.
- **Justification**:
  - Relational Schema: A submission is linked to a canonical company and optionally a user. Postgres enforces foreign keys and index constraints.
  - Aggregations: High-fidelity calculations like averages, medians, and distribution curves are more performant and robust under Postgres relational operations (using indices on `companyId`, `totalComp`, etc.).
  - Prisma provides strong type safety out of the box, generating TypeScript models directly from `schema.prisma`.

## 3. Database Provider: Neon Serverless Postgres over Railway Postgres
- **Context**: Deployment host needs to be reliable, low-latency, and cost-effective.
- **Decision**: Deploy using Neon (Serverless Postgres).
- **Justification**:
  - Vercel integration: Neon integrates seamlessly with Vercel and offers auto-scaling, instantaneous branching, and serverless driver capabilities.
  - Edge compatibility: Neon's serverless driver enables querying from Edge Runtime routes if we need sub-millisecond API response times.
  - Free tier: Generous free tier suitable for early-stage and prototype deployments without cold starts.

## 4. Data Normalization Strategy: Canonical Name Mapping
- **Context**: Submissions will contain variations of company names (e.g., "Google", "Google LLC", "Alphabet Inc") and cities (e.g., "Bangalore", "Bengaluru", "blr").
- **Decision**: Store both the raw submitted name and a normalized canonical name. Use an alias map and basic slugification.
- **Justification**:
  - A lookup dictionary (`lib/normalize.ts`) maps common aliases (e.g., `google llc` -> `Google`) on insert.
  - For new companies not in the alias map, we clean the raw input (trim, case normalize) and save it as the canonical name.
  - Generate a URL-safe `slug` (e.g., `google`) to enable clean routes like `/company/google` and optimize queries by indexing the `slug` and `canonicalName` columns.

## 5. Total Compensation (TC) Formula
- **Context**: Total Compensation needs to represent the annualized value of a compensation package.
- **Decision**: Total compensation is computed on insertion and persisted in the database using the following formula:
  $$\text{total\_compensation} = \text{baseSalary} + \text{annualBonus} + \text{signingBonus} + \left(\frac{\text{stockValue}}{\text{vestingYears}}\right)$$
- **Justification**:
  - Annualizing stock options over the standard vesting period (typically 4 years) is the industry standard (used by Levels.fyi).
  - Signing bonus is amortized fully into the first-year compensation.
  - Persisting `totalComp` in the DB as a column (rather than calculating it on demand) allows fast sorting, pagination, and range indexing (e.g., `WHERE totalComp >= 2000000`).
