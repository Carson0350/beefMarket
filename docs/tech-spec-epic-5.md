# Epic Technical Specification: Inquiry & Communication

Date: 2025-11-14
Author: Carson
Epic ID: 5
Status: Draft

---

## Overview

Epic 5 implements the inquiry and communication system that enables breeders to contact ranch owners about bulls of interest. This epic delivers the critical value proposition of connecting buyers and sellers - the core business transaction flow that converts platform visits into sales opportunities.

The system includes a contact form on bull detail pages, immediate email notifications to ranch owners, an inquiry dashboard for tracking and managing inquiries, response tracking capabilities, and basic analytics to measure inquiry effectiveness. This transforms the platform from a passive showcase into an active marketplace facilitating direct communication.

The inquiry system must be simple enough for low-digital-literacy ranch owners to manage while providing breeders with a professional, trustworthy contact experience. Success is measured by first inquiry within 30 days of ranch onboarding and ranch owners actively responding to inquiries.

## Objectives and Scope

**In Scope:**
- Contact form on bull detail pages (breeder name, email, phone, message)
- Form validation and submission to API
- Email notifications to ranch owners upon inquiry submission
- Inquiry dashboard for ranch owners to view all inquiries
- Inquiry filtering by status (Unread, Responded, Archived)
- Mark inquiries as responded or archived
- Reply via email client functionality
- Internal notes on inquiries (ranch owner only)
- Basic inquiry analytics (total inquiries, response rate, top bulls)
- Inquiry-to-bull and inquiry-to-ranch relationships
- Mobile-responsive inquiry forms and dashboard

**Out of Scope (Future Phases):**
- In-platform messaging system (Phase 2)
- Automated response templates (Phase 2)
- Advanced analytics and conversion tracking (Phase 2)
- CRM integration (Phase 3)
- Inquiry routing for multi-user ranches (Phase 3)
- Breeder inquiry history across ranches (Phase 3)

## System Architecture Alignment

This epic aligns with the established Next.js monolithic architecture:

**Components Referenced:**
- **API Routes:** POST /api/inquiries, GET /api/inquiries, PATCH /api/inquiries/[id], GET /api/inquiries/analytics
- **Database:** Prisma ORM with PostgreSQL (Inquiry model already defined in schema)
- **Email Service:** Resend for transactional inquiry notifications
- **Authentication:** NextAuth.js for session management and role-based access
- **UI Components:** React components with Tailwind CSS styling

**Architectural Constraints:**
- Multi-tenant data isolation (ranch owners see only their inquiries)
- Row-level security enforced in API routes
- RESTful API conventions for inquiry endpoints
- Server Components for initial page loads, Client Components for interactivity
- Email delivery must be asynchronous (non-blocking)
- Form validation on both client and server sides
- Mobile-first responsive design

## Detailed Design

### Services and Modules

| Module | Responsibility | Inputs | Outputs | Owner |
|--------|---------------|--------|---------|-------|
| **InquiryForm Component** | Render contact form on bull detail pages, validate input, submit to API | Bull ID, breeder input (name, email, phone, message) | API request payload | Frontend |
| **POST /api/inquiries** | Create new inquiry, trigger email notification | Inquiry data (bullId, breederName, breederEmail, breederPhone, message) | Created inquiry object, 201 status | API Route |
| **GET /api/inquiries** | Fetch inquiries for authenticated ranch owner | Query params (status filter, pagination) | Array of inquiry objects | API Route |
| **PATCH /api/inquiries/[id]** | Update inquiry status (responded/archived) | Inquiry ID, status update, optional internal notes | Updated inquiry object | API Route |
| **GET /api/inquiries/analytics** | Calculate inquiry metrics for ranch | Ranch ID, date range | Analytics data (total, response rate, top bulls) | API Route |
| **Email Service** | Send inquiry notification emails to ranch owners | Inquiry data, ranch owner email, bull details | Email delivery confirmation | lib/email.ts |
| **InquiryDashboard Page** | Display and manage inquiries for ranch owners | User session (ranch ID) | Rendered dashboard with inquiry list | Dashboard Route |
| **InquiryAnalytics Component** | Calculate and display inquiry metrics | Ranch ID, date range | Metrics (total inquiries, by bull, response rate) | Dashboard Component |

