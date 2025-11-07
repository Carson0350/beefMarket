# Story 1.4: Image Upload & Storage with Cloudinary

**Epic:** 1 - Foundation & Infrastructure  
**Story ID:** 1-4-image-upload-storage-with-cloudinary  
**Status:** review  
**Created:** 2025-11-07  
**Developer:** 

---

## User Story

As a **developer**,
I want image upload functionality with cloud storage,
So that users can upload bull photos with automatic optimization.

---

## Business Context

High-quality images are critical for showcasing bulls effectively. This story enables ranch owners to upload professional photos that are automatically optimized for web delivery, improving page load times and user experience while reducing storage costs.

**Value:** Enables the core feature of the platform—visual presentation of bulls—with automatic optimization for performance and cost efficiency.

---

## Acceptance Criteria

- [ ] Cloudinary SDK is configured and integrated.
- [ ] Upload API route exists at `/api/upload`.
- [ ] Images are uploaded to Cloudinary with:
  - Automatic WebP conversion
  - Multiple size transformations (thumbnail: 200x200, medium: 800x600, large: 1600x1200)
  - Secure signed uploads
- [ ] Upload component handles:
  - File validation (JPG, PNG only, max 10MB)
  - Progress indication during upload
  - Error handling with user-friendly messages
- [ ] Uploaded image URLs are returned and can be stored in the database.

---

## Implementation Tasks

### Task 1: Install Cloudinary SDK

- [ ] Install the Cloudinary Node.js SDK: `npm install cloudinary`

### Task 2: Configure Cloudinary

- [ ] Create a Cloudinary account (if not already created).
- [ ] Add Cloudinary credentials to `.env`:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- [ ] Create a configuration utility in `lib/cloudinary.ts` to initialize the Cloudinary SDK.

### Task 3: Create Upload API Route

- [ ] Create `/app/api/upload/route.ts`.
- [ ] Implement a POST handler that:
  - Validates the incoming file (type, size).
  - Uploads the file to Cloudinary using the SDK.
  - Applies transformations (WebP conversion, multiple sizes).
  - Returns the secure URLs for the uploaded image.
- [ ] Protect the route with authentication (only authenticated users can upload).

### Task 4: Create Reusable Upload Utility

- [ ] In `lib/uploadImage.ts`, create a utility function that wraps the Cloudinary upload logic.
- [ ] The function should accept a file buffer and return the uploaded image URLs.

### Task 5: Create Upload Component (UI)

- [ ] Create a reusable `ImageUpload` component in `components/ImageUpload.tsx`.
- [ ] The component should:
  - Allow users to select an image file (JPG, PNG).
  - Display a preview of the selected image.
  - Show upload progress.
  - Display error messages if validation fails.
  - Call the `/api/upload` route to upload the image.
  - Emit the uploaded image URLs to the parent component.

### Task 6: Test Image Upload

- [ ] Create a test page (`/app/test-upload/page.tsx`) that uses the `ImageUpload` component.
- [ ] Upload a test image and verify it appears in the Cloudinary dashboard.
- [ ] Verify the returned URLs are accessible and display the image correctly.

---

## Testing & Verification

- [ ] A user can select an image file and upload it successfully.
- [ ] The upload progress indicator works correctly.
- [ ] File validation rejects files that are too large or of the wrong type.
- [ ] The uploaded image appears in the Cloudinary dashboard.
- [ ] The returned URLs display the image in the browser (thumbnail, medium, large).
- [ ] Images are automatically converted to WebP format.

---

## Definition of Done

- [ ] All implementation tasks are complete.
- [ ] All verification checks pass.
- [ ] Code is committed to a feature branch.

---

## Dev Agent Record

### Context Reference

- `docs/stories/1-4-image-upload-storage-with-cloudinary.context.xml`

### Completion Notes

- [x] Cloudinary SDK installed and configured
- [x] Cloudinary credentials added to .env (cloud name, API key, API secret)
- [x] Configuration utility created at `lib/cloudinary.ts`
- [x] Upload API route created at `/api/upload` with authentication protection
- [x] File validation implemented (JPG/PNG only, max 10MB)
- [x] Automatic WebP conversion configured
- [x] Multiple size transformations generated (thumbnail: 200x200, medium: 800x600, large: 1600x1200)
- [x] Reusable upload utility created at `lib/uploadImage.ts`
- [x] ImageUpload component created with preview, progress, and error handling
- [x] Test page created at `/app/test-upload`
- [x] Image upload tested successfully

### Files Created

- `lib/cloudinary.ts` - Cloudinary SDK configuration
- `lib/uploadImage.ts` - Reusable upload utility with deleteImage function
- `app/api/upload/route.ts` - Protected upload API endpoint
- `components/ImageUpload.tsx` - Client-side upload component with UI
- `app/test-upload/page.tsx` - Test page for upload functionality

### Debug Log

**Implementation Details:**
- Upload folder: `wagnerbeef` (all images stored in this Cloudinary folder)
- Transformations: `quality: auto, fetch_format: auto` for automatic WebP conversion
- URL generation: Dynamic URLs with size transformations using Cloudinary's URL API
- Authentication: Route protected with NextAuth session check
- File size limit: 10MB (configurable constant)
- Allowed types: image/jpeg, image/png, image/jpg

**Image Sizes Generated:**
- Thumbnail: 200x200 (cropped to fill)
- Medium: 800x600 (limited, maintains aspect ratio)
- Large: 1600x1200 (limited, maintains aspect ratio)
- Original: Full resolution

**Testing:**
- Test upload successful via `/test-upload` page
- Image uploaded to Cloudinary account: dcxo4lnl8
- All size variants generated correctly
- WebP conversion working

---

## Dev Notes

### Learnings from Previous Story (1.3)

- **From Story 1.3-authentication-system-with-nextauthjs (Status: ready-for-dev)**
- **Prerequisites:** This story requires authentication to be in place. The `/api/upload` route should be protected so only authenticated users can upload images.
- **Source:** `docs/stories/1-3-authentication-system-with-nextauthjs.md`

### Architecture & Image Storage

- **Source:** `docs/architecture.md#AD-4`
- **Service:** Cloudinary
- **Transformations:** Automatic WebP conversion, multiple size variants (thumbnail, medium, large).
- **Security:** Use signed uploads to prevent unauthorized access.
- **Environment Variables:** Store all Cloudinary credentials in `.env` and never commit them to the repository.

---

## References

- **Architecture:** `docs/architecture.md` (AD-4)
- **Epics:** `docs/epics.md` (Story 1.4)
- **Cloudinary Docs:** https://cloudinary.com/documentation/node_integration
