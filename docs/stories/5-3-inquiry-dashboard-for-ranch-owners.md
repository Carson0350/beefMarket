# Story 5.3: Inquiry Dashboard for Ranch Owners

Status: drafted

## Story

As a **ranch owner**,
I want to view and manage all inquiries in a dashboard,
so that I can track leads and follow up appropriately.

## Acceptance Criteria

1. Ranch owners can access inquiry dashboard at `/dashboard/inquiries`
2. Dashboard displays all inquiries for the ranch owner's ranch only
3. Inquiries are grouped by status: Unread, Responded, Archived
4. Each inquiry shows: bull name with thumbnail, breeder name, date, message preview (first 100 chars)
5. Inquiries are sorted by date (newest first) within each status group
6. Dashboard shows unread inquiry count badge in navigation
7. Clicking an inquiry expands full details: bull info, breeder contact, full message, timestamp
8. Dashboard is paginated (20 inquiries per page)
9. Dashboard loads in <2 seconds for 100 inquiries

## Tasks / Subtasks

- [ ] Task 1: Create GET /api/inquiries Endpoint (AC: #2, #8, #9)
  - [ ] Create GET handler in `/app/api/inquiries/route.ts`
  - [ ] Require authentication (RANCH_OWNER role)
  - [ ] Verify user session with NextAuth
  - [ ] Extract ranchId from authenticated user
  - [ ] Implement query parameters: status filter (UNREAD/RESPONDED/ARCHIVED), page, limit
  - [ ] Fetch inquiries filtered by ranchId (row-level security)
  - [ ] Include related bull data (name, photos) via Prisma include
  - [ ] Sort by createdAt DESC within each status group
  - [ ] Implement pagination (default: 20 per page, max: 100)
  - [ ] Return ListInquiriesResponse with inquiries array and pagination metadata
  - [ ] Handle errors: 401 (unauthorized), 403 (not ranch owner), 500 (server error)
  - [ ] Add database indexes for performance (ranchId, status, createdAt)

- [ ] Task 2: Create Inquiry Dashboard Page (AC: #1, #2, #3, #4, #5, #7)
  - [ ] Create `/app/dashboard/inquiries/page.tsx` as server component
  - [ ] Protect route with middleware (RANCH_OWNER role required)
  - [ ] Fetch inquiries on server side using GET /api/inquiries
  - [ ] Group inquiries by status (Unread, Responded, Archived)
  - [ ] Create status tabs/sections for filtering
  - [ ] Display inquiry list with: bull thumbnail, bull name, breeder name, date, message preview (100 chars)
  - [ ] Implement expandable inquiry details (click to expand)
  - [ ] Show full inquiry details: bull info, breeder contact (name, email, phone), full message, timestamp
  - [ ] Sort inquiries by date (newest first) within each group
  - [ ] Style with Tailwind CSS (mobile-responsive)

- [ ] Task 3: Implement Pagination (AC: #8, #9)
  - [ ] Add pagination controls (Previous, Next, page numbers)
  - [ ] Update URL query params on page change (?page=2)
  - [ ] Fetch new page data from API
  - [ ] Display current page and total pages
  - [ ] Disable Previous on first page, Next on last page
  - [ ] Maintain status filter across pagination

- [ ] Task 4: Add Unread Badge to Navigation (AC: #6)
  - [ ] Create API endpoint or helper to get unread count
  - [ ] Fetch unread count for dashboard navigation
  - [ ] Display badge with count next to "Inquiries" link
  - [ ] Update badge when inquiries are marked as read/responded
  - [ ] Style badge (red circle with white text)

- [ ] Task 5: Optimize Performance (AC: #9)
  - [ ] Add database indexes: ranchId, status, createdAt
  - [ ] Use Prisma select to fetch only needed fields
  - [ ] Implement efficient pagination queries
  - [ ] Test load time with 100 inquiries (target: <2 seconds)
  - [ ] Consider caching unread count

- [ ] Task 6: Testing (AC: #1-9)
  - [ ] Integration test: GET /api/inquiries returns only ranch owner's inquiries
  - [ ] Integration test: Unauthorized user → 401 response
  - [ ] Integration test: BREEDER role → 403 response
  - [ ] Integration test: Status filter works (UNREAD, RESPONDED, ARCHIVED)
  - [ ] Integration test: Pagination returns correct page
  - [ ] Performance test: Dashboard loads in <2 seconds with 100 inquiries
  - [ ] Manual test: Login as ranch owner, navigate to /dashboard/inquiries
  - [ ] Manual test: Verify inquiries grouped by status
  - [ ] Manual test: Click inquiry to expand details
  - [ ] Manual test: Verify unread badge shows correct count
  - [ ] Manual test: Test pagination (navigate pages)
  - [ ] Manual test: Verify mobile responsiveness

## Dev Notes

### Requirements Context

**From Tech Spec Epic 5 (tech-spec-epic-5.md):**
- API endpoint: GET /api/inquiries with authentication required (RANCH_OWNER role)
- Authorization: User can only access inquiries for their own ranch (row-level security)
- Query parameters: status (optional), page (default: 1), limit (default: 20, max: 100)
- Response includes: inquiries array with bull details, pagination metadata
- Performance target: <2 seconds for 100 inquiries
- Database indexes on ranchId, status, createdAt for query optimization

**From Epics (epics.md - Story 5.3):**
- Dashboard at `/dashboard/inquiries`
- List shows: date, breeder name/contact, bull name, message preview, status
- Filter by status (All, Unread, Responded, Archived)
- Click to view full details
- Mark as responded or archived (handled in Story 5.4)
- Unread count badge in navigation
- Paginated (20 per page)
- Sort by date (newest first)

**Architecture Constraints:**
- Multi-tenant data isolation (ranch owners see only their inquiries)
- Row-level security enforced in API routes
- Server Components for initial page loads
- Client Components for interactivity (expand/collapse, filters)
- RESTful API conventions
- Mobile-first responsive design

### Learnings from Previous Stories

**From Story 5-1 (Status: drafted)**
- Inquiry model created with fields: id, bullId, ranchId, breederName, breederEmail, breederPhone, message, status, internalNotes, respondedAt, timestamps
- InquiryStatus enum: UNREAD, RESPONDED, ARCHIVED
- Indexes on ranchId, bullId, status, createdAt
- POST /api/inquiries creates inquiries with status=UNREAD

**From Story 5-2 (Status: drafted)**
- Email notifications sent to ranch owners on inquiry submission
- Ranch owner email fetched from Ranch model
- Email includes link to inquiry dashboard (`/dashboard/inquiries`)

**Implications for Story 5.3:**
- Use existing Inquiry model and relationships
- Fetch inquiries via ranchId from authenticated user session
- Dashboard is the destination for email notification links
- Status filtering uses existing InquiryStatus enum values
- Leverage existing indexes for performance

**From Story 4-4d (Status: done)**
- Notification history management patterns established
- Dashboard UI patterns for listing and filtering
- Pagination patterns available as reference

### Project Structure Notes

**Existing Patterns:**
- Dashboard pages: `/app/dashboard/[page]/page.tsx` pattern
- Authentication: NextAuth.js session management
- Authorization: Middleware protects routes by role
- API routes: GET handlers with query params
- Pagination: URL query params (?page=2&status=UNREAD)

**Files to Create:**
- `app/dashboard/inquiries/page.tsx` - Inquiry dashboard page (server component)
- `components/InquiryList.tsx` - Inquiry list component (client component for interactivity)
- `components/InquiryCard.tsx` - Individual inquiry card with expand/collapse

**Files to Modify:**
- `app/api/inquiries/route.ts` - Add GET handler for fetching inquiries
- Dashboard navigation component - Add "Inquiries" link with unread badge
- `middleware.ts` - Verify `/dashboard/inquiries` is protected

**Dependencies:**
- `@prisma/client` - Database queries
- `next-auth` - Session management
- `date-fns` - Date formatting for timestamps
- Tailwind CSS - Styling

### References

- [Source: docs/tech-spec-epic-5.md#APIs and Interfaces - GET /api/inquiries]
- [Source: docs/tech-spec-epic-5.md#Workflows and Sequencing - Workflow 3]
- [Source: docs/tech-spec-epic-5.md#Non-Functional Requirements - Performance]
- [Source: docs/tech-spec-epic-5.md#Acceptance Criteria - AC-5.3]
- [Source: docs/epics.md#Epic 5 - Story 5.3]
- [Source: docs/stories/5-1-inquiry-contact-form.md#Tasks - Inquiry Model]
- [Source: docs/stories/5-2-inquiry-email-notifications-to-ranch-owners.md#Tasks - Dashboard Link]

## Dev Agent Record

### Context Reference

docs/stories/5-3-inquiry-dashboard-for-ranch-owners.context.xml

### Agent Model Used

<!-- To be filled during implementation -->

### Debug Log References

<!-- To be filled during implementation -->

### Completion Notes List

<!-- To be filled during implementation -->

### File List

<!-- To be filled during implementation -->
