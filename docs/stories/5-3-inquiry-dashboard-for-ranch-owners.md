# Story 5.3: Inquiry Dashboard for Ranch Owners

**Epic:** 5 - Inquiry & Communication  
**Story ID:** 5-3-inquiry-dashboard-for-ranch-owners  
**Status:** review  
**Created:** 2025-11-14  
**Developer:** Dev Agent (Amelia)

---

## User Story

As a **ranch owner**,
I want to view and manage all inquiries about my bulls in a centralized dashboard,
So that I can track breeder interest and ensure I don't miss any potential sales opportunities.

---

## Acceptance Criteria

### AC-5.3.1: Dashboard Access
**Given** I'm logged in as a ranch owner  
**When** I navigate to `/dashboard/inquiries`  
**Then** I should see the inquiry dashboard page

**And** the page is only accessible to authenticated ranch owners

### AC-5.3.2: Ranch-Specific Filtering
**Given** I'm viewing the inquiry dashboard  
**When** the page loads  
**Then** I should only see inquiries for bulls that belong to my ranch

**And** I cannot see inquiries for other ranches' bulls

### AC-5.3.3: Status Grouping
**Given** I'm viewing the inquiry dashboard  
**When** the inquiries are displayed  
**Then** they should be grouped by status:
- Unread (default expanded)
- Responded (collapsed by default)
- Archived (collapsed by default)

**And** each group shows the count of inquiries in that status

### AC-5.3.4: Inquiry List Display
**Given** I'm viewing inquiries in a status group  
**When** I look at each inquiry item  
**Then** each item should display:
- Bull name with thumbnail image (100x75px)
- Breeder name
- Date received (relative time, e.g., "2 hours ago")
- Message preview (first 100 characters with ellipsis)

**And** items are visually distinct and easy to scan

### AC-5.3.5: Chronological Sorting
**Given** inquiries are displayed in a status group  
**When** I review the list  
**Then** inquiries should be sorted by date (newest first) within each status group

### AC-5.3.6: Unread Count Badge
**Given** I have unread inquiries  
**When** I view the dashboard navigation  
**Then** I should see a badge showing the count of unread inquiries

**And** the badge updates when inquiry status changes

### AC-5.3.7: Inquiry Detail View
**Given** I'm viewing the inquiry list  
**When** I click on an inquiry item  
**Then** the inquiry should expand to show full details:
- Bull information (name, photo, link to bull page)
- Breeder contact information (name, email, phone)
- Full inquiry message
- Timestamp (full date and time)
- Status indicator

**And** I can collapse the detail view by clicking again

### AC-5.3.8: Pagination
**Given** I have more than 20 inquiries in a status group  
**When** I view the inquiry list  
**Then** inquiries should be paginated with 20 items per page

**And** I can navigate between pages using pagination controls

### AC-5.3.9: Performance
**Given** I have up to 100 inquiries  
**When** I load the inquiry dashboard  
**Then** the page should load in less than 2 seconds

**And** pagination navigation should respond in less than 300ms

---

## Tasks / Subtasks

**Task 1: Create Inquiry Dashboard Page** (AC: 5.3.1)
- [ ] Create `/app/dashboard/inquiries/page.tsx`
- [ ] Add authentication check (ranch owner only)
- [ ] Set up page layout with header
- [ ] Add navigation breadcrumbs
- [ ] Style with Tailwind CSS

**Task 2: Implement GET /api/inquiries Endpoint** (AC: 5.3.2, 5.3.5, 5.3.8)
- [ ] Create GET handler in `/app/api/inquiries/route.ts`
- [ ] Verify user is authenticated and is ranch owner
- [ ] Filter inquiries by authenticated user's ranch ID
- [ ] Support query parameters: status, page, limit
- [ ] Sort by createdAt DESC within status groups
- [ ] Implement pagination (20 items per page)
- [ ] Include bull details (name, slug, heroImage)
- [ ] Return inquiry count and pagination metadata

**Task 3: Create Inquiry List Component** (AC: 5.3.3, 5.3.4)
- [ ] Create `components/InquiryList.tsx`
- [ ] Group inquiries by status (Unread, Responded, Archived)
- [ ] Display count badge for each status group
- [ ] Render inquiry cards with thumbnail, name, date, preview
- [ ] Make Unread section expanded by default
- [ ] Add expand/collapse functionality for status groups
- [ ] Style for visual hierarchy

**Task 4: Implement Inquiry Card Component** (AC: 5.3.4, 5.3.7)
- [ ] Create `components/InquiryCard.tsx`
- [ ] Display bull thumbnail (100x75px)
- [ ] Show breeder name and relative date
- [ ] Truncate message to 100 characters
- [ ] Add click handler to expand/collapse details
- [ ] Render full details when expanded
- [ ] Include bull link and breeder contact info
- [ ] Add status indicator badge

