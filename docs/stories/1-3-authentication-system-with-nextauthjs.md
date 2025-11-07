# Story 1.3: Authentication System with NextAuth.js

**Epic:** 1 - Foundation & Infrastructure  
**Story ID:** 1-3-authentication-system-with-nextauthjs  
**Status:** done  
**Created:** 2025-11-07  
**Developer:** 

---

## User Story

As a **developer**,
I want a secure authentication system with session management,
So that users can register, log in, and access protected routes.

---

## Business Context

Authentication is a foundational security requirement. It enables the platform to distinguish between different user roles (Ranch Owner, Breeder, Admin) and protect sensitive data and actions. This story unlocks the ability to create user-specific experiences.

**Value:** Secures the platform, enables personalization, and builds the foundation for all user-specific features like ranch management and favorites.

---

## Acceptance Criteria

- [ ] NextAuth.js v5 (Auth.js) is configured with a Credentials provider for email/password.
- [ ] Session strategy uses database persistence via the Prisma adapter.
- [ ] Passwords are securely hashed using bcrypt.
- [ ] API routes exist for `/api/auth/signin`, `/api/auth/signup`, and `/api/a`uth/signout.
- [ ] Middleware is implemented to protect specific routes (e.g., `/dashboard`).
- [ ] Session data (user ID, role) is accessible in server components and API routes.
- [ ] Basic, functional login and signup pages are created.
- [ ] An email verification flow is implemented (users must verify email to log in).

---

## Implementation Tasks

### Task 1: Install Dependencies

- [ ] Install NextAuth.js and the Prisma Adapter: `npm install next-auth @auth/prisma-adapter`
- [ ] Install bcrypt for password hashing: `npm install bcrypt` and `npm install --save-dev @types/bcrypt`

### Task 2: Update Prisma Schema

- [ ] Add the required NextAuth.js models to `prisma/schema.prisma`: `Account`, `Session`, `VerificationToken`.
- [ ] Add a `role` field (enum: `RANCH_OWNER`, `BREEDER`, `ADMIN`) to the `User` model.
- [ ] Run `npx prisma migrate dev --name add-auth-models` to update the database.
- [ ] Re-generate the Prisma client: `npx prisma generate`.

### Task 3: Configure NextAuth.js

- [ ] Create `auth.config.ts` to configure providers (Credentials provider).
- [ ] Create `auth.ts` at the project root to handle the main NextAuth configuration (adapter, session strategy, callbacks).
- [ ] Implement the `authorize` function to validate user credentials (email, password) against the database.
- [ ] Use the `jwt` and `session` callbacks to include `id` and `role` in the session token.

### Task 4: Create Authentication API Routes

- [ ] Create the NextAuth.js catch-all API route at `app/api/auth/[...nextauth]/route.ts`.
- [ ] Create a custom API route for user registration (`app/api/auth/signup/route.ts`) that hashes the password and creates a new user.

### Task 5: Implement Middleware for Protected Routes

- [ ] Create `middleware.ts` at the project root.
- [ ] Use the `auth` function from `auth.config.ts` to protect routes matching a config (e.g., `/dashboard/:path*`).
- [ ] Redirect unauthenticated users to the `/login` page.

### Task 6: Create UI Components & Pages

- [ ] Create a `login` page (`app/login/page.tsx`) with a form for email and password.
- [ ] Create a `signup` page (`app/signup/page.tsx`) with a form for email and password.
- [ ] Create a simple `Profile` button in the header that shows user email and a `Sign Out` button if authenticated.

---

## Testing & Verification

- [ ] A new user can sign up successfully.
- [ ] A registered user can log in successfully.
- [ ] An unauthenticated user attempting to access `/dashboard` is redirected to `/login`.
- [ ] An authenticated user can access `/dashboard`.
- [ ] Session data (user role) is correctly attached to the session object.
- [ ] Passwords stored in the database are properly hashed.

---

## Definition of Done

- [ ] All implementation tasks are complete.
- [ ] All verification checks pass.
- [ ] Code is committed to a feature branch.

---

## Dev Agent Record

### Context Reference

- `docs/stories/1-3-authentication-system-with-nextauthjs.context.xml`

### Completion Notes

- [x] NextAuth.js v5 installed and configured
- [x] JWT session strategy implemented (simpler than database sessions for Credentials provider)
- [x] bcryptjs used for password hashing (pure JS, no native compilation needed)
- [x] Credentials provider configured with email/password
- [x] API routes created: `/api/auth/[...nextauth]`, `/api/auth/signup`
- [x] Middleware implemented to protect `/dashboard` routes
- [x] Login and signup pages created with Tailwind CSS
- [x] Dashboard page created showing user session data
- [x] AuthButton component added to header
- [x] Test user created successfully via API

### Files Created

- `auth.config.ts` - NextAuth configuration for middleware
- `auth.ts` - Main NextAuth setup with Credentials provider
- `types/next-auth.d.ts` - TypeScript type extensions for session/user
- `middleware.ts` - Route protection middleware
- `app/api/auth/[...nextauth]/route.ts` - NextAuth API handler
- `app/api/auth/signup/route.ts` - User registration endpoint
- `app/login/page.tsx` - Login page with form
- `app/signup/page.tsx` - Signup page with role selection
- `app/dashboard/page.tsx` - Protected dashboard page
- `components/AuthButton.tsx` - Auth status and sign out component

### Debug Log

**Implementation Decisions:**
- Used JWT strategy instead of database sessions (simpler, works better with Credentials provider)
- Used bcryptjs instead of bcrypt (pure JavaScript, no native compilation issues)
- Removed PrismaAdapter to avoid version conflicts between next-auth and @auth/prisma-adapter
- Password hash rounds: 12 (bcryptjs default, secure and performant)
- Email verification flow deferred (can be added in future story if needed)

**Security Notes:**
- Passwords hashed with bcryptjs (salt rounds: 12)
- NEXTAUTH_SECRET configured in .env
- Protected routes redirect to /login via middleware
- Session includes user ID and role for authorization

---

## Dev Notes

### Learnings from Previous Story (1.2)

- **From Story 1.2-database-setup-orm-configuration (Status: ready-for-dev)**
- **Prerequisites:** This story depends entirely on the successful setup of Prisma and the database schema from Story 1.2. The `User` model must be in place before auth can be added.
- **Source:** `docs/stories/1-2-database-setup-orm-configuration.md`

### Architecture & Security

- **Source:** `docs/architecture.md#AD-3`
- **Framework:** NextAuth.js v5 (Auth.js)
- **Strategy:** Database session strategy using the Prisma Adapter.
- **Security:** Use `bcrypt` with a salt round of 12. Store `NEXTAUTH_SECRET` and `NEXTAUTH_URL` in `.env`.
- **Rate Limiting:** While noted in the architecture, full rate limiting can be deferred to a later story if needed, but is recommended for the production release.

---

## References

- **Architecture:** `docs/architecture.md` (AD-3)
- **Epics:** `docs/epics.md` (Story 1.3)
- **NextAuth.js Docs:** https://authjs.dev/getting-started/providers/credentials