### Data Models and Contracts

**Inquiry Model (Existing in Prisma Schema):**

```prisma
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
```

**API Request/Response Contracts:**

```typescript
// Create Inquiry Request
interface CreateInquiryRequest {
  bullId: string;
  breederName: string;      // 2-100 characters
  breederEmail: string;     // Valid email format
  breederPhone?: string;    // Optional, valid phone if provided
  message: string;          // 10-2000 characters
}

// Create Inquiry Response
interface CreateInquiryResponse {
  inquiry: {
    id: string;
    bullId: string;
    ranchId: string;
    breederName: string;
    breederEmail: string;
    breederPhone: string | null;
    message: string;
    status: 'UNREAD';
    createdAt: string;
  };
}

// List Inquiries Request (Query Params)
interface ListInquiriesParams {
  status?: 'UNREAD' | 'RESPONDED' | 'ARCHIVED';
  page?: number;      // Default: 1
  limit?: number;     // Default: 20, Max: 100
}

// List Inquiries Response
interface ListInquiriesResponse {
  inquiries: Inquiry[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Update Inquiry Request
interface UpdateInquiryRequest {
  status?: 'RESPONDED' | 'ARCHIVED';
  internalNotes?: string;  // Max 1000 characters
}

// Analytics Response
interface InquiryAnalyticsResponse {
  totalInquiries: number;
  unreadCount: number;
  responseRate: number;  // Percentage
  topBulls: Array<{
    bullId: string;
    bullName: string;
    inquiryCount: number;
  }>;
  inquiriesOverTime: Array<{
    month: string;
    count: number;
  }>;
}

// Email Template Data
interface InquiryEmailData {
  ranchOwnerName: string;
  ranchName: string;
  bullName: string;
  bullPhotoUrl: string;
  breederName: string;
  breederEmail: string;
  breederPhone?: string;
  message: string;
  dashboardUrl: string;
  timestamp: string;
}
```

### APIs and Interfaces

**API Endpoint Specifications:**

**1. POST /api/inquiries**
- **Method:** POST
- **Authentication:** None (public endpoint)
- **Rate Limiting:** 10 requests per hour per IP address
- **Request Body:** CreateInquiryRequest
- **Validation:**
  - bullId must exist and be published
  - breederName: 2-100 characters
  - breederEmail: valid email format
  - breederPhone: optional, valid phone format if provided
  - message: 10-2000 characters
- **Success Response:** 201 Created with inquiry object
- **Error Responses:**
  - 400: Validation error (invalid input)
  - 404: Bull not found
  - 429: Rate limit exceeded
  - 500: Server error
- **Side Effects:**
  - Creates inquiry record in database
  - Triggers async email notification to ranch owner
  - Sets inquiry status to UNREAD

**2. GET /api/inquiries**
- **Method:** GET
- **Authentication:** Required (RANCH_OWNER role)
- **Authorization:** User can only access inquiries for their own ranch
- **Query Parameters:** ListInquiriesParams (status, page, limit)
- **Response:** 200 OK with ListInquiriesResponse
- **Error Responses:**
  - 401: Unauthorized (not logged in)
  - 403: Forbidden (not ranch owner)
  - 500: Server error

**3. PATCH /api/inquiries/[id]**
- **Method:** PATCH
- **Authentication:** Required (RANCH_OWNER role)
- **Authorization:** User can only update inquiries for their own ranch
- **Path Parameters:** id (inquiry ID)
- **Request Body:** UpdateInquiryRequest
- **Validation:**
  - status: must be RESPONDED or ARCHIVED
  - internalNotes: max 1000 characters
- **Success Response:** 200 OK with updated inquiry
- **Error Responses:**
  - 400: Validation error
  - 401: Unauthorized
  - 403: Forbidden (not owner)
  - 404: Inquiry not found
  - 500: Server error
- **Side Effects:**
  - Sets respondedAt timestamp when status changes to RESPONDED

