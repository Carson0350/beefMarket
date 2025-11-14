# Story 5.2: Inquiry Email Notifications to Ranch Owners

Status: drafted

## Story

As a **ranch owner**,
I want to receive email notifications when breeders inquire about my bulls,
so that I can respond quickly to sales opportunities.

## Acceptance Criteria

1. Ranch owner receives email within 5 seconds of inquiry submission
2. Email subject line: "New Inquiry: [Bull Name] from [Breeder Name]"
3. Email body includes: bull name, bull photo, breeder name, breeder email, breeder phone, full message
4. Email includes direct link to inquiry dashboard
5. Reply-to header is set to breeder's email address
6. Email is mobile-responsive and professionally branded
7. Failed email deliveries are logged and retried up to 3 times
8. Inquiry is saved to database even if email delivery fails

## Tasks / Subtasks

- [ ] Task 1: Set Up Email Service Integration (AC: #1, #7, #8)
  - [ ] Verify Resend API key in environment variables (RESEND_API_KEY)
  - [ ] Install `resend` package if not already installed
  - [ ] Create or verify `lib/email.ts` utility exists
  - [ ] Add `sendInquiryNotification()` function to email service
  - [ ] Implement retry logic: 3 attempts with exponential backoff (1s, 5s, 15s)
  - [ ] Add error logging for failed email deliveries
  - [ ] Test email service connection

- [ ] Task 2: Create Email Template (AC: #2, #3, #4, #5, #6)
  - [ ] Create `emails/inquiry-notification.tsx` using React Email
  - [ ] Design mobile-responsive email layout
  - [ ] Add email sections: header with logo, bull info with photo, breeder contact details, message content, CTA button to dashboard
  - [ ] Set subject line: "New Inquiry: [Bull Name] from [Breeder Name]"
  - [ ] Set reply-to header to breeder's email address
  - [ ] Include direct link to inquiry dashboard: `/dashboard/inquiries`
  - [ ] Add professional branding (wagnerBeef logo, colors)
  - [ ] Test email rendering in preview

- [ ] Task 3: Integrate Email Sending into Inquiry API (AC: #1, #7, #8)
  - [ ] Modify POST /api/inquiries endpoint in `app/api/inquiries/route.ts`
  - [ ] After saving inquiry to database, trigger async email notification
  - [ ] Fetch ranch owner details (name, email) from database
  - [ ] Fetch bull details (name, photo URL) for email template
  - [ ] Call `sendInquiryNotification()` with inquiry data
  - [ ] Ensure email sending is non-blocking (async/await with try-catch)
  - [ ] Log email delivery success/failure
  - [ ] Return 201 response immediately (don't wait for email)
  - [ ] Ensure inquiry is saved even if email fails

- [ ] Task 4: Email Delivery Logging (AC: #7, #8)
  - [ ] Add email delivery status logging (success/failure, timestamp, error message)
  - [ ] Log Resend message ID for tracking
  - [ ] Consider adding emailSentAt field to Inquiry model (optional)
  - [ ] Log retry attempts and final outcome

- [ ] Task 5: Testing (AC: #1-8)
  - [ ] Unit test: Email template renders with correct data
  - [ ] Unit test: Reply-to header set correctly
  - [ ] Integration test: Submit inquiry → email sent within 5 seconds
  - [ ] Integration test: Email contains correct bull name, breeder info, message
  - [ ] Integration test: Email includes dashboard link
  - [ ] Integration test: Resend API failure → inquiry still saved, error logged
  - [ ] Integration test: Retry logic executes on transient failures
  - [ ] Manual test: Receive email in inbox, verify mobile responsiveness
  - [ ] Manual test: Click "Reply" in email client → breeder email pre-filled
  - [ ] Manual test: Click dashboard link → navigates to inquiry dashboard

## Dev Notes

### Requirements Context

**From Tech Spec Epic 5 (tech-spec-epic-5.md):**
- Email service: Resend (already configured, API key in env)
- Email delivery: Asynchronous, non-blocking API response
- Retry logic: 3 attempts with exponential backoff
- Timeout: 10 seconds per email send attempt
- Email template data: ranchOwnerName, ranchName, bullName, bullPhotoUrl, breederName, breederEmail, breederPhone, message, dashboardUrl, timestamp
- Subject: "New Inquiry: [Bull Name] from [Breeder Name]"
- Reply-to: Set to breeder email for direct response
- Graceful degradation: If email fails, inquiry still saved

**From Epics (epics.md - Story 5.2):**
- Email sent immediately when inquiry is saved
- Email includes breeder contact info and message
- Link to inquiry dashboard included
- Mobile-responsive and professional design

**Architecture Constraints:**
- Email delivery must be asynchronous (non-blocking)
- Inquiry creation must succeed even if email fails
- SPF/DKIM configured via Resend (no action needed)
- No sensitive data in email subject lines
- Email service: Resend with 99.9% uptime SLA

### Learnings from Previous Story

**From Story 5-1 (Status: drafted)**

Story 5-1 created the inquiry submission flow:

- **New API Endpoint**: POST /api/inquiries creates inquiry records
- **Inquiry Model**: Inquiry table with bullId, ranchId, breederName, breederEmail, breederPhone, message, status
- **InquiryForm Component**: Client-side form at `components/InquiryForm.tsx`
- **Validation**: Zod schemas validate inquiry data (breederName, email, phone, message)
- **Rate Limiting**: 10 requests per hour per IP
- **Integration Point**: Form integrated into bull detail pages

**Implications for Story 5.2:**
- Modify existing POST /api/inquiries endpoint to add email notification
- Use inquiry data already validated and saved by Story 5.1
- Email sending should NOT block the 201 response
- Fetch ranch owner email from Ranch model via bullId → ranchId relationship
- Reuse existing email service infrastructure from Story 4.4 notifications

**From Story 4-4e (Status: in-progress)**

Story 4-4e is implementing notification batching with BullMQ/Redis:

- **Email Service**: `lib/email.ts` exists for email sending
- **Async Processing**: Notifications queued and processed asynchronously
- **Resend Integration**: Already configured for transactional emails

**Decision for Story 5.2:**
- Use direct Resend email sending (not BullMQ queue) for immediate delivery
- Inquiry notifications are time-sensitive (5 second target)
- BullMQ queue is for batched notifications, not transactional emails
- If Story 4-4e completes and queue is stable, consider migrating later

### Project Structure Notes

**Existing Patterns:**
- Email service: `lib/email.ts` (verify and extend)
- Email templates: React Email components (create `emails/` directory if needed)
- API routes: Async error handling with try-catch
- Logging: Console logs for development, consider structured logging for production

**Files to Create:**
- `emails/inquiry-notification.tsx` - React Email template for inquiry notifications

**Files to Modify:**
- `app/api/inquiries/route.ts` - Add email notification trigger after inquiry creation
- `lib/email.ts` - Add `sendInquiryNotification()` function

**Dependencies:**
- `resend` (^6.4.2) - Email API client (should already be installed)
- `react-email` - Email template framework (verify installation)
- `@react-email/components` - Email component library

**Environment Variables:**
- `RESEND_API_KEY` - Already configured (verify in .env)
- `NEXTAUTH_URL` - Base URL for dashboard link

### References

- [Source: docs/tech-spec-epic-5.md#Data Models and Contracts - InquiryEmailData]
- [Source: docs/tech-spec-epic-5.md#APIs and Interfaces - POST /api/inquiries Side Effects]
- [Source: docs/tech-spec-epic-5.md#Workflows and Sequencing - Workflow 2]
- [Source: docs/tech-spec-epic-5.md#Non-Functional Requirements - Email Delivery Reliability]
- [Source: docs/tech-spec-epic-5.md#Acceptance Criteria - AC-5.2]
- [Source: docs/epics.md#Epic 5 - Story 5.2]
- [Source: docs/stories/5-1-inquiry-contact-form.md#Tasks]
- [Source: docs/stories/4-4e-notification-batching-queue.md#Technical Notes]

## Dev Agent Record

### Context Reference

docs/stories/5-2-inquiry-email-notifications-to-ranch-owners.context.xml

### Agent Model Used

<!-- To be filled during implementation -->

### Debug Log References

<!-- To be filled during implementation -->

### Completion Notes List

<!-- To be filled during implementation -->

### File List

<!-- To be filled during implementation -->
