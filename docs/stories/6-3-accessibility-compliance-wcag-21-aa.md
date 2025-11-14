# Story 6.3: Accessibility Compliance (WCAG 2.1 AA)

Status: ready-for-dev

## Story

As a **user with disabilities**,
I want the platform to be accessible,
so that I can use it with assistive technologies.

## Acceptance Criteria

1. **Keyboard navigation** works for all interactive elements (no mouse required)
2. **Screen reader compatible** with proper ARIA labels and semantic HTML
3. **Color contrast ratio** meets 4.5:1 minimum for text
4. **Focus indicators** are clearly visible on all interactive elements
5. **Alt text** is provided for all images
6. **Form labels** are properly associated with inputs
7. **Skip navigation links** are present for keyboard users
8. **Lighthouse Accessibility score** is >90
9. **No accessibility errors** in axe DevTools audit
10. **Headings** follow proper hierarchy (h1, h2, h3 in order)
11. **ARIA landmarks** are used appropriately (main, nav, aside, footer)
12. **Error messages** are announced to screen readers

## Tasks / Subtasks

- [ ] Task 1: Run Accessibility Audit and Establish Baseline (AC: #8, #9)
  - [ ] Run Lighthouse accessibility audit on all major pages
  - [ ] Run axe DevTools audit on all major pages
  - [ ] Document current accessibility issues
  - [ ] Prioritize issues by severity (critical, serious, moderate, minor)
  - [ ] Create accessibility issue tracking spreadsheet
  - [ ] Set target: Lighthouse >90, zero critical/serious axe issues

- [ ] Task 2: Implement Keyboard Navigation (AC: #1, #4)
  - [ ] Test keyboard navigation on all pages (Tab, Shift+Tab, Enter, Space, Esc)
  - [ ] Ensure all interactive elements are keyboard accessible (buttons, links, forms, modals)
  - [ ] Fix focus order to follow logical reading order
  - [ ] Implement visible focus indicators (outline or ring) on all focusable elements
  - [ ] Ensure focus is trapped in modals/dialogs
  - [ ] Implement Esc key to close modals/dialogs
  - [ ] Test dropdown menus with keyboard (arrow keys, Enter)
  - [ ] Ensure no keyboard traps (can always navigate away)
  - [ ] Verify focus management after actions (e.g., after deleting item, focus moves logically)

- [ ] Task 3: Add Skip Navigation Links (AC: #7)
  - [ ] Implement "Skip to main content" link at top of page
  - [ ] Make skip link visible on focus
  - [ ] Ensure skip link works with keyboard (Tab, Enter)
  - [ ] Test skip link with screen reader
  - [ ] Add skip links for other repeated navigation if needed

- [ ] Task 4: Semantic HTML and ARIA Landmarks (AC: #2, #11)
  - [ ] Audit all pages for semantic HTML usage
  - [ ] Use semantic elements: header, nav, main, aside, footer, article, section
  - [ ] Add ARIA landmarks where semantic HTML isn't sufficient
  - [ ] Ensure only one main landmark per page
  - [ ] Add role="navigation" to nav elements if needed
  - [ ] Add role="complementary" to sidebars
  - [ ] Verify landmark structure with screen reader

- [ ] Task 5: Heading Hierarchy (AC: #10)
  - [ ] Audit heading structure on all pages
  - [ ] Ensure one h1 per page (page title)
  - [ ] Ensure headings follow logical order (h1 → h2 → h3, no skipping levels)
  - [ ] Fix any heading hierarchy issues
  - [ ] Use headings for structure, not just styling
  - [ ] Test heading navigation with screen reader (NVDA, VoiceOver)

- [ ] Task 6: Form Accessibility (AC: #6, #12)
  - [ ] Ensure all form inputs have associated labels (explicit or aria-label)
  - [ ] Use label element with for attribute
  - [ ] Add aria-describedby for help text
  - [ ] Implement aria-invalid and aria-errormessage for validation errors
  - [ ] Ensure error messages are announced to screen readers
  - [ ] Group related inputs with fieldset and legend
  - [ ] Test forms with screen reader
  - [ ] Verify keyboard navigation in forms (Tab, Shift+Tab, Enter)

- [ ] Task 7: Image Accessibility (AC: #5)
  - [ ] Audit all images for alt text
  - [ ] Add descriptive alt text for informative images (bull photos, logos)
  - [ ] Use empty alt="" for decorative images
  - [ ] Ensure alt text is concise and descriptive
  - [ ] For complex images (pedigree tree, charts), provide longer description
  - [ ] Test image descriptions with screen reader

- [ ] Task 8: Color Contrast (AC: #3)
  - [ ] Audit all text for color contrast using contrast checker tool
  - [ ] Ensure body text meets 4.5:1 contrast ratio
  - [ ] Ensure large text (18pt+) meets 3:1 contrast ratio
  - [ ] Fix any contrast issues (adjust colors or add backgrounds)
  - [ ] Test in high contrast mode
  - [ ] Verify contrast on interactive elements (buttons, links, form inputs)
  - [ ] Document color palette with contrast ratios

- [ ] Task 9: ARIA Labels and Descriptions (AC: #2)
  - [ ] Add aria-label to icon-only buttons (e.g., favorite heart, close X)
  - [ ] Add aria-labelledby to complex components
  - [ ] Add aria-describedby for additional context
  - [ ] Ensure aria-live regions for dynamic content (notifications, loading states)
  - [ ] Use aria-expanded for expandable sections
  - [ ] Use aria-selected for tabs/toggles
  - [ ] Avoid redundant ARIA (don't add aria-label if visible label exists)
  - [ ] Test ARIA labels with screen reader

- [ ] Task 10: Interactive Component Accessibility (AC: #1, #2, #4)
  - [ ] Audit all interactive components (buttons, dropdowns, modals, tabs)
  - [ ] Ensure buttons use button element (not div with onClick)
  - [ ] Add proper ARIA attributes to custom components
  - [ ] Implement keyboard support for custom components
  - [ ] Ensure modals/dialogs are accessible (focus trap, Esc to close, aria-modal)
  - [ ] Test dropdowns with keyboard and screen reader
  - [ ] Test tabs with arrow keys and screen reader
  - [ ] Verify comparison bar is keyboard accessible

- [ ] Task 11: Screen Reader Testing (AC: #2)
  - [ ] Test with NVDA (Windows) or VoiceOver (Mac)
  - [ ] Test all major pages (browse, bull detail, compare, dashboard, forms)
  - [ ] Verify all content is announced correctly
  - [ ] Verify navigation is logical
  - [ ] Verify form validation errors are announced
  - [ ] Verify dynamic content updates are announced (aria-live)
  - [ ] Document any screen reader issues and fix

- [ ] Task 12: Focus Management (AC: #1, #4)
  - [ ] Ensure focus is visible at all times (no outline: none without replacement)
  - [ ] Implement custom focus styles if default outline is insufficient
  - [ ] Manage focus after user actions (e.g., after submitting form, focus moves to success message)
  - [ ] Manage focus in modals (focus first focusable element on open, return focus on close)
  - [ ] Ensure focus doesn't get lost or stuck
  - [ ] Test focus management with keyboard navigation

- [ ] Task 13: Dynamic Content and Loading States (AC: #2, #12)
  - [ ] Add aria-live regions for dynamic content updates
  - [ ] Announce loading states to screen readers
  - [ ] Announce success/error messages to screen readers
  - [ ] Use aria-busy for loading states
  - [ ] Ensure loading spinners have accessible labels
  - [ ] Test dynamic content with screen reader

- [ ] Task 14: Tables and Data Accessibility (AC: #2)
  - [ ] Ensure data tables use proper table markup (table, thead, tbody, th, td)
  - [ ] Add scope attribute to th elements (scope="col" or scope="row")
  - [ ] Add caption or aria-label to tables
  - [ ] Ensure comparison table is accessible
  - [ ] Test tables with screen reader

- [ ] Task 15: Final Accessibility Audit and Testing (AC: #1-12)
  - [ ] Run final Lighthouse accessibility audit (target >90)
  - [ ] Run final axe DevTools audit (zero critical/serious issues)
  - [ ] Test all pages with keyboard only (no mouse)
  - [ ] Test all pages with screen reader (NVDA or VoiceOver)
  - [ ] Test in high contrast mode
  - [ ] Verify all acceptance criteria are met
  - [ ] Document accessibility improvements
  - [ ] Create accessibility testing checklist for future development
  - [ ] Manual test: Navigate entire site with keyboard only
  - [ ] Manual test: Navigate entire site with screen reader
  - [ ] Manual test: Verify all images have alt text
  - [ ] Manual test: Verify all forms are accessible
  - [ ] Manual test: Verify color contrast is sufficient

## Dev Notes

### Requirements Context

**From Epics (epics.md - Story 6.3):**
- Keyboard navigation for all interactive elements
- Screen reader compatible (ARIA labels, semantic HTML)
- Color contrast ratio: 4.5:1 minimum
- Focus indicators clearly visible
- Alt text for all images
- Form labels properly associated
- Skip navigation links present
- Lighthouse Accessibility score: >90

**From PRD (PRD.md - NFR-9, NFR-10):**
- WCAG 2.1 AA compliance required
- Inclusive design for broader user base
- Touch-friendly interface (44x44px minimum touch targets)
- No hover-only interactions
- Pinch-to-zoom enabled

**From Architecture (architecture.md - AD-8):**
- shadcn/ui components are accessible by default (Radix UI primitives)
- Radix UI provides keyboard nav and ARIA attributes
- Tailwind CSS for styling (can customize focus styles)

**From PRD (User Experience Principles - Accessibility):**
- WCAG 2.1 AA compliance target
- Keyboard navigation for all interactive elements
- Screen reader friendly labels and ARIA attributes
- Sufficient color contrast (4.5:1 minimum)
- Focus indicators clearly visible

**Architecture Constraints:**
- Use shadcn/ui components (already accessible with Radix UI)
- Semantic HTML throughout
- ARIA attributes where needed
- Test with screen readers (NVDA, VoiceOver)
- Color contrast checking tools

### Learnings from Previous Story

**From Story 6-2-performance-optimization (Status: drafted)**

- Loading states and skeletons implemented for better UX
- Dynamic imports used for heavy components
- Image optimization with Next.js Image component
- Performance improvements should not compromise accessibility

**Implications for Story 6.3:**
- Ensure loading states are announced to screen readers (aria-live)
- Verify dynamically loaded components are accessible
- Ensure lazy-loaded images have proper alt text
- Optimistic UI updates should maintain accessibility

**From Story 6-1-responsive-design-refinement (Status: drafted)**
- Touch targets are 44x44px minimum (good for accessibility)
- Mobile navigation implemented (hamburger menu or bottom nav)
- Forms are mobile-friendly
- Touch gestures implemented for galleries

**Implications for Story 6.3:**
- Verify mobile navigation is keyboard accessible
- Ensure hamburger menu can be operated with keyboard
- Touch gestures should not be the only way to interact (provide keyboard alternatives)
- Mobile forms should be accessible with screen readers

### Project Structure Notes

**Accessibility-Critical Pages:**
- `/app/browse/page.tsx` - Bull browse page (filters, cards, navigation)
- `/app/bulls/[slug]/page.tsx` - Bull detail page (gallery, data tables, contact form)
- `/app/compare/page.tsx` - Comparison page (complex table, multiple bulls)
- `/app/dashboard/page.tsx` - Ranch dashboard (navigation, actions)
- `/app/dashboard/inquiries/page.tsx` - Inquiry dashboard (list, filters)
- Authentication pages (login, signup) - Forms, validation

**Accessibility-Critical Components:**
- `components/ui/button.tsx` - shadcn/ui Button (should be accessible)
- `components/ui/form.tsx` - shadcn/ui Form (should be accessible)
- `components/ui/dialog.tsx` - shadcn/ui Dialog (should be accessible)
- `components/ui/select.tsx` - shadcn/ui Select (should be accessible)
- `components/BullCard.tsx` - Ensure images have alt text, links are accessible
- `components/BullGallery.tsx` - Ensure gallery is keyboard accessible
- `components/ComparisonTable.tsx` - Ensure table has proper markup
- `components/Navigation.tsx` - Ensure nav is keyboard accessible
- `components/FilterSidebar.tsx` - Ensure filters are keyboard accessible
- `components/InquiryForm.tsx` - Ensure form is accessible

**Files to Audit:**
- All page files - Check heading hierarchy, landmarks, keyboard nav
- All component files - Check ARIA labels, keyboard support
- `app/globals.css` - Ensure focus styles are visible (no outline: none)
- Form components - Check labels, error messages, validation

**Dependencies:**
- shadcn/ui (Radix UI primitives - accessible by default)
- React Hook Form (supports accessibility)
- Next.js (supports semantic HTML)

**Accessibility Testing Tools:**
- Chrome DevTools Lighthouse (Accessibility audit)
- axe DevTools browser extension
- WAVE browser extension
- Color contrast checker (WebAIM, Coolors)
- Screen readers: NVDA (Windows), VoiceOver (Mac), JAWS (Windows)
- Keyboard-only testing (no mouse)

**Accessibility Checklist:**
- [ ] All pages pass Lighthouse accessibility audit (>90)
- [ ] All pages pass axe DevTools audit (zero critical/serious issues)
- [ ] All interactive elements are keyboard accessible
- [ ] All images have alt text
- [ ] All forms have proper labels
- [ ] Color contrast meets 4.5:1 minimum
- [ ] Focus indicators are visible
- [ ] Heading hierarchy is correct
- [ ] ARIA landmarks are used
- [ ] Skip navigation links present
- [ ] Screen reader testing completed
- [ ] Keyboard-only testing completed

### References

- [Source: docs/epics.md#Epic 6 - Story 6.3]
- [Source: docs/PRD.md#NFR-9: WCAG 2.1 AA Compliance]
- [Source: docs/PRD.md#NFR-10: Mobile Accessibility]
- [Source: docs/PRD.md#User Experience Principles - Accessibility]
- [Source: docs/architecture.md#AD-8: Styling Strategy - shadcn/ui]
- [Source: docs/stories/6-2-performance-optimization.md]
- [Source: docs/stories/6-1-responsive-design-refinement.md]
- [WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/]
- [WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/]

## Dev Agent Record

### Context Reference

- `docs/stories/6-3-accessibility-compliance-wcag-21-aa.context.xml`

### Agent Model Used

<!-- To be filled during implementation -->

### Debug Log References

<!-- To be filled during implementation -->

### Completion Notes List

<!-- To be filled during implementation -->

### File List

<!-- To be filled during implementation -->
