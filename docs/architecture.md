# wagnerBeef - Technical Architecture

**Author:** Carson
**Date:** 2025-11-07
**Version:** 1.0
**Project Level:** Medium Complexity

---

## Executive Summary

This architecture document defines the technical foundation for wagnerBeef, a B2B SaaS platform for cattle breeding. The architecture is designed for a solo full-stack developer building in evenings/weekends, prioritizing simplicity, rapid iteration, and cost-effectiveness while maintaining professional quality and scalability to 50 ranches.

**Core Architecture Pattern:** Monolithic Next.js application with serverless API routes, PostgreSQL database, and Cloudinary for image storage. Deployed on Vercel for zero-config scaling and preview environments.

**Key Architectural Decisions:**
- **Framework:** Next.js 14+ with App Router (React + TypeScript + Tailwind)
- **Database:** PostgreSQL with Prisma ORM (type-safe, migrations, excellent DX)
- **Authentication:** NextAuth.js v5 with session-based auth
- **Image Storage:** Cloudinary (automatic optimization, CDN, transformations)
- **Deployment:** Vercel (seamless Next.js integration, preview deployments)
- **Email:** Resend or SendGrid (transactional emails for inquiries/notifications)

**Architecture Philosophy:** Start simple, scale when needed. Monolithic architecture is appropriate for MVP scale (5-15 ranches). Can evolve to microservices if marketplace phase requires it (Phase 3+).

---

## Project Context

**Project Overview:**
WagnerBeef is a B2B SaaS platform connecting bull ranchers with breeders for artificial insemination services. The platform enables ranchers to professionally showcase their bulls' genetics and pedigree while providing breeders with efficient discovery and evaluation tools.

**Scale & Complexity:**
- **Project Level:** Medium Complexity
- **Epic Count:** 6 epics
- **Story Count:** 31 implementable stories
- **Target Scale (Year 1):** 5-15 ranches, 500 bulls, 1,000 visitors/month
- **Growth Potential:** Evolve from individual ranch licenses to centralized marketplace

**Key Requirements:**
- **Functional:** 18 requirements across user management, ranch/bull profiles, discovery, comparison, favorites, inquiry system
- **Non-Functional:** 14 requirements covering performance, security, scalability, accessibility, reliability, usability

**Critical Success Factors:**
- Ranch owners can add bulls in <30 minutes (low digital literacy)
- Breeders can find perfect bull in <5 minutes (efficient discovery)
- First inquiry within 30 days of ranch onboarding
- Platform handles 50 concurrent ranches without performance degradation

**Unique Challenges:**
- **Low Digital Literacy Users:** Primary users (ranchers) require extremely simple, forgiving UX
- **Rural Internet:** Optimize for slower connections (4G, rural areas)
- **Photo-Heavy Content:** Bull images are critical but must load quickly
- **Multi-Tenant B2B:** Data isolation between ranches with shared infrastructure
- **Genetic Data Complexity:** Structured EPD data with flexible schema for various breeds

---

## Architectural Decisions

### AD-1: Framework Selection - Next.js 14+ with App Router

**Decision:** Use Next.js 14+ with App Router as the primary framework.

**Rationale:**
- Full-stack framework (frontend + API routes in one codebase)
- Excellent Vercel deployment integration (zero-config)
- Built-in image optimization (critical for photo-heavy content)
- Server and client components (optimize for rural internet)
- File-based routing (simple, intuitive)
- TypeScript + Tailwind support out of box
- Strong ecosystem and community

**Alternatives Considered:**
- Remix: Good, but less mature ecosystem
- Separate React + Express: More complexity, separate deployments
- T3 Stack: Opinionated, includes tRPC (unnecessary for this scale)

**Implementation:** Story 1.1 - Initialize with `npx create-next-app@latest`

---

### AD-2: Database - PostgreSQL with Prisma ORM

**Decision:** Use PostgreSQL as the primary database with Prisma as the ORM.

