# Story 3.4: Detailed Bull Profile Page

**Epic:** 3 - Bull Discovery & Browsing  
**Story ID:** 3-4-detailed-bull-profile-page  
**Status:** backlog  
**Created:** 2025-11-11  
**Developer:** 

---

## User Story

As a **breeder**,
I want to view comprehensive bull details including photos, genetics, pedigree, and performance data,
So that I can thoroughly evaluate a bull for my breeding program.

---

## Acceptance Criteria

### AC1: Page Layout and Navigation
**Given** I click on a bull card from the browse page  
**When** the bull detail page loads  
**Then** I should see:
- Clean, professional layout
- Breadcrumb navigation (Home > Bulls > Bull Name)
- Back to browse button
- Bull name as page title
- Responsive design for all screen sizes

**And** page URL should be `/bulls/[slug]`

### AC2: Photo Gallery
**Given** I am viewing a bull detail page  
**When** I see the photo section  
**Then** I should see:
- Hero image displayed prominently
- Thumbnail strip of additional photos (if any)
- Click thumbnail to view full size
- Zoom capability on images
- Image carousel/lightbox for full-screen viewing
- Navigation arrows between photos

**And** images should be optimized and load quickly

### AC3: Basic Information Section
**Given** I am viewing bull details  
**When** I see the basic info section  
**Then** I should see:
- Bull name (prominent)
- Registration number
- Breed
- Birth date (formatted as "Born: Month Year")
- Age (calculated from birth date)
- Ranch name (linked to ranch profile)
- Ranch location (City, State)

**And** all information should be clearly labeled

### AC4: Genetic Data Display
**Given** I want to evaluate genetics  
**When** I view the genetic data section  
**Then** I should see:
- **EPD Table:** All EPD values in formatted table
  - Birth Weight, Weaning Weight, Yearling Weight
  - Milk, Maternal, Carcass traits
  - Clear column headers and units
- **Genetic Markers:** Listed clearly (if available)
- **DNA Test Results:** Displayed (if available)
- Tooltips explaining EPD meanings

**And** missing data should show "Not Available" gracefully

### AC5: Pedigree Information
**Given** I want to see lineage  
**When** I view the pedigree section  
**Then** I should see:
- Sire name
- Dam name
- Notable ancestors (if listed)
- Visual pedigree tree (3 generations if data available)

**And** pedigree should be easy to read and understand

### AC6: Performance Data
**Given** I want to see performance metrics  
**When** I view the performance section  
**Then** I should see:
- Birth weight
- Weaning weight
- Yearling weight
- Current weight
- Frame score
- Scrotal circumference
- Weight progression chart (visual)
- Progeny notes (if available)

**And** data should be formatted with proper units

### AC7: Inventory and Pricing
**Given** I want to know availability  
**When** I view the inventory section  
**Then** I should see:
- Semen availability status (In Stock / Limited / Sold Out)
- Number of straws available
- Price per straw (if listed)
- Availability status badge (color-coded)
- "Contact Ranch" CTA button (prominent)

**And** sold out bulls should still show full information

### AC8: Contact CTA
**Given** I am interested in a bull  
**When** I see the contact section  
**Then** I should see:
- Prominent "Contact Ranch" button
- Ranch contact information
- Quick inquiry form (optional)

**And** button should be sticky/visible as I scroll

### AC9: Shareable URL
**Given** I want to share a bull  
**When** I view the page  
**Then** I should see:
- Share button with copy link functionality
- Social media share options (optional)
- URL is clean and bookmarkable

**And** shared URL should work for anyone (public access)

---

## Tasks / Subtasks

**Task 1: Create Bull Detail Page Route (AC1)**
- [ ] Create `/app/bulls/[slug]/page.tsx`
- [ ] Implement server-side data fetching by slug
- [ ] Add breadcrumb navigation
- [ ] Create responsive page layout
- [ ] Add back button
- [ ] Test page loads correctly

**Task 2: Implement Photo Gallery (AC2)**
- [ ] Display hero image prominently
- [ ] Create thumbnail strip for additional photos
- [ ] Implement image lightbox/modal
- [ ] Add zoom functionality
- [ ] Create image carousel navigation
- [ ] Optimize images with Next.js Image
- [ ] Test gallery on all devices

**Task 3: Display Basic Information (AC3)**
- [ ] Create basic info section component
- [ ] Display all basic fields
- [ ] Link ranch name to ranch profile
- [ ] Calculate and display age from birth date
- [ ] Format dates properly
- [ ] Test all fields display correctly

**Task 4: Create Genetic Data Section (AC4)**
- [ ] Create EPD table component
- [ ] Parse epdData JSON and display in table
- [ ] Add tooltips for EPD explanations
- [ ] Display genetic markers
- [ ] Show DNA test results
- [ ] Handle missing data gracefully
- [ ] Test genetic data displays correctly