**4. GET /api/inquiries/analytics**
- **Method:** GET
- **Authentication:** Required (RANCH_OWNER role)
- **Authorization:** User can only access analytics for their own ranch
- **Query Parameters:** dateRange (optional, defaults to all time)
- **Response:** 200 OK with InquiryAnalyticsResponse
- **Response Schema:**
  - totalInquiries: count of all inquiries
  - unreadCount: count of UNREAD inquiries
  - responseRate: (RESPONDED / total) * 100
  - topBulls: top 5 bulls by inquiry count
  - inquiriesOverTime: monthly counts for last 6 months
- **Error Responses:**
  - 401: Unauthorized
  - 403: Forbidden
  - 500: Server error

### Workflows and Sequencing

**Workflow 1: Breeder Submits Inquiry**
1. Breeder views bull detail page
2. Scrolls to "Contact Ranch" section
3. Fills out inquiry form (name, email, phone optional, message)
4. Client-side validation runs on blur
5. Clicks "Send Inquiry" button
6. Form submits POST to /api/inquiries
7. API validates request body
8. API verifies bull exists and is published
9. API creates inquiry record with status=UNREAD
10. API triggers async email notification (non-blocking)
11. API returns 201 with inquiry object
12. UI displays success message
13. Form resets to initial state

**Workflow 2: Email Notification to Ranch Owner**
1. Inquiry created event triggers email service
2. Email service fetches ranch owner details
3. Email service fetches bull details for template
4. Email service generates HTML email with React Email template
5. Email sent via Resend with reply-to set to breeder email
6. Email delivery logged (success/failure)

**Workflow 3: Ranch Owner Views Inquiries**
1. Ranch owner logs in
2. Navigates to /dashboard/inquiries
3. Server component fetches inquiries for ranch (GET /api/inquiries)
4. Inquiries grouped by status (Unread, Responded, Archived)
5. Unread section expanded by default
6. Ranch owner clicks inquiry to view full details
7. Details expand showing bull info, breeder contact, full message

**Workflow 4: Ranch Owner Responds to Inquiry**
1. Ranch owner views inquiry details
2. Clicks "Reply via Email" button
3. Email client opens with pre-filled recipient and subject
4. Ranch owner composes response in email client
5. Sends email directly to breeder
6. Returns to dashboard
7. Clicks "Mark as Responded"
8. PATCH /api/inquiries/[id] with status=RESPONDED
9. respondedAt timestamp set
10. Inquiry moves to Responded section

**Workflow 5: Ranch Owner Views Analytics**
1. Ranch owner on inquiry dashboard
2. Analytics section displays at top
3. GET /api/inquiries/analytics fetches metrics
4. Displays: Total inquiries, Unread count, Response rate
5. Shows top 5 bulls by inquiry count

## Non-Functional Requirements

### Performance

**Inquiry Submission:**
- Form submission response time: <500ms (excluding email delivery)
- Email notification delivery: <5 seconds (async, non-blocking)
- Form validation feedback: <100ms (client-side)

**Inquiry Dashboard:**
- Initial page load: <2 seconds for 100 inquiries
- Pagination: <300ms per page navigation
- Status filter application: <200ms (client-side)
- Analytics calculation: <1 second for 1000 inquiries

**Rate Limiting:**
- Inquiry submission: 10 requests per hour per IP (prevent spam)
- API endpoints: 100 requests per minute per authenticated user

**Database Performance:**
- Inquiry queries optimized with indexes on ranchId, status, createdAt
- Pagination limits: 20 inquiries per page (default), max 100
- Analytics queries use aggregation for efficiency

**Email Delivery:**
- Asynchronous processing (non-blocking API response)
- Retry logic: 3 attempts with exponential backoff
- Timeout: 10 seconds per email send attempt

### Security

**Data Protection:**
- Inquiry data visible only to owning ranch (row-level security)
- Breeder contact information not exposed publicly
- Email addresses protected from scraping (no public display)
- Internal notes visible only to ranch owner

**Input Validation:**
- Server-side validation on all inquiry submissions (Zod schemas)
- XSS prevention: Sanitize message content before storage/display
- SQL injection prevention: Parameterized queries via Prisma
- Email validation: RFC 5322 compliant format checking
- Phone validation: International format support with sanitization

