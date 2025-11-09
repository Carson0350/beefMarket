# Story 2.6: Ranch Dashboard & Bull Management

**Epic:** 2 - Ranch Owner Onboarding  
**Story ID:** 2-6-ranch-dashboard-bull-management  
**Status:** ready-for-dev  
**Created:** 2025-11-07  
**Developer:** 

---

## User Story

As a **ranch owner**,
I want a dashboard showing all my bulls with edit and archive capabilities,
So that I can manage my inventory and keep information current.

---

## Acceptance Criteria

**AC1: Dashboard Overview**
- Dashboard displays all bulls (published, draft, archived) in grid/list view
- Each bull card shows: hero photo, name, breed, status badge, semen count
- Filter tabs: All, Published, Draft, Archived
- Search box to filter bulls by name or breed
- "Add New Bull" button prominently displayed

**AC2: Ranch Information Display**
- Dashboard header shows ranch name and public URL
- "Copy Link" button copies ranch URL to clipboard
- Ranch statistics displayed: total bulls, active listings, draft count
- Link to edit ranch profile

**AC3: Bull Management Actions**
- "Edit" button on each bull opens edit form
- "Archive" button changes bull status to ARCHIVED
- "Unarchive" button restores archived bulls to PUBLISHED
- "Delete" button permanently removes bull (with confirmation)
- Actions available via dropdown menu or buttons

**AC4: Edit Bull Flow**
- Edit form reuses creation form components
- Form pre-populated with existing bull data
- All three steps accessible (basic info, genetic data, performance)
- Changes saved to existing bull record
- Success message after update

**AC5: Archive Functionality**
- Archived bulls hidden from public ranch page
- Archived bulls visible in dashboard with "Archived" badge
- Archived bulls can be unarchived
- Archive action requires confirmation

---

## Tasks / Subtasks

**Task 1: Create Dashboard Page Layout (AC1, AC2)**
- [ ] Create `/dashboard/page.tsx` (protected route, ranch owners only)
- [ ] Design dashboard header with ranch info and stats
- [ ] Create bulls grid/list component
- [ ] Add filter tabs (All, Published, Draft, Archived)
- [ ] Add search functionality
- [ ] Display "Add New Bull" button
- [ ] Test dashboard layout and navigation

**Task 2: Implement Bull Cards (AC1)**
- [ ] Create `components/BullCard.tsx` component
- [ ] Display hero photo, name, breed, status badge
- [ ] Show semen count
- [ ] Add action buttons/dropdown
- [ ] Style status badges (different colors for each status)
- [ ] Test bull card display

**Task 3: Create Ranch Statistics Component (AC2)**
- [ ] Fetch bull counts by status
- [ ] Display total bulls, active listings, drafts
- [ ] Add ranch URL with copy button
- [ ] Implement clipboard copy functionality
- [ ] Show success toast on copy
- [ ] Test statistics display

**Task 4: Implement Filter and Search (AC1)**
- [ ] Create filter state management
- [ ] Implement tab filtering by status
- [ ] Implement search by name/breed
- [ ] Update bull list based on filters
- [ ] Test filtering and search

**Task 5: Create Edit Bull Flow (AC3, AC4)**
- [ ] Create `/bulls/[id]/edit/page.tsx`
- [ ] Reuse form components from creation flow
- [ ] Fetch existing bull data
- [ ] Pre-populate form with bull data
- [ ] Update API route to handle updates
- [ ] Test edit flow with all three steps

**Task 6: Implement Archive Functionality (AC3, AC5)**
- [ ] Add archive confirmation modal
- [ ] Create `/api/bulls/[id]/archive` endpoint
- [ ] Update bull status to ARCHIVED
- [ ] Create unarchive endpoint
- [ ] Update public ranch page to exclude archived bulls
- [ ] Test archive and unarchive

