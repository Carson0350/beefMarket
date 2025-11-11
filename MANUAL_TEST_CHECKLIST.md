# Epic 2: Manual Testing Checklist

**Test Date:** ___________  
**Tester:** ___________  
**Environment:** http://localhost:3001  
**Test User:** testranch@example.com / password123

---

## Pre-Testing Setup

- [ ] Dev server running on http://localhost:3001
- [ ] Database is running (PostgreSQL on port 5431)
- [ ] Test user exists and email is verified
- [ ] Test ranch profile exists

**Quick Setup Commands:**
```bash
# Verify test user
npx tsx scripts/verify-test-user.ts

# Run automated tests
npx tsx scripts/test-epic-2-complete.ts
```

---

## 1. Authentication Flow (Story 2.1)

### Login
- [ ] Navigate to http://localhost:3001/login
- [ ] Enter credentials: testranch@example.com / password123
- [ ] Click "Sign In"
- [ ] **Expected:** Redirect to dashboard
- [ ] **Expected:** No errors in console

### Session Persistence
- [ ] Refresh the page
- [ ] **Expected:** Still logged in
- [ ] **Expected:** Dashboard still displays

### Logout
- [ ] Click logout button (if available)
- [ ] **Expected:** Redirect to login/home
- [ ] **Expected:** Cannot access /dashboard without login

---

## 2. Ranch Profile (Story 2.2)

### View Ranch Profile
- [ ] Navigate to /dashboard/ranch/edit
- [ ] **Expected:** Ranch name: "Wagner Premium Ranch"
- [ ] **Expected:** Slug: "wagner-ranch"
- [ ] **Expected:** All fields populated correctly

### Edit Ranch Profile
- [ ] Change ranch name to "Wagner Premium Ranch Updated"
- [ ] Update contact email
- [ ] Click "Save Changes"
- [ ] **Expected:** Success message appears
- [ ] **Expected:** Changes persist after refresh

### Public Ranch Page
- [ ] Navigate to /ranch/wagner-ranch
- [ ] **Expected:** Ranch profile displays publicly
- [ ] **Expected:** Shows ranch name, location, description
- [ ] **Expected:** Shows published bulls (if any)

---

## 3. Bull Creation Flow - Step 1: Basic Info (Story 2.3)

### Navigate to Create Bull
- [ ] From dashboard, click "Add New Bull" or navigate to /bulls/create
- [ ] **Expected:** Form displays with all fields

### Fill Basic Information
- [ ] Enter bull name: "Test Bull 001"
- [ ] Select breed: "Angus"
- [ ] Enter registration number: "TEST-001"
- [ ] Select birth date: Any past date
- [ ] **Expected:** All fields accept input

### Photo Upload
- [ ] Click "Click to upload photos"
- [ ] Select 1-3 images from your computer
- [ ] **Expected:** Images upload successfully
- [ ] **Expected:** Upload progress shows
- [ ] **Expected:** Thumbnails appear after upload
- [ ] **Expected:** First image has "Hero" badge

### Photo Reordering
- [ ] Drag and drop photos to reorder
- [ ] **Expected:** Photos reorder smoothly
- [ ] **Expected:** First photo always shows "Hero" badge
- [ ] **Expected:** Hero badge moves with reordering

### Photo Deletion
- [ ] Hover over a photo
- [ ] Click the X button
- [ ] **Expected:** Photo is removed
- [ ] **Expected:** If hero photo deleted, next photo becomes hero

### Save as Draft
- [ ] Click "Save as Draft"
- [ ] **Expected:** Success message appears
- [ ] **Expected:** Redirect to /dashboard?success=bull-draft-saved
- [ ] **Expected:** Bull appears in dashboard with "Draft" badge

### Continue to Next Step
- [ ] Create another bull or edit existing
- [ ] Fill basic info and upload at least 1 photo
- [ ] Click "Continue to Genetic Data →"
- [ ] **Expected:** Redirect to /bulls/[slug]/edit/genetic
- [ ] **Expected:** URL contains bull slug

