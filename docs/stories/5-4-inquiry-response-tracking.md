# Story 5.4: Inquiry Response Tracking

Status: drafted

## Story

As a **ranch owner**,
I want to mark inquiries as responded and add notes,
so that I can track my follow-up activities.

## Acceptance Criteria

1. Ranch owner can mark inquiry as "Responded" from inquiry detail view
2. "Reply via Email" button opens default email client with pre-filled recipient and subject
3. Marking as responded sets respondedAt timestamp
4. Ranch owner can add internal notes (visible only to them)
5. Ranch owner can archive inquiries to hide from main view
6. Archived inquiries remain accessible via "Archived" filter
7. Status changes are reflected immediately in the UI
8. Inquiry list can be filtered by status (Unread/Responded/Archived)

## Tasks / Subtasks

- [ ] Task 1: Create PATCH /api/inquiries/[id] Endpoint (AC: #1, #3, #4, #5, #7)
  - [ ] Create `/app/api/inquiries/[id]/route.ts` with PATCH handler
  - [ ] Require authentication (RANCH_OWNER role)
  - [ ] Extract inquiry ID from path parameters
  - [ ] Verify user owns the inquiry (ranchId matches user's ranch)
  - [ ] Implement Zod validation for UpdateInquiryRequest (status, internalNotes)
  - [ ] Validate status: must be RESPONDED or ARCHIVED
  - [ ] Validate internalNotes: max 1000 characters
  - [ ] Update inquiry record in database
  - [ ] Set respondedAt timestamp when status changes to RESPONDED
  - [ ] Return 200 OK with updated inquiry object
  - [ ] Handle errors: 400 (validation), 401 (unauthorized), 403 (not owner), 404 (not found), 500 (server error)

- [ ] Task 2: Add Status Update UI to Inquiry Detail View (AC: #1, #3, #7)
  - [ ] Add "Mark as Responded" button to inquiry detail view
  - [ ] Add "Archive" button to inquiry detail view
  - [ ] Implement click handlers to call PATCH /api/inquiries/[id]
  - [ ] Show loading state during API call
  - [ ] Update UI immediately on success (optimistic update)
  - [ ] Display success message: "Inquiry marked as responded" or "Inquiry archived"
  - [ ] Move inquiry to appropriate status section
  - [ ] Handle API errors with error messages

- [ ] Task 3: Implement "Reply via Email" Button (AC: #2)
  - [ ] Add "Reply via Email" button to inquiry detail view
  - [ ] Generate mailto link with pre-filled data:
    - To: breeder email
    - Subject: "Re: Inquiry about [Bull Name]"
    - Body: Optional pre-filled greeting
  - [ ] Open default email client on button click
  - [ ] Test on multiple browsers and operating systems

- [ ] Task 4: Add Internal Notes Field (AC: #4)
  - [ ] Add textarea for internal notes in inquiry detail view
  - [ ] Display existing notes if present
  - [ ] Add "Save Notes" button
  - [ ] Call PATCH /api/inquiries/[id] with internalNotes on save
  - [ ] Show character count (max 1000 characters)
  - [ ] Display success message on save
  - [ ] Handle validation errors (max length exceeded)

- [ ] Task 5: Implement Status Filtering (AC: #8)
  - [ ] Add status filter tabs/buttons (All, Unread, Responded, Archived)
  - [ ] Update URL query params on filter change (?status=UNREAD)
  - [ ] Fetch filtered inquiries from GET /api/inquiries
  - [ ] Highlight active filter
  - [ ] Maintain filter across page refreshes (URL state)
  - [ ] Show inquiry count for each status

- [ ] Task 6: Add "Reopen" Functionality (Optional Enhancement)
  - [ ] Allow changing status back to UNREAD if needed
  - [ ] Add "Reopen" button for responded/archived inquiries
  - [ ] Clear respondedAt timestamp when reopening

- [ ] Task 7: Testing (AC: #1-8)
  - [ ] Integration test: PATCH /api/inquiries/[id] updates status to RESPONDED
  - [ ] Integration test: respondedAt timestamp set when status changes to RESPONDED
  - [ ] Integration test: PATCH with internalNotes saves notes correctly
  - [ ] Integration test: Unauthorized user cannot update inquiry → 401
  - [ ] Integration test: Ranch owner cannot update other ranch's inquiry → 403
  - [ ] Integration test: Invalid status value → 400 with error
  - [ ] Integration test: Notes exceeding 1000 chars → 400 with error
  - [ ] Manual test: Mark inquiry as responded → status updates, timestamp set
  - [ ] Manual test: Add internal notes → notes saved and displayed
  - [ ] Manual test: Archive inquiry → moves to Archived section
  - [ ] Manual test: Click "Reply via Email" → email client opens with correct data
  - [ ] Manual test: Filter by status → shows correct inquiries
  - [ ] Manual test: Status changes reflect immediately in UI

## Dev Notes

### Requirements Context

**From Tech Spec Epic 5 (tech-spec-epic-5.md):**
- API endpoint: PATCH /api/inquiries/[id] with authentication required (RANCH_OWNER role)
- Authorization: User can only update inquiries for their own ranch
- Request body: UpdateInquiryRequest with status (RESPONDED/ARCHIVED) and internalNotes (max 1000 chars)
- Side effect: Sets respondedAt timestamp when status changes to RESPONDED
- Response: 200 OK with updated inquiry object

**From Epics (epics.md - Story 5.4):**
- Mark as responded functionality
- Add internal notes (not visible to breeder)
- See response timestamp
- Reopen inquiry if needed
- Notes saved and displayed on detail view

**Architecture Constraints:**
- Row-level security: Verify inquiry ownership before update
- Optimistic UI updates for better UX
- Client-side validation before API call
- Server-side validation is authoritative
- Mobile-responsive design

### Learnings from Previous Stories

**From Story 5-1 (Status: drafted)**
- Inquiry model includes: status (InquiryStatus enum), internalNotes (optional), respondedAt (optional timestamp)
- InquiryStatus enum values: UNREAD, RESPONDED, ARCHIVED
- Inquiry model has ranchId for ownership verification

**From Story 5-2 (Status: drafted)**
- Email notifications include breeder email with reply-to header
- Ranch owners can reply directly via email client

**From Story 5-3 (Status: drafted)**
- Dashboard displays inquiries grouped by status
- Inquiry detail view expands to show full information
- Status filtering implemented in dashboard
- GET /api/inquiries supports status query parameter

**Implications for Story 5.4:**
- Use existing status enum values (RESPONDED, ARCHIVED)
- Leverage existing internalNotes and respondedAt fields
- Update UI to reflect status changes from Story 5.3
- "Reply via Email" uses breeder email from inquiry record
- Status filter from Story 5.3 will show updated inquiries in correct sections

**From Story 4-4b (Status: done)**
- Notification preferences UI patterns for settings/toggles
- Form validation and save patterns

### Project Structure Notes

**Existing Patterns:**
- API routes: Dynamic routes with [id] parameter
- Authorization: Verify ownership via ranchId comparison
- Optimistic updates: Update UI before API response, rollback on error
- Form validation: Zod schemas for request validation

**Files to Create:**
- `app/api/inquiries/[id]/route.ts` - PATCH endpoint for updating inquiries

**Files to Modify:**
- `components/InquiryCard.tsx` or inquiry detail component - Add status update buttons, notes field, reply button
- `app/dashboard/inquiries/page.tsx` - Handle status filter changes

**Dependencies:**
- `@prisma/client` - Database updates
- `next-auth` - Session management
- `zod` - Request validation
- `date-fns` - Timestamp formatting

### References

- [Source: docs/tech-spec-epic-5.md#APIs and Interfaces - PATCH /api/inquiries/[id]]
- [Source: docs/tech-spec-epic-5.md#Workflows and Sequencing - Workflow 4]
- [Source: docs/tech-spec-epic-5.md#Data Models and Contracts - UpdateInquiryRequest]
- [Source: docs/tech-spec-epic-5.md#Acceptance Criteria - AC-5.4]
- [Source: docs/epics.md#Epic 5 - Story 5.4]
- [Source: docs/stories/5-1-inquiry-contact-form.md#Tasks - Inquiry Model Fields]
- [Source: docs/stories/5-3-inquiry-dashboard-for-ranch-owners.md#Tasks - Status Filtering]

## Dev Agent Record

### Context Reference

docs/stories/5-4-inquiry-response-tracking.context.xml

### Agent Model Used

<!-- To be filled during implementation -->

### Debug Log References

<!-- To be filled during implementation -->

### Completion Notes List

<!-- To be filled during implementation -->

### File List

<!-- To be filled during implementation -->
