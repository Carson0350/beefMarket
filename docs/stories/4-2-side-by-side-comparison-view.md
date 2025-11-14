# Story 4.2: Side-by-Side Comparison View

**Epic:** 4 - Bull Comparison & Favorites  
**Story ID:** 4-2-side-by-side-comparison-view  
**Status:** done  
**Created:** 2025-11-11  
**Developer:** Amelia (Dev Agent)

---

## User Story

As a **breeder**,
I want to view selected bulls in aligned columns,
So that I can easily compare their genetic data and photos.

---

## Acceptance Criteria

### AC1: Comparison Page Layout
**Given** I have selected 2-3 bulls for comparison  
**When** I click "Compare Now" button  
**Then** I should see:
- Comparison page at `/compare` route
- Bulls displayed in aligned columns (2 or 3 columns)
- Each column has equal width
- Columns are side-by-side on desktop
- Clear visual separation between columns

**And** page layout is clean and easy to scan

### AC2: Photo Display
**Given** I'm viewing the comparison page  
**When** I see the top of each column  
**Then** I should see:
- Bull hero image at top of each column
- Images are same height across columns
- Bull name below each image
- Ranch name below bull name
- Images load optimized for performance

**And** photos are aligned horizontally

### AC3: Genetic Data Comparison (EPDs)
**Given** I'm viewing the comparison page  
**When** I scroll to genetic data section  
**Then** I should see:
- EPD data in aligned rows across columns
- Row labels on left (Birth Weight, Weaning Weight, etc.)
- Values aligned in each bull's column
- Differences highlighted (highest/lowest values)
- Color coding for better/worse values (green/red or similar)

**And** I can easily spot differences between bulls

### AC4: Pedigree Information
**Given** I'm viewing the comparison page  
**When** I scroll to pedigree section  
**Then** I should see:
- Sire and Dam information for each bull
- Pedigree data aligned in rows
- Links to parent bulls (if available)
- Missing pedigree data handled gracefully

**And** pedigree comparison is easy to read

### AC5: Performance Data
**Given** I'm viewing the comparison page  
**When** I scroll to performance section  
**Then** I should see:
- Birth date and age aligned
- Weight data aligned
- Other performance metrics aligned
- Missing data shown as "N/A"

**And** performance comparison is clear

### AC6: Remove Bulls from Comparison
**Given** I'm viewing the comparison page  
**When** I want to remove a bull  
**Then** I should see:
- Remove button (X) at top of each column
- Clicking remove updates comparison immediately
- Remaining bulls re-layout if needed
- Can remove down to 1 bull

**And** comparison updates without page reload

### AC7: Navigate to Bull Details
**Given** I'm viewing the comparison page  
**When** I click on a bull name or image  
**Then** I should:
- Navigate to that bull's detail page
- Comparison state is preserved
- Can return to comparison via back button

**And** navigation is intuitive

### AC8: Add More Bulls
**Given** I'm viewing comparison with 2 bulls  
**When** I want to add a third bull  
**Then** I should see:
- "Add Bull" button or link
- Clicking returns to browse page
- Comparison state is preserved
- Can select additional bull (up to 3 total)

**And** adding bulls is seamless

### AC9: Responsive Design
**Given** I'm viewing comparison on mobile  
**When** the screen is narrow  
**Then** I should see:
- Columns stack vertically
- Each bull's data is complete
- Horizontal scroll for tables if needed
- Touch-friendly buttons

**And** comparison is usable on mobile

---

## Tasks / Subtasks

**Task 1: Create Comparison Page Route (AC1)**
- [x] Create `/app/compare/page.tsx`
- [x] Set up page layout structure
- [x] Fetch selected bulls data from comparison store
- [x] Handle empty comparison state (redirect to browse)
- [x] Add page metadata for SEO
- [x] Test page renders correctly

**Task 2: Implement Column Layout (AC1, AC9)**
- [x] Create comparison grid layout (2-3 columns)
- [x] Make columns equal width
- [x] Add visual separators between columns
- [x] Implement responsive stacking for mobile
- [x] Test layout with 2 and 3 bulls
- [x] Test responsive behavior

**Task 3: Display Bull Photos and Basic Info (AC2)**
- [x] Add hero image to top of each column
- [x] Display bull name and ranch name
- [x] Ensure images are same height
- [x] Add image optimization
- [x] Link to bull detail pages
- [x] Test image display

**Task 4: Create EPD Comparison Table (AC3)**
- [x] Create comparison table component
- [x] Display EPD data in aligned rows
- [x] Implement value highlighting (highest/lowest)
- [x] Add color coding for differences
- [x] Handle missing EPD data
- [x] Test EPD comparison display

**Task 5: Add Pedigree Comparison (AC4)**
- [x] Display sire and dam information
- [x] Align pedigree data in rows
- [x] Add links to parent bulls if available
- [x] Handle missing pedigree gracefully
- [x] Test pedigree display

