# Story 5.1: Inquiry Contact Form

Status: drafted

## Story

As a **breeder**,
I want to submit an inquiry about a bull,
so that I can contact the ranch owner to discuss purchasing semen.

## Acceptance Criteria

1. Contact form is visible on all published bull detail pages
2. Form includes fields: breeder name (required), email (required), phone (optional), message (required)
3. Message field is pre-filled with "I'm interested in [Bull Name]"
4. Client-side validation provides immediate feedback on invalid inputs
5. Form submission is disabled until all required fields are valid
6. Successful submission shows confirmation message: "Your inquiry has been sent to [Ranch Name]"
7. Form resets after successful submission
8. Error messages are clear and actionable for validation failures

## Tasks / Subtasks

- [ ] Task 1: Create Inquiry Data Model (AC: #1-8)
  - [ ] Add Inquiry model to Prisma schema with fields: id, bullId, ranchId, breederName, breederEmail, breederPhone, message, status, internalNotes, respondedAt, timestamps
  - [ ] Add InquiryStatus enum (UNREAD, RESPONDED, ARCHIVED)
  - [ ] Add indexes on ranchId, bullId, status, createdAt
  - [ ] Run Prisma migration to create Inquiry table
  - [ ] Verify model relationships (Bull, Ranch)

- [ ] Task 2: Create POST /api/inquiries Endpoint (AC: #1-8)
  - [ ] Create `/app/api/inquiries/route.ts` with POST handler
  - [ ] Implement Zod validation schema for CreateInquiryRequest (breederName 2-100 chars, valid email, optional phone, message 10-2000 chars)
  - [ ] Verify bull exists and is published
  - [ ] Extract ranchId from bull record
  - [ ] Create inquiry record with status=UNREAD
  - [ ] Return 201 with inquiry object
  - [ ] Handle errors: 400 (validation), 404 (bull not found), 500 (server error)
  - [ ] Add rate limiting: 10 requests per hour per IP

- [ ] Task 3: Create InquiryForm Component (AC: #1-8)
  - [ ] Create `components/InquiryForm.tsx` as client component
  - [ ] Add form fields: breederName (text), breederEmail (email), breederPhone (tel, optional), message (textarea)
  - [ ] Pre-fill message with "I'm interested in [Bull Name]"
  - [ ] Implement client-side validation with Zod and React Hook Form
  - [ ] Show validation errors on blur and submit
  - [ ] Disable submit button until form is valid
  - [ ] Handle form submission to POST /api/inquiries
  - [ ] Display success message: "Your inquiry has been sent to [Ranch Name]"
  - [ ] Reset form after successful submission
  - [ ] Handle API errors with clear messages
  - [ ] Add loading state during submission

- [ ] Task 4: Integrate Form into Bull Detail Page (AC: #1)
  - [ ] Add "Contact Ranch" section to `/app/bulls/[slug]/page.tsx`
  - [ ] Import and render InquiryForm component
  - [ ] Pass bullId, bullName, and ranchName as props
  - [ ] Position form below bull details (before footer)
  - [ ] Style section with clear heading and visual separation

- [ ] Task 5: Testing (AC: #1-8)
  - [ ] Unit test: Zod validation schema (valid/invalid inputs)
  - [ ] Integration test: POST /api/inquiries with valid data → 201 response
  - [ ] Integration test: POST /api/inquiries with invalid data → 400 with error details
  - [ ] Integration test: POST /api/inquiries with non-existent bull → 404
  - [ ] Integration test: Rate limiting (11th request within hour → 429)
  - [ ] Manual test: Form renders on bull detail page
  - [ ] Manual test: Submit valid inquiry → success message shown, form resets
  - [ ] Manual test: Submit invalid data → validation errors displayed
  - [ ] Manual test: Verify inquiry saved to database with correct data

## Dev Notes

### Requirements Context

**From Tech Spec Epic 5 (tech-spec-epic-5.md):**
- Inquiry model already defined in Prisma schema (verify and use existing definition)
- API endpoint: POST /api/inquiries (public, no auth required)
- Rate limiting: 10 requests per hour per IP address
- Validation: breederName (2-100 chars), breederEmail (valid format), breederPhone (optional, valid if provided), message (10-2000 chars)
- Success response: 201 Created with inquiry object
- Email notification triggered asynchronously (handled in Story 5.2, not this story)

**From Epics (epics.md - Story 5.1):**
- Form works for both logged-in and guest users (public endpoint)
- Form validation prevents submission without required fields
- Confirmation message after submission
- Pre-filled message with bull name

**Architecture Constraints:**
- RESTful API conventions
- Server-side validation required (client-side is UX enhancement)
- XSS prevention: Sanitize message content before storage
- CSRF protection via NextAuth.js tokens
- Form validation on both client and server sides
- Mobile-first responsive design

### Learnings from Previous Story

**From Story 4-4e (Status: in-progress)**

Story 4-4e is still in progress and focuses on notification batching/queue infrastructure. Key learnings:

- **New Infrastructure**: BullMQ and Redis queue system being set up for async processing
- **Email Service Pattern**: Story 4-4e uses `lib/email.ts` for email sending - this story will trigger email in Story 5.2
- **Notification Model**: NotificationPreferences model being added for user preferences
- **Async Processing**: Notifications are queued and processed asynchronously (non-blocking)

**Implications for Story 5.1:**
- DO NOT implement email sending in this story (Story 5.2 handles that)
- Focus only on form submission and inquiry creation
- API should return 201 immediately after saving inquiry (email is async)
- Consider that email notification will be added in next story

**Technical Debt/Warnings:**
- Story 4-4e is optional and may not be complete - verify if email infrastructure is ready for Story 5.2
- If BullMQ/Redis not available, Story 5.2 may use direct email sending via Resend

### Project Structure Notes

**Existing Patterns:**
- API routes: `/app/api/[resource]/route.ts` pattern
- Components: `/components/[ComponentName].tsx` pattern
- Database: Prisma ORM with PostgreSQL
- Validation: Zod schemas for type-safe validation
- Forms: React Hook Form for form management
- Authentication: NextAuth.js (not required for this story)

**Files to Create:**
- `app/api/inquiries/route.ts` - POST endpoint for inquiry submission
- `components/InquiryForm.tsx` - Contact form component

**Files to Modify:**
- `app/bulls/[slug]/page.tsx` - Add InquiryForm component
- `prisma/schema.prisma` - Verify Inquiry model exists (should already be defined per tech spec)

**Dependencies:**
- `@prisma/client` - Database ORM
- `zod` - Validation schemas
- `react-hook-form` - Form management
- `@hookform/resolvers` - Zod resolver for React Hook Form

### References

- [Source: docs/tech-spec-epic-5.md#Data Models and Contracts]
- [Source: docs/tech-spec-epic-5.md#APIs and Interfaces - POST /api/inquiries]
- [Source: docs/tech-spec-epic-5.md#Workflows and Sequencing - Workflow 1]
- [Source: docs/tech-spec-epic-5.md#Acceptance Criteria - AC-5.1]
- [Source: docs/epics.md#Epic 5 - Story 5.1]
- [Source: docs/stories/4-4e-notification-batching-queue.md#Dev Agent Record]

## Dev Agent Record

### Context Reference

docs/stories/5-1-inquiry-contact-form.context.xml

### Agent Model Used

<!-- To be filled during implementation -->

### Debug Log References

<!-- To be filled during implementation -->

### Completion Notes List

<!-- To be filled during implementation -->

### File List

<!-- To be filled during implementation -->