---

## 4. Bull Creation Flow - Step 2: Genetic Data (Story 2.4)

### EPD Values
- [ ] Enter Birth Weight EPD: 2.5
- [ ] Enter Weaning Weight EPD: 45
- [ ] Enter Yearling Weight EPD: 80
- [ ] Enter Milk EPD: 25
- [ ] **Expected:** All numeric fields accept decimal values

### Genetic Markers
- [ ] Enter genetic markers: "Polled, Black coat"
- [ ] **Expected:** Text area accepts input

### DNA Test Results
- [ ] Enter DNA test results: "GeneMax tested"
- [ ] **Expected:** Text area accepts input

### Pedigree - Sire & Dam
- [ ] Enter sire name: "Champion Sire 123"
- [ ] Enter dam name: "Elite Dam 456"
- [ ] **Expected:** Text fields accept input

### Notable Ancestors
- [ ] Click "Add Ancestor"
- [ ] Enter ancestor name: "Famous Bull 789"
- [ ] Click "Add Ancestor" again
- [ ] Enter another ancestor name
- [ ] **Expected:** Multiple ancestor fields appear
- [ ] Click X to remove an ancestor
- [ ] **Expected:** Ancestor is removed

### Navigation - Back
- [ ] Click "← Back to Basic Info"
- [ ] **Expected:** Return to /bulls/[slug]/edit
- [ ] **Expected:** Previously entered data is preserved

### Navigation - Save Draft
- [ ] Return to genetic data page
- [ ] Click "Save as Draft"
- [ ] **Expected:** Success message
- [ ] **Expected:** Redirect to dashboard
- [ ] **Expected:** Bull still shows as "Draft"

### Navigation - Continue
- [ ] Edit bull again, go to genetic data
- [ ] Click "Continue to Performance →"
- [ ] **Expected:** Redirect to /bulls/[slug]/edit/performance

---

## 5. Bull Creation Flow - Step 3: Performance & Inventory (Story 2.5)

### Weight Data
- [ ] Enter birth weight: 85
- [ ] Enter weaning weight: 650
- [ ] Enter yearling weight: 1100
- [ ] Enter current weight: 1800
- [ ] **Expected:** All numeric fields accept values

### Frame & Measurements
- [ ] Enter frame score: 6
- [ ] Enter scrotal circumference: 38.5
- [ ] **Expected:** Fields accept numeric values

### Progeny Notes
- [ ] Enter progeny notes: "Excellent calving ease, strong maternal traits"
- [ ] **Expected:** Text area accepts input

### Inventory - Semen Count (Required)
- [ ] Leave semen count empty
- [ ] Try to save
- [ ] **Expected:** Validation error appears
- [ ] Enter semen count: 100
- [ ] **Expected:** Error clears

### Pricing
- [ ] Enter price per straw: 50.00
- [ ] Select availability: "Available"
- [ ] **Expected:** Fields accept input

### Navigation - Back
- [ ] Click "← Back to Genetic Data"
- [ ] **Expected:** Return to genetic page
- [ ] **Expected:** Data preserved

### Save as Draft
- [ ] Return to performance page
- [ ] Click "Save as Draft"
- [ ] **Expected:** Success message
- [ ] **Expected:** Redirect to dashboard
- [ ] **Expected:** Bull shows as "Draft"

### Publish Bull
- [ ] Edit bull again, go to performance page
- [ ] Ensure semen count is filled
- [ ] Click "Publish Bull"
- [ ] **Expected:** Success message with shareable URL
- [ ] **Expected:** Redirect to dashboard
- [ ] **Expected:** Bull shows as "Published" with green badge

---

## 6. Ranch Dashboard (Story 2.6)

