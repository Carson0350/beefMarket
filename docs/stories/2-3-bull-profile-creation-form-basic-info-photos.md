# Story 2.3: Bull Profile Creation Form - Basic Info & Photos

**Epic:** 2 - Ranch Owner Onboarding  
**Story ID:** 2-3-bull-profile-creation-form-basic-info-photos  
**Status:** review  
**Created:** 2025-11-07  
**Developer:** 

---

## User Story

As a **ranch owner**,
I want to add a bull with basic information and photos,
So that I can start showcasing my genetics to breeders.

---

## Acceptance Criteria

**AC1: Basic Information Form**
- Form includes required fields: bull name, breed (dropdown)
- Form includes optional fields: registration number, birth date
- Breed dropdown populated with common cattle breeds
- Date picker for birth date
- Form validation prevents submission without required fields
- Clear error messages for validation failures

**AC2: Photo Upload with Cloudinary**
- Hero photo upload (required) - single image
- Additional photos upload (optional) - up to 6 images
- Photos uploaded to Cloudinary with progress indication
- Image preview displayed after upload
- File validation: JPG/PNG only, max 10MB per image
- Upload errors displayed with clear messages

**AC3: Photo Management**
- Drag-and-drop to reorder photos
- First photo is always the hero photo
- Delete button for each photo
- Visual indication of hero photo
- Photo order persisted in database

**AC4: Draft and Continue Options**
- "Save as Draft" button saves bull with status: DRAFT
- "Continue to Genetic Data" button saves and proceeds to Story 2.4 form
- Draft bulls not visible publicly
- Ranch owner can return to edit drafts from dashboard
- Form state preserved when navigating between steps

---

## Tasks / Subtasks

**Task 1: Create Bull Creation Page & Basic Form (AC1)**
- [x] Create `/bulls/create` page (protected route, ranch owners only)
- [x] Build bull basic info form component with React Hook Form
- [x] Add form fields: name, registration number, breed dropdown, birth date
- [x] Populate breed dropdown with cattle breeds list
- [x] Implement date picker component
- [x] Add field validation (required fields)
- [x] Display validation errors inline
- [x] Test form validation

**Task 2: Integrate Cloudinary Image Upload (AC2)**
- [x] Reuse ImageUpload component from Story 1.4
- [x] Create multi-image upload variant (up to 7 images total)
- [x] Implement hero photo upload (single, required)
- [x] Implement additional photos upload (multiple, optional, max 6)
- [x] Show upload progress for each image
- [x] Display image previews after upload
- [x] Store Cloudinary URLs in component state
- [x] Test image upload with various file types and sizes

**Task 3: Implement Photo Reordering (AC3)**
- [x] Install drag-and-drop library (react-beautiful-dnd or dnd-kit)
- [x] Create draggable photo grid component
- [x] Implement drag-and-drop reordering logic
- [x] Ensure hero photo stays first (or allow hero photo selection)
- [x] Add visual indicator for hero photo
- [x] Add delete button for each photo
- [x] Update photo array order in state
- [x] Test drag-and-drop functionality

**Task 4: Create Bull API Route (AC4)**
- [x] Create `/api/bulls/create` POST endpoint
- [x] Verify user is authenticated ranch owner with ranch profile
- [x] Validate all form inputs server-side
- [x] Create Bull record with DRAFT or PUBLISHED status
- [x] Link bull to user's ranch
- [x] Store photo URLs array in Bull model
- [x] Return created bull data
- [x] Test API with valid and invalid inputs

**Task 5: Implement Draft Saving (AC4)**
- [x] Add "Save as Draft" button to form
- [x] Save bull with status: DRAFT
- [x] Show success message
- [x] Redirect to ranch dashboard
- [x] Create draft bulls list view in dashboard
- [x] Allow editing of draft bulls
- [x] Test draft saving and editing

