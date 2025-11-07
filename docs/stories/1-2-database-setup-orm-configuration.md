# Story 1.2: Database Setup & ORM Configuration

**Epic:** 1 - Foundation & Infrastructure  
**Story ID:** 1-2-database-setup-orm-configuration  
**Status:** review  
**Created:** 2025-11-07  
**Developer:** 

---

## User Story

As a **developer**,
I want a PostgreSQL database with Prisma ORM configured,
So that I can store and query data efficiently with type safety.

---

## Business Context

This story establishes the data persistence layer for the entire application. It enables all subsequent features that require data storage, including user accounts, ranch profiles, and bull information. Without a database, the application cannot store any state.

**Value:** Provides a reliable, type-safe, and scalable data layer, enabling all future feature development.

---

## Acceptance Criteria

- [ ] PostgreSQL database is provisioned (local + Vercel Postgres)
- [ ] Prisma is installed and configured
- [ ] Initial schema includes: `User`, `Ranch`, `Bull` models with basic fields
- [ ] Prisma migrations run successfully
- [ ] Prisma Client is generated and importable
- [ ] Database connection works in the development environment

---

## Implementation Tasks

### Task 1: Install Prisma

- [ ] Install Prisma CLI as a dev dependency: `npm install prisma --save-dev`

### Task 2: Initialize Prisma

- [ ] Run `npx prisma init` to create the `prisma` directory and `schema.prisma` file.
- [ ] Configure `datasource db` provider to `postgresql`.

### Task 3: Define Database Schema

- [ ] In `prisma/schema.prisma`, define the initial models based on `architecture.md`:
  - `User` (id, email, password, role, etc.)
  - `Ranch` (id, userId, name, slug, etc.)
  - `Bull` (id, ranchId, name, slug, breed, etc.)
- [ ] Add relations between models (e.g., User-Ranch, Ranch-Bull).
- [ ] Include indexes on frequently queried fields (`slug`, `ranchId`, `breed`).

### Task 4: Set Up Environment Variables

- [ ] Create a `.env` file (and add to `.gitignore`).
- [ ] Add `DATABASE_URL` for local PostgreSQL instance (e.g., `postgresql://user:password@localhost:5432/wagnerbeef`).
- [ ] Add `DIRECT_URL` for Prisma connection pooling.

### Task 5: Run Initial Migration

- [ ] Run `npx prisma migrate dev --name init` to create the first migration and apply it to the local database.
- [ ] Verify the migration file is created in `prisma/migrations`.

### Task 6: Generate Prisma Client

- [ ] Run `npx prisma generate` to generate the type-safe Prisma Client.
- [ ] Verify `@prisma/client` is available to the application.

### Task 7: Create Database Utility

- [ ] In `lib/db.ts`, create and export a singleton Prisma client instance to be used throughout the app.

### Task 8: Test Database Connection

- [ ] Create a simple test script or API route to query the database (e.g., fetch users) and confirm the connection works.

---

## Testing & Verification

- [ ] `npx prisma migrate dev` completes without errors.
- [ ] `npx prisma generate` completes without errors.
- [ ] A test query to the local database successfully returns data.
- [ ] The `prisma/migrations` directory contains the initial migration.
- [ ] The `User`, `Ranch`, and `Bull` tables are created in the local PostgreSQL database.

---

## Definition of Done

- [ ] All implementation tasks are complete.
- [ ] All verification checks pass.
- [ ] Code is committed to the `story/1.2-database-setup` branch.

---

## Dev Agent Record

### Completion Notes

- [x] Prisma installed and configured
- [x] Database schema defined with all models (User, Ranch, Bull, Inquiry, Favorite, Account, Session, VerificationToken)
- [x] Initial migration created and applied successfully
- [x] Prisma Client generated
- [x] Database utility created at `lib/db.ts` with singleton pattern
- [x] Database connection tested via `/api/test-db` route
- [x] PostgreSQL database `beefStore` created on port 5431

### Files Created

- `prisma/schema.prisma` - Complete database schema with 8 models and 3 enums
- `prisma/migrations/20251107172125_init/migration.sql` - Initial migration
- `lib/db.ts` - Singleton Prisma client utility
- `app/api/test-db/route.ts` - Test API route for database connection verification
- `.env` - Environment variables with DATABASE_URL and DIRECT_URL

### Debug Log

**Database Setup:**
- Used local PostgreSQL 12.22 running on port 5431
- Database name: `beefStore`
- User: `ErinAntoine`
- Removed auto-generated `prisma.config.ts` file (not needed for standard setup)

**Schema Decisions:**
- Implemented complete schema from architecture.md including all future models
- Added proper indexes on frequently queried fields (slug, ranchId, breed, status)
- Used `@db.Text` for long text fields (about, message, notes)
- Implemented cascade deletes for referential integrity
- Used `cuid()` for all IDs for better distribution

---

## Dev Notes

### Learnings from Previous Story (1.1)

- **From Story 1.1-project-initialization-core-setup (Status: review)**
- **New Patterns:** Manual Next.js setup in a non-empty directory was successful. All config files (`package.json`, `tsconfig.json`, etc.) were created manually.
- **File Structure:** Core directories `app/`, `components/`, `lib/`, `types/` are in place. This story will add the `prisma/` directory.
- **Tooling:** Prettier is configured; run `npm run format` before committing.
- **Source:** `docs/stories/1-1-project-initialization-core-setup.md#Dev-Agent-Record`

### Architecture & Schema

- **Source:** `docs/architecture.md#Data-Architecture`
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Key Models:** `User`, `Ranch`, `Bull`
- **Data Types:** Use `String`, `DateTime`, `Boolean`, `Json` as defined in the architecture document.
- **Multi-Tenancy:** The schema establishes the foundation for multi-tenancy with the `ranchId` foreign key on the `Bull` model.

---

## References

- **Architecture:** `docs/architecture.md` (AD-2, Data Architecture)
- **Epics:** `docs/epics.md` (Story 1.2)