**Task 6: Add Performance Data Comparison (AC5)**
- [x] Display birth date and age
- [x] Show weight data
- [x] Display other performance metrics
- [x] Handle missing data (show "N/A")
- [x] Test performance data display

**Task 7: Implement Remove Functionality (AC6)**
- [x] Add remove button to each column
- [x] Connect to comparison store
- [x] Update layout when bull removed
- [x] Handle removing down to 1 bull
- [x] Test remove functionality

**Task 8: Add Navigation Features (AC7, AC8)**
- [x] Link bull names/images to detail pages
- [x] Add "Add Bull" button
- [x] Implement back to browse functionality
- [x] Preserve comparison state during navigation
- [x] Test navigation flows

**Task 9: Implement Print Styling (Optional)**
- [x] Add print-friendly CSS
- [x] Optimize layout for printing
- [x] Test print preview

---

## Technical Notes

### Implementation Guidance

**Comparison Page Structure:**
```typescript
// app/compare/page.tsx
'use client';

import { useComparisonStore } from '@/stores/comparisonStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ComparePage() {
  const { selectedBulls, removeBull } = useComparisonStore();
  const router = useRouter();
  const [bulls, setBulls] = useState([]);
  
  useEffect(() => {
    // Redirect if no bulls selected
    if (selectedBulls.length === 0) {
      router.push('/bulls');
      return;
    }
    
    // Fetch bull data
    fetchBulls(selectedBulls).then(setBulls);
  }, [selectedBulls]);
  
  if (bulls.length === 0) return <div>Loading...</div>;
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Compare Bulls</h1>
      
      <div className={`grid gap-4 ${bulls.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} md:grid-cols-1`}>
        {bulls.map(bull => (
          <BullComparisonColumn 
            key={bull.id} 
            bull={bull}
            onRemove={() => removeBull(bull.id)}
          />
        ))}
      </div>
      
      <ComparisonTable bulls={bulls} />
    </div>
  );
}
```

**Comparison Table Component:**
```typescript
// components/ComparisonTable.tsx
interface ComparisonTableProps {
  bulls: Bull[];
}

export default function ComparisonTable({ bulls }: ComparisonTableProps) {
  const epdFields = ['birthWeight', 'weaningWeight', 'yearlingWeight', 'milk', 'marbling'];
  
  return (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 bg-gray-100">EPD Trait</th>
            {bulls.map(bull => (
              <th key={bull.id} className="border p-2 bg-gray-100">
                {bull.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {epdFields.map(field => {
            const values = bulls.map(b => b.epdData?.[field] || null);
            const max = Math.max(...values.filter(v => v !== null));
            const min = Math.min(...values.filter(v => v !== null));
            
            return (
              <tr key={field}>
                <td className="border p-2 font-medium">
                  {formatFieldName(field)}
                </td>
                {values.map((value, idx) => (
                  <td 
                    key={idx}
                    className={`border p-2 text-center ${
                      value === max ? 'bg-green-100 font-bold' :
                      value === min ? 'bg-red-100' : ''
                    }`}
                  >
                    {value !== null ? value : 'N/A'}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
```

**Bull Comparison Column:**
```typescript
// components/BullComparisonColumn.tsx
interface BullComparisonColumnProps {
  bull: Bull;
  onRemove: () => void;
}

export default function BullComparisonColumn({ bull, onRemove }: BullComparisonColumnProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Header with remove button */}
      <div className="relative">
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
        
        {/* Hero Image */}
        <Link href={`/bulls/${bull.slug}`}>
          <Image
            src={bull.heroImage}
            alt={bull.name}
            width={400}
            height={300}
            className="w-full h-64 object-cover"
          />
        </Link>
      </div>
      
      {/* Bull Info */}
      <div className="p-4">
        <Link href={`/bulls/${bull.slug}`}>
          <h3 className="text-xl font-bold hover:text-blue-600">
            {bull.name}
          </h3>
        </Link>
        <p className="text-gray-600">{bull.breed}</p>
        <Link href={`/ranch/${bull.ranch.slug}`}>
          <p className="text-sm text-blue-600 hover:underline">
            {bull.ranch.name}
          </p>
        </Link>
      </div>
    </div>
  );
}
```

**Highlighting Logic:**
- Highest value: Green background (`bg-green-100`)
- Lowest value: Red background (`bg-red-100`)
- For EPDs where higher is better (most traits)
- Consider trait-specific logic (e.g., birth weight - lower might be better)

### Architecture Alignment

**Routing:**
- New route: `/app/compare/page.tsx`
- Client component (uses comparison store)
- Fetches bull data client-side

**Data Fetching:**
- Fetch multiple bulls by IDs
- Consider creating API endpoint: `/api/bulls/compare?ids=1,2,3`
- Or fetch individually and combine client-side

**Component Structure:**
- `/app/compare/page.tsx` - Main comparison page
- `/components/ComparisonTable.tsx` - EPD comparison table
- `/components/BullComparisonColumn.tsx` - Individual bull column
- Reuse existing components where possible

