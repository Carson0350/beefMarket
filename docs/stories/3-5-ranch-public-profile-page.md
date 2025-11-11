# Story 3.5: Ranch Public Profile Page

**Epic:** 3 - Bull Discovery & Browsing  
**Story ID:** 3-5-ranch-public-profile-page  
**Status:** review  
**Created:** 2025-11-11  
**Developer:** Amelia (Dev Agent) 

---

## User Story

As a **breeder**,
I want to view a ranch's public profile with their bulls and information,
So that I can learn about the ranch and see all their available bulls in one place.

---

## Acceptance Criteria

### AC1: Ranch Profile Header
**Given** I navigate to a ranch's public profile  
**When** the page loads  
**Then** I should see:
- Ranch name (prominent header)
- Ranch logo (if uploaded)
- Location (City, State)
- Ranch description/about section
- Contact information (email, phone if public)
- Website link (if provided)
- Social media links (if provided)

**And** page URL should be `/ranch/[slug]`

### AC2: Ranch Statistics
**Given** I am viewing a ranch profile  
**When** I see the statistics section  
**Then** I should see:
- Total number of bulls available
- Number of breeds offered
- Years in business (if provided)
- Any certifications or awards (if listed)

**And** statistics should be visually appealing

### AC3: Bulls Grid Display
**Given** I want to see a ranch's bulls  
**When** I scroll to the bulls section  
**Then** I should see:
- Grid of all published, non-archived bulls from this ranch
- Same card format as main browse page
- Bulls sorted by recently added
- "View All Bulls" link if many bulls (pagination)

**And** clicking a bull card goes to bull detail page

### AC4: Ranch Story/About Section
**Given** I want to learn about the ranch  
**When** I view the about section  
**Then** I should see:
- Ranch history/story (if provided)
- Breeding philosophy
- Specializations or focus areas
- Rich text formatting preserved

**And** content should be readable and well-formatted

### AC5: Contact Section
**Given** I want to contact the ranch  
**When** I see the contact section  
**Then** I should see:
- Contact email
- Phone number
- Physical address (if public)
- "Contact Ranch" button
- Map showing ranch location (optional)

**And** contact information should be easy to copy

### AC6: Breadcrumb Navigation
**Given** I am on a ranch profile  
**When** I look at navigation  
**Then** I should see:
- Breadcrumb: Home > Ranches > Ranch Name
- Back to browse button

**And** navigation should work correctly

### AC7: Empty State
**Given** a ranch has no published bulls  
**When** I view their profile  
**Then** I should see:
- Ranch information still displays
- Friendly message: "No bulls currently available"
- Suggestion to check back later

**And** page should not look broken

### AC8: SEO and Sharing
**Given** I want to share a ranch profile  
**When** I view the page  
**Then** I should see:
- Share button with copy link
- Meta tags for social media sharing
- Clean, bookmarkable URL

**And** shared links should show ranch preview

---

## Tasks / Subtasks

**Task 1: Create Ranch Profile Page Route (AC1, AC6)**
- [x] Create `/app/ranch/[slug]/page.tsx`
- [x] Implement server-side data fetching by slug
- [x] Add breadcrumb navigation
- [x] Create responsive page layout
- [x] Test page loads correctly

**Task 2: Build Ranch Header Section (AC1)**
- [x] Create ranch header component
- [ ] Display ranch logo (future enhancement)
- [x] Show location information
- [x] Display contact information
- [x] Add website and social links
- [x] Test header displays correctly

**Task 3: Display Ranch Statistics (AC2)**
- [x] Create statistics component
- [x] Calculate total published bulls count
- [x] Count unique breeds
- [ ] Display years in business (future enhancement)
- [ ] Show certifications/awards (future enhancement)
- [x] Style statistics cards
- [x] Test statistics accuracy

**Task 4: Create Bulls Grid Section (AC3)**
- [x] Reuse BullCard component from Story 3.1
- [x] Fetch and display ranch's bulls
- [x] Implement sorting (recently added)
- [ ] Add pagination if needed (future enhancement)
- [x] Filter to only published, non-archived bulls
- [x] Test bulls grid displays correctly

**Task 5: Display Ranch Story/About (AC4)**
- [x] Create about section component
- [x] Display ranch description
- [x] Show breeding philosophy
- [x] Preserve rich text formatting
- [x] Handle missing content gracefully
- [x] Test about section

**Task 6: Build Contact Section (AC5)**
- [x] Create contact section component
- [x] Display all contact methods
- [x] Add "Contact Ranch" CTA button
- [ ] Implement map integration (future enhancement)
- [x] Make contact info copyable (clickable links)
- [x] Test contact section

**Task 7: Handle Empty State (AC7)**
- [x] Create empty state component for no bulls
- [x] Show friendly message
- [x] Ensure ranch info still displays
- [x] Test empty state

**Task 8: Add Share Functionality (AC8)**
- [ ] Create share button (Story 3.6)
- [ ] Implement copy link to clipboard (Story 3.6)
- [x] Add meta tags for SEO
- [ ] Test sharing functionality (Story 3.6)

