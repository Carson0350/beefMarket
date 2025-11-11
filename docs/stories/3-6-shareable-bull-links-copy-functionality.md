# Story 3.6: Shareable Bull Links & Copy Functionality

**Epic:** 3 - Bull Discovery & Browsing  
**Story ID:** 3-6-shareable-bull-links-copy-functionality  
**Status:** backlog  
**Created:** 2025-11-11  
**Developer:** 

---

## User Story

As a **breeder**,
I want to easily share bull profiles and ranch pages via copyable links,
So that I can collaborate with partners or share interesting bulls with colleagues.

---

## Acceptance Criteria

### AC1: Share Button on Bull Detail Page
**Given** I am viewing a bull detail page  
**When** I see the share section  
**Then** I should see:
- Prominent "Share" button
- Copy link icon/button
- Social media share options (optional)

**And** share button should be easily accessible

### AC2: Copy Link Functionality
**Given** I click the "Copy Link" button  
**When** the action completes  
**Then** I should see:
- Success toast message: "Link copied to clipboard!"
- Full bull URL copied to clipboard
- Toast auto-dismisses after 3 seconds

**And** I should be able to paste the link immediately

### AC3: Shareable URLs
**Given** I copy a bull or ranch link  
**When** I paste it  
**Then** the URL should be:
- Clean and readable (e.g., `/bulls/champion-angus-123`)
- Bookmarkable
- Shareable via any medium (email, text, social)
- Publicly accessible (no login required)

**And** URL should work for anyone who receives it

### AC4: Share Button on Ranch Profile
**Given** I am viewing a ranch profile page  
**When** I see the share section  
**Then** I should see:
- "Share Ranch" button
- Copy link functionality
- Same behavior as bull share

**And** ranch URL should be shareable

### AC5: Share from Browse Page Cards
**Given** I am browsing bulls on the main page  
**When** I hover over a bull card  
**Then** I should see:
- Share icon/button on the card
- Quick copy link without navigating to detail page

**And** share should work directly from cards

### AC6: Social Media Sharing (Optional)
**Given** I click social share options  
**When** I select a platform  
**Then** I should see:
- Pre-filled share dialog for selected platform
- Bull/ranch name and description included
- Hero image included in preview
- Proper meta tags for rich previews

**And** shared links should show rich previews on social platforms

### AC7: Mobile Share API
**Given** I am on a mobile device  
**When** I click share  
**Then** I should see:
- Native mobile share sheet (if supported)
- Fallback to copy link if not supported

**And** mobile sharing should feel native

### AC8: Analytics Tracking (Optional)
**Given** someone shares a bull or ranch  
**When** the share action occurs  
**Then** the system should:
- Track share events (for ranch owner insights)
- Record share method (copy link, social, etc.)
- Store anonymized data

**And** tracking should not impact user experience

---

## Tasks / Subtasks

**Task 1: Create Share Button Component (AC1, AC4)**
- [ ] Create `components/ShareButton.tsx`
- [ ] Design share button UI
- [ ] Add copy link icon
- [ ] Make component reusable
- [ ] Test component renders correctly

**Task 2: Implement Copy to Clipboard (AC2)**
- [ ] Use Clipboard API
- [ ] Handle browser compatibility
- [ ] Show success toast notification
- [ ] Handle copy errors gracefully
- [ ] Test clipboard functionality

**Task 3: Add Share to Bull Detail Page (AC1, AC2)**
- [ ] Import ShareButton component
- [ ] Place in prominent location
- [ ] Pass bull URL to component
- [ ] Test share works on bull pages

**Task 4: Add Share to Ranch Profile (AC4)**
- [ ] Import ShareButton component
- [ ] Place in ranch header
- [ ] Pass ranch URL to component
- [ ] Test share works on ranch pages

**Task 5: Add Quick Share to Bull Cards (AC5)**
- [ ] Add share icon to BullCard component
- [ ] Implement hover state
- [ ] Add copy link functionality
- [ ] Prevent navigation when clicking share
- [ ] Test card share functionality