**Task 7: Implement Delete Functionality (AC3)**
- [ ] Add delete confirmation modal with warning
- [ ] Create `/api/bulls/[id]/delete` endpoint (or use DELETE method)
- [ ] Permanently delete bull record
- [ ] Delete associated Cloudinary images
- [ ] Show success message
- [ ] Test delete with confirmation

**Task 8: Update Public Ranch Page (AC5)**
- [ ] Modify `/ranch/[slug]/page.tsx`
- [ ] Filter out archived bulls from display
- [ ] Only show PUBLISHED bulls
- [ ] Test public page excludes archived bulls

**Task 9: Testing (All ACs)**
- [ ] Unit test: Filter and search logic
- [ ] Unit test: Statistics calculation
- [ ] Integration test: Complete dashboard functionality
- [ ] Integration test: Edit bull flow
- [ ] Integration test: Archive/unarchive/delete flows
- [ ] Manual test: Complete ranch owner workflow

---

## Dev Notes

### Learnings from Previous Stories

**From Story 2-5-bull-profile-creation-form-performance-inventory (Status: drafted)**

- **Bull Creation**: Three-step form with all bull data
- **Public Pages**: Bulls visible at `/bulls/[id]`
- **Ranch Page**: Bulls displayed on `/ranch/[slug]`
- **Status System**: DRAFT, PUBLISHED, SOLD, ARCHIVED

**From Story 2-3-bull-profile-creation-form-basic-info-photos (Status: drafted)**

- **Form Components**: Reusable form step components
- **Form State**: Context or Zustand for multi-step forms
- **Image Management**: Cloudinary integration for photos

[Sources: docs/stories/2-5-bull-profile-creation-form-performance-inventory.md, docs/stories/2-3-bull-profile-creation-form-basic-info-photos.md]

### Architecture & Technical Approach

**Dashboard Layout:**
```
┌─────────────────────────────────────────┐
│ Wagner Ranch              [Copy Link]   │
│ 12 Bulls | 10 Active | 2 Drafts        │
├─────────────────────────────────────────┤
│ [All] [Published] [Draft] [Archived]   │
│ [Search...] [+ Add New Bull]           │
├─────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐            │
│ │ Bull │ │ Bull │ │ Bull │            │
│ │ Card │ │ Card │ │ Card │            │
│ └──────┘ └──────┘ └──────┘            │
└─────────────────────────────────────────┘
```

**Bull Status Management:**
- DRAFT: Visible only to owner, editable
- PUBLISHED: Visible publicly, editable
- ARCHIVED: Hidden publicly, visible to owner, can unarchive
- SOLD: Special archived state (future enhancement)

**Edit vs Create:**
- Reuse same form components
- Differentiate by presence of bull ID in URL
- Pre-populate form if editing
- Update vs Create API endpoints

**Clipboard Copy:**
```javascript
navigator.clipboard.writeText(ranchUrl);
// Show toast notification
```

### Project Structure Alignment

**Files to Create:**
- `app/dashboard/page.tsx` - Main dashboard
- `components/BullCard.tsx` - Bull display card
- `components/RanchStats.tsx` - Statistics component
- `components/ConfirmModal.tsx` - Reusable confirmation modal
- `app/bulls/[id]/edit/page.tsx` - Edit bull page
- `app/api/bulls/[id]/archive/route.ts` - Archive endpoint
- `app/api/bulls/[id]/route.ts` - Update and delete endpoints

**Files to Modify:**
- `app/ranch/[slug]/page.tsx` - Filter archived bulls
- `middleware.ts` - Protect dashboard routes

**Database:**
- No schema changes needed (Bull model already has status field)

### References

- **Epic Definition**: `docs/epics.md#Epic-2-Story-2.6`
- **Previous Stories**: 
  - `docs/stories/2-5-bull-profile-creation-form-performance-inventory.md`
  - `docs/stories/2-3-bull-profile-creation-form-basic-info-photos.md`
- **Prisma Schema**: `prisma/schema.prisma` (Bull model)

---

## Dev Agent Record

### Context Reference

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
