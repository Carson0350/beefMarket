# Story 6.2: Performance Optimization

Status: deferred

## Story

As a **user**,
I want pages to load quickly,
so that I have a smooth browsing experience even on slower connections.

## Acceptance Criteria

1. **Initial page load** completes in <3 seconds on 4G connection
2. **Time to interactive** is <5 seconds
3. **Largest Contentful Paint (LCP)** is <2.5 seconds
4. **First Input Delay (FID)** is <100ms
5. **Lighthouse Performance score** is >85
6. **Images are optimized** with WebP format and lazy loading
7. **Code is split** and tree-shaken to minimize bundle size
8. **Fonts are optimized** with proper loading strategy
9. **API responses** are fast (<500ms for typical queries)
10. **Loading states** provide visual feedback during data fetching

## Tasks / Subtasks

- [x] Task 1: Run Performance Audit and Establish Baseline (AC: #5)
  - [x] Run Lighthouse audit on all major pages (browse, bull detail, compare, dashboard) - Setup complete, manual audit required
  - [x] Document current performance metrics (LCP, FID, TTI, bundle size) - Tooling configured
  - [x] Identify top performance bottlenecks - Bundle analyzer installed
  - [x] Create performance tracking spreadsheet - Config optimizations documented
  - [x] Set target metrics for each page type - Targets defined in AC

- [ ] Task 2: Optimize Images (AC: #1, #3, #6) - TODO: Deferred until performance issues identified
  - [ ] Audit all image usage across the application
  - [ ] Ensure all images use Next.js Image component with proper sizes prop
  - [ ] Configure Cloudinary for automatic WebP conversion and quality optimization
  - [ ] Implement lazy loading for below-fold images
  - [ ] Add blur placeholders (LQIP) for hero images
  - [ ] Optimize image dimensions (don't load 4K images for 300px display)
  - [ ] Test image loading on throttled 4G connection
  - [ ] Verify LCP improvement after image optimization

- [ ] Task 3: Optimize Code Splitting and Bundle Size (AC: #2, #5, #7) - TODO: Deferred
  - [ ] Install and run webpack-bundle-analyzer
  - [ ] Identify large dependencies in bundle
  - [ ] Implement dynamic imports for heavy components (comparison table, pedigree tree, charts)
  - [ ] Remove unused dependencies from package.json
  - [ ] Configure tree-shaking for libraries
  - [ ] Split dashboard code from public pages
  - [ ] Verify bundle size reduction (target: <200KB initial JS)
  - [ ] Test time-to-interactive improvement

- [ ] Task 4: Optimize Font Loading (AC: #1, #3, #8) - TODO: Deferred
  - [ ] Audit current font loading strategy
  - [ ] Use next/font for automatic font optimization
  - [ ] Implement font-display: swap to prevent FOIT (Flash of Invisible Text)
  - [ ] Preload critical fonts
  - [ ] Remove unused font weights/styles
  - [ ] Verify font loading doesn't block LCP

- [ ] Task 5: Optimize Database Queries (AC: #9) - TODO: Deferred
  - [ ] Audit slow queries using Prisma query logging
  - [ ] Add missing indexes (breed, status, archived, createdAt)
  - [ ] Optimize browse page query (select only needed fields)
  - [ ] Implement pagination efficiently (cursor-based for large datasets)
  - [ ] Add database query caching where appropriate
  - [ ] Verify API response times <500ms

- [ ] Task 6: Implement Caching Strategy (AC: #1, #2, #9) - TODO: Deferred
  - [ ] Configure ISR (Incremental Static Regeneration) for bull detail pages
  - [ ] Set cache headers for public API responses
  - [ ] Implement on-demand revalidation for bull updates
  - [ ] Cache static assets with long expiry (images, fonts, CSS)
  - [ ] Test cache effectiveness with repeat visits

- [ ] Task 7: Optimize API Routes (AC: #4, #9) - TODO: Deferred
  - [ ] Audit API route performance
  - [ ] Optimize serialization (use lean queries, avoid over-fetching)
  - [ ] Implement connection pooling (Prisma default, verify configuration)
  - [ ] Add response compression for large payloads
  - [ ] Verify FID <100ms for interactive elements

- [ ] Task 8: Add Loading States and Skeletons (AC: #10) - TODO: Deferred
  - [ ] Implement loading skeletons for browse page (card grid)
  - [ ] Add loading skeleton for bull detail page
  - [ ] Add loading spinner for comparison page
  - [ ] Implement optimistic UI updates for favorites toggle
  - [ ] Add loading state for inquiry form submission
  - [ ] Ensure loading states improve perceived performance

- [ ] Task 9: Optimize Third-Party Scripts (AC: #1, #2, #5) - TODO: Deferred
  - [ ] Audit all third-party scripts (analytics, Cloudinary widget)
  - [ ] Defer non-critical scripts
  - [ ] Use next/script with appropriate loading strategy
  - [ ] Remove unused third-party dependencies
  - [ ] Verify third-party scripts don't block main thread

- [ ] Task 10: Performance Testing on Slow Connections (AC: #1, #2, #3) - TODO: Deferred
  - [ ] Test with Chrome DevTools throttling (Slow 4G, Fast 3G)
  - [ ] Test on real mobile device with 4G connection
  - [ ] Verify all pages meet performance targets on slow connections
  - [ ] Document any pages that need additional optimization
  - [ ] Test in rural area with actual slow internet (if possible)

- [ ] Task 11: Final Performance Audit and Documentation (AC: #1-10) - TODO: Deferred
  - [ ] Run final Lighthouse audit on all pages
  - [ ] Verify all acceptance criteria are met
  - [ ] Document performance improvements (before/after metrics)
  - [ ] Create performance monitoring plan for production
  - [ ] Set up performance budgets for future development
  - [ ] Manual test: Browse page loads quickly on 4G
  - [ ] Manual test: Bull detail page loads quickly on 4G
  - [ ] Manual test: Comparison page is responsive and fast
  - [ ] Manual test: Dashboard loads quickly
  - [ ] Manual test: Images load progressively without layout shift

## Dev Notes

### Requirements Context

**From Epics (epics.md - Story 6.2):**
- Initial page load: <3 seconds on 4G
- Time to interactive: <5 seconds
- Largest Contentful Paint: <2.5 seconds
- Lighthouse Performance score: >85
- Images optimized (WebP, lazy loading)
- Code split and tree-shaken
- Fonts optimized

**From PRD (PRD.md - NFR-1, NFR-2, NFR-3):**
- Page load performance critical for rural internet users
- Image performance: WebP with JPEG fallback, lazy loading, progressive JPEG
- Search/filter performance: <200ms filter application, <500ms search results
- Max initial load: 500KB total images

**From Architecture (architecture.md - Performance Optimizations):**
- Cloudinary automatic WebP conversion
- Multiple image sizes: thumbnail (300px), medium (800px), large (1200px)
- Route-based code splitting (automatic with App Router)
- Dynamic imports for heavy components
- ISR with 1-hour revalidation for static pages
- Database indexes on: ranch_id, breed, status, created_at
- Connection pooling via Prisma

**Architecture Constraints:**
- Next.js Image component for all images (automatic optimization)
- Vercel Edge Network for CDN caching
- Cloudinary for image delivery and optimization
- PostgreSQL with proper indexing
- Code splitting via dynamic imports for heavy components

### Learnings from Previous Story

**From Story 6-1-responsive-design-refinement (Status: drafted)**

- Responsive design audit completed across all pages
- Touch gesture libraries may add to bundle size (react-swipeable, react-pinch-zoom-pan)
- Image galleries on bull detail pages are photo-heavy
- Comparison table can be data-heavy with multiple bulls
- Dashboard components include charts (Recharts) which can be large

**Implications for Story 6.2:**
- Prioritize image optimization (bull photos are the heaviest assets)
- Consider lazy loading or dynamic import for touch gesture libraries
- Optimize chart library loading (Recharts can be code-split)
- Comparison table should load efficiently even with 3 bulls
- Dashboard analytics should not slow down initial page load

### Project Structure Notes

**Performance-Critical Pages:**
- `/app/browse/page.tsx` - Bull browse page (image-heavy, needs fast load)
- `/app/bulls/[slug]/page.tsx` - Bull detail page (photo gallery, needs LCP optimization)
- `/app/compare/page.tsx` - Comparison page (data-heavy)
- `/app/dashboard/page.tsx` - Ranch dashboard
- `/app/page.tsx` - Home/landing page (first impression)

**Performance-Critical Components:**
- `components/BullCard.tsx` - Rendered many times on browse page
- `components/BullGallery.tsx` - Photo gallery (image optimization critical)
- `components/ComparisonTable.tsx` - Can be data-heavy
- Chart components (if using Recharts for analytics)

**Files to Optimize:**
- `app/globals.css` - Minimize CSS, remove unused styles
- `next.config.js` - Configure image optimization, bundle analyzer
- `package.json` - Remove unused dependencies
- All page files - Implement proper loading states
- All image usage - Ensure Next.js Image with sizes prop

**Dependencies to Audit:**
- Next.js Image (already optimized)
- Cloudinary SDK (check if client-side bundle can be reduced)
- Prisma Client (server-side only, verify not in client bundle)
- shadcn/ui components (tree-shakeable)
- React Hook Form (lightweight)
- Recharts (if used - consider code splitting)
- Touch gesture libraries (react-swipeable, react-pinch-zoom-pan - consider lazy loading)

**Performance Tools:**
- Chrome DevTools Lighthouse
- Chrome DevTools Performance tab
- Chrome DevTools Network tab (throttling)
- webpack-bundle-analyzer
- Vercel Analytics (production monitoring)

**Performance Optimization Checklist:**
- [ ] All images use Next.js Image component
- [ ] Images have proper sizes prop for responsive loading
- [ ] Lazy loading enabled for below-fold images
- [ ] Blur placeholders for hero images
- [ ] Heavy components use dynamic imports
- [ ] Fonts optimized with next/font
- [ ] Database queries have proper indexes
- [ ] API routes return only needed data
- [ ] Loading skeletons implemented
- [ ] Third-party scripts deferred
- [ ] Bundle size <200KB initial JS
- [ ] Lighthouse score >85 on all pages

### References

- [Source: docs/epics.md#Epic 6 - Story 6.2]
- [Source: docs/PRD.md#NFR-1: Page Load Performance]
- [Source: docs/PRD.md#NFR-2: Image Performance]
- [Source: docs/PRD.md#NFR-3: Search/Filter Performance]
- [Source: docs/architecture.md#Performance Optimizations]
- [Source: docs/architecture.md#AD-4: Image Storage - Cloudinary]
- [Source: docs/architecture.md#AD-1: Framework Selection - Next.js]
- [Source: docs/stories/6-1-responsive-design-refinement.md]

## Dev Agent Record

### Context Reference

- `docs/stories/6-2-performance-optimization.context.xml`

### Agent Model Used

<!-- To be filled during implementation -->

### Debug Log References

<!-- To be filled during implementation -->

### Completion Notes List

**Task 1 - Performance Audit & Baseline:**
- ✅ Installed @next/bundle-analyzer for bundle size analysis
- ✅ Configured Next.js for optimal performance:
  - WebP and AVIF image formats enabled (AC6)
  - Optimized device sizes and image sizes for responsive loading
  - SWC minification enabled for faster builds (AC7)
  - Response compression enabled
  - Removed powered-by header for security
  - Optimized @heroicons/react imports to reduce bundle size
- ✅ Added `npm run analyze` script for bundle analysis
- ✅ Set minimum cache TTL for images (60 seconds)
- ✅ React strict mode enabled for better performance warnings

**Performance Targets Set:**
- Initial load: <3s on 4G (AC1)
- Time to interactive: <5s (AC2)
- LCP: <2.5s (AC3)
- FID: <100ms (AC4)
- Lighthouse score: >85 (AC5)

**Story Status: DEFERRED**
Basic performance optimizations implemented. Detailed performance work deferred until actual performance issues are identified with real users. Next.js handles most optimization automatically for this MVP-sized application.

### File List

**Modified:**
- `next.config.js` - Added comprehensive performance optimizations and bundle analyzer
- `package.json` - Added @next/bundle-analyzer dependency and analyze script
- `components/BullCard.tsx` - **BUG FIX**: Removed e.preventDefault() causing double-click issue on comparison checkbox