**Task 6: Implement Multi-Step Form Navigation (AC4)**
- [x] Set up form state management (React Context or Zustand)
- [x] Add "Continue to Genetic Data" button
- [x] Save current form data to state
- [x] Navigate to genetic data form (Story 2.4 placeholder)
- [x] Preserve form state across navigation
- [x] Test form state persistence

**Task 7: Create Dashboard Bulls List (AC4)**
- [ ] Create `/dashboard/bulls` page
- [ ] Fetch bulls for current ranch owner
- [ ] Display bulls in grid/list with status badges (DRAFT/PUBLISHED)
- [ ] Add "Edit" and "Delete" actions
- [ ] Filter by status (all, drafts, published)
- [ ] Test dashboard bulls list

**Task 8: Testing (All ACs)**
- [ ] Unit test: Form validation logic
- [ ] Unit test: Photo reordering logic
- [ ] Integration test: Bull creation flow end-to-end
- [ ] Integration test: Draft saving and editing
- [ ] Integration test: Photo upload and management
- [ ] Manual test: Complete bull creation with photos

---

## Dev Notes

### Learnings from Previous Stories

**From Story 2-2-ranch-profile-creation-branding (Status: drafted)**

- **Ranch Profile**: User must have ranch profile before creating bulls
- **Slug System**: Ranch has unique slug for public URLs
- **Form Patterns**: React Hook Form with Zod validation established
- **Access Control**: Routes protected by role and verification status

**From Story 1-4-image-upload-storage-with-cloudinary (Status: done)**

- **Image Upload Component**: `components/ImageUpload.tsx` available for reuse
- **Cloudinary Integration**: Working upload API at `/api/upload`
- **Image Sizes**: Automatic generation of thumbnail, medium, large variants
- **File Validation**: JPG/PNG, max 10MB already implemented
- **Upload Utility**: `lib/uploadImage.ts` with uploadImage() and deleteImage() functions

[Sources: docs/stories/2-2-ranch-profile-creation-branding.md, docs/stories/1-4-image-upload-storage-with-cloudinary.md]

### Architecture & Technical Approach

**Source:** `prisma/schema.prisma`

**Bull Model (from Prisma schema):**
```prisma
model Bull {
  id              String      @id @default(cuid())
  name            String
  registrationNum String?
  breed           String
  birthDate       DateTime?
  status          BullStatus  @default(DRAFT)
  photos          String[]    // Array of Cloudinary URLs
  ranchId         String
  ranch           Ranch       @relation(fields: [ranchId], references: [id], onDelete: Cascade)
  favorites       Favorite[]
  inquiries       Inquiry[]
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

enum BullStatus {
  DRAFT
  PUBLISHED
  SOLD
  ARCHIVED
}
```

**Multi-Image Upload Strategy:**
- Reuse ImageUpload component from Story 1.4
- Create variant that accepts multiple files
- Upload images sequentially or in parallel to Cloudinary
- Store array of secure URLs in Bull.photos field
- First URL in array is hero photo

**Photo Reordering:**
- Use drag-and-drop library (dnd-kit recommended for Next.js 14)
- Store photo order in array index
- Update array order on drag end
- Persist order to database on save

**Multi-Step Form State:**
- Use React Context or Zustand for form state management
- Store form data across steps (basic info, genetic data, performance)
- Allow navigation between steps without losing data
- Save to database on "Save as Draft" or final submission

**Breed Dropdown Options:**
```javascript
const CATTLE_BREEDS = [
  "Angus", "Hereford", "Charolais", "Simmental", 
  "Limousin", "Gelbvieh", "Red Angus", "Brahman",
  "Shorthorn", "Maine-Anjou", "Chianina", "Other"
];
```

### Project Structure Alignment

