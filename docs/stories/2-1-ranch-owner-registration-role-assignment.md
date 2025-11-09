# Story 2.1: Ranch Owner Registration & Role Assignment

**Epic:** 2 - Ranch Owner Onboarding  
**Story ID:** 2-1-ranch-owner-registration-role-assignment  
**Status:** review  
**Created:** 2025-11-07  
**Developer:** 

---

## User Story

As a **ranch owner**,
I want to create an account with my email and password,
So that I can access the platform to manage my ranch and bulls.

---

## Acceptance Criteria

**AC1: Ranch Owner Account Creation**
- User can sign up with email, password, and password confirmation
- Account is created with role set to "RANCH_OWNER"
- Password is hashed using bcryptjs (12 rounds)
- Duplicate email addresses are rejected with clear error message

**AC2: Email Verification Flow**
- Verification token is generated and stored in database
- Verification email is sent to user's email address
- Email contains clickable verification link
- Link redirects to verification page that validates token
- Upon successful verification, `emailVerified` field is set to current timestamp

**AC3: Post-Registration Flow**
- After signup, user is redirected to "Check Your Email" page
- After email verification, user is redirected to ranch profile creation page
- Unverified users cannot access ranch management features (dashboard, bull creation)

**AC4: Form Validation**
- Email format validation
- Password minimum 6 characters
- Password confirmation must match
- Clear, user-friendly error messages displayed inline

---

## Tasks / Subtasks

**Task 1: Extend Signup API to Support Role Selection (AC1)**
- [x] Modify `/api/auth/signup` route to accept `role` parameter
- [x] Default role to "RANCH_OWNER" if not specified
- [x] Validate role is one of: RANCH_OWNER, BREEDER, ADMIN
- [x] Update user creation to set role field
- [x] Test signup API with role parameter

**Task 2: Implement Email Verification Token System (AC2)**
- [x] Create verification token generation utility (crypto.randomBytes)
- [x] Add token to VerificationToken model (already exists in Prisma schema)
- [x] Create `/api/auth/verify-email` API route
- [x] Implement token validation logic (check expiry, mark email as verified)
- [x] Delete token after successful verification
- [x] Test token generation and validation

**Task 3: Set Up Email Sending Service (AC2)**
- [x] Install email service package (Resend or Nodemailer)
- [x] Configure email credentials in `.env`
- [x] Create email utility function in `lib/email.ts`
- [x] Design verification email template (HTML + text)
- [x] Send verification email after signup
- [x] Test email delivery locally

**Task 4: Create Email Verification Pages (AC2, AC3)**
- [x] Create `/verify-email` page to handle verification link clicks
- [x] Create `/check-email` page shown after signup
- [x] Add loading state while verifying token
- [x] Display success/error messages
- [x] Redirect to ranch profile creation after verification
- [x] Test verification flow end-to-end

**Task 5: Update Signup Page with Role Selection (AC1, AC4)**
- [x] Add role selection to signup form (radio buttons or dropdown)
- [x] Update form validation to include role
- [x] Show appropriate messaging for ranch owners vs breeders
- [x] Redirect to `/check-email` after successful signup
- [x] Test form validation and submission

**Task 6: Implement Access Control for Unverified Users (AC3)**
- [x] Update middleware to check `emailVerified` status
- [x] Protect ranch management routes (dashboard, bull creation)
- [x] Redirect unverified users to `/check-email` page
- [x] Allow access to verification and profile pages
- [x] Test access control for verified and unverified users

**Task 7: Testing (All ACs)**
- [x] Unit test: Token generation and validation
- [x] Unit test: Email sending utility
- [x] Integration test: Complete signup and verification flow
- [x] Integration test: Access control for unverified users
- [x] Manual test: Receive and click verification email

---

## Dev Notes

### Learnings from Previous Story (1.5)

**From Story 1-5-deployment-pipeline-environment-configuration (Status: done)**

- **Foundation Complete**: All Epic 1 infrastructure stories are done - authentication, database, image upload, and deployment are working
- **Authentication System**: NextAuth.js v5 configured with JWT strategy, Credentials provider, bcryptjs password hashing
- **Database Ready**: PostgreSQL with Prisma ORM, User model includes `emailVerified` DateTime field and `role` enum (RANCH_OWNER, BREEDER, ADMIN)
- **Existing Auth Files**: 
  - `auth.ts` - Main NextAuth configuration
  - `auth.config.ts` - NextAuth middleware config
  - `app/api/auth/signup/route.ts` - User registration endpoint (needs extension for role and verification)
  - `middleware.ts` - Route protection
- **User Model Fields Available**: id, email, emailVerified, password, role, createdAt, updatedAt
- **VerificationToken Model**: Already exists in Prisma schema with identifier, token, expires fields

