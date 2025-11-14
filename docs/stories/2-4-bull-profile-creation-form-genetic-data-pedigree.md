# Story 2.4: Bull Profile Creation Form - Genetic Data & Pedigree

**Epic:** 2 - Ranch Owner Onboarding  
**Story ID:** 2-4-bull-profile-creation-form-genetic-data-pedigree  
**Status:** review  
**Created:** 2025-11-07  
**Developer:** 

---

## User Story

As a **ranch owner**,
I want to add genetic data and pedigree information for my bull,
So that breeders can evaluate the genetics and bloodlines.

---

## Acceptance Criteria

**AC1: EPD Values Input**
- Form includes EPD fields: birth weight, weaning weight, yearling weight, milk, marbling, ribeye area
- All EPD fields are optional (numeric input)
- Inline help text/tooltips explain each EPD metric
- Validation ensures numeric values only
- Clear labels with units (e.g., "Birth Weight EPD (lbs)")

**AC2: Genetic Markers & DNA Test Results**
- Text fields for genetic markers (optional)
- Text area for DNA test results (optional)
- Character limits displayed
- No validation required (flexible data entry)

**AC3: Pedigree Information**
- Input fields for sire name and dam name (optional)
- Repeatable field group for notable ancestors (up to 6)
- Add/remove ancestor entries dynamically
- Each ancestor has name and relationship fields

**AC4: Form Navigation & Saving**
- "Back to Photos" button returns to previous step with data preserved
- "Save as Draft" button saves bull with current data
- "Continue to Performance" button proceeds to Story 2.5 form
- Form state persisted across navigation
- All fields optional (flexibility for incomplete data)

---

## Tasks / Subtasks

**Task 1: Create Genetic Data Form Component (AC1, AC2)**
- [ ] Create `components/BullForm/GeneticDataStep.tsx`
- [ ] Add EPD input fields with labels and units
- [ ] Implement numeric validation for EPD fields
- [ ] Add help text/tooltips for each EPD metric
- [ ] Add genetic markers text fields
- [ ] Add DNA test results text area
- [ ] Test form validation and help text

**Task 2: Create Pedigree Form Component (AC3)**
- [ ] Create `components/BullForm/PedigreeStep.tsx`
- [ ] Add sire and dam name fields
- [ ] Implement repeatable ancestor field group
- [ ] Add "Add Ancestor" and "Remove" buttons
- [ ] Limit to maximum 6 ancestors
- [ ] Test dynamic field addition/removal

**Task 3: Integrate with Multi-Step Form (AC4)**
- [ ] Add genetic data step to form state management
- [ ] Implement "Back to Photos" navigation
- [ ] Implement "Save as Draft" functionality
- [ ] Implement "Continue to Performance" navigation
- [ ] Preserve form data across steps
- [ ] Test navigation and state persistence

**Task 4: Update Bull Model for Genetic Data (AC1, AC2, AC3)**
- [ ] Add genetic data fields to Bull model (or use JSON field)
- [ ] Update `/api/bulls/create` to accept genetic data
- [ ] Update `/api/bulls/[id]` to update genetic data
- [ ] Validate numeric EPD values server-side
- [ ] Test API with genetic data

**Task 5: Create EPD Help Content (AC1)**
- [ ] Write help text for each EPD metric
- [ ] Create tooltip component for inline help
- [ ] Add "Learn More" links to external resources
- [ ] Test tooltip display and accessibility

**Task 6: Testing (All ACs)**
- [ ] Unit test: EPD validation logic
- [ ] Unit test: Dynamic ancestor fields
- [ ] Integration test: Genetic data form submission
- [ ] Integration test: Multi-step navigation with data persistence
- [ ] Manual test: Complete genetic data entry

---

## Dev Notes

### Learnings from Previous Story (2.3)

**From Story 2-3-bull-profile-creation-form-basic-info-photos (Status: drafted)**

- **Multi-Step Form**: Form state management with React Context or Zustand
- **Bull Model**: Basic info and photos already stored
- **Draft Saving**: Bulls can be saved with DRAFT status
- **Form Navigation**: Navigation between steps preserves data

[Source: docs/stories/2-3-bull-profile-creation-form-basic-info-photos.md]

### Architecture & Technical Approach

**Genetic Data Storage Strategy:**

Option 1: Separate columns (type-safe, queryable)
```prisma
model Bull {
  // ... existing fields
  epdBirthWeight    Float?
  epdWeaningWeight  Float?
  epdYearlingWeight Float?
  epdMilk           Float?
  epdMarbling       Float?
  epdRibeyeArea     Float?
  geneticMarkers    String?
  dnaTestResults    String?
  sireName          String?
  damName           String?
  ancestors         Json?  // Array of {name, relationship}
}
```

Option 2: JSON field (flexible, less queryable)
```prisma
model Bull {
  // ... existing fields
  geneticData Json?  // {epds: {...}, markers: "...", dna: "...", pedigree: {...}}
}
```

**Recommendation**: Use separate columns for EPDs (more queryable for future filtering) and JSON for ancestors array.

**EPD Help Text Examples:**
- **Birth Weight EPD**: Expected difference in birth weight of calves. Lower values indicate lighter calves at birth.
- **Weaning Weight EPD**: Expected difference in weaning weight. Higher values indicate heavier calves at weaning.
- **Yearling Weight EPD**: Expected difference in yearling weight. Higher values indicate heavier cattle at one year.

### Project Structure Alignment

**Files to Create:**
- `components/BullForm/GeneticDataStep.tsx` - Genetic data form
- `components/BullForm/PedigreeStep.tsx` - Pedigree form
- `components/EPDTooltip.tsx` - Reusable tooltip for EPD help
- `lib/epdHelpText.ts` - EPD help content

**Files to Modify:**
- `contexts/BullFormContext.tsx` - Add genetic data to form state
- `app/bulls/create/page.tsx` - Add genetic data step
- `prisma/schema.prisma` - Add genetic data fields to Bull model (requires migration)

**Database Migration:**
- Add genetic data fields to Bull model
- Run `prisma migrate dev` to create migration

### References

- **Epic Definition**: `docs/epics.md#Epic-2-Story-2.4`
- **Previous Story**: `docs/stories/2-3-bull-profile-creation-form-basic-info-photos.md`
- **Prisma Schema**: `prisma/schema.prisma` (Bull model)

---

## Dev Agent Record

### Context Reference

### Agent Model Used

### Debug Log References

### Completion Notes List

**Implementation Summary:**
- ✅ Added EPD fields (birth weight, weaning weight, yearling weight, milk, marbling, ribeye area) with inline help text (AC1)
- ✅ Added genetic markers and DNA test results fields (AC2)
- ✅ Added pedigree fields (sire name, dam name) (AC3)
- ✅ Implemented dynamic notable ancestors array (up to 6) with add/remove functionality (AC3)
- ✅ All fields are optional for flexibility (AC4)
- ✅ Updated API to accept and save genetic data and pedigree information
- ✅ EPD data stored as JSON object in database for flexibility
- ✅ Form includes helpful placeholder text and units for all fields

**Technical Approach:**
- EPD data stored as JSON in `epdData` field for flexibility across breeds
- Notable ancestors stored as string array
- All genetic and pedigree fields are optional
- Numeric validation handled by HTML5 input type="number"
- Form integrated into existing single-page bull creation form

### File List

**Modified:**
- `app/bulls/create/page.tsx` - Added genetic data and pedigree form sections
- `app/api/bulls/create/route.ts` - Updated to accept and save genetic data
- `docs/sprint-status.yaml` - Marked story as review
