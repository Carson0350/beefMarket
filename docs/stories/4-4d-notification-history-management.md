# Story 4.4d: Notification History & Management

**Epic:** 4 - Bull Comparison & Favorites  
**Story ID:** 4-4d-notification-history-management  
**Status:** review  
**Created:** 2025-11-11  
**Developer:** Cascade (Claude 3.7 Sonnet)

---

## User Story

As a **breeder**,
I want to view my notification history and manage my notification preferences,
So that I can track changes and control what notifications I receive.

---

## Acceptance Criteria

### AC1: Notification Model
**Given** the system sends notifications  
**When** a notification is sent  
**Then** the system should:
- Store notification record in database
- Include notification type (inventory, price)
- Include bull information
- Include change details
- Include timestamp
- Include read/unread status

**And** notifications are queryable by user

### AC2: Notification History Page
**Given** I'm logged in as a breeder  
**When** I navigate to notification history  
**Then** I should see:
- List of recent notifications (last 30 days)
- Notification type indicator
- Bull name and image thumbnail
- What changed (summary)
- Timestamp (relative, e.g., "2 hours ago")
- Read/unread indicator
- Link to bull page

**And** notifications are sorted by date (newest first)

### AC3: Mark as Read
**Given** I have unread notifications  
**When** I view a notification or click on it  
**Then** the system should:
- Mark notification as read
- Update read status in database
- Update UI to show read state
- Reduce unread count badge

**And** read status persists

### AC4: Unread Count Badge
**Given** I have unread notifications  
**When** I view the navigation  
**Then** I should see:
- Badge with unread count
- Badge on notifications link
- Badge updates when notifications marked as read

**And** badge is visible and clear

### AC5: Notification Filtering
**Given** I'm viewing notification history  
**When** I want to filter notifications  
**Then** I should see:
- Filter by type (inventory, price, all)
- Filter by read/unread status
- Filter by date range (optional)

**And** filters update the list immediately

### AC6: Unsubscribe from Bull
**Given** I receive a notification email  
**When** I click "Unsubscribe" link in email  
**Then** I should:
- Be taken to unsubscribe page
- See bull information
- See option to disable notifications for this bull
- See option to disable all notifications
- Confirm unsubscribe action
- See confirmation message

**And** no more emails sent after unsubscribe

### AC7: Unsubscribe Token Security
**Given** an unsubscribe link is generated  
**When** the link is created  
**Then** it should:
- Include secure token
- Be valid for 30 days
- Be single-use or user-specific
- Prevent unauthorized unsubscribes

**And** expired tokens show appropriate message

---

## Tasks / Subtasks

**Task 1: Create Notification Model**
- [x] Design Notification schema
- [x] Add fields: type, bullId, userId, changeData, readAt, createdAt
- [x] Create Prisma migration
- [x] Test model relationships

**Task 2: Store Notifications on Send**
- [x] Update email sending to create Notification record
- [x] Store notification type
- [x] Store change details as JSON
- [x] Test notification creation

**Task 3: Create Notification History Page**
- [x] Create /notifications page
- [x] Fetch user's notifications (last 30 days)
- [x] Display notification list
- [x] Show notification details
- [x] Add read/unread indicators
- [x] Style page

**Task 4: Mark as Read Functionality**
- [x] Create API endpoint to mark as read
- [x] Update readAt timestamp
- [x] Update UI optimistically
- [x] Test mark as read

**Task 5: Unread Count Badge**
- [x] Query unread notification count
- [x] Add badge to navigation
- [x] Update count when marked as read
- [x] Style badge

**Task 6: Notification Filtering**
- [x] Add filter controls
- [x] Filter by type (inventory/price)
- [x] Filter by read/unread
- [x] Update list on filter changed
- [ ] Test filtering

**Task 7: Unsubscribe Flow**
- [ ] Generate unsubscribe tokens
- [ ] Add unsubscribe links to emails
- [ ] Create unsubscribe page
- [ ] Handle unsubscribe action
- [ ] Show confirmation
- [ ] Test unsubscribe flow

**Task 8: Testing**
- [ ] Test notification creation
- [ ] Test history page
- [ ] Test mark as read
- [ ] Test filtering
- [ ] Test unsubscribe
- [ ] Test token expiration

---

## Technical Notes

### Implementation Guidance

**Notification Model:**
```prisma
model Notification {
  id          String    @id @default(cuid())
  userId      String
  bullId      String
  type        NotificationType
  changeData  Json      // Stores old/new values, change type, etc.
  readAt      DateTime?
  createdAt   DateTime  @default(now())
  
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  bull        Bull      @relation(fields: [bullId], references: [id], onDelete: Cascade)
  
  @@index([userId, createdAt])
  @@index([userId, readAt])
}

enum NotificationType {
  INVENTORY_CHANGE
  PRICE_CHANGE
}
```

**Store Notification on Send:**
```typescript
async function sendInventoryChangeEmail(data: EmailData) {
  // Send email
  await resend.emails.send({ ... });
  
  // Store notification
  await prisma.notification.create({
    data: {
      userId: data.userId,
      bullId: data.bull.id,
      type: 'INVENTORY_CHANGE',
      changeData: {
        oldInventory: data.oldInventory,
        newInventory: data.newInventory,
        changeType: data.changeType,
      },
    },
  });
}
```

**Unsubscribe Token:**
```typescript
import crypto from 'crypto';

function generateUnsubscribeToken(userId: string, bullId: string): string {
  const data = `${userId}:${bullId}:${Date.now()}`;
  const secret = process.env.UNSUBSCRIBE_SECRET!;
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

function verifyUnsubscribeToken(token: string, userId: string, bullId: string): boolean {
  // Verify token matches and is not expired
  // Implementation depends on token format
}
```

### Architecture Alignment

**Database:**
- New Notification model
- Relationships to User and Bull
- Indexes for performance

**UI:**
- New notifications page
- Badge in navigation
- Unsubscribe landing page

### Affected Components

**New Files:**
- `app/notifications/page.tsx` - Notification history page
- `app/unsubscribe/page.tsx` - Unsubscribe landing page
- `app/api/notifications/[id]/read/route.ts` - Mark as read API
- `app/api/unsubscribe/route.ts` - Unsubscribe API

**Modified Files:**
- `prisma/schema.prisma` - Add Notification model
- `lib/email.ts` - Add unsubscribe links, store notifications
- `components/AuthButton.tsx` - Add notification count badge

---

## Prerequisites

**Required:**
- Story 4.4a complete (notifications being sent)
- Story 4.4b complete (notification preferences exist)

---

## Definition of Done

- [ ] Notification model created
- [ ] Notifications stored when sent
- [ ] History page displays notifications
- [ ] Mark as read works
- [ ] Unread count badge shows
- [ ] Filtering works
- [ ] Unsubscribe flow complete
- [ ] Token security implemented
- [ ] No console errors
- [ ] Code reviewed and approved

---

## Dev Agent Record

### Context Reference

- Story Context: `docs/stories/4-4d-notification-history-management.context.xml`

### File List

(To be filled during implementation)
