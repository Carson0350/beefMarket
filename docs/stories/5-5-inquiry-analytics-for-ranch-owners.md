# Story 5.5: Inquiry Analytics for Ranch Owners

Status: drafted

## Story

As a **ranch owner**,
I want to see inquiry statistics,
so that I can understand which bulls generate the most interest.

## Acceptance Criteria

1. Analytics section displays at top of inquiry dashboard
2. Metrics shown: Total inquiries (all time), Unread count, Response rate percentage
3. "Top Bulls" section shows 5 bulls with most inquiries and their counts
4. "Inquiries Over Time" chart shows monthly inquiry counts for last 6 months
5. Clicking a bull name in analytics filters inquiry list to that bull
6. Analytics calculate in <1 second for 1000 inquiries
7. Response rate calculation: (responded count / total inquiries) * 100
8. Analytics are ranch-specific (only show data for authenticated ranch owner's ranch)

## Tasks / Subtasks

- [ ] Task 1: Create GET /api/inquiries/analytics Endpoint (AC: #2, #3, #4, #6, #7, #8)
  - [ ] Create `/app/api/inquiries/analytics/route.ts` with GET handler
  - [ ] Require authentication (RANCH_OWNER role)
  - [ ] Extract ranchId from authenticated user session
  - [ ] Implement query parameter: dateRange (optional, defaults to all time)
  - [ ] Calculate total inquiries count for ranch
  - [ ] Calculate unread count (status = UNREAD)
  - [ ] Calculate response rate: (RESPONDED count / total) * 100
  - [ ] Query top 5 bulls by inquiry count (GROUP BY bullId, ORDER BY count DESC, LIMIT 5)
  - [ ] Include bull name and photo in top bulls response
  - [ ] Calculate monthly inquiry counts for last 6 months (GROUP BY month)
  - [ ] Return InquiryAnalyticsResponse with all metrics
  - [ ] Optimize queries with aggregation and indexes
  - [ ] Handle errors: 401 (unauthorized), 403 (not ranch owner), 500 (server error)

- [ ] Task 2: Create InquiryAnalytics Component (AC: #1, #2, #3, #4)
  - [ ] Create `components/InquiryAnalytics.tsx` client component
  - [ ] Fetch analytics data from GET /api/inquiries/analytics
  - [ ] Display metrics cards: Total Inquiries, Unread Count, Response Rate
  - [ ] Format response rate as percentage (e.g., "75%")
  - [ ] Display "Top Bulls" section with bull names, thumbnails, and inquiry counts
  - [ ] Make bull names clickable to filter inquiry list
  - [ ] Style with Tailwind CSS (responsive grid layout)
  - [ ] Show loading state while fetching data
  - [ ] Handle empty state (no inquiries yet)

- [ ] Task 3: Create Inquiries Over Time Chart (AC: #4, #6)
  - [ ] Install chart library (Recharts or Chart.js)
  - [ ] Create chart component for monthly inquiry trend
  - [ ] Display last 6 months on x-axis
  - [ ] Display inquiry count on y-axis
  - [ ] Use bar chart or line chart
  - [ ] Style chart to match dashboard theme
  - [ ] Make chart responsive (mobile-friendly)

- [ ] Task 4: Integrate Analytics into Dashboard (AC: #1)
  - [ ] Add InquiryAnalytics component to top of `/app/dashboard/inquiries/page.tsx`
  - [ ] Position above inquiry list
  - [ ] Ensure analytics section is visible on page load

- [ ] Task 5: Implement Bull Filter from Analytics (AC: #5)
  - [ ] Add click handler to bull names in Top Bulls section
  - [ ] Update URL query param: ?bullId=[id]
  - [ ] Filter inquiry list to show only inquiries for selected bull
  - [ ] Add "Clear Filter" button to return to all inquiries
  - [ ] Highlight selected bull in analytics

- [ ] Task 6: Optimize Performance (AC: #6)
  - [ ] Add database indexes for analytics queries (ranchId, status, createdAt, bullId)
  - [ ] Use Prisma aggregation functions (count, groupBy)
  - [ ] Test query performance with 1000 inquiries (target: <1 second)
  - [ ] Consider caching analytics data (refresh every 5 minutes)
  - [ ] Use database views or materialized queries if needed

- [ ] Task 7: Testing (AC: #1-8)
  - [ ] Integration test: GET /api/inquiries/analytics returns correct metrics
  - [ ] Integration test: Total inquiries count is accurate
  - [ ] Integration test: Unread count matches UNREAD status count
  - [ ] Integration test: Response rate calculation is correct
  - [ ] Integration test: Top bulls query returns 5 bulls ordered by count
  - [ ] Integration test: Monthly counts aggregate correctly
  - [ ] Integration test: Unauthorized user → 401
  - [ ] Integration test: Analytics filtered by ranch (only owner's data)
  - [ ] Performance test: Analytics calculate in <1 second with 1000 inquiries
  - [ ] Manual test: View analytics section on dashboard
  - [ ] Manual test: Verify metrics display correctly
  - [ ] Manual test: Click bull name → inquiry list filters to that bull
  - [ ] Manual test: Verify chart displays last 6 months
  - [ ] Manual test: Test with empty state (no inquiries)
  - [ ] Manual test: Verify mobile responsiveness

## Dev Notes

### Requirements Context

**From Tech Spec Epic 5 (tech-spec-epic-5.md):**
- API endpoint: GET /api/inquiries/analytics with authentication required (RANCH_OWNER role)
- Authorization: User can only access analytics for their own ranch
- Response includes: totalInquiries, unreadCount, responseRate (percentage), topBulls (top 5 with counts), inquiriesOverTime (monthly counts for 6 months)
- Performance target: <1 second for 1000 inquiries
- Response rate formula: (RESPONDED / total) * 100

**From Epics (epics.md - Story 5.5):**
- Analytics on dashboard
- Metrics: Total inquiries (all time and last 30 days), inquiries by bull, response rate, trend chart
- Click bull names to view their inquiries
- Consider export to CSV functionality (optional)

**Architecture Constraints:**
- Database aggregation for efficient queries
- Indexes on ranchId, status, createdAt, bullId
- Caching for performance (analytics don't need real-time updates)
- Mobile-responsive chart design
- Ranch-specific data isolation

### Learnings from Previous Stories

**From Story 5-1 (Status: drafted)**
- Inquiry model includes: bullId, ranchId, status, createdAt
- Indexes on ranchId, bullId, status, createdAt already defined

**From Story 5-3 (Status: drafted)**
- Dashboard at `/app/dashboard/inquiries/page.tsx`
- Inquiry list supports filtering by status
- Unread count badge already implemented

**From Story 5-4 (Status: drafted)**
- Status values: UNREAD, RESPONDED, ARCHIVED
- respondedAt timestamp set when status changes to RESPONDED

**Implications for Story 5.5:**
- Use existing indexes for performant aggregation queries
- Analytics component integrates into existing dashboard page
- Bull filter can reuse filtering logic from Story 5.3
- Response rate uses RESPONDED status count
- Leverage existing Bull relationship for top bulls query

**From Story 4-4d (Status: done)**
- Notification history with analytics patterns
- Dashboard UI patterns for metrics display

### Project Structure Notes

**Existing Patterns:**
- Analytics components: Display metrics in card grid
- Dashboard integration: Add components to dashboard pages
- API aggregation: Use Prisma groupBy and count
- Chart libraries: Recharts for React-friendly charts

**Files to Create:**
- `app/api/inquiries/analytics/route.ts` - Analytics endpoint
- `components/InquiryAnalytics.tsx` - Analytics display component
- `components/InquiryChart.tsx` - Chart component for trend visualization

**Files to Modify:**
- `app/dashboard/inquiries/page.tsx` - Add InquiryAnalytics component at top
- Inquiry list component - Add bull filter support

**Dependencies:**
- `@prisma/client` - Database aggregation queries
- `next-auth` - Session management
- `recharts` or `chart.js` - Chart visualization library
- `date-fns` - Date manipulation for monthly grouping

**Optional Enhancements:**
- Export analytics to CSV
- Date range selector (last 30 days, last 90 days, all time)
- Comparison metrics (vs. previous period)

### References

- [Source: docs/tech-spec-epic-5.md#APIs and Interfaces - GET /api/inquiries/analytics]
- [Source: docs/tech-spec-epic-5.md#Workflows and Sequencing - Workflow 5]
- [Source: docs/tech-spec-epic-5.md#Data Models and Contracts - InquiryAnalyticsResponse]
- [Source: docs/tech-spec-epic-5.md#Non-Functional Requirements - Performance]
- [Source: docs/tech-spec-epic-5.md#Acceptance Criteria - AC-5.5]
- [Source: docs/epics.md#Epic 5 - Story 5.5]
- [Source: docs/stories/5-1-inquiry-contact-form.md#Tasks - Inquiry Model Indexes]
- [Source: docs/stories/5-3-inquiry-dashboard-for-ranch-owners.md#Tasks - Dashboard Page]

## Dev Agent Record

### Context Reference

docs/stories/5-5-inquiry-analytics-for-ranch-owners.context.xml

### Agent Model Used

<!-- To be filled during implementation -->

### Debug Log References

<!-- To be filled during implementation -->

### Completion Notes List

<!-- To be filled during implementation -->

### File List

<!-- To be filled during implementation -->
