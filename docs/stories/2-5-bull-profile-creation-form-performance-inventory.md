# Story 2.5: Bull Profile Creation Form - Performance & Inventory

**Epic:** 2 - Ranch Owner Onboarding  
**Story ID:** 2-5-bull-profile-creation-form-performance-inventory  
**Status:** ready-for-dev  
**Created:** 2025-11-07  
**Developer:** 

---

## User Story

As a **ranch owner**,
I want to add performance data and semen inventory count,
So that breeders know the bull's track record and availability.

---

## Acceptance Criteria

**AC1: Performance Data Input**
- Form includes weight data fields: birth weight, weaning weight, yearling weight (all optional)
- Progeny performance notes text area (optional, 1000 char max)
- Numeric validation for weight fields
- Character counter for notes field
- Clear labels with units

**AC2: Inventory & Pricing**
- Available semen straw count field (required, numeric, minimum 0)
- Price per straw field (optional, currency format)
- Validation prevents negative numbers
- Currency formatting for price display

**AC3: Bull Profile Preview**
- "Preview Profile" button shows modal with complete bull profile
- Preview displays all entered data formatted as it will appear to breeders
- Preview includes hero photo and all photos
- Preview shows all sections: basic info, photos, genetic data, performance
- Close preview returns to form

**AC4: Publish or Save as Draft**
- "Save as Draft" button saves bull with DRAFT status
- "Publish Bull" button changes status to PUBLISHED
- Published bulls immediately visible on ranch public page
- Success message displays with shareable bull URL
- Redirect to ranch dashboard after publish

---

## Tasks / Subtasks

**Task 1: Create Performance & Inventory Form (AC1, AC2)**
- [ ] Create `components/BullForm/PerformanceStep.tsx`
- [ ] Add weight data fields (birth, weaning, yearling)
- [ ] Add progeny performance notes text area
- [ ] Add semen straw count field (required)
- [ ] Add price per straw field (optional)
- [ ] Implement numeric validation
- [ ] Implement currency formatting for price
- [ ] Add character counter for notes
- [ ] Test form validation

**Task 2: Create Bull Profile Preview Modal (AC3)**
- [ ] Create `components/BullProfilePreview.tsx` modal component
- [ ] Fetch complete bull data from form state
- [ ] Display all bull information in formatted layout
- [ ] Show hero photo and photo gallery
- [ ] Display all sections with proper styling
- [ ] Add close button to return to form
- [ ] Test preview with complete and partial data

**Task 3: Implement Publish Functionality (AC4)**
- [ ] Add "Publish Bull" button to form
- [ ] Update bull status to PUBLISHED in database
- [ ] Generate shareable bull URL
- [ ] Display success message with URL
- [ ] Add "Copy Link" button for URL
- [ ] Redirect to ranch dashboard
- [ ] Test publish flow end-to-end

**Task 4: Update Bull Model for Performance Data (AC1, AC2)**
- [ ] Add performance fields to Bull model
- [ ] Add inventory and pricing fields
- [ ] Update `/api/bulls/[id]` to accept performance data
- [ ] Validate required semen count field
- [ ] Test API with performance data

**Task 5: Create Public Bull Profile Page (AC4)**
- [ ] Create `/bulls/[id]/page.tsx` dynamic route
- [ ] Fetch bull data by ID
- [ ] Display complete bull profile with all sections
- [ ] Show photo gallery
- [ ] Add "Contact Ranch" button
- [ ] Handle 404 for non-existent or draft bulls
- [ ] Test public profile page

**Task 6: Update Ranch Public Page to Show Bulls (AC4)**
- [ ] Update `/ranch/[slug]/page.tsx`
- [ ] Fetch and display published bulls for ranch
- [ ] Show bulls in grid layout with photos
- [ ] Link each bull to its profile page
- [ ] Test ranch page with multiple bulls

**Task 7: Testing (All ACs)**
- [ ] Unit test: Performance data validation
- [ ] Unit test: Currency formatting
- [ ] Integration test: Complete bull creation flow (all 3 steps)
- [ ] Integration test: Publish and view on public pages
- [ ] Manual test: Create and publish complete bull profile

---

## Dev Notes

### Learnings from Previous Stories

**From Story 2-4-bull-profile-creation-form-genetic-data-pedigree (Status: drafted)**

- **Multi-Step Form**: Three-step form with state management
- **Form Navigation**: Back/forward navigation with data persistence
- **Draft Saving**: Bulls saved with DRAFT status at any step

**From Story 2-2-ranch-profile-creation-branding (Status: drafted)**

- **Public Pages**: Ranch has public profile at `/ranch/[slug]`
- **Slug System**: Unique slugs for public URLs

[Sources: docs/stories/2-4-bull-profile-creation-form-genetic-data-pedigree.md, docs/stories/2-2-ranch-profile-creation-branding.md]

### Architecture & Technical Approach

**Bull Model Updates:**
```prisma
model Bull {
  // ... existing fields
  birthWeight       Float?
  weaningWeight     Float?
  yearlingWeight    Float?
  progenyNotes      String?
  semenCount        Int       @default(0)
  pricePerStraw     Float?
  status            BullStatus @default(DRAFT)
}
```

**Bull Status Flow:**
- DRAFT → User can edit, not visible publicly
- PUBLISHED → Visible on ranch page and in browse/search
- SOLD → Archived, not visible in active listings
- ARCHIVED → Hidden by ranch owner

**Public URL Structure:**
- Ranch: `/ranch/[slug]` (e.g., `/ranch/wagner-ranch`)
- Bull: `/bulls/[id]` (e.g., `/bulls/clh123abc`)

**Preview Modal:**
- Show formatted bull profile exactly as breeders will see it
- Include all sections with proper styling
- Use same components as public bull page for consistency

### Project Structure Alignment

**Files to Create:**
- `components/BullForm/PerformanceStep.tsx` - Performance & inventory form
- `components/BullProfilePreview.tsx` - Preview modal
- `app/bulls/[id]/page.tsx` - Public bull profile page
- `lib/currency.ts` - Currency formatting utilities

**Files to Modify:**
- `contexts/BullFormContext.tsx` - Add performance data to state
- `app/bulls/create/page.tsx` - Add performance step and publish logic
- `app/ranch/[slug]/page.tsx` - Display published bulls
- `prisma/schema.prisma` - Add performance fields (requires migration)

**Database Migration:**
- Add performance and inventory fields to Bull model
- Run `prisma migrate dev`

### References

- **Epic Definition**: `docs/epics.md#Epic-2-Story-2.5`
- **Previous Stories**: 
  - `docs/stories/2-4-bull-profile-creation-form-genetic-data-pedigree.md`
  - `docs/stories/2-2-ranch-profile-creation-branding.md`
- **Prisma Schema**: `prisma/schema.prisma` (Bull model)

---

## Dev Agent Record

### Context Reference

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
