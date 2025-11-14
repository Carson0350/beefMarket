# Story 5.4: Inquiry Response Tracking

**Epic:** 5 - Inquiry & Communication  
**Story ID:** 5-4-inquiry-response-tracking  
**Status:** ready-for-dev  
**Created:** 2025-11-14

---

## User Story

As a **ranch owner**,
I want to mark inquiries as responded or archived and add internal notes,
So that I can track which inquiries I've handled and keep my inquiry list organized.

---

## Acceptance Criteria

### AC-5.4.1: Mark as Responded
- Ranch owner can mark inquiry as "RESPONDED"
- respondedAt timestamp is set automatically
- Inquiry moves to "Responded" section

### AC-5.4.2: Reply via Email Button
- "Reply via Email" button opens email client
- Pre-filled: To (breeder email), Subject, Body template

### AC-5.4.3: Responded Timestamp
- Display respondedAt in readable format
- Show relative time for recent responses

### AC-5.4.4: Add Internal Notes
- Textarea for internal notes (max 1000 chars)
- Notes visible only to ranch owner
- Editable at any time

### AC-5.4.5: Archive Inquiry
- Ranch owner can archive inquiries
- Archived inquiries move to "Archived" section

### AC-5.4.6: Archived Inquiries Accessible
- Archived inquiries viewable in Archived section
- Full details still accessible

### AC-5.4.7: Status Changes Reflected Immediately
- UI updates without page reload
- Count badges update instantly

### AC-5.4.8: Filter by Status
- Filter dropdown for Unread/Responded/Archived/All
- Filter persists in URL query params

---

## Tasks

- [ ] Create PATCH /api/inquiries/[id] endpoint
- [ ] Add status update buttons (Responded, Archive)
- [ ] Implement Reply via Email button (mailto link)
- [ ] Display respondedAt timestamp
- [ ] Add internal notes field with save
- [ ] Implement status filtering
- [ ] Optimize UI updates (optimistic updates)
- [ ] Testing (unit, integration, authorization)

---

## Dev Notes

**API Route:** `/app/api/inquiries/[id]/route.ts` - PATCH handler for status and notes updates

**Components:** Enhance InquiryCard with action buttons, notes field, email button

**Authorization:** Verify ranch ownership before allowing updates

**References:**
- [Source: docs/tech-spec-epic-5.md#APIs > PATCH /api/inquiries/[id]]
- [Source: docs/tech-spec-epic-5.md#Workflows > Workflow 4: Ranch Owner Responds]

---

## Dev Agent Record

### Context Reference

- `docs/stories/5-4-inquiry-response-tracking.context.xml` - Story context with acceptance criteria, tasks, documentation references, code artifacts, interfaces, constraints, and testing guidance