**Rationale:**
- **PostgreSQL:**
  - Relational data (ranches, bulls, users, inquiries) fits well
  - ACID compliance for data integrity
  - Full-text search capabilities (bull/ranch search)
  - JSON fields for flexible genetic data (EPDs vary by breed)
  - Excellent Vercel Postgres integration
- **Prisma:**
  - Type-safe database access (TypeScript integration)
  - Automatic migrations (schema evolution)
  - Excellent developer experience
  - Built-in connection pooling
  - Prisma Studio for data inspection

**Alternatives Considered:**
- MongoDB: Flexible schema but loses relational benefits (ranch-bull relationships)
- Raw SQL: More control but loses type safety and migration management

**Schema Design Principles:**
- Normalized schema for core entities (User, Ranch, Bull, Inquiry, Favorite)
- JSON fields for flexible data (EPD values, genetic markers)
- Soft deletes for bulls (archived boolean)
- Indexes on frequently queried fields (ranch_id, breed, status)

**Implementation:** Story 1.2 - Database Setup & ORM Configuration

---

### AD-3: Authentication - NextAuth.js v5 (Auth.js)

**Decision:** Use NextAuth.js v5 for authentication and session management.

**Rationale:**
- Native Next.js integration (App Router support)
- Session-based auth with database storage
- Built-in CSRF protection
- Extensible for future social login (Phase 2)
- Handles email verification flow
- Secure by default (HTTP-only cookies)

**Authentication Strategy:**
- Email/password with bcrypt hashing (cost factor 12)
- Role-based access control (RANCH_OWNER, BREEDER, ADMIN)
- Session timeout: 30 days
- Rate limiting on auth endpoints (5 attempts/15min)

**Implementation:** Story 1.3 - Authentication System

---

### AD-4: Image Storage - Cloudinary

**Decision:** Use Cloudinary for image upload, storage, and optimization.

**Rationale:**
- Automatic image optimization (WebP, compression)
- Multiple size transformations (thumbnail, medium, large)
- CDN delivery (fast loading for rural users)
- Signed uploads (security)
- Free tier sufficient for MVP (25GB storage, 25GB bandwidth)
- Simple SDK integration

**Image Strategy:**
- Upload: Signed uploads from client to Cloudinary
- Storage: Store Cloudinary URLs in database
- Delivery: Automatic format selection (WebP with fallback)
- Optimization: Lazy loading, responsive images

**Alternatives Considered:**
- Vercel Blob Storage: Good but less mature, fewer transformations
- S3: More setup, no automatic optimization

**Implementation:** Story 1.4 - Image Upload & Storage

---

### AD-5: Deployment - Vercel

**Decision:** Deploy on Vercel with automated CI/CD.

**Rationale:**
- Zero-config Next.js deployment
- Automatic preview deployments (PR-based)
- Built-in Vercel Postgres integration
- Edge network (fast global delivery)
- Serverless functions (API routes scale automatically)
- Free tier sufficient for MVP
- Environment variable management

**Deployment Strategy:**
- Main branch → Production
- Feature branches → Preview deployments
- Database migrations run on deployment
- Environment variables configured in Vercel dashboard

**Implementation:** Story 1.5 - Deployment Pipeline

---

### AD-6: Email Service - Resend

**Decision:** Use Resend for transactional emails.

**Rationale:**
- Modern API, excellent DX
- React Email for templates (JSX-based)
- Generous free tier (3,000 emails/month)
- Good deliverability
- Simple integration with Next.js

**Email Types:**
- Inquiry notifications to ranch owners (immediate)
- Email verification (registration)
- Favorites update notifications (batched)
- Password reset

**Alternatives Considered:**
- SendGrid: More mature but complex API
- AWS SES: Cheapest but requires more setup

**Implementation:** Story 5.2 - Inquiry Email Notifications

---

### AD-7: State Management - React Context + URL State

**Decision:** Use React Context for global state, URL parameters for shareable state.

**Rationale:**
- **React Context:** Simple, built-in, sufficient for MVP scope
  - Comparison state (selected bulls)
  - Auth state (user session)
  - Toast notifications