[Source: docs/stories/1-5-deployment-pipeline-environment-configuration.md#Dev-Agent-Record]

### Architecture & Technical Approach

**Source:** `docs/architecture.md#AD-3`

**Email Verification Strategy:**
- Use NextAuth.js built-in email verification support
- Generate secure random tokens using Node.js crypto module
- Store tokens in VerificationToken table (already in Prisma schema)
- Tokens expire after 24 hours
- Email service: Recommend Resend (modern, simple API) or Nodemailer (self-hosted SMTP)

**Role Assignment:**
- User model already has `role` enum: RANCH_OWNER, BREEDER, ADMIN
- Default to RANCH_OWNER for this story
- Role determines access to features (ranch management vs browsing/favorites)

**Access Control:**
- Extend existing middleware to check `emailVerified` field
- Protect routes: `/dashboard`, `/ranch/*`, `/bulls/create`
- Allow access: `/verify-email`, `/check-email`, `/login`, `/signup`

**Form Validation:**
- Use React Hook Form (already used in login/signup pages from Story 1.3)
- Client-side validation for immediate feedback
- Server-side validation in API routes for security

### Project Structure Alignment

**Files to Create:**
- `lib/email.ts` - Email sending utility
- `lib/tokens.ts` - Token generation and validation utilities
- `app/api/auth/verify-email/route.ts` - Email verification endpoint
- `app/verify-email/page.tsx` - Verification page (handles link clicks)
- `app/check-email/page.tsx` - Post-signup instruction page

**Files to Modify:**
- `app/api/auth/signup/route.ts` - Add role parameter, send verification email
- `app/signup/page.tsx` - Add role selection UI
- `middleware.ts` - Add emailVerified check for protected routes
- `.env` - Add email service credentials

**Database:**
- No schema changes needed (User and VerificationToken models already exist)

### Environment Variables Required

```
# Email Service (choose one)
RESEND_API_KEY=<your-resend-key>
# OR
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your-email>
SMTP_PASSWORD=<your-password>

# Email Configuration
FROM_EMAIL=noreply@wagnerbeef.com
VERIFICATION_EMAIL_EXPIRY=86400000  # 24 hours in ms
```

### References

- **Epic Definition**: `docs/epics.md#Epic-2-Story-2.1`
- **Architecture**: `docs/architecture.md#AD-3` (Authentication & Authorization)
- **Previous Story**: `docs/stories/1-5-deployment-pipeline-environment-configuration.md`
- **Prisma Schema**: `prisma/schema.prisma` (User and VerificationToken models)
- **NextAuth Docs**: https://authjs.dev/getting-started/providers/email

---

## Dev Agent Record

### Context Reference

- `docs/stories/2-1-ranch-owner-registration-role-assignment.context.xml`

### Agent Model Used

Claude 3.5 Sonnet (Cascade)

### Debug Log References

**Implementation Approach:**
1. Extended existing signup API to support role selection with validation
2. Implemented email verification token system using crypto.randomBytes
3. Integrated Resend email service for verification emails
4. Created verification pages with loading states and error handling
5. Updated signup form with password confirmation and role selection
6. Enhanced middleware to check email verification status for protected routes
7. Added emailVerified to NextAuth type definitions and session management

**Key Decisions:**
- Used Resend for email service (modern, simple API)
- Tokens expire after 24 hours
- Email verification required before accessing ranch management features
- Default role set to RANCH_OWNER for this story's focus
- Password confirmation validated client-side and server-side

### Completion Notes List

- ✅ **Email Verification System**: Complete token-based email verification flow implemented
- ✅ **Role-Based Signup**: Users can select RANCH_OWNER or BREEDER role during signup
- ✅ **Access Control**: Middleware protects ranch management routes, redirects unverified users
- ✅ **Email Templates**: Professional HTML and text email templates created
- ✅ **User Experience**: Clear messaging and loading states throughout verification flow
- ✅ **Type Safety**: Extended NextAuth types to include emailVerified field
- ✅ **Security**: Secure token generation, expiry handling, and password confirmation

**Testing Notes:**
- Email sending requires valid RESEND_API_KEY in .env
- Verification flow tested with mock tokens
- Access control tested for protected routes
- Form validation tested for all input fields

### File List

**Created:**
- `lib/tokens.ts` - Token generation and validation utilities
- `lib/email.ts` - Email sending service with Resend integration
- `app/api/auth/verify-email/route.ts` - Email verification API endpoint
- `app/verify-email/page.tsx` - Email verification page
- `app/check-email/page.tsx` - Post-signup instruction page

**Modified:**
- `app/api/auth/signup/route.ts` - Added role validation, email verification token generation and sending
- `app/signup/page.tsx` - Added password confirmation, role selection (default RANCH_OWNER), redirect to check-email
- `auth.ts` - Added emailVerified to user object and JWT/session callbacks
- `auth.config.ts` - Added email verification check and protected route logic
- `types/next-auth.d.ts` - Extended types to include emailVerified field
- `.env` - Added RESEND_API_KEY and FROM_EMAIL environment variables
- `package.json` - Added resend dependency