**Task 9: Create/Update API Route (AC1, AC3)**
- [x] Data fetching in page component (server-side)
- [x] Fetch ranch by slug with bulls
- [x] Include only published, non-archived bulls
- [x] Return 404 if ranch not found
- [x] Test API returns correct data

---

## Technical Notes

### Implementation Guidance

**Data Fetching:**
```typescript
const ranch = await prisma.ranch.findUnique({
  where: { slug: params.slug },
  include: {
    bulls: {
      where: {
        status: 'PUBLISHED',
        archived: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        slug: true,
        name: true,
        breed: true,
        heroImage: true,
        semenAvailable: true,
        price: true,
        epdData: true,
      },
    },
  },
});

if (!ranch) {
  notFound();
}
```

**Statistics Calculation:**
```typescript
const stats = {
  totalBulls: ranch.bulls.length,
  breeds: [...new Set(ranch.bulls.map(b => b.breed))].length,
  yearsInBusiness: ranch.establishedYear 
    ? new Date().getFullYear() - ranch.establishedYear 
    : null,
};
```

**Contact Information Display:**
- Email: Make clickable mailto: link
- Phone: Make clickable tel: link
- Address: Format nicely, optionally link to Google Maps

**Map Integration (Optional):**
```typescript
// Using Google Maps Embed API
const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${encodeURIComponent(ranch.address)}`;
```

**SEO Meta Tags:**
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const ranch = await fetchRanch(params.slug);
  
  return {
    title: `${ranch.name} - Wagner Beef`,
    description: ranch.description || `View bulls from ${ranch.name}`,
    openGraph: {
      title: ranch.name,
      description: ranch.description,
      images: [ranch.logo || '/default-ranch.jpg'],
    },
  };
}
```

### Affected Components
- New: `/app/ranch/[slug]/page.tsx`
- New: `/components/ranch/RanchHeader.tsx`
- New: `/components/ranch/RanchStats.tsx`
- New: `/components/ranch/RanchAbout.tsx`
- New: `/components/ranch/RanchContact.tsx`
- Reused: `/components/BullCard.tsx`
- New: `/api/ranch/[slug]/public/route.ts`

### Dependencies
- Next.js 14 App Router
- Prisma (Ranch, Bull models)
- Next.js Image for logo
- Google Maps API (optional, for map)
- Tailwind CSS

### Edge Cases
- Ranch not found (404)
- Ranch has no bulls
- Missing ranch logo
- Missing contact information
- Missing description
- Very long ranch descriptions
- Many bulls (pagination needed)

---

## Prerequisites

**Required:**
- Story 3.1 complete (BullCard component exists)
- Ranch model has all required fields
- Bulls linked to ranches

**Data Requirements:**
- At least 1 ranch with complete profile
- Ranch with published bulls
- Ranch with description and contact info

---

## Definition of Done

- [x] Ranch profile page accessible at `/ranch/[slug]`
- [x] All ranch information displays correctly
- [x] Bulls grid shows ranch's bulls
- [x] Contact section is functional
- [x] Statistics are accurate
- [x] Empty state works when no bulls
- [ ] Share functionality works (Story 3.6)
- [x] 404 handling for invalid slugs
- [x] SEO meta tags implemented
- [x] Responsive on all devices
- [x] No console errors
- [ ] Code reviewed and approved
- [x] Tested with real ranch data

---

## Dev Agent Record

### Context Reference

Enhanced existing ranch profile page from Epic 2

### Agent Model Used

Claude 3.5 Sonnet (Cascade IDE)

### Implementation Approach

1. **Enhanced Existing Page**: Updated existing `/app/ranch/[slug]/page.tsx`
2. **Reused Components**: Leveraged BullCard from Story 3.1
3. **Statistics Calculation**: Dynamic stats from bull data
4. **Responsive Layout**: 3-column grid with sticky sidebar

### Key Decisions

- **Reused BullCard**: Consistent UI across browse and ranch pages
- **Statistics**: Bulls available and breeds offered
- **Empty State**: Friendly message when no bulls
- **Contact CTA**: Prominent mailto button
- **Breadcrumbs**: Consistent navigation pattern
- **SEO**: Dynamic metadata generation

### Completion Notes

**Implemented Features:**
- ✅ Dynamic route `/ranch/[slug]`
- ✅ Breadcrumb navigation
- ✅ Ranch header with name and location
- ✅ Statistics (bulls available, breeds offered)
- ✅ About section with ranch description
- ✅ Bulls grid using BullCard component
- ✅ Contact sidebar with email, phone, website
- ✅ Empty state for no bulls
- ✅ 404 handling
- ✅ SEO metadata

**Testing:**
- Tested with `/ranch/wagner-ranch`
- Verified all 5 bulls display correctly
- Confirmed statistics accuracy
- Tested responsive layout

### File List

**Modified Files:**
- `/app/ranch/[slug]/page.tsx` - Enhanced ranch profile page