**Authentication & Authorization:**
- Inquiry submission: Public endpoint (no auth required)
- Inquiry viewing: Requires RANCH_OWNER role + ownership check
- Inquiry updates: Requires RANCH_OWNER role + ownership check
- Session-based authentication via NextAuth.js (HTTP-only cookies)

**Rate Limiting & Abuse Prevention:**
- IP-based rate limiting on inquiry submission (10/hour)
- Prevents spam and automated submissions
- CAPTCHA consideration for future if abuse detected
- Email validation prevents disposable email addresses (optional)

**CSRF Protection:**
- All POST/PATCH requests protected by NextAuth.js CSRF tokens
- SameSite cookie attribute set to 'lax'

**Email Security:**
- Reply-to header set to breeder email (direct response)
- No sensitive data in email subject lines
- Unsubscribe link not applicable (transactional emails)
- SPF/DKIM configured via Resend

### Reliability/Availability

**Email Delivery Reliability:**
- Retry logic: 3 attempts with exponential backoff (1s, 5s, 15s)
- Failure logging: All email failures logged for manual review
- Fallback: If email fails after retries, inquiry still saved (ranch owner can view in dashboard)
- Dead letter queue: Failed emails stored for manual intervention

**Database Reliability:**
- Transaction support: Inquiry creation wrapped in database transaction
- Rollback on failure: If email trigger fails, inquiry creation still succeeds
- Connection pooling: Prisma manages connection pool (max 10 connections)
- Query timeouts: 30 seconds max per query

**Error Handling:**
- Graceful degradation: If email service down, inquiry still saved
- User feedback: Clear error messages for validation failures
- Error boundaries: React error boundaries prevent full page crashes
- API error responses: Consistent JSON error format with status codes

**Uptime Target:**
- 99.5% uptime (aligned with Vercel SLA)
- Email service: 99.9% uptime (Resend SLA)
- Database: 99.95% uptime (Vercel Postgres SLA)

**Data Persistence:**
- All inquiries persisted immediately to database
- No data loss on email delivery failure
- Inquiry history maintained indefinitely (no auto-deletion)

### Observability

**Logging:**
- Inquiry creation events: Log bullId, ranchId, timestamp
- Email delivery events: Log success/failure, delivery time, error messages
- API errors: Log full error stack, request context, user session
- Rate limit violations: Log IP address, timestamp, endpoint

**Metrics to Track:**
- Inquiry submission rate (per hour, per day)
- Email delivery success rate
- Average response time for inquiry submission
- Dashboard page load times
- Inquiry status distribution (unread/responded/archived)
- Response rate by ranch

**Monitoring Alerts:**
- Email delivery failure rate >10%: Alert via Vercel notifications
- API error rate >5%: Alert via Vercel notifications
- Database query timeout: Alert immediately
- Rate limit violations >100/hour: Review for abuse

**Debugging Support:**
- Request IDs: Generate unique ID per API request for tracing
- Error context: Include user session, request params in error logs
- Email delivery logs: Store Resend message IDs for tracking
- Inquiry audit trail: Track status changes with timestamps

**Analytics Dashboard:**
- Ranch owner analytics: Built into inquiry dashboard UI
- Platform analytics: Admin-only view of system-wide metrics
- No third-party analytics on inquiry data (privacy)

## Dependencies and Integrations

**External Services:**

| Service | Purpose | Version/Plan | Configuration |
|---------|---------|--------------|---------------|
| **Resend** | Email delivery for inquiry notifications | Free tier (3,000 emails/month) | API key in env: `RESEND_API_KEY` |
| **Vercel Postgres** | Database storage for inquiries | Hobby tier | Connection string in env |
| **NextAuth.js** | Session management and authentication | v5.0.0-beta.30 | Already configured |

**Internal Dependencies:**

