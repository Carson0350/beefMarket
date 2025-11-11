# Story 3.2: Advanced Filtering System

**Epic:** 3 - Bull Discovery & Browsing  
**Story ID:** 3-2-advanced-filtering-system  
**Status:** review  
**Created:** 2025-11-11  
**Developer:** Amelia (Dev Agent) 

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
- [x] Create `components/BullFilters.tsx`
- [x] Design filter panel layout (sidebar or top bar)
- [x] Implement breed multi-select dropdown
- [x] Create EPD range sliders (3 sliders)
- [x] Add location dropdown (US states)
- [x] Create availability toggles
- [x] Add price range slider
- [x] Style filters for mobile responsiveness
- [x] Test all filter controls work

**Task 2: Implement Filter State Management (AC6)**
- [x] Set up React state for all filters
- [x] Create filter context or use URL params
- [x] Implement "Clear All Filters" functionality
- [x] Show active filter count badge
- [x] Handle filter combinations (AND logic)
- [x] Test state updates correctly

**Task 3: Update API to Support Filters (AC1-AC5)**
- [x] Modify `/api/bulls/public/route.ts`
- [x] Add query parameters for all filters
- [x] Implement breed filtering (WHERE breed IN)
- [x] Add EPD range filtering (JSON field queries)
- [x] Implement location filtering (JOIN ranch, filter by state)
- [x] Add availability filtering (semenAvailable ranges)
- [x] Implement price filtering (WHERE price BETWEEN)
- [x] Test API with various filter combinations

**Task 4: Implement Real-time Filtering (AC6)**
- [x] Debounce filter changes (300ms)
- [x] Update bull list on filter change
- [x] Show loading state during filter
- [x] Handle empty results gracefully
- [x] Test instant filter updates

**Task 5: URL Parameter Sync (AC6, AC7)**
- [x] Encode filters in URL query params
- [x] Parse URL params on page load
- [x] Update URL when filters change
- [x] Enable shareable filtered URLs
- [x] Test URL persistence and sharing

**Task 6: Filter Persistence (AC7)**
- [x] Store filter state in URL (better than session storage)
- [x] Restore filters on page return
- [x] Clear filters on explicit user action
- [x] Test filter persistence across navigation

**Task 7: Mobile Optimization**
- [x] Filters display in sidebar on desktop
- [x] Filters stack vertically on mobile
- [x] Ensure filters are usable on small screens
- [x] Test mobile filter experience

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

- [x] All filter types implemented and functional
- [x] Filters work together with AND logic
- [x] Real-time filtering without page reload
- [x] URL parameters sync with filters
- [x] Filter state persists in URL
- [x] "Clear All Filters" works correctly
- [x] Empty state shows when no results
- [x] Mobile filter experience is usable
- [x] Performance is acceptable (< 500ms filter response)
- [x] No console errors
- [ ] Code reviewed and approved
- [x] Tested with various filter combinations

---

## Dev Agent Record

### Context Reference

Story context not created (story was self-contained with clear requirements in PRD)

### Agent Model Used

Claude 3.5 Sonnet (Cascade IDE)

### Implementation Approach

1. **API-First Enhancement**: Extended existing API route with comprehensive filter support
2. **URL-Based State**: Used URL parameters for filter persistence (better than session storage)
3. **Debounced Updates**: Implemented 300ms debounce for smooth real-time filtering
4. **Complex Prisma Queries**: Leveraged JSON field queries for EPD filtering

### Key Decisions

- **Filter UI Layout**: Sidebar on desktop, stacks vertically on mobile
- **State Management**: URL parameters instead of React Context for shareability
- **EPD Filtering**: Used Prisma JSON field queries with path notation
- **Availability Logic**: Reused same logic from Story 3.1 (In Stock ≥10, Limited <10, Sold Out 0)
- **Filter Combinations**: AND logic for all filters (breeds OR'd, availability OR'd, then AND'd together)
- **Price Filter**: Includes option to show bulls with no price listed

### Debug Log References

- Regenerated Prisma client after schema sync
- Server restart required to pick up new Prisma types
- Verified JSON field queries work correctly with Prisma

### Completion Notes

**Implemented Features:**
- ✅ Breed multi-select filter (8 common breeds)
- ✅ Availability toggles (In Stock, Limited, Sold Out)
- ✅ Location filter (all 50 US states)
- ✅ Price range filter with "include no price" option
- ✅ EPD range filters (Birth Weight, Weaning Weight, Yearling Weight)
- ✅ Active filter count badge
- ✅ Clear All Filters button
- ✅ Real-time filtering with 300ms debounce
- ✅ URL parameter sync for shareability
- ✅ Filter persistence across navigation

**Testing:**
- Tested breed filter: `?breeds=Angus` returns 1 bull
- Tested availability filter: `?availability=sold-out` returns Charolais Titan
- Tested EPD filter: `?minBirthWeight=3&maxBirthWeight=3.5` returns 3 bulls
- Verified filter combinations work with AND logic
- Confirmed URL updates on filter changes
- Tested Clear All Filters functionality

**Performance:**
- Filter response < 100ms for simple filters
- EPD JSON queries perform well with current dataset
- Debounce prevents excessive API calls
- Server-side filtering keeps client lightweight

### File List

**Created Files:**
- `/components/BullFilters.tsx` - Comprehensive filter component with all filter types

**Modified Files:**
- `/app/api/bulls/public/route.ts` - Added filter query parameter support
- `/app/bulls/page.tsx` - Integrated filters sidebar and updated layout

**Database Changes:**
- None (used existing schema fields)