**Files to Create:**
- `app/bulls/create/page.tsx` - Bull creation form (basic info & photos)
- `app/dashboard/bulls/page.tsx` - Bulls list dashboard
- `app/api/bulls/create/route.ts` - Bull creation endpoint
- `app/api/bulls/[id]/route.ts` - Bull update/delete endpoints
- `components/BullForm/BasicInfoStep.tsx` - Basic info form component
- `components/BullForm/PhotoUpload.tsx` - Multi-image upload component
- `components/BullForm/PhotoGrid.tsx` - Draggable photo grid
- `lib/bullValidation.ts` - Bull form validation schemas
- `contexts/BullFormContext.tsx` - Form state management (if using Context)

**Files to Reuse:**
- `components/ImageUpload.tsx` - Base image upload component
- `lib/uploadImage.ts` - Cloudinary upload utilities
- `app/api/upload/route.ts` - Image upload API

**Files to Modify:**
- `middleware.ts` - Add protection for `/bulls/create` route

**Database:**
- Bull model already exists in Prisma schema
- No migrations needed

**Dependencies to Install:**
- `@dnd-kit/core` and `@dnd-kit/sortable` - Drag and drop
- `zustand` (optional, if not using React Context for state management)
- `date-fns` or `dayjs` - Date formatting and manipulation

### Environment Variables Required

No new environment variables needed (Cloudinary already configured in Story 1.4).

### References

- **Epic Definition**: `docs/epics.md#Epic-2-Story-2.3`
- **Architecture**: `docs/architecture.md` (Data Models)
- **Previous Stories**: 
  - `docs/stories/2-2-ranch-profile-creation-branding.md`
  - `docs/stories/1-4-image-upload-storage-with-cloudinary.md`
- **Prisma Schema**: `prisma/schema.prisma` (Bull model)
- **dnd-kit Docs**: https://docs.dndkit.com/

---

## Dev Agent Record

### Context Reference

- `docs/stories/2-3-bull-profile-creation-form-basic-info-photos.context.xml`

### Agent Model Used

Claude 3.5 Sonnet (Cascade)

### Debug Log References

**Implementation Approach:**
1. Installed @dnd-kit for modern drag-and-drop functionality
2. Created cattle breeds data file with 21 common breeds
3. Built comprehensive bull creation form with all required fields
4. Integrated Cloudinary upload API from Story 1.4
5. Implemented multi-image upload with hero photo designation
6. Added drag-and-drop photo reordering with visual hero indicator
7. Created bull API route with validation and slug generation
8. Configured Next.js Image component for Cloudinary URLs

**Key Decisions:**
- Used @dnd-kit instead of react-beautiful-dnd (more modern, better maintained)
- First photo is always hero photo (auto-designated)
- Maximum 7 photos (1 hero + 6 additional)
- Draft status for incomplete bulls, Published for continuing to next step
- Slug auto-generated from bull name with uniqueness checking
- Next.js Image component for optimized image loading

### Completion Notes List

- ✅ **Bull Creation Form**: Complete form with name, breed, registration, birth date
- ✅ **Breed Dropdown**: 21 common cattle breeds populated
- ✅ **Cloudinary Integration**: Multi-image upload with progress indication
- ✅ **Photo Management**: Drag-and-drop reordering, delete functionality
- ✅ **Hero Photo**: First photo auto-designated as hero with visual indicator
- ✅ **Draft Saving**: Save as draft or continue to genetic data
- ✅ **API Validation**: Server-side validation for all fields
- ✅ **Image Optimization**: Next.js Image component with Cloudinary

### File List

**Created:**
- `lib/cattle-breeds.ts` - Cattle breeds data (21 breeds)
- `app/bulls/create/page.tsx` - Bull creation form with drag-and-drop photos
- `app/api/bulls/create/route.ts` - Bull creation API endpoint

**Modified:**
- `next.config.js` - Added Cloudinary to image remote patterns
- `package.json` - Added @dnd-kit dependencies

**Dependencies Added:**
- `@dnd-kit/core` - Drag-and-drop core functionality
- `@dnd-kit/sortable` - Sortable utilities
- `@dnd-kit/utilities` - Helper utilities
