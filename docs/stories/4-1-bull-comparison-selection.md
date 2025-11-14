# Story 4.1: Bull Comparison Selection

**Epic:** 4 - Bull Comparison & Favorites  
**Story ID:** 4-1-bull-comparison-selection  
**Status:** done  
**Created:** 2025-11-11  
**Developer:** Amelia (Dev Agent)

---

## User Story

As a **breeder**,
I want to select 2-3 bulls for comparison,
So that I can evaluate them side-by-side.

---

## Acceptance Criteria

### AC1: Comparison Checkbox on Bull Cards
**Given** I'm browsing bulls on the browse page  
**When** I see bull cards  
**Then** I should see:
- Comparison checkbox on each bull card
- Checkbox is clearly visible and accessible
- Checkbox state (checked/unchecked) is obvious

**And** clicking checkbox adds bull to comparison

### AC2: Comparison Selection (Max 3)
**Given** I click comparison checkboxes  
**When** I select bulls  
**Then** the system should:
- Add selected bulls to comparison state
- Enforce maximum of 3 bulls
- Disable checkboxes when 3 bulls selected
- Show visual feedback for disabled state

**And** I cannot select more than 3 bulls

### AC3: Floating Comparison Bar
**Given** I have selected 1+ bulls for comparison  
**When** bulls are in comparison state  
**Then** I should see:
- Floating comparison bar at bottom of screen
- Selected bulls displayed with thumbnails
- Bull names shown
- Remove button for each bull
- "Compare Now" button (enabled when 2+ bulls selected)

**And** comparison bar stays visible while scrolling

### AC4: Remove Bulls from Comparison
**Given** I have bulls in the comparison bar  
**When** I click remove button on a bull  
**Then** the system should:
- Remove bull from comparison state
- Update comparison bar
- Re-enable that bull's checkbox on browse page
- Update "Compare Now" button state

**And** I can continue selecting other bulls

### AC5: Session Persistence
**Given** I have selected bulls for comparison  
**When** I navigate between pages or refresh  
**Then** my comparison selection should:
- Persist during the browser session
- Restore selected bulls when returning to browse page
- Maintain comparison bar state

**And** comparison state is cleared when I close the browser

### AC6: Compare Now Button
**Given** I have 2 or 3 bulls selected  
**When** the comparison bar is visible  
**Then** I should see:
- "Compare Now" button is enabled
- Button shows count (e.g., "Compare 2 Bulls")
- Clicking button navigates to comparison page

**And** button is disabled when only 1 bull selected

---

## Tasks / Subtasks

**Task 1: Create Comparison State Management (AC1, AC2, AC5)**
- [x] Create comparison context or Zustand store
- [x] Implement add/remove bull logic
- [x] Enforce max 3 bulls validation
- [x] Implement session storage persistence
- [x] Add TypeScript types for comparison state
- [x] Test state management logic

**Task 2: Add Comparison Checkbox to Bull Cards (AC1, AC2)**
- [x] Update BullCard component
- [x] Add checkbox UI element
- [x] Connect checkbox to comparison state
- [x] Implement disabled state when max reached
- [x] Add visual feedback for selection
- [x] Test checkbox functionality

**Task 3: Create Floating Comparison Bar Component (AC3, AC4)**
- [x] Create ComparisonBar component
- [x] Design floating bar UI (bottom of screen)
- [x] Display selected bulls with thumbnails
- [x] Add remove buttons for each bull
- [x] Implement sticky positioning
- [x] Make responsive for mobile
- [x] Test comparison bar display

**Task 4: Implement Compare Now Button (AC6)**
- [x] Add "Compare Now" button to comparison bar
- [x] Show bull count in button text
- [x] Enable/disable based on selection count
- [x] Navigate to comparison page on click
- [x] Test button functionality

**Task 5: Integrate with Browse Page (AC1-AC6)**
- [x] Import comparison context/store
- [x] Wrap browse page with provider (if using Context)
- [x] Add ComparisonBar to page layout
- [x] Test full integration
- [x] Verify session persistence

**Task 6: Handle Edge Cases**
- [x] Handle removing last bull from comparison
- [x] Handle navigating away and back
- [x] Handle browser refresh
- [x] Handle session storage limits
- [x] Test all edge cases

---

## Technical Notes

### Implementation Guidance

**State Management Options:**

Option 1 - React Context (Simpler):
```typescript
// contexts/ComparisonContext.tsx
interface ComparisonContextType {
  selectedBulls: string[]; // Bull IDs
  addBull: (bullId: string) => void;
  removeBull: (bullId: string) => void;
  clearComparison: () => void;
  isSelected: (bullId: string) => boolean;
  canAddMore: boolean;
}
```

Option 2 - Zustand (Recommended for this feature):
```typescript
// stores/comparisonStore.ts
interface ComparisonStore {
  selectedBulls: string[];
  addBull: (bullId: string) => void;
  removeBull: (bullId: string) => void;
  clearComparison: () => void;
}

export const useComparisonStore = create<ComparisonStore>()(
  persist(
    (set, get) => ({
      selectedBulls: [],
      addBull: (bullId) => {
        const { selectedBulls } = get();
        if (selectedBulls.length < 3 && !selectedBulls.includes(bullId)) {
          set({ selectedBulls: [...selectedBulls, bullId] });
        }
      },
      removeBull: (bullId) => {
        set({ selectedBulls: get().selectedBulls.filter(id => id !== bullId) });
      },
      clearComparison: () => set({ selectedBulls: [] }),
    }),
    {
      name: 'comparison-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
```

