# Story 3.1: Public Bull Browse Page with Card Grid

**Epic:** 3 - Bull Discovery & Browsing  
**Story ID:** 3-1-public-bull-browse-page-with-card-grid  
**Status:** backlog  
**Created:** 2025-11-11  
**Developer:** 

---

## User Story

As a **breeder (guest or logged in)**,
I want to browse all published bulls in a visual card grid,
So that I can discover available bulls and evaluate breeding options.

---

## Acceptance Criteria

### AC1: Card Grid Layout
**Given** I navigate to the public bulls browse page  
**When** the page loads  
**Then** I should see:
- Responsive card grid (4 columns desktop, 2 tablet, 1 mobile)
- Each card displays: Hero photo, bull name, breed, ranch name
- Cards are visually appealing with consistent styling
- Smooth loading with skeleton states

**And** cards should be clickable to view bull details

### AC2: Bull Card Content
**Given** a bull card is displayed  
**When** I view the card  
**Then** I should see:
- Hero image (optimized, lazy loaded)
- Bull name (prominent)
- Breed
- Ranch name (linked to ranch profile)
- Key EPD highlights (Birth Weight, Weaning Weight, Yearling Weight)
- Semen availability indicator (In Stock / Limited / Sold Out)

**And** images should have fallback for missing photos

### AC3: Pagination
**Given** there are more than 20 bulls  
**When** I scroll to the bottom of the page  
**Then** I should see:
- Pagination controls (Previous, Page numbers, Next)
- Current page highlighted
- 20 bulls per page
- Smooth page transitions

**And** URL should update with page number for bookmarking

### AC4: Default Sorting
**Given** I visit the browse page  
**When** the page loads  
**Then** bulls should be sorted by:
- Recently published first (newest to oldest)
- Only PUBLISHED and non-archived bulls shown

**And** archived bulls should never appear in public browse

### AC5: Empty State
**Given** there are no published bulls  
**When** the page loads  
**Then** I should see:
- Friendly empty state message
- Suggestion to check back later
- No broken layout or errors

### AC6: Performance
**Given** the page loads  
**When** I measure performance  
**Then** I should see:
- Initial page load < 2 seconds
- Images lazy load as I scroll
- Smooth scrolling with no jank
- Optimized database queries (eager loading ranch data)

---

## Tasks / Subtasks

**Task 1: Create Public Browse Page Route (AC1, AC4)**
- [ ] Create `/app/bulls/page.tsx` (public route)
- [ ] Set up server-side data fetching
- [ ] Implement responsive grid layout (Tailwind grid)
- [ ] Add skeleton loading states
- [ ] Test page renders correctly

**Task 2: Create Bull Card Component (AC2)**
- [ ] Create `components/BullCard.tsx` (reusable)
- [ ] Display hero image with Next.js Image optimization
- [ ] Show bull name, breed, ranch name
- [ ] Display key EPD values (BW, WW, YW)
- [ ] Add availability indicator with color coding
- [ ] Implement fallback image for missing photos
- [ ] Make card clickable (link to bull detail)
- [ ] Test card displays all data correctly

**Task 3: Implement Pagination (AC3)**
- [ ] Add pagination controls component
- [ ] Implement page state management
- [ ] Update URL with page parameter
- [ ] Fetch bulls for current page (limit 20)
- [ ] Handle edge cases (first page, last page)
- [ ] Test pagination navigation

**Task 4: Create API Route for Bulls List (AC1, AC4, AC6)**
- [ ] Create `/api/bulls/public/route.ts`
- [ ] Query only PUBLISHED and non-archived bulls
- [ ] Implement pagination (skip/take)
- [ ] Sort by createdAt DESC (newest first)
- [ ] Eager load ranch data (avoid N+1 queries)
- [ ] Return total count for pagination
- [ ] Test API returns correct data

**Task 5: Handle Empty State (AC5)**
- [ ] Create empty state component
- [ ] Show when no bulls found
- [ ] Add friendly messaging
- [ ] Test empty state displays correctly

**Task 6: Performance Optimization (AC6)**
- [ ] Implement lazy loading for images
- [ ] Add image optimization (Next.js Image)
- [ ] Optimize database queries (select only needed fields)
- [ ] Add caching headers for API responses
- [ ] Test page load performance
- [ ] Verify smooth scrolling

---

## Technical Notes

### Implementation Guidance

**Route Structure:**
- Public route: `/bulls` (no authentication required)
- Server component for initial data fetch
- Client component for interactivity

**Database Query:**
```typescript
const bulls = await prisma.bull.findMany({
  where: {
    status: 'PUBLISHED',
    archived: false,
  },
  include: {
    ranch: {
      select: {
        name: true,
        slug: true,
      },
    },
  },
  orderBy: {
    createdAt: 'desc',
  },
  skip: (page - 1) * 20,
  take: 20,
});
```

**EPD Display:**
- Show only top 3 EPDs: Birth Weight, Weaning Weight, Yearling Weight
- Format: "BW: +2.5 | WW: +45 | YW: +80"
- Use epdData JSON field

**Availability Logic:**
```typescript
const availability = 
  bull.semenAvailable === 0 ? 'Sold Out' :
  bull.semenAvailable < 10 ? 'Limited' :
  'In Stock';
```

**Image Optimization:**
- Use Next.js Image component
- Lazy load with `loading="lazy"`
- Cloudinary URLs already optimized
- Fallback: Generic bull silhouette

### Affected Components
- New: `/app/bulls/page.tsx`
- New: `/components/BullCard.tsx`
- New: `/components/Pagination.tsx`
- New: `/api/bulls/public/route.ts`

### Dependencies
- Next.js 14 App Router
- Prisma (Bull, Ranch models)
- Tailwind CSS for styling
- Next.js Image for optimization

### Edge Cases
- No bulls published yet
- Missing hero images
- Very long bull/ranch names
- Slow network (loading states)
- Large number of bulls (pagination)

---

## Prerequisites

**Required:**
- Epic 2 complete (bulls can be created and published)
- Bull model has all required fields
- Ranch model exists and is linked

**Data Requirements:**
- At least 1 published bull for testing
- Bulls have heroImage set
- Bulls linked to ranch profiles

---

## Definition of Done

- [ ] Public browse page accessible at `/bulls`
- [ ] Card grid displays all published bulls
- [ ] Pagination works correctly
- [ ] Cards show all required information
- [ ] Images load and display properly
- [ ] Empty state handles no bulls gracefully
- [ ] Page loads in < 2 seconds
- [ ] Responsive on mobile, tablet, desktop
- [ ] No console errors
- [ ] Code reviewed and approved
- [ ] Tested with real data

---

## Dev Agent Record

### Context Reference

(To be created by Scrum Master)

### Agent Model Used

(To be filled during implementation)

### Debug Log References

(To be filled during implementation)

### Completion Notes List

(To be filled during implementation)

### File List

(To be filled during implementation)