| Dependency | Version | Purpose |
|------------|---------|---------|
| `@prisma/client` | ^6.19.0 | Database ORM for inquiry CRUD |
| `next` | ^14.2.0 | Framework for API routes and pages |
| `next-auth` | ^5.0.0-beta.30 | Authentication middleware |
| `resend` | ^6.4.2 | Email API client |
| `react` | ^18.3.0 | UI components |
| `date-fns` | ^4.1.0 | Date formatting for timestamps |

**Code Dependencies:**

- **Database Schema:** `prisma/schema.prisma` - Inquiry model already defined
- **Email Service:** `lib/email.ts` - Existing email utility functions
- **Authentication:** `auth.ts`, `auth.config.ts` - Session management
- **Middleware:** `middleware.ts` - Route protection
- **Types:** `types/next-auth.d.ts` - TypeScript definitions

**Integration Points:**

1. **Bull Detail Page Integration:**
   - Add InquiryForm component to `/app/bulls/[slug]/page.tsx`
   - Pass bull ID and ranch ID as props
   - Display "Contact Ranch" button/section

2. **Dashboard Navigation Integration:**
   - Add "Inquiries" link to dashboard navigation
   - Display unread inquiry count badge
   - Link to `/dashboard/inquiries`

3. **Email Template Integration:**
   - Create email template in `emails/inquiry-notification.tsx` (React Email)
   - Use existing email service in `lib/email.ts`
   - Add new `sendInquiryNotification()` function

4. **API Route Integration:**
   - Create `/app/api/inquiries/route.ts` (GET, POST)
   - Create `/app/api/inquiries/[id]/route.ts` (PATCH)
   - Create `/app/api/inquiries/analytics/route.ts` (GET)
   - Use existing auth middleware patterns

**Environment Variables Required:**

```env
# Already configured (no changes needed)
RESEND_API_KEY=re_xxxxx
DATABASE_URL=postgres://...
NEXTAUTH_SECRET=xxxxx
NEXTAUTH_URL=https://wagnerbeef.com
```

**No New External Dependencies Required** - All services already in use.

## Acceptance Criteria (Authoritative)

**AC-5.1: Inquiry Contact Form (Story 5-1)**
1. Contact form is visible on all published bull detail pages
2. Form includes fields: breeder name (required), email (required), phone (optional), message (required)
3. Message field is pre-filled with "I'm interested in [Bull Name]"
4. Client-side validation provides immediate feedback on invalid inputs
5. Form submission is disabled until all required fields are valid
6. Successful submission shows confirmation message: "Your inquiry has been sent to [Ranch Name]"
7. Form resets after successful submission
8. Error messages are clear and actionable for validation failures

**AC-5.2: Inquiry Email Notifications (Story 5-2)**
1. Ranch owner receives email within 5 seconds of inquiry submission
2. Email subject line: "New Inquiry: [Bull Name] from [Breeder Name]"
3. Email body includes: bull name, bull photo, breeder name, breeder email, breeder phone, full message
4. Email includes direct link to inquiry dashboard
5. Reply-to header is set to breeder's email address
6. Email is mobile-responsive and professionally branded
7. Failed email deliveries are logged and retried up to 3 times
8. Inquiry is saved to database even if email delivery fails

**AC-5.3: Inquiry Dashboard (Story 5-3)**
1. Ranch owners can access inquiry dashboard at `/dashboard/inquiries`
2. Dashboard displays all inquiries for the ranch owner's ranch only
3. Inquiries are grouped by status: Unread, Responded, Archived
4. Each inquiry shows: bull name with thumbnail, breeder name, date, message preview (first 100 chars)
5. Inquiries are sorted by date (newest first) within each status group
6. Dashboard shows unread inquiry count badge in navigation
7. Clicking an inquiry expands full details: bull info, breeder contact, full message, timestamp
8. Dashboard is paginated (20 inquiries per page)
9. Dashboard loads in <2 seconds for 100 inquiries

**AC-5.4: Inquiry Response Tracking (Story 5-4)**
1. Ranch owner can mark inquiry as "Responded" from inquiry detail view
2. "Reply via Email" button opens default email client with pre-filled recipient and subject
3. Marking as responded sets respondedAt timestamp
4. Ranch owner can add internal notes (visible only to them)
5. Ranch owner can archive inquiries to hide from main view
6. Archived inquiries remain accessible via "Archived" filter
7. Status changes are reflected immediately in the UI
8. Inquiry list can be filtered by status (Unread/Responded/Archived)

