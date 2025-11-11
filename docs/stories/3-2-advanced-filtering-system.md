# Story 3.2: Advanced Filtering System

**Epic:** 3 - Bull Discovery & Browsing  
**Story ID:** 3-2-advanced-filtering-system  
**Status:** backlog  
**Created:** 2025-11-11  
**Developer:** 

---

## User Story

As a **breeder**,
I want to filter bulls by multiple criteria (breed, EPDs, location, price, availability),
So that I can narrow down to bulls that match my specific breeding goals.

---

## Acceptance Criteria

### AC1: Breed Filter
**Given** I am on the bulls browse page  
**When** I open the breed filter  
**Then** I should see:
- Multi-select dropdown with all available breeds
- Checkbox for each breed
- "Select All" and "Clear All" options
- Count of bulls per breed

**And** when I select breeds, the bull list updates instantly

### AC2: EPD Range Filters
**Given** I want to filter by genetic traits  
**When** I use EPD range sliders  
**Then** I should see:
- Sliders for: Birth Weight, Weaning Weight, Yearling Weight
- Min and max values displayed
- Current range values shown
- Sliders update smoothly

**And** bulls outside the range are filtered out immediately

### AC3: Location Filter
**Given** I want to find bulls in specific regions  
**When** I use the location filter  
**Then** I should see:
- Dropdown of US states
- Multi-select capability
- Option to select "All States"

**And** only bulls from ranches in selected states appear

### AC4: Availability Filter
**Given** I want to see only available bulls  
**When** I toggle availability filters  
**Then** I should see:
- "In Stock" toggle
- "Limited Stock" toggle
- "Sold Out" toggle (default off)

**And** bulls are filtered by semen availability status

### AC5: Price Range Filter
**Given** I have a budget  
**When** I use the price range slider  
**Then** I should see:
- Min and max price inputs
- Slider for visual adjustment
- Option to include bulls with no price listed

**And** only bulls within price range are shown

### AC6: Filter Interactions
**Given** I have applied multiple filters  
**When** I interact with the page  
**Then** I should see:
- All filters work together (AND logic)
- Filter state persists during session
- URL updates with filter parameters
- "Clear All Filters" button visible when filters active
- Count of active filters shown

**And** filters apply instantly without page reload

### AC7: Filter Persistence
**Given** I have applied filters  
**When** I navigate to a bull detail and return  
**Then** my filters should still be applied

**And** when I share the URL, filters are included

---

## Tasks / Subtasks

**Task 1: Create Filter UI Component (AC1-AC5)**
- [ ] Create `components/BullFilters.tsx`
- [ ] Design filter panel layout (sidebar or top bar)
- [ ] Implement breed multi-select dropdown
- [ ] Create EPD range sliders (3 sliders)
- [ ] Add location dropdown (US states)
- [ ] Create availability toggles
- [ ] Add price range slider
- [ ] Style filters for mobile responsiveness
- [ ] Test all filter controls work

**Task 2: Implement Filter State Management (AC6)**
- [ ] Set up React state for all filters
- [ ] Create filter context or use URL params
- [ ] Implement "Clear All Filters" functionality
- [ ] Show active filter count badge
- [ ] Handle filter combinations (AND logic)
- [ ] Test state updates correctly

**Task 3: Update API to Support Filters (AC1-AC5)**
- [ ] Modify `/api/bulls/public/route.ts`
- [ ] Add query parameters for all filters
- [ ] Implement breed filtering (WHERE breed IN)
- [ ] Add EPD range filtering (JSON field queries)
- [ ] Implement location filtering (JOIN ranch, filter by state)
- [ ] Add availability filtering (semenAvailable ranges)
- [ ] Implement price filtering (WHERE price BETWEEN)
- [ ] Test API with various filter combinations

**Task 4: Implement Real-time Filtering (AC6)**
- [ ] Debounce filter changes (300ms)
- [ ] Update bull list on filter change
- [ ] Show loading state during filter
- [ ] Handle empty results gracefully
- [ ] Test instant filter updates