**Task 5: Add Unread Count Badge to Navigation** (AC: 5.3.6)
- [ ] Fetch unread inquiry count in dashboard layout
- [ ] Display badge on "Inquiries" nav link
- [ ] Update count when inquiries are marked as responded
- [ ] Style badge (red background, white text)
- [ ] Position badge on top-right of nav item

**Task 6: Implement Pagination** (AC: 5.3.8)
- [ ] Create pagination component or use existing
- [ ] Display page numbers and navigation arrows
- [ ] Handle page changes with URL query params
- [ ] Update inquiry list on page change
- [ ] Show current page and total pages
- [ ] Disable prev/next buttons at boundaries

**Task 7: Optimize Performance** (AC: 5.3.9)
- [ ] Add database indexes (ranchId, status, createdAt)
- [ ] Implement efficient queries (select only needed fields)
- [ ] Use Next.js Server Components for initial load
- [ ] Add loading states during data fetching
- [ ] Test with 100 inquiries to verify <2s load time

**Task 8: Testing**
- [ ] Test dashboard access (auth required)
- [ ] Test ranch-specific filtering (can't see other ranches)
- [ ] Test status grouping and counts
- [ ] Test inquiry card display
- [ ] Test expand/collapse functionality
- [ ] Test pagination with multiple pages
- [ ] Test unread count badge updates
- [ ] Test performance with 100 inquiries
- [ ] Test responsive design on mobile/tablet
- [ ] Integration test: end-to-end dashboard flow

---

## Dev Notes

### Implementation Guidance

**Dashboard Page Structure:**
```typescript
// app/dashboard/inquiries/page.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { InquiryList } from '@/components/InquiryList';

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: { status?: string; page?: string };
}) {
  const session = await auth();
  
  if (!session?.user || session.user.role !== 'RANCH_OWNER') {
    redirect('/login');
  }

  // Fetch ranch for current user
  const ranch = await prisma.ranch.findUnique({
    where: { userId: session.user.id },
  });

  if (!ranch) {
    return <div>No ranch found for your account</div>;
  }

  // Fetch inquiries
  const page = parseInt(searchParams.page || '1');
  const status = searchParams.status;
  const limit = 20;

  const where = {
    ranchId: ranch.id,
    ...(status && { status: status.toUpperCase() }),
  };

  const [inquiries, totalCount] = await Promise.all([
    prisma.inquiry.findMany({
      where,
      include: {
        bull: {
          select: {
            id: true,
            name: true,
            slug: true,
            heroImage: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.inquiry.count({ where }),
  ]);

  // Group by status
  const groupedInquiries = {
    UNREAD: inquiries.filter(i => i.status === 'UNREAD'),
    RESPONDED: inquiries.filter(i => i.status === 'RESPONDED'),
    ARCHIVED: inquiries.filter(i => i.status === 'ARCHIVED'),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Inquiries</h1>
      
      <InquiryList
        inquiries={groupedInquiries}
        totalCount={totalCount}
        currentPage={page}
        pageSize={limit}
      />
    </div>
  );
}
```

**API Route:**
```typescript
// app/api/inquiries/route.ts (GET handler)
export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'RANCH_OWNER') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Get ranch for user
  const ranch = await prisma.ranch.findUnique({
    where: { userId: session.user.id },
  });

  if (!ranch) {
    return NextResponse.json(
      { error: 'Ranch not found' },
      { status: 404 }
    );
  }

  // Parse query params
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  // Build where clause
  const where: any = { ranchId: ranch.id };
  if (status) {
    where.status = status.toUpperCase();
  }

  // Fetch inquiries with pagination
  const [inquiries, totalCount] = await Promise.all([
    prisma.inquiry.findMany({
      where,
      include: {
        bull: {
          select: {
            id: true,
            name: true,
            slug: true,
            heroImage: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.inquiry.count({ where }),
  ]);

  return NextResponse.json({
    inquiries,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  });
}
```

**Inquiry List Component:**
```typescript
// components/InquiryList.tsx
'use client';

import { useState } from 'react';
import { InquiryCard } from './InquiryCard';

interface InquiryListProps {
  inquiries: {
    UNREAD: Inquiry[];
    RESPONDED: Inquiry[];
    ARCHIVED: Inquiry[];
  };
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export function InquiryList({
  inquiries,
  totalCount,
  currentPage,
  pageSize,
}: InquiryListProps) {
  const [expandedGroups, setExpandedGroups] = useState({
    UNREAD: true,
    RESPONDED: false,
    ARCHIVED: false,
  });

  const toggleGroup = (group: keyof typeof expandedGroups) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Unread Section */}
      <section>
        <button
          onClick={() => toggleGroup('UNREAD')}
          className="flex items-center justify-between w-full p-4 bg-red-50 rounded-lg"
        >
          <h2 className="text-xl font-semibold">
            Unread ({inquiries.UNREAD.length})
          </h2>
          <span>{expandedGroups.UNREAD ? '▼' : '▶'}</span>
        </button>
        
        {expandedGroups.UNREAD && (
          <div className="mt-4 space-y-3">
            {inquiries.UNREAD.map(inquiry => (
              <InquiryCard key={inquiry.id} inquiry={inquiry} />
            ))}
          </div>
        )}
      </section>

      {/* Responded Section */}
      <section>
        <button
          onClick={() => toggleGroup('RESPONDED')}
          className="flex items-center justify-between w-full p-4 bg-green-50 rounded-lg"
        >
          <h2 className="text-xl font-semibold">
            Responded ({inquiries.RESPONDED.length})
          </h2>
          <span>{expandedGroups.RESPONDED ? '▼' : '▶'}</span>
        </button>
        
        {expandedGroups.RESPONDED && (
          <div className="mt-4 space-y-3">
            {inquiries.RESPONDED.map(inquiry => (
              <InquiryCard key={inquiry.id} inquiry={inquiry} />
            ))}
          </div>
        )}
      </section>

      {/* Archived Section */}
      <section>
        <button
          onClick={() => toggleGroup('ARCHIVED')}
          className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg"
        >
          <h2 className="text-xl font-semibold">
            Archived ({inquiries.ARCHIVED.length})
          </h2>
          <span>{expandedGroups.ARCHIVED ? '▼' : '▶'}</span>
        </button>
        
        {expandedGroups.ARCHIVED && (
          <div className="mt-4 space-y-3">
            {inquiries.ARCHIVED.map(inquiry => (
              <InquiryCard key={inquiry.id} inquiry={inquiry} />
            ))}
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalCount > pageSize && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalCount / pageSize)}
        />
      )}
    </div>
  );
}
```

### Architecture Alignment

**Server Components:**
- Dashboard page uses Next.js Server Components for initial data fetch
- Reduces client-side JavaScript
- Improves initial page load performance

**Authentication:**
- Uses NextAuth.js session management
- Middleware protects dashboard routes
- Role-based access control (RANCH_OWNER only)

**Database Optimization:**
- Indexes on ranchId, status, createdAt for fast queries
- Pagination to limit data transfer
- Select only needed fields to reduce payload size

### Learnings from Previous Story

**From Story 5-2-inquiry-email-notifications-to-ranch-owners (Status: drafted)**

- **API Route Created**: POST /api/inquiries at `app/api/inquiries/route.ts` - this story adds GET handler to same file
- **Inquiry Model**: Database schema includes status field (UNREAD, RESPONDED, ARCHIVED) - use for filtering
- **Email Service**: Inquiries are being created with email notifications - dashboard displays these inquiries

[Source: stories/5-2-inquiry-email-notifications-to-ranch-owners.md]

### Project Structure Notes

**New Files to Create:**
- `app/dashboard/inquiries/page.tsx` - Main dashboard page
- `components/InquiryList.tsx` - Inquiry list with status grouping
- `components/InquiryCard.tsx` - Individual inquiry card

**Files to Modify:**
- `app/api/inquiries/route.ts` - Add GET handler
- Dashboard navigation - Add unread count badge

**Database:**
- Verify indexes exist: ranchId, status, createdAt (should be in schema already)

### References

- [Source: docs/tech-spec-epic-5.md#APIs > GET /api/inquiries]
- [Source: docs/tech-spec-epic-5.md#Detailed-Design > InquiryDashboard Page]
- [Source: docs/tech-spec-epic-5.md#Workflows > Workflow 3: Ranch Owner Views Inquiries]
- [Source: docs/tech-spec-epic-5.md#NFR > Performance > Inquiry Dashboard]
- [Source: docs/PRD.md#FR-8.3: Inquiry Dashboard]
- [Source: docs/architecture.md#Data Architecture > Inquiry Model]

---

## Definition of Done

- [ ] Dashboard page created and accessible at /dashboard/inquiries
- [ ] Authentication enforced (ranch owner only)
- [ ] GET /api/inquiries endpoint working
- [ ] Inquiries filtered by ranch ownership
- [ ] Status grouping implemented (Unread, Responded, Archived)
- [ ] Inquiry cards display all required information
- [ ] Expand/collapse functionality working
- [ ] Unread count badge in navigation
- [ ] Pagination working for >20 inquiries
- [ ] Performance <2s for 100 inquiries
- [ ] Responsive design on mobile/tablet/desktop
- [ ] Unit and integration tests passing
- [ ] No console errors or warnings
- [ ] Code reviewed and approved

---

## Dev Agent Record

### Context Reference

- `docs/stories/5-3-inquiry-dashboard-for-ranch-owners.context.xml` - Story context with acceptance criteria, tasks, documentation references, code artifacts, interfaces, constraints, and testing guidance

### Agent Model Used

(To be filled during implementation)

### Debug Log References

(To be filled during implementation)

### Completion Notes List

(To be filled during implementation)

### File List

(To be filled during implementation)