**Task 5: Build Pedigree Display (AC5)**
- [ ] Create pedigree section component
- [ ] Display sire and dam names
- [ ] List notable ancestors
- [ ] Create visual pedigree tree (optional)
- [ ] Test pedigree displays correctly

**Task 6: Display Performance Data (AC6)**
- [ ] Create performance section component
- [ ] Display all weight measurements
- [ ] Show frame score and scrotal circumference
- [ ] Create weight progression chart (Chart.js or Recharts)
- [ ] Display progeny notes
- [ ] Format units properly
- [ ] Test performance section

**Task 7: Show Inventory and Pricing (AC7)**
- [ ] Create inventory section component
- [ ] Display semen availability with color-coded badge
- [ ] Show straw count
- [ ] Display price (if available)
- [ ] Add prominent "Contact Ranch" button
- [ ] Test inventory display

**Task 8: Implement Contact CTA (AC8)**
- [ ] Create sticky contact button
- [ ] Link to ranch contact info
- [ ] Add quick inquiry form (optional)
- [ ] Test CTA is always accessible

**Task 9: Add Share Functionality (AC9)**
- [ ] Create share button component
- [ ] Implement copy link to clipboard
- [ ] Add social media share options (optional)
- [ ] Test share functionality

**Task 10: Create API Route (AC1)**
- [ ] Create `/api/bulls/[slug]/public/route.ts`
- [ ] Fetch bull by slug with all related data
- [ ] Include ranch information
- [ ] Return 404 if bull not found or not published
- [ ] Test API returns correct data

---

## Technical Notes

### Implementation Guidance

**Data Fetching:**
```typescript
const bull = await prisma.bull.findUnique({
  where: { slug: params.slug },
  include: {
    ranch: {
      select: {
        name: true,
        slug: true,
        city: true,
        state: true,
        contactEmail: true,
        phone: true,
      },
    },
  },
});

// Check if published and not archived
if (!bull || bull.status !== 'PUBLISHED' || bull.archived) {
  notFound();
}
```

**Age Calculation:**
```typescript
const calculateAge = (birthDate: Date) => {
  const today = new Date();
  const birth = new Date(birthDate);
  const months = (today.getFullYear() - birth.getFullYear()) * 12 
    + today.getMonth() - birth.getMonth();
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  return `${years} years, ${remainingMonths} months`;
};
```

**EPD Table Structure:**
```typescript
const epdFields = [
  { key: 'birthWeight', label: 'Birth Weight', unit: 'lbs' },
  { key: 'weaningWeight', label: 'Weaning Weight', unit: 'lbs' },
  { key: 'yearlingWeight', label: 'Yearling Weight', unit: 'lbs' },
  { key: 'milk', label: 'Milk', unit: 'lbs' },
  { key: 'maternal', label: 'Maternal', unit: 'lbs' },
];
```

**Weight Chart:**
- Use Chart.js or Recharts
- X-axis: Age milestones (Birth, Weaning, Yearling, Current)
- Y-axis: Weight in lbs
- Line chart showing progression

**Image Lightbox:**
- Consider using: yet-another-react-lightbox or react-image-lightbox
- Or build custom with Tailwind modal

### Affected Components
- New: `/app/bulls/[slug]/page.tsx`
- New: `/components/bull-detail/PhotoGallery.tsx`
- New: `/components/bull-detail/GeneticDataTable.tsx`
- New: `/components/bull-detail/PedigreeTree.tsx`
- New: `/components/bull-detail/PerformanceChart.tsx`
- New: `/api/bulls/[slug]/public/route.ts`

### Dependencies
- Next.js 14 App Router
- Prisma (Bull, Ranch models)
- Chart.js or Recharts (for weight chart)
- React Image Lightbox library
- Tailwind CSS
- Next.js Image

### Edge Cases
- Bull not found (404)
- Bull is draft or archived (404)
- Missing photos
- Missing EPD data
- Missing pedigree information
- No price listed
- Sold out inventory

---

## Prerequisites

**Required:**
- Story 3.1 complete (browse page with links to detail)
- Bull model has all required fields
- Ranch model linked to bulls

**Data Requirements:**
- At least 1 published bull with complete data
- Bulls with photos
- Bulls with EPD data
- Bulls with pedigree information

---

## Definition of Done

- [ ] Bull detail page accessible at `/bulls/[slug]`
- [ ] All sections display correctly
- [ ] Photo gallery works with zoom
- [ ] EPD table displays all genetic data
- [ ] Pedigree shows lineage
- [ ] Performance chart visualizes weights
- [ ] Inventory and pricing clear
- [ ] Contact CTA prominent and functional
- [ ] Share functionality works
- [ ] 404 handling for invalid slugs
- [ ] Responsive on all devices
- [ ] No console errors
- [ ] Code reviewed and approved
- [ ] Tested with real bull data

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