### Dashboard Layout
- [ ] Navigate to /dashboard
- [ ] **Expected:** Ranch name displays at top
- [ ] **Expected:** Ranch statistics show (Total, Published, Drafts, Archived)
- [ ] **Expected:** Ranch URL displays with copy button
- [ ] **Expected:** "Add New Bull" button visible

### Ranch Statistics
- [ ] Verify total bulls count matches actual bulls
- [ ] Verify published count matches published bulls
- [ ] Verify draft count matches draft bulls
- [ ] Verify archived count matches archived bulls
- [ ] **Expected:** All counts are accurate

### Copy Ranch URL
- [ ] Click "Copy Link" button next to ranch URL
- [ ] **Expected:** Success message "Link copied!"
- [ ] Paste in browser address bar
- [ ] **Expected:** Clipboard contains correct URL

### Filter Tabs
- [ ] Click "All" tab
- [ ] **Expected:** Shows all bulls (published, draft, archived)
- [ ] Click "Published" tab
- [ ] **Expected:** Shows only published, non-archived bulls
- [ ] Click "Draft" tab
- [ ] **Expected:** Shows only draft bulls
- [ ] Click "Archived" tab
- [ ] **Expected:** Shows only archived bulls

### Search Functionality
- [ ] Enter bull name in search box
- [ ] **Expected:** List filters to matching bulls
- [ ] Clear search
- [ ] Enter breed name
- [ ] **Expected:** List filters to matching breed
- [ ] Test with partial name
- [ ] **Expected:** Partial matches work

### Bull Cards Display
For each bull card, verify:
- [ ] Hero image displays correctly
- [ ] Bull name displays
- [ ] Breed displays
- [ ] Status badge displays (Published/Draft/Archived)
- [ ] Status badge has correct color (green/yellow/gray)
- [ ] Semen count displays
- [ ] Action buttons visible (Edit, Archive/Unarchive, Delete)

---

## 7. Bull Management Actions (Story 2.6)

### Edit Bull
- [ ] Click "Edit" on a bull card
- [ ] **Expected:** Redirect to /bulls/[slug]/edit
- [ ] **Expected:** Form pre-populated with bull data
- [ ] Make a change (e.g., update name)
- [ ] Click "Save Changes"
- [ ] **Expected:** Success message
- [ ] **Expected:** Return to dashboard
- [ ] **Expected:** Change is reflected in bull card

### Navigate Through Edit Steps
- [ ] From basic info edit page, click "Continue to Genetic Data →"
- [ ] **Expected:** Navigate to genetic page with data preserved
- [ ] Click "Continue to Performance →"
- [ ] **Expected:** Navigate to performance page with data preserved
- [ ] Click "← Back to Genetic Data"
- [ ] **Expected:** Navigate back successfully
- [ ] Click "← Back to Basic Info"
- [ ] **Expected:** Navigate back to edit page

### Archive Bull
- [ ] Click "Archive" on a published bull
- [ ] **Expected:** Confirmation modal appears
- [ ] **Expected:** Modal warns about hiding from public
- [ ] Click "Cancel"
- [ ] **Expected:** Modal closes, no action taken
- [ ] Click "Archive" again
- [ ] Click "Archive" in modal
- [ ] **Expected:** Success message appears
- [ ] **Expected:** Bull status changes to "Archived"
- [ ] **Expected:** Bull has gray "Archived" badge
- [ ] Navigate to public ranch page
- [ ] **Expected:** Archived bull does NOT appear

### Unarchive Bull
- [ ] Click "Archived" filter tab
- [ ] Find an archived bull
- [ ] Click "Unarchive"
- [ ] **Expected:** Confirmation modal appears
- [ ] Click "Unarchive" in modal
- [ ] **Expected:** Success message
- [ ] **Expected:** Bull returns to previous status
- [ ] **Expected:** Bull appears in "All" or "Published" tab