**Task 6: Implement Social Media Sharing (AC6) - Optional**
- [ ] Add social share buttons (Facebook, Twitter, LinkedIn)
- [ ] Implement share dialogs for each platform
- [ ] Add meta tags for rich previews
- [ ] Test social sharing on each platform

**Task 7: Add Mobile Share API Support (AC7)**
- [ ] Detect mobile device
- [ ] Use navigator.share() if available
- [ ] Fallback to copy link on desktop
- [ ] Test on iOS and Android

**Task 8: Implement Analytics Tracking (AC8) - Optional**
- [ ] Add event tracking for shares
- [ ] Track share method
- [ ] Store share data
- [ ] Create analytics dashboard view (future)
- [ ] Test analytics tracking

**Task 9: Add SEO Meta Tags (AC3, AC6)**
- [ ] Add Open Graph tags to bull pages
- [ ] Add Twitter Card tags
- [ ] Include bull/ranch images in meta
- [ ] Test meta tags with social debuggers

---

## Technical Notes

### Implementation Guidance

**Clipboard API Implementation:**
```typescript
const copyToClipboard = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    toast.success('Link copied to clipboard!');
  }
};
```

**Mobile Share API:**
```typescript
const handleShare = async (title: string, url: string) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        url: url,
      });
    } catch (err) {
      // User cancelled or error occurred
    }
  } else {
    // Fallback to copy
    await copyToClipboard(url);
  }
};
```

**Open Graph Meta Tags:**
```typescript
// In bull detail page
export async function generateMetadata({ params }): Promise<Metadata> {
  const bull = await fetchBull(params.slug);
  
  return {
    title: `${bull.name} - ${bull.breed}`,
    description: `View ${bull.name}, a ${bull.breed} bull from ${bull.ranch.name}`,
    openGraph: {
      title: bull.name,
      description: `${bull.breed} bull from ${bull.ranch.name}`,
      images: [bull.heroImage],
      url: `/bulls/${bull.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: bull.name,
      description: `${bull.breed} bull from ${bull.ranch.name}`,
      images: [bull.heroImage],
    },
  };
}
```

**Social Share URLs:**
```typescript
const socialShareUrls = {
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
};
```

**Toast Notification:**
- Use react-hot-toast or similar library
- Or create custom toast component
- Auto-dismiss after 3 seconds

### Affected Components
- New: `/components/ShareButton.tsx`
- New: `/components/Toast.tsx` (if custom)
- Modified: `/app/bulls/[slug]/page.tsx`
- Modified: `/app/ranch/[slug]/page.tsx`
- Modified: `/components/BullCard.tsx`

### Dependencies
- Clipboard API (native browser)
- Navigator Share API (mobile)
- react-hot-toast or similar (for notifications)
- Social media share URLs (no SDK needed)

### Edge Cases
- Clipboard API not supported (old browsers)
- Navigator.share not available (desktop)
- User denies clipboard permission
- Network error during share
- Missing meta images
- Very long URLs

---

## Prerequisites

**Required:**
- Story 3.4 complete (bull detail page exists)
- Story 3.5 complete (ranch profile page exists)
- Bull and ranch pages have proper URLs

**Data Requirements:**
- Bulls with hero images for meta tags
- Ranches with logos for meta tags

---

## Definition of Done

- [ ] Share button component created and reusable
- [ ] Copy to clipboard works on all pages
- [ ] Success toast shows on copy
- [ ] Share works on bull detail pages
- [ ] Share works on ranch profile pages
- [ ] Quick share works on bull cards
- [ ] Mobile share API integrated
- [ ] SEO meta tags added for rich previews
- [ ] Social media sharing works (if implemented)
- [ ] Analytics tracking works (if implemented)
- [ ] Tested on desktop and mobile
- [ ] Tested on multiple browsers
- [ ] No console errors
- [ ] Code reviewed and approved

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