**Task 5: URL Parameter Sync (AC6, AC7)**
- [ ] Encode filters in URL query params
- [ ] Parse URL params on page load
- [ ] Update URL when filters change
- [ ] Enable shareable filtered URLs
- [ ] Test URL persistence and sharing

**Task 6: Filter Persistence (AC7)**
- [ ] Store filter state in session storage
- [ ] Restore filters on page return
- [ ] Clear filters on explicit user action
- [ ] Test filter persistence across navigation

**Task 7: Mobile Optimization**
- [ ] Create mobile filter drawer/modal
- [ ] Add "Show Filters" button on mobile
- [ ] Ensure filters are usable on small screens
- [ ] Test mobile filter experience

---

## Technical Notes

### Implementation Guidance

**Filter State Structure:**
```typescript
interface BullFilters {
  breeds: string[];
  epdRanges: {
    birthWeight: { min: number; max: number };
    weaningWeight: { min: number; max: number };
    yearlingWeight: { min: number; max: number };
  };
  states: string[];
  availability: ('in-stock' | 'limited' | 'sold-out')[];
  priceRange: { min: number; max: number };
  includeNoPriceListings: boolean;
}
```

**API Query Example:**
```typescript
const bulls = await prisma.bull.findMany({
  where: {
    status: 'PUBLISHED',
    archived: false,
    ...(breeds.length > 0 && { breed: { in: breeds } }),
    ...(states.length > 0 && {
      ranch: { state: { in: states } }
    }),
    ...(priceRange && {
      OR: [
        { price: { gte: priceRange.min, lte: priceRange.max } },
        ...(includeNoPriceListings ? [{ price: null }] : [])
      ]
    }),
    // EPD filtering requires JSON field queries
    ...(epdRanges && {
      epdData: {
        path: ['birthWeight'],
        gte: epdRanges.birthWeight.min,
        lte: epdRanges.birthWeight.max,
      }
    }),
  },
  include: { ranch: true },
});
```

**EPD Range Defaults:**
- Birth Weight: -5 to +10
- Weaning Weight: -20 to +80
- Yearling Weight: -30 to +120

**Availability Logic:**
```typescript
const availabilityFilter = availability.map(status => {
  if (status === 'in-stock') return { semenAvailable: { gte: 10 } };
  if (status === 'limited') return { semenAvailable: { gte: 1, lt: 10 } };
  if (status === 'sold-out') return { semenAvailable: 0 };
});
```

**URL Encoding:**
- Use URLSearchParams for filter encoding
- Example: `/bulls?breeds=Angus,Hereford&state=TX&minPrice=50`

### Affected Components
- Modified: `/app/bulls/page.tsx`
- New: `/components/BullFilters.tsx`
- Modified: `/api/bulls/public/route.ts`
- New: `/hooks/useBullFilters.ts` (optional)

### Dependencies
- React state management (useState, useEffect)
- Next.js router (useRouter, useSearchParams)
- Prisma JSON field queries
- Tailwind CSS for styling
- Optional: React Hook Form for complex filter forms

### Edge Cases
- No bulls match filter criteria
- Invalid filter values in URL
- Extremely narrow filter combinations
- Performance with many filters active
- Mobile filter UX

---

## Prerequisites

**Required:**
- Story 3.1 complete (browse page exists)
- Bull model has epdData JSON field
- Ranch model has state field
- Bulls have price and semenAvailable fields

**Data Requirements:**
- Bulls with varied breeds
- Bulls with EPD data
- Ranches in different states
- Bulls with various price points

---

## Definition of Done

- [ ] All filter types implemented and functional
- [ ] Filters work together with AND logic
- [ ] Real-time filtering without page reload
- [ ] URL parameters sync with filters
- [ ] Filter state persists in session
- [ ] "Clear All Filters" works correctly
- [ ] Empty state shows when no results
- [ ] Mobile filter experience is usable
- [ ] Performance is acceptable (< 500ms filter response)
- [ ] No console errors
- [ ] Code reviewed and approved
- [ ] Tested with various filter combinations

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