**AC-5.5: Inquiry Analytics (Story 5-5)**
1. Analytics section displays at top of inquiry dashboard
2. Metrics shown: Total inquiries (all time), Unread count, Response rate percentage
3. "Top Bulls" section shows 5 bulls with most inquiries and their counts
4. "Inquiries Over Time" chart shows monthly inquiry counts for last 6 months
5. Clicking a bull name in analytics filters inquiry list to that bull
6. Analytics calculate in <1 second for 1000 inquiries
7. Response rate calculation: (responded count / total inquiries) * 100
8. Analytics are ranch-specific (only show data for authenticated ranch owner's ranch)

## Traceability Mapping

| Acceptance Criteria | Spec Section | Component/API | Test Approach |
|---------------------|--------------|---------------|---------------|
| **AC-5.1.1-8** | Detailed Design > InquiryForm Component | `components/InquiryForm.tsx`, `app/bulls/[slug]/page.tsx` | Unit test form validation, integration test form submission |
| **AC-5.1.1** | APIs > POST /api/inquiries | `app/api/inquiries/route.ts` | API test: verify form renders on bull pages |
| **AC-5.1.2-4** | Data Models > CreateInquiryRequest | Form component with Zod validation | Unit test validation rules |
| **AC-5.1.5-7** | Workflows > Workflow 1 | Form submission handler | Integration test: submit valid inquiry |
| **AC-5.1.8** | APIs > POST /api/inquiries (Error Responses) | API validation middleware | API test: submit invalid data, verify error messages |
| **AC-5.2.1-6** | Detailed Design > Email Service, Workflows > Workflow 2 | `lib/email.ts`, email template | Integration test: verify email sent and content |
| **AC-5.2.7-8** | NFR > Reliability > Email Delivery Reliability | Email retry logic in API route | Unit test retry mechanism, verify inquiry saved on email failure |
| **AC-5.3.1-9** | Detailed Design > InquiryDashboard Page, APIs > GET /api/inquiries | `app/dashboard/inquiries/page.tsx`, `app/api/inquiries/route.ts` | Integration test: load dashboard, verify filtering and pagination |
| **AC-5.3.7** | Data Models > Inquiry Model (indexes) | Database indexes on ranchId, status | Performance test: measure query time with 100 inquiries |
| **AC-5.4.1-8** | APIs > PATCH /api/inquiries/[id], Workflows > Workflow 4 | `app/api/inquiries/[id]/route.ts`, dashboard UI | Integration test: update inquiry status, verify timestamp |
| **AC-5.4.2** | Workflows > Workflow 4 (step 3-4) | Dashboard inquiry detail component | Manual test: verify email client opens with correct data |
| **AC-5.5.1-8** | Detailed Design > InquiryAnalytics Component, APIs > GET /api/inquiries/analytics | `app/api/inquiries/analytics/route.ts`, analytics component | Integration test: verify metrics calculation accuracy |
| **AC-5.5.6** | NFR > Performance > Inquiry Dashboard | Analytics query optimization | Performance test: measure calculation time with 1000 inquiries |

**PRD Requirements Mapping:**

| PRD Requirement | Epic 5 Stories | Acceptance Criteria |
|-----------------|----------------|---------------------|
| FR-8.1: Submit Inquiry | Story 5-1 | AC-5.1.1-8 |
| FR-8.2: Inquiry Notifications | Story 5-2 | AC-5.2.1-8 |
| FR-8.3: Inquiry Dashboard | Story 5-3, 5-4 | AC-5.3.1-9, AC-5.4.1-8 |
| NFR-1: Page Load Performance | Story 5-3 | AC-5.3.9 |
| NFR-4: Authentication Security | Story 5-3, 5-4, 5-5 | Implicit in authorization checks |
| NFR-5: Data Protection | All stories | Implicit in row-level security |

## Risks, Assumptions, Open Questions

**Risks:**

1. **RISK: Email Deliverability**
   - Ranch owner emails may be marked as spam
   - **Mitigation:** Use Resend with proper SPF/DKIM configuration, professional email templates, avoid spam trigger words
   - **Fallback:** Inquiries always saved to dashboard even if email fails

2. **RISK: Inquiry Spam**
   - Public form may attract spam submissions
   - **Mitigation:** IP-based rate limiting (10/hour), input validation, consider CAPTCHA if abuse detected
   - **Monitoring:** Track submission patterns, alert on unusual volume

3. **RISK: Email Service Downtime**
   - Resend outage prevents notification delivery
   - **Mitigation:** Async email processing, retry logic, inquiries still saved to database
   - **Monitoring:** Alert on email failure rate >10%

4. **RISK: Performance Degradation**
   - Analytics queries may slow down with large inquiry volumes
   - **Mitigation:** Database indexes, query optimization, caching for analytics
   - **Threshold:** Performance acceptable up to 1000 inquiries per ranch

**Assumptions:**

1. **ASSUMPTION:** Ranch owners check email regularly (within 24 hours)
   - Email notification is primary alert mechanism
   - Dashboard provides backup access to inquiries

2. **ASSUMPTION:** Breeders prefer email-based communication over in-platform messaging
   - MVP uses email client for responses (not in-platform chat)
   - Future phase may add messaging if user feedback indicates need

3. **ASSUMPTION:** Ranch owners manage inquiries individually (single-user ranches)
   - No multi-user inquiry assignment or routing in MVP
   - Future phase may add team features for larger operations

4. **ASSUMPTION:** Inquiry volume is manageable manually (<50 inquiries/month per ranch)
   - No automated response templates or workflows in MVP
   - Analytics help identify high-demand bulls

5. **ASSUMPTION:** Resend free tier (3,000 emails/month) is sufficient
   - Based on 15 ranches × 50 inquiries/month = 750 emails/month
   - Includes buffer for other notification types

**Open Questions:**

1. **QUESTION:** Should we implement CAPTCHA on inquiry form from launch?
   - **Decision Needed:** Start without CAPTCHA, add if spam becomes issue
   - **Rationale:** Reduces friction for legitimate breeders, rate limiting provides initial protection

2. **QUESTION:** Should breeder phone number be required or optional?
   - **Decision:** Optional (as specified in PRD)
   - **Rationale:** Some breeders prefer email-only contact

3. **QUESTION:** Should we track inquiry-to-sale conversions?
   - **Decision:** Out of scope for MVP (Story 5-5 focuses on inquiry metrics only)
   - **Future Phase:** Add conversion tracking in Phase 2 analytics

4. **QUESTION:** Should archived inquiries be auto-deleted after a period?
   - **Decision:** No auto-deletion in MVP, maintain full history
   - **Rationale:** Storage cost is minimal, historical data valuable for analytics

5. **QUESTION:** Should we send confirmation email to breeder after inquiry submission?
   - **Decision:** Not in MVP scope
   - **Rationale:** UI confirmation message sufficient, reduces email volume
   - **Future Consideration:** Add if user feedback indicates need

## Test Strategy Summary

**Testing Approach:**

Epic 5 requires comprehensive testing across UI, API, email delivery, and data persistence layers. Testing strategy balances automated coverage with manual verification for email client integration.

**Test Levels:**

**1. Unit Tests**
- **Form Validation:** Test Zod schemas for inquiry form inputs
  - Valid inputs pass validation
  - Invalid email formats rejected
  - Required fields enforced
  - Character limits respected (message 10-2000 chars)
- **Email Service:** Test email template rendering
  - Template renders with correct data
  - Reply-to header set correctly
  - Links are properly formatted
- **Analytics Calculations:** Test metric computation logic
  - Response rate calculation accuracy
  - Inquiry grouping by bull
  - Monthly aggregation logic

**2. Integration Tests**
- **Inquiry Submission Flow (AC-5.1):**
  - POST /api/inquiries with valid data → 201 response
  - Inquiry saved to database with correct ranchId
  - Email notification triggered
  - Form shows success message
- **Email Notification Flow (AC-5.2):**
  - Inquiry creation triggers email send
  - Email contains correct inquiry data
  - Email delivery logged
  - Retry logic executes on failure
- **Dashboard Loading (AC-5.3):**
  - GET /api/inquiries returns filtered inquiries
  - Only ranch owner's inquiries returned
  - Pagination works correctly
  - Status filtering works
- **Status Updates (AC-5.4):**
  - PATCH /api/inquiries/[id] updates status
  - respondedAt timestamp set correctly
  - Unauthorized users cannot update
- **Analytics API (AC-5.5):**
  - GET /api/inquiries/analytics returns correct metrics
  - Data filtered by ranch ownership
  - Performance acceptable with 1000 inquiries

**3. API Tests**
- **Authentication/Authorization:**
  - Unauthenticated requests to protected endpoints → 401
  - BREEDER role cannot access ranch owner endpoints → 403
  - Ranch owner cannot access other ranch's inquiries → 403
- **Rate Limiting:**
  - 11th inquiry submission within hour → 429 response
  - Rate limit resets after time window
- **Validation:**
  - Invalid bullId → 404
  - Missing required fields → 400 with error details
  - Invalid email format → 400

**4. E2E Tests (Manual)**
- **Breeder Inquiry Submission:**
  1. Navigate to bull detail page
  2. Fill and submit inquiry form
  3. Verify success message
  4. Verify email received by ranch owner
  5. Verify inquiry appears in dashboard
- **Ranch Owner Response:**
  1. Login as ranch owner
  2. Navigate to inquiry dashboard
  3. Click inquiry to view details
  4. Click "Reply via Email"
  5. Verify email client opens with correct data
  6. Mark as responded
  7. Verify status updated in UI
- **Analytics Verification:**
  1. Create multiple inquiries for different bulls
  2. View analytics section
  3. Verify counts and percentages accurate
  4. Click bull name to filter
  5. Verify filtered results

**5. Performance Tests**
- Dashboard load time with 100 inquiries < 2 seconds
- Analytics calculation with 1000 inquiries < 1 second
- Inquiry submission response time < 500ms
- Email delivery within 5 seconds

**6. Security Tests**
- SQL injection attempts in message field
- XSS attempts in message field (verify sanitization)
- CSRF token validation on POST/PATCH
- Authorization bypass attempts
- Rate limit enforcement

**Test Data Requirements:**

- **Test Ranch Accounts:** 2-3 ranch owner accounts
- **Test Bulls:** 5-10 published bulls across ranches
- **Test Inquiries:** 50-100 inquiries with varied status
- **Test Breeders:** Valid and invalid email addresses

**Edge Cases to Test:**

1. **Email Delivery Failures:**
   - Resend API returns error → Inquiry still saved
   - Network timeout → Retry logic executes
   - Invalid ranch owner email → Error logged

2. **Concurrent Updates:**
   - Two ranch owners updating same inquiry simultaneously
   - Optimistic locking or last-write-wins behavior

3. **Large Message Content:**
   - Message at 2000 character limit
   - Message with special characters and emojis
   - Message with URLs and formatting

4. **Empty States:**
   - Dashboard with zero inquiries
   - Analytics with no data
   - Archived filter with no archived inquiries

5. **Pagination Edge Cases:**
   - Exactly 20 inquiries (single page)
   - 21 inquiries (two pages)
   - Last page with fewer than 20 items

**Test Coverage Goals:**

- Unit test coverage: >80% for business logic
- API endpoint coverage: 100% (all endpoints tested)
- Critical path coverage: 100% (inquiry submission, email, dashboard)
- Edge case coverage: Key scenarios documented and tested

**Testing Tools:**

- **Unit/Integration:** Jest + React Testing Library
- **API Tests:** Supertest or Vitest
- **E2E:** Manual testing (Playwright for future automation)
- **Performance:** Lighthouse, custom timing measurements
- **Email Testing:** Resend test mode, email preview tools

**Acceptance Testing:**

Each story's acceptance criteria (AC-5.1 through AC-5.5) must be verified before marking story as done. Test checklist created from acceptance criteria and executed by developer before code review.