**Comparison Bar Component:**
```typescript
// components/ComparisonBar.tsx
'use client';

export default function ComparisonBar() {
  const { selectedBulls, removeBull } = useComparisonStore();
  const router = useRouter();
  
  if (selectedBulls.length === 0) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            {selectedBulls.map(bullId => (
              <BullThumbnail key={bullId} bullId={bullId} onRemove={removeBull} />
            ))}
          </div>
          <button
            disabled={selectedBulls.length < 2}
            onClick={() => router.push('/compare')}
            className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Compare {selectedBulls.length} Bulls
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Bull Card Checkbox:**
```typescript
// In BullCard component
const { selectedBulls, addBull, removeBull } = useComparisonStore();
const isSelected = selectedBulls.includes(bull.id);
const canAddMore = selectedBulls.length < 3;

<input
  type="checkbox"
  checked={isSelected}
  disabled={!isSelected && !canAddMore}
  onChange={(e) => {
    if (e.target.checked) {
      addBull(bull.id);
    } else {
      removeBull(bull.id);
    }
  }}
  className="w-5 h-5"
/>
```

### Architecture Alignment

**State Management:**
- Use Zustand for comparison state (lightweight, TypeScript-friendly)
- Persist to sessionStorage (not localStorage - comparison is session-specific)
- Client component pattern (comparison is interactive)

**Component Structure:**
- `/components/ComparisonBar.tsx` - Floating comparison bar
- `/components/BullThumbnail.tsx` - Small bull preview in comparison bar
- `/stores/comparisonStore.ts` - Zustand store for comparison state
- Modify `/components/BullCard.tsx` - Add comparison checkbox

**Routing:**
- Comparison bar navigates to `/compare` route (Story 4.2)

### Dependencies

**New Dependencies:**
```json
{
  "zustand": "^4.4.0"
}
```

### Affected Components

**New Files:**
- `/stores/comparisonStore.ts` - Comparison state management
- `/components/ComparisonBar.tsx` - Floating comparison bar
- `/components/BullThumbnail.tsx` - Bull preview in comparison bar

**Modified Files:**
- `/components/BullCard.tsx` - Add comparison checkbox
- `/app/bulls/page.tsx` - Add ComparisonBar to layout

### Edge Cases

- User selects 3 bulls, removes one, selects another
- User refreshes page with bulls selected
- Session storage is full or disabled
- User navigates to bull detail page (comparison bar should still show)
- Mobile view with limited screen space
- Very long bull names in comparison bar

### Testing Considerations

- Test max 3 bulls enforcement
- Test session persistence across page navigation
- Test session storage save/restore
- Test checkbox state synchronization
- Test comparison bar visibility
- Test remove functionality
- Test responsive design on mobile

---

## Prerequisites

**Required:**
- Story 3.1 complete (Bull browse page with BullCard exists)
- Bulls have unique IDs for comparison tracking

**Data Requirements:**
- Multiple bulls available for selection

---

## Definition of Done

- [x] Comparison state management implemented (React Context per architecture)
- [x] Comparison checkbox added to bull cards
- [x] Max 3 bulls validation enforced
- [x] Floating comparison bar displays selected bulls
- [x] Remove bulls functionality works
- [x] "Compare Now" button enabled when 2+ bulls selected
- [x] Session persistence works across navigation
- [x] Comparison state clears on browser close
- [x] Responsive design for mobile
- [x] No console errors
- [x] Code reviewed and approved
- [x] Tested with multiple bulls
- [x] Tested session persistence

---

## Dev Agent Record

### Context Reference

- Story Context: `docs/stories/4-1-bull-comparison-selection.context.xml`

### Agent Model Used

Cascade (Windsurf IDE) - 2025-11-11

### Debug Log References

No blocking issues encountered. TypeScript compilation successful with no errors.

### Completion Notes List

**Implementation Summary:**
- ✅ Created ComparisonContext using React Context (per architecture decision AD-7, not Zustand)
- ✅ Implemented sessionStorage persistence with hydration pattern to avoid SSR issues
- ✅ Added comparison checkbox to BullCard with proper event handling to prevent Link navigation
- ✅ Created ComparisonBar component with floating bottom bar UI and slide-up animation
- ✅ Created BullThumbnail component with API endpoint for fetching bull data
- ✅ Integrated ComparisonProvider into bulls browse page
- ✅ Added placeholder /compare page for Story 4.2
- ✅ All acceptance criteria met: max 3 bulls, session persistence, disabled states, remove functionality

**Technical Decisions:**
- Used React Context instead of Zustand per architecture.md (AD-7)
- Added 'use client' directive to BullCard since it now uses hooks
- Restructured BullCard to place checkbox outside Link to prevent navigation conflicts
- Created dedicated API endpoint for bull thumbnails to optimize data fetching
- Added CSS animation for smooth comparison bar appearance

**Applied Global Rules:**
- G.1.0.0: Kept codebase clean and organized with proper file structure
- G.2.0.0: DRY principle - reused BullThumbnail component for each selected bull
- G.4.0.0: KISS principle - simple React Context implementation
- G.5.0.0: Single Responsibility - each component has one clear purpose
- G.7.0.0: Full TypeScript type declarations for all interfaces

### File List

**New Files:**
- contexts/ComparisonContext.tsx
- components/ComparisonBar.tsx
- components/BullThumbnail.tsx
- app/api/bulls/[id]/thumbnail/route.ts
- app/compare/page.tsx

**Modified Files:**
- components/BullCard.tsx
- app/bulls/page.tsx
- app/globals.css
- docs/sprint-status.yaml