- **URL Parameters:** Shareable, bookmarkable state
  - Search filters (breed, EPD ranges, location)
  - Pagination
  - Sort order

**Alternatives Considered:**
- Zustand: Lightweight but unnecessary for this scale
- Redux: Overkill for MVP
- TanStack Query: Good for server state, may add later

**Implementation:** Implemented as needed per story

---

### AD-8: Styling Strategy - Tailwind CSS + shadcn/ui

**Decision:** Use Tailwind CSS for styling with shadcn/ui for components.

**Rationale:**
- **Tailwind:** Utility-first, rapid development, small bundle size
- **shadcn/ui:** Copy-paste components (not a dependency)
  - Accessible by default (WCAG 2.1 AA)
  - Customizable with Tailwind
  - Radix UI primitives (keyboard nav, ARIA)

**Component Strategy:**
- Use shadcn/ui for: Button, Form, Dialog, Select, Dropdown
- Custom components for: Bull cards, comparison table, pedigree tree
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

**Implementation:** Story 1.1 (Tailwind), components added as needed

---

### AD-9: Form Handling - React Hook Form + Zod

**Decision:** Use React Hook Form for forms with Zod for validation.

**Rationale:**
- **React Hook Form:** Performant, minimal re-renders, great DX
- **Zod:** Type-safe validation, reusable schemas
- Works well with shadcn/ui form components
- Server-side validation reuses Zod schemas

**Form Strategy:**
- Client-side validation (immediate feedback)
- Server-side validation (security)
- Helpful error messages (low digital literacy users)
- Auto-save drafts (bull creation form)

**Implementation:** Story 2.3+ (Bull creation forms)

---

### AD-10: API Design - Next.js API Routes (RESTful)

**Decision:** Use Next.js API routes with RESTful conventions.

**Rationale:**
- Serverless functions (auto-scaling)
- Collocated with frontend (single codebase)
- Simple for solo developer
- Type-safe with TypeScript

**API Structure:**
```
/api/auth/*          - NextAuth.js routes
/api/upload          - Image upload (Cloudinary)
/api/ranches/*       - Ranch CRUD
/api/bulls/*         - Bull CRUD
/api/inquiries/*     - Inquiry management
/api/favorites/*     - Favorites management
```

**API Patterns:**
- RESTful conventions (GET, POST, PUT, DELETE)
- Authentication middleware
- Input validation (Zod)
- Error handling (consistent format)
- Rate limiting (prevent abuse)

**Alternatives Considered:**
- tRPC: Type-safe but adds complexity
- GraphQL: Overkill for this scale

**Implementation:** API routes created per story

---

### AD-11: Multi-Tenancy Strategy - Row-Level Security

**Decision:** Implement multi-tenancy with row-level data isolation in PostgreSQL.

**Rationale:**
- Single database, shared infrastructure (cost-effective)
- Data isolation via foreign keys and middleware
- Each ranch is a tenant with isolated data
- Simpler than separate databases per tenant

**Implementation:**
- All queries filtered by ranch_id (middleware)
- API routes check ownership before mutations
- Database indexes on ranch_id for performance
- Prisma middleware for automatic filtering

**Security:**
- Ranch A cannot access Ranch B's data
- Enforced at API and database level
- Admin role can access all data (support)

**Implementation:** Story 2.2+ (Ranch profile creation)

---

### AD-12: Search Strategy - PostgreSQL Full-Text Search

**Decision:** Use PostgreSQL full-text search for bull/ranch search.

**Rationale:**
- Built into PostgreSQL (no external service)
- Sufficient for MVP scale (<500 bulls)
- Supports partial matching
- Can add Algolia/Meilisearch later if needed

**Search Implementation:**
- Index: bull name, registration number, ranch name
- Debounced search input (300ms)
- Combine with filters (breed, EPD ranges)
- Highlight matching terms in results

**Alternatives Considered:**
- Algolia: Best search experience but $$$
- Meilisearch: Good but adds infrastructure