### Delete Bull
- [ ] Click "Delete" on a bull (use a test bull)
- [ ] **Expected:** Confirmation modal appears
- [ ] **Expected:** Modal has warning about permanent deletion
- [ ] Click "Cancel"
- [ ] **Expected:** Modal closes, no action taken
- [ ] Click "Delete" again
- [ ] Click "Delete" in modal
- [ ] **Expected:** Success message appears
- [ ] **Expected:** Bull is removed from list
- [ ] Refresh page
- [ ] **Expected:** Bull still does not appear (permanent deletion)

---

## 8. Data Persistence & Validation

### Form Validation
- [ ] Try to create bull without name
- [ ] **Expected:** Validation error
- [ ] Try to create bull without breed
- [ ] **Expected:** Validation error
- [ ] Try to publish without semen count
- [ ] **Expected:** Validation error

### Data Persistence
- [ ] Create a bull with all data filled
- [ ] Save as draft
- [ ] Logout and login again
- [ ] Edit the bull
- [ ] **Expected:** All data is preserved
- [ ] Navigate through all 3 steps
- [ ] **Expected:** All data shows correctly

### Image Persistence
- [ ] Upload multiple images
- [ ] Save bull
- [ ] Edit bull again
- [ ] **Expected:** All images display correctly
- [ ] **Expected:** Hero image is still first
- [ ] Reorder images and save
- [ ] Edit again
- [ ] **Expected:** New order is preserved

---

## 9. Edge Cases & Error Handling

### Network Errors
- [ ] Start creating a bull
- [ ] Stop the dev server
- [ ] Try to save
- [ ] **Expected:** Error message appears
- [ ] Restart server
- [ ] Try again
- [ ] **Expected:** Save works

### Large Image Upload
- [ ] Try to upload a very large image (>10MB)
- [ ] **Expected:** Upload succeeds or shows appropriate error
- [ ] **Expected:** No browser crash

### Maximum Photos
- [ ] Upload 7 photos
- [ ] Try to upload an 8th photo
- [ ] **Expected:** Error message or upload button disabled

### Special Characters
- [ ] Enter bull name with special characters: "Test's Bull #1"
- [ ] Save and publish
- [ ] **Expected:** Slug is URL-safe
- [ ] **Expected:** Bull displays correctly

### Long Text Fields
- [ ] Enter very long progeny notes (1000+ characters)
- [ ] Save
- [ ] **Expected:** Text is saved completely
- [ ] Edit again
- [ ] **Expected:** Full text displays

---

## 10. Browser Compatibility (Optional)

Test in multiple browsers:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari

For each browser, verify:
- [ ] Dashboard loads correctly
- [ ] Forms work properly
- [ ] Image upload works
- [ ] Drag-and-drop works
- [ ] Modals display correctly

---

## 11. Responsive Design (Optional)

Test on different screen sizes:
- [ ] Desktop (1920x1080)
- [ ] Tablet (768px width)
- [ ] Mobile (375px width)

For each size, verify:
- [ ] Dashboard is readable
- [ ] Forms are usable
- [ ] Buttons are clickable
- [ ] Images display properly
- [ ] Navigation works

---

## 12. Console & Network

### Console Errors
- [ ] Open browser DevTools console
- [ ] Navigate through all pages
- [ ] **Expected:** No errors in console
- [ ] **Expected:** No warnings (or only expected warnings)

### Network Requests
- [ ] Open Network tab
- [ ] Create/edit a bull
- [ ] **Expected:** API calls return 200 status
- [ ] **Expected:** No 404 or 500 errors
- [ ] Upload an image
- [ ] **Expected:** Upload to Cloudinary succeeds

---

## Test Results Summary

**Total Tests:** _____ / _____  
**Passed:** _____  
**Failed:** _____  
**Blocked:** _____

### Critical Issues Found:
1. 
2. 
3. 

### Minor Issues Found:
1. 
2. 
3. 

### Notes:


---

## Sign-Off

**Tester Signature:** ___________________  
**Date:** ___________________  
**Status:** [ ] PASS [ ] FAIL [ ] NEEDS REVIEW
