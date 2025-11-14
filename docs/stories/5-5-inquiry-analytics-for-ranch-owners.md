# Story 5.5: Inquiry Analytics for Ranch Owners

**Epic:** 5 - Inquiry & Communication  
**Story ID:** 5-5-inquiry-analytics-for-ranch-owners  
**Status:** ready-for-dev  
**Created:** 2025-11-14

---

## User Story

As a **ranch owner**,
I want to see analytics about my inquiries,
So that I can understand which bulls generate the most interest and track my response performance.

---

## Acceptance Criteria

### AC-5.5.1: Analytics Section Display
- Analytics section at top of inquiry dashboard
- Visible to ranch owners only

### AC-5.5.2: Key Metrics Display
- Total inquiries (all time)
- Unread count with badge
- Response rate percentage

### AC-5.5.3: Top Bulls by Inquiry Count
- Show top 5 bulls with most inquiries
- Display bull name and inquiry count
- Clickable to filter inquiries by that bull

### AC-5.5.4: Inquiries Over Time Chart
- Monthly inquiry counts for last 6 months
- Simple bar or line chart
- Clear axis labels

### AC-5.5.5: Click to Filter
- Clicking bull name filters inquiry list
- Shows only inquiries for that bull

### AC-5.5.6: Performance
- Analytics calculate in <1 second for 1000 inquiries
- Efficient database queries with aggregation

### AC-5.5.7: Response Rate Calculation
- Formula: (responded count / total inquiries) × 100
- Display as percentage with 1 decimal place

### AC-5.5.8: Ranch-Specific Data
- Analytics show only data for authenticated ranch owner's ranch
- Cannot see other ranches' analytics

---

## Tasks

- [ ] Create GET /api/inquiries/analytics endpoint
- [ ] Implement analytics calculations (aggregation queries)
- [ ] Create InquiryAnalytics component
- [ ] Display key metrics (total, unread, response rate)
- [ ] Show top 5 bulls by inquiry count
- [ ] Create inquiries over time chart
- [ ] Implement click-to-filter functionality
- [ ] Optimize query performance
- [ ] Testing (calculations, performance, authorization)

---

## Dev Notes

**API Route:** `/app/api/inquiries/analytics/route.ts` - GET handler with aggregation queries

**Component:** `components/InquiryAnalytics.tsx` - Display metrics and charts

**Performance:** Use Prisma aggregation, group by bull/month, limit to last 6 months

**References:**
- [Source: docs/tech-spec-epic-5.md#APIs > GET /api/inquiries/analytics]
- [Source: docs/tech-spec-epic-5.md#Workflows > Workflow 5: Ranch Owner Views Analytics]

---

## Dev Agent Record

### Context Reference

- `docs/stories/5-5-inquiry-analytics-for-ranch-owners.context.xml` - Story context with acceptance criteria, tasks, documentation references, code artifacts, interfaces, constraints, and testing guidance