**Implementation:** Story 3.3 - Text Search Functionality

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Desktop    │  │    Tablet    │  │    Mobile    │      │
│  │   Browser    │  │   Browser    │  │   Browser    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS
┌───────────────────────────┴─────────────────────────────────┐
│                      VERCEL EDGE NETWORK                      │
│                     (CDN + Load Balancing)                    │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────┐
│                   NEXT.JS APPLICATION LAYER                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              App Router (React Components)              │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │ │
│  │  │  Server  │  │  Client  │  │  Shared  │            │ │
│  │  │Components│  │Components│  │Components│            │ │
│  │  └──────────┘  └──────────┘  └──────────┘            │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           API Routes (Serverless Functions)             │ │
│  │  /api/auth/*  /api/bulls/*  /api/inquiries/*          │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                  Middleware Layer                       │ │
│  │  Authentication │ Authorization │ Rate Limiting         │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────┴────────┐  ┌───────┴────────┐  ┌──────┴───────┐
│   PostgreSQL   │  │   Cloudinary   │  │    Resend    │
│   (Vercel)     │  │  (Images/CDN)  │  │   (Email)    │
│                │  │                │  │              │
│  - Users       │  │  - Bull Photos │  │  - Inquiries │
│  - Ranches     │  │  - Optimized   │  │  - Verif.    │
│  - Bulls       │  │  - Transforms  │  │  - Notifs    │
│  - Inquiries   │  │                │  │              │
│  - Favorites   │  │                │  │              │
└────────────────┘  └────────────────┘  └──────────────┘
```

### Component Architecture

**Page Components (App Router):**
```
/app
├── (auth)
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── verify-email/page.tsx
├── (public)
│   ├── page.tsx                    # Home/landing
│   ├── browse/page.tsx             # Bull browse grid
│   ├── compare/page.tsx            # Bull comparison
│   ├── bulls/[slug]/page.tsx       # Bull detail
│   └── [ranch-slug]/page.tsx       # Ranch profile
├── (dashboard)
│   ├── dashboard/page.tsx          # Ranch dashboard
│   ├── dashboard/bulls/new/page.tsx
│   ├── dashboard/bulls/[id]/edit/page.tsx
│   ├── dashboard/inquiries/page.tsx
│   └── favorites/page.tsx          # Breeder favorites
└── api/
    ├── auth/[...nextauth]/route.ts
    ├── upload/route.ts
    ├── ranches/route.ts
    ├── bulls/route.ts
    ├── inquiries/route.ts
    └── favorites/route.ts
```

**Shared Components:**
```
/components
├── ui/                    # shadcn/ui components
│   ├── button.tsx
│   ├── form.tsx
│   ├── dialog.tsx
│   └── select.tsx
├── bull-card.tsx          # Bull display card
├── bull-comparison-table.tsx
├── pedigree-tree.tsx
├── image-upload.tsx
├── filter-sidebar.tsx
├── inquiry-form.tsx
└── layout/
    ├── header.tsx
    ├── footer.tsx
    └── dashboard-nav.tsx
```

### Data Flow Patterns

**1. Bull Creation Flow (Ranch Owner):**
```
User → Form (React Hook Form) → Client Validation (Zod)
  → API Route (/api/bulls POST) → Server Validation (Zod)
  → Prisma (Create Bull) → PostgreSQL
  → Return Success → Update UI → Redirect to Dashboard
```

**2. Image Upload Flow:**
```
User → File Select → ImageUpload Component
  → Cloudinary Widget (Signed Upload) → Cloudinary CDN
  → Return URL → Store in Form State
  → Submit Form → Save URL to Database
```

**3. Bull Discovery Flow (Breeder):**
```
User → Browse Page → Apply Filters (URL State)
  → Server Component → Prisma Query (Filtered)
  → PostgreSQL → Return Bulls → Render Cards
  → Click Card → Navigate to Bull Detail (SSR)
```

**4. Inquiry Flow:**
```
Breeder → Contact Form → API Route (/api/inquiries POST)
  → Create Inquiry (Prisma) → PostgreSQL
  → Trigger Email (Resend) → Ranch Owner Email
  → Return Success → Show Confirmation
```

### Performance Optimizations

**1. Image Optimization:**
- Cloudinary automatic WebP conversion
- Multiple sizes: thumbnail (300px), medium (800px), large (1200px)
- Lazy loading (below fold)
- Next.js Image component (automatic optimization)
- Blur placeholder (LQIP)

**2. Code Splitting:**
- Route-based splitting (automatic with App Router)
- Dynamic imports for heavy components (comparison table, pedigree tree)
- Separate client bundles for dashboard vs public pages

**3. Caching Strategy:**
- Static pages: Home, about (ISR with 1-hour revalidation)
- Dynamic pages: Bull details (ISR with on-demand revalidation)
- API responses: Cache headers for public data
- CDN caching: Vercel Edge Network

**4. Database Optimization:**
- Indexes on: ranch_id, breed, status, created_at
- Connection pooling (Prisma default)
- Efficient queries (select only needed fields)
- Pagination (20 items per page)

---

## Data Architecture

### Database Schema (Prisma)

```prisma
// User Model - Authentication and roles
model User {
  id                String    @id @default(cuid())
  email             String    @unique
  emailVerified     DateTime?
  password          String    // bcrypt hashed
  role              Role      @default(BREEDER)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  // Relations
  ranch             Ranch?
  favorites         Favorite[]
  sessions          Session[]
  accounts          Account[]
}

enum Role {
  RANCH_OWNER
  BREEDER
  ADMIN
}

// Ranch Model - One-to-one with User (ranch owners)
model Ranch {
  id                String    @id @default(cuid())
  userId            String    @unique
  name              String
  slug              String    @unique  // URL-friendly (e.g., "wagner-ranch")
  state             String
  contactEmail      String
  contactPhone      String
  about             String?   @db.Text
  websiteUrl        String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  // Relations
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  bulls             Bull[]
  inquiries         Inquiry[]
  
  @@index([slug])
  @@index([userId])
}

// Bull Model - Core entity
model Bull {
  id                String    @id @default(cuid())
  ranchId           String
  slug              String    @unique  // URL-friendly
  status            BullStatus @default(DRAFT)
  
  // Basic Info
  name              String
  registrationNumber String?
  breed             String
  birthDate         DateTime?
  
  // Photos (Cloudinary URLs)
  heroImage         String
  additionalImages  String[]  // Array of URLs
  
  // Genetic Data (JSON for flexibility across breeds)
  epdData           Json?     // { birthWeight: 2.5, weaningWeight: 45, ... }
  geneticMarkers    String?   @db.Text
  dnaTestResults    String?   @db.Text
  
  // Pedigree
  sireName          String?
  damName           String?
  notableAncestors  String[]
  
  // Performance
  birthWeight       Float?
  weaningWeight     Float?
  yearlingWeight    Float?
  progenyNotes      String?   @db.Text
  
  // Inventory
  availableStraws   Int       @default(0)
  pricePerStraw     Float?
  
  // Metadata
  archived          Boolean   @default(false)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  // Relations
  ranch             Ranch     @relation(fields: [ranchId], references: [id], onDelete: Cascade)
  inquiries         Inquiry[]
  favorites         Favorite[]
  
  @@index([ranchId])
  @@index([breed])
  @@index([status])
  @@index([slug])
  @@index([archived])
}

enum BullStatus {
  DRAFT
  PUBLISHED
}

// Inquiry Model - Breeder contacts ranch owner
model Inquiry {
  id                String    @id @default(cuid())
  bullId            String
  ranchId           String
  
  // Breeder Info
  breederName       String
  breederEmail      String
  breederPhone      String?
  message           String    @db.Text
  
  // Status Tracking
  status            InquiryStatus @default(UNREAD)
  internalNotes     String?   @db.Text
  respondedAt       DateTime?
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  // Relations
  bull              Bull      @relation(fields: [bullId], references: [id], onDelete: Cascade)
  ranch             Ranch     @relation(fields: [ranchId], references: [id], onDelete: Cascade)
  
  @@index([ranchId])
  @@index([bullId])
  @@index([status])
  @@index([createdAt])
}

enum InquiryStatus {
  UNREAD
  RESPONDED
  ARCHIVED
}

// Favorite Model - Breeders save bulls
model Favorite {
  id                String    @id @default(cuid())
  userId            String
  bullId            String
  notificationsEnabled Boolean @default(true)
  createdAt         DateTime  @default(now())
  
  // Relations
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  bull              Bull      @relation(fields: [bullId], references: [id], onDelete: Cascade)
  
  @@unique([userId, bullId])  // Prevent duplicate favorites
  @@index([userId])
  @@index([bullId])
}

// NextAuth.js Models
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  
  @@unique([identifier, token])
}
```

### Data Relationships

```
User (1) ──────────── (1) Ranch
  │                      │
  │                      │
  │ (many)          (many) │
  │                      │
Favorite            Bull
  │                      │
  │                      │
  └──────────(many)──────┘
                         │
                         │ (many)
                         │
                      Inquiry
```

### Key Design Decisions

**1. Multi-Tenancy:**
- Each Ranch is a tenant
- Bulls belong to Ranch (foreign key)
- Inquiries linked to both Bull and Ranch
- API middleware filters by ranch ownership

**2. Flexible Genetic Data:**
- EPD data stored as JSON (varies by breed)
- Allows different breeds to have different EPD fields
- Type-safe access via Zod schemas in application layer

**3. Soft Deletes:**
- Bulls use `archived` boolean (not deleted)
- Preserves data for analytics
- Hidden from public browse but visible to ranch owner

**4. Slugs for SEO:**
- Ranch and Bull have unique slugs
- URL-friendly (e.g., `/bulls/champion-angus-2024`)
- Generated from name + unique ID

**5. Image Storage:**
- Cloudinary URLs stored as strings
- Hero image (required) + additional images (array)
- No binary data in database

### Indexes Strategy

**High-Priority Indexes (Query Performance):**
- `Bull.ranchId` - Filter bulls by ranch
- `Bull.breed` - Filter by breed
- `Bull.status` - Filter published vs draft
- `Bull.archived` - Exclude archived bulls
- `Inquiry.ranchId` - Ranch owner's inquiries
- `Inquiry.createdAt` - Sort inquiries by date

**Unique Indexes (Data Integrity):**
- `User.email` - Prevent duplicate accounts
- `Ranch.slug` - Unique ranch URLs
- `Bull.slug` - Unique bull URLs
- `Favorite(userId, bullId)` - Prevent duplicate favorites

### Data Migration Strategy

**Initial Setup (Story 1.2):**
```bash
npx prisma init
npx prisma migrate dev --name init
npx prisma generate
```

**Schema Evolution:**
- Use Prisma migrations for schema changes
- Test migrations in preview deployments
- Run migrations on production deployment (Vercel)
- Keep migrations reversible when possible

**Seed Data (Development):**
```typescript
// prisma/seed.ts
// Create sample ranch, bulls, users for testing
```

---

## Summary

This architecture document provides the complete technical foundation for wagnerBeef. All architectural decisions are documented, database schema is defined, and implementation patterns are established.

**Key Takeaways:**
- **Monolithic Next.js** application (appropriate for MVP scale)
- **PostgreSQL + Prisma** for type-safe database access
- **Cloudinary** for image optimization (critical for rural users)
- **Vercel deployment** with zero-config scaling
- **Security-first** approach with RBAC and multi-tenant isolation

**Ready for Implementation:**
All 31 stories from the epic breakdown can now be implemented following these architectural patterns. Start with Epic 1, Story 1.1 (Project Initialization).

**Reference Documents:**
- Product Brief: `/docs/product-brief-wagnerBeef-2025-11-07.md`
- PRD: `/docs/PRD.md`
- Epic Breakdown: `/docs/epics.md`
- Architecture: `/docs/architecture.md` (this document)

---

_This architecture ensures consistency across all development phases and provides clear guidance for AI agents implementing the system._