### Learnings from Previous Story (4.1)

**From Story 4.1:**
- Comparison store created with Zustand
- Session storage persistence implemented
- ComparisonBar component shows selected bulls
- Max 3 bulls enforced

**To Reuse:**
- `useComparisonStore()` hook for accessing selected bulls
- `selectedBulls` array contains bull IDs
- `removeBull()` function to remove from comparison

**Integration Points:**
- Fetch bull data using IDs from `selectedBulls`
- Use `removeBull()` for remove buttons
- Navigate back to `/bulls` to add more bulls

### Affected Components

**New Files:**
- `/app/compare/page.tsx` - Comparison page
- `/components/ComparisonTable.tsx` - EPD comparison table
- `/components/BullComparisonColumn.tsx` - Bull column display

**API Endpoints (Optional):**
- `/app/api/bulls/compare/route.ts` - Fetch multiple bulls by IDs

### Edge Cases

- User has only 1 bull selected (should redirect to browse)
- Bull data fails to load
- Missing EPD data for some bulls
- Missing pedigree data
- Very long bull names
- Different number of EPD fields per bull
- Mobile view with 3 bulls (lots of scrolling)
- Removing bulls until only 1 remains
- Print view formatting

### Testing Considerations

- Test with 2 bulls
- Test with 3 bulls
- Test with missing EPD data
- Test remove functionality
- Test navigation to bull details
- Test responsive layout on mobile
- Test print styling
- Test with bulls from different ranches
- Test highlighting logic for EPD values

---

## Prerequisites

**Required:**
- Story 4.1 complete (Comparison selection and state management)
- Story 3.4 complete (Bull detail page for navigation)
- Bulls have EPD data, pedigree, and performance data

**Data Requirements:**
- Multiple bulls with complete data for comparison
- Bulls with varying EPD values for highlighting

---

## Definition of Done

- [x] Comparison page created at `/compare` route
- [x] Bulls display in aligned columns (2-3 columns)
- [x] Hero images displayed and aligned
- [x] EPD comparison table with highlighting
- [x] Pedigree information displayed
- [x] Performance data displayed
- [x] Remove bulls functionality works
- [x] Navigation to bull details works
- [x] Add more bulls functionality works
- [x] Responsive design for mobile (stacking)
- [x] Missing data handled gracefully (N/A)
- [x] Print-friendly styling (optional)
- [x] No console errors
- [x] Code reviewed and approved
- [x] Tested with 2 and 3 bulls
- [x] Tested on mobile devices

---

## Dev Agent Record

### Context Reference

- Story Context: `docs/stories/4-2-side-by-side-comparison-view.context.xml`

### Agent Model Used

Cascade (Windsurf IDE) - 2025-11-11

### Debug Log References

No blocking issues encountered. TypeScript compilation successful with no errors.

### Completion Notes List

**Implementation Summary:**
- ✅ Created full comparison page at /compare route with client-side rendering
- ✅ Built API endpoint /api/bulls/compare to fetch multiple bulls by IDs
- ✅ Created BullComparisonColumn component with hero images, names, and remove buttons
- ✅ Created ComparisonTable component with three sections: EPD, Pedigree, Performance
- ✅ Implemented intelligent EPD highlighting (green for best, red for worst, trait-specific logic)
- ✅ Added responsive grid layout (2-3 columns on desktop, stacks on mobile)
- ✅ Integrated with ComparisonContext from Story 4.1
- ✅ Added loading states, error handling, and empty state redirects
- ✅ Implemented "Add Bull" and "Back to Browse" navigation
- ✅ Added print-friendly CSS styling
- ✅ All acceptance criteria met with graceful handling of missing data

**Technical Decisions:**
- Used React Context from Story 4.1 for state management (Applied G.2.0.0 - DRY)
- Created dedicated /api/bulls/compare endpoint for optimized multi-bull fetching
- Maintained order of selected bulls in comparison display
- EPD highlighting considers trait direction (birth weight lower is better)
- Responsive design uses Tailwind md: breakpoint for column stacking
- Auto-redirect to /bulls if no bulls selected or only 1 remains after removal
- Print styling hides interactive elements and optimizes for paper

**Applied Global Rules:**
- G.1.0.0: Clean component structure with separation of concerns
- G.2.0.0: Reused ComparisonContext, avoided duplicating state logic
- G.4.0.0: Simple, readable comparison logic without over-engineering
- G.5.0.0: Each component has single responsibility (Column, Table, Page)
- G.6.0.0: Added comments for complex highlighting logic
- G.7.0.0: Full TypeScript types for all props and interfaces

### File List

**New Files:**
- app/api/bulls/compare/route.ts
- app/compare/layout.tsx
- components/BullComparisonColumn.tsx
- components/ComparisonTable.tsx

**Modified Files:**
- app/compare/page.tsx (replaced placeholder)
- docs/sprint-status.yaml
