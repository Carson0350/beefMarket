# Story 3.3: Text Search Functionality

**Epic:** 3 - Bull Discovery & Browsing  
**Story ID:** 3-3-text-search-functionality  
**Status:** backlog  
**Created:** 2025-11-11  
**Developer:** 

---

## User Story

As a **breeder**,
I want to search for bulls by name, registration number, or ranch name,
So that I can quickly find specific bulls or ranches I'm interested in.

---

## Acceptance Criteria

### AC1: Search Input
**Given** I am on the bulls browse page  
**When** I see the search bar  
**Then** I should see:
- Prominent search input field
- Search icon indicator
- Placeholder text: "Search by bull name, registration, or ranch..."
- Clear button (X) when text is entered

**And** search input should be easily accessible on all screen sizes

### AC2: Real-time Search
**Given** I type in the search box  
**When** I enter text  
**Then** I should see:
- Results update as I type (debounced 300ms)
- Loading indicator during search
- No page reload required

**And** search should work with filters already applied

### AC3: Search Fields
**Given** I enter a search query  
**When** the search executes  
**Then** it should search across:
- Bull name (partial match, case-insensitive)
- Registration number (partial match)
- Ranch name (partial match, case-insensitive)

**And** results should match any of these fields (OR logic)

### AC4: Search Results Display
**Given** search results are returned  
**When** I view the results  
**Then** I should see:
- Matching bulls displayed in card grid
- Search term highlighted in bull names
- Count of results shown ("Showing 15 results for 'Angus'")
- Results sorted by relevance

**And** if no results, show helpful empty state

### AC5: Search Persistence
**Given** I have entered a search query  
**When** I navigate away and return  
**Then** my search query should:
- Be preserved in the URL
- Still be active when I return
- Be clearable with the X button

**And** search state should work with filter state

### AC6: Search Performance
**Given** I perform a search  
**When** I measure response time  
**Then** I should see:
- Search results in < 500ms
- Smooth typing experience (no lag)
- Efficient database queries

**And** search should handle large datasets efficiently

---

## Tasks / Subtasks

**Task 1: Create Search UI Component (AC1)**
- [ ] Add search input to bulls browse page
- [ ] Style search bar (prominent, accessible)
- [ ] Add search icon
- [ ] Implement clear button (X)
- [ ] Make responsive for mobile
- [ ] Test search input displays correctly

**Task 2: Implement Search State Management (AC2, AC5)**
- [ ] Add search query to component state
- [ ] Implement debounce (300ms delay)
- [ ] Update URL with search parameter
- [ ] Parse search param on page load
- [ ] Handle clear search action
- [ ] Test state management works

**Task 3: Update API for Search (AC3, AC6)**
- [ ] Modify `/api/bulls/public/route.ts`
- [ ] Add search query parameter
- [ ] Implement case-insensitive partial matching
- [ ] Search across: bull name, registration number
- [ ] Join ranch table for ranch name search
- [ ] Use OR logic for multi-field search
- [ ] Optimize query with indexes
- [ ] Test API search functionality

**Task 4: Implement Search Results Display (AC4)**
- [ ] Show result count
- [ ] Highlight search terms in results (optional)
- [ ] Sort by relevance (exact matches first)
- [ ] Handle empty search results
- [ ] Create empty state component
- [ ] Test results display correctly

**Task 5: Integrate Search with Filters (AC2, AC5)**
- [ ] Combine search with existing filters (AND logic)
- [ ] Ensure search and filters work together
- [ ] Update URL with both search and filter params
- [ ] Test search + filter combinations

**Task 6: Add Loading States (AC2)**
- [ ] Show loading indicator during search
- [ ] Debounce to prevent excessive API calls
- [ ] Handle slow network gracefully
- [ ] Test loading states

**Task 7: Performance Optimization (AC6)**
- [ ] Add database indexes on searchable fields
- [ ] Implement query optimization
- [ ] Test with large datasets
- [ ] Measure and optimize response time

---

## Technical Notes

### Implementation Guidance

**Search Query Structure:**
```typescript
const searchQuery = query.trim().toLowerCase();

const bulls = await prisma.bull.findMany({
  where: {
    status: 'PUBLISHED',
    archived: false,
    OR: [
      { name: { contains: searchQuery, mode: 'insensitive' } },
      { registrationNumber: { contains: searchQuery, mode: 'insensitive' } },
      { ranch: { name: { contains: searchQuery, mode: 'insensitive' } } },
    ],
    // Combine with existing filters
    ...existingFilters,
  },
  include: {
    ranch: {
      select: { name: true, slug: true },
    },
  },
});
```

**Debounce Implementation:**
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [debouncedQuery, setDebouncedQuery] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedQuery(searchQuery);
  }, 300);

  return () => clearTimeout(timer);
}, [searchQuery]);

useEffect(() => {
  // Fetch results with debouncedQuery
}, [debouncedQuery]);
```

**URL Parameter:**
- Add `?search=query` to URL
- Example: `/bulls?search=angus&breeds=Angus`

**Relevance Sorting:**
- Exact matches first
- Partial matches second
- Sort by createdAt within each group

**Database Indexes:**
```prisma
model Bull {
  // ...
  @@index([name])
  @@index([registrationNumber])
}

model Ranch {
  // ...
  @@index([name])
}
```

### Affected Components
- Modified: `/app/bulls/page.tsx`
- New: `/components/SearchBar.tsx`
- Modified: `/api/bulls/public/route.ts`
- Modified: `/components/BullFilters.tsx` (if integrated)

### Dependencies
- React hooks (useState, useEffect, useMemo)
- Next.js router (useRouter, useSearchParams)
- Prisma full-text search capabilities
- Lodash debounce (optional, or custom implementation)

### Edge Cases
- Empty search query
- Special characters in search
- Very long search queries
- No results found
- Search with all filters active
- Slow network conditions

---

## Prerequisites

**Required:**
- Story 3.1 complete (browse page exists)
- Story 3.2 complete (filters exist) - for integration
- Bull model has name and registrationNumber
- Ranch model has name field

**Data Requirements:**
- Bulls with varied names
- Bulls with registration numbers
- Ranches with different names

---

## Definition of Done

- [ ] Search input visible and functional
- [ ] Real-time search with debounce works
- [ ] Searches across all specified fields
- [ ] Results display correctly
- [ ] Empty state shows when no results
- [ ] Search persists in URL
- [ ] Search works with filters
- [ ] Clear search button works
- [ ] Performance < 500ms
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Code reviewed and approved
- [ ] Tested with various search queries

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
