# Story 4.4b: Notification Preferences UI

**Epic:** 4 - Bull Comparison & Favorites  
**Story ID:** 4-4b-notification-preferences-ui  
**Status:** ready-for-dev  
**Created:** 2025-11-11  
**Developer:**

---

## User Story

As a **breeder**,
I want to control notification settings for each favorited bull,
So that I only receive notifications for bulls I'm actively tracking.

---

## Acceptance Criteria

### AC1: Per-Bull Notification Toggle
**Given** I'm viewing my favorites page  
**When** I see my favorited bulls  
**Then** I should see:
- Notification toggle switch for each bull
- Current notification status (on/off)
- Visual indicator of notification state

**And** toggle is easily accessible on each bull card

### AC2: Toggle Notification Setting
**Given** I have a favorited bull  
**When** I click the notification toggle  
**Then** the system should:
- Update the notificationsEnabled field immediately
- Show visual feedback (loading state)
- Update UI to reflect new state
- Persist change to database

**And** change takes effect immediately

### AC3: Notification Status Indicator
**Given** I'm viewing my favorites  
**When** I look at a bull card  
**Then** I should see:
- Clear visual indicator if notifications are ON (e.g., bell icon filled)
- Clear visual indicator if notifications are OFF (e.g., bell icon with slash)
- Tooltip explaining notification status

**And** status is visible at a glance

### AC4: Bulk Toggle Option
**Given** I have multiple favorited bulls  
**When** I want to change notifications for all  
**Then** I should see:
- "Enable all notifications" button
- "Disable all notifications" button
- Confirmation before bulk action

**And** bulk action updates all favorites at once

---

## Tasks / Subtasks

**Task 1: Create NotificationToggle Component**
- [ ] Create reusable NotificationToggle component
- [ ] Add bell icon (on/off states)
- [ ] Implement toggle functionality
- [ ] Add loading state
- [ ] Add error handling
- [ ] Style component

**Task 2: Update Favorites Page**
- [ ] Add NotificationToggle to each bull card
- [ ] Position toggle prominently
- [ ] Show current notification status
- [ ] Add tooltip for clarity
- [ ] Test UI responsiveness

**Task 3: Create Toggle API Endpoint**
- [ ] Create PATCH /api/favorites/[bullId]/notifications
- [ ] Validate user owns the favorite
- [ ] Update notificationsEnabled field
- [ ] Return updated favorite
- [ ] Handle errors gracefully

**Task 4: Implement Bulk Actions**
- [ ] Add "Enable All" button to favorites page
- [ ] Add "Disable All" button to favorites page
- [ ] Create bulk update API endpoint
- [ ] Add confirmation dialog
- [ ] Update UI after bulk action
- [ ] Test bulk operations

**Task 5: Testing**
- [ ] Test toggle on individual bulls
- [ ] Test bulk enable/disable
- [ ] Test with no favorites
- [ ] Test with many favorites
- [ ] Verify database updates
- [ ] Test error scenarios

---

## Technical Notes

### Implementation Guidance

**NotificationToggle Component:**
```typescript
// components/NotificationToggle.tsx
'use client';

import { useState } from 'react';
import { BellIcon, BellSlashIcon } from '@heroicons/react/24/outline';
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid';

interface NotificationToggleProps {
  bullId: string;
  bullName: string;
  initialEnabled: boolean;
}

export default function NotificationToggle({
  bullId,
  bullName,
  initialEnabled,
}: NotificationToggleProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    const newState = !enabled;
    
    // Optimistic update
    setEnabled(newState);

    try {
      const res = await fetch(`/api/favorites/${bullId}/notifications`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newState }),
      });

      if (!res.ok) {
        throw new Error('Failed to update notifications');
      }
    } catch (error) {
      // Revert on error
      setEnabled(!newState);
      console.error('Failed to toggle notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const Icon = enabled ? BellIconSolid : BellSlashIcon;

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`p-2 rounded-full transition-colors ${
        enabled
          ? 'text-blue-600 hover:bg-blue-50'
          : 'text-gray-400 hover:bg-gray-100'
      } disabled:opacity-50`}
      title={enabled ? `Notifications ON for ${bullName}` : `Notifications OFF for ${bullName}`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
```

**API Endpoint:**
```typescript
// app/api/favorites/[bullId]/notifications/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: { bullId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { enabled } = await request.json();

    // Update the favorite's notification setting
    const favorite = await prisma.favorite.updateMany({
      where: {
        userId: session.user.id,
        bullId: params.bullId,
      },
      data: {
        notificationsEnabled: enabled,
      },
    });

    if (favorite.count === 0) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, enabled });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}
```

**Update Favorites Page:**
```typescript
// app/favorites/page.tsx - Add to bull cards
import NotificationToggle from '@/components/NotificationToggle';

// In the favorites map
{favorites.map(({ bull, notificationsEnabled }) => (
  <div key={bull.id} className="relative">
    <BullCard bull={bull} isFavorited={true} />
    <div className="absolute top-2 right-2 bg-white rounded-full shadow-md">
      <NotificationToggle
        bullId={bull.id}
        bullName={bull.name}
        initialEnabled={notificationsEnabled}
      />
    </div>
  </div>
))}
```

### Architecture Alignment

**Component Structure:**
- Reusable NotificationToggle component
- Optimistic UI updates
- Error handling with reversion

**API Design:**
- RESTful endpoint pattern
- Authentication required
- Validates user owns favorite

### Affected Components

**New Files:**
- `components/NotificationToggle.tsx` - Toggle component
- `app/api/favorites/[bullId]/notifications/route.ts` - Toggle API

**Modified Files:**
- `app/favorites/page.tsx` - Add notification toggles
- `app/api/favorites/route.ts` - Include notificationsEnabled in response

### Edge Cases

- User toggles rapidly (debounce or disable during update)
- Network error during toggle (revert state)
- Favorite deleted while toggling
- User not authenticated
- Invalid bull ID

### Testing Considerations

- Test toggle on/off for single bull
- Test bulk enable/disable
- Test with slow network (loading state)
- Test error handling
- Test UI feedback
- Verify database persistence

---

## Prerequisites

**Required:**
- Story 4.4a complete (notificationsEnabled field exists)
- Favorites page exists

---

## Definition of Done

- [ ] NotificationToggle component created
- [ ] Toggle API endpoint works
- [ ] Toggles visible on favorites page
- [ ] Bulk actions implemented
- [ ] Optimistic UI updates work
- [ ] Error handling implemented
- [ ] Database updates persist
- [ ] No console errors
- [ ] Code reviewed and approved
- [ ] Tested with multiple scenarios

---

## Dev Agent Record

### Context Reference

- Story Context: `docs/stories/4-4b-notification-preferences-ui.context.xml`

### File List

(To be filled during implementation)
