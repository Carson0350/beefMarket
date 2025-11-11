# Story 4.4e: Notification Batching & Queue (OPTIONAL)

**Epic:** 4 - Bull Comparison & Favorites  
**Story ID:** 4-4e-notification-batching-queue  
**Status:** backlog  
**Created:** 2025-11-11  
**Developer:**

---

## User Story

As a **breeder**,
I want to receive batched notifications instead of individual emails for every change,
So that I'm not overwhelmed by too many emails.

---

## Acceptance Criteria

### AC1: Notification Queue Setup
**Given** the system needs to send notifications  
**When** a bull is updated  
**Then** the system should:
- Add notification to job queue (BullMQ)
- Process queue asynchronously
- Retry failed notifications
- Log queue operations

**And** notifications are reliable and don't block requests

### AC2: Notification Batching
**Given** multiple bulls are updated within a short time  
**When** notifications are queued  
**Then** the system should:
- Group notifications by user
- Wait for batching window (e.g., 1 hour)
- Send single email with all changes
- List all bulls and changes in one email

**And** maximum 1 email per hour per user

### AC3: Global Notification Preferences
**Given** I'm logged in as a breeder  
**When** I navigate to account settings  
**Then** I should see:
- Email frequency options (immediate, hourly, daily, weekly)
- Notification type checkboxes (inventory, price, EPDs)
- Global enable/disable toggle
- Save preferences button

**And** preferences apply to all favorited bulls

### AC4: Daily Digest Email
**Given** I have email frequency set to "daily"  
**When** favorited bulls are updated during the day  
**Then** I should receive:
- Single email at end of day (e.g., 6 PM)
- Summary of all changes
- Grouped by bull
- Links to all affected bulls

**And** only one email per day

### AC5: Weekly Digest Email
**Given** I have email frequency set to "weekly"  
**When** favorited bulls are updated during the week  
**Then** I should receive:
- Single email at end of week (e.g., Sunday evening)
- Summary of all changes for the week
- Grouped by bull
- Highlights most significant changes

**And** only one email per week

---

## Tasks / Subtasks

**Task 1: Setup BullMQ & Redis**
- [ ] Install BullMQ and Redis dependencies
- [ ] Configure Redis connection
- [ ] Create notification queue
- [ ] Test queue connection

**Task 2: Create NotificationPreferences Model**
- [ ] Design schema (frequency, types, enabled)
- [ ] Create migration
- [ ] Add relationship to User
- [ ] Test model

**Task 3: Queue Integration**
- [ ] Replace direct email sending with queue jobs
- [ ] Add jobs to queue on bull updates
- [ ] Process jobs asynchronously
- [ ] Implement retry logic
- [ ] Test queue processing

**Task 4: Batching Logic**
- [ ] Implement batching window (1 hour)
- [ ] Group notifications by user
- [ ] Create batch email template
- [ ] Send batched emails
- [ ] Test batching

**Task 5: Preferences UI**
- [ ] Create account settings page
- [ ] Add frequency selector
- [ ] Add notification type checkboxes
- [ ] Save preferences to database
- [ ] Test UI

**Task 6: Digest Email Implementation**
- [ ] Create daily digest job (cron)
- [ ] Create weekly digest job (cron)
- [ ] Query pending notifications
- [ ] Generate digest email
- [ ] Send digest
- [ ] Mark notifications as sent
- [ ] Test digests

**Task 7: Testing**
- [ ] Test queue reliability
- [ ] Test batching
- [ ] Test daily digest
- [ ] Test weekly digest
- [ ] Test preference changes
- [ ] Load test with many notifications

---

## Technical Notes

### Implementation Guidance

**BullMQ Setup:**
```typescript
// lib/queue.ts
import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

export const notificationQueue = new Queue('notifications', { connection });

// Worker
const worker = new Worker(
  'notifications',
  async (job) => {
    const { userId, bullId, type, changeData } = job.data;
    await processNotification({ userId, bullId, type, changeData });
  },
  { connection }
);
```

**NotificationPreferences Model:**
```prisma
model NotificationPreferences {
  id                String    @id @default(cuid())
  userId            String    @unique
  frequency         NotificationFrequency @default(IMMEDIATE)
  enabledTypes      NotificationType[]
  globallyEnabled   Boolean   @default(true)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum NotificationFrequency {
  IMMEDIATE
  HOURLY
  DAILY
  WEEKLY
}
```

**Batching Logic:**
```typescript
async function processBatchedNotifications() {
  // Get all pending notifications from last hour
  const notifications = await prisma.notification.findMany({
    where: {
      sentAt: null,
      createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
    },
    include: { user: true, bull: true },
  });

  // Group by user
  const groupedByUser = notifications.reduce((acc, notif) => {
    if (!acc[notif.userId]) acc[notif.userId] = [];
    acc[notif.userId].push(notif);
    return acc;
  }, {} as Record<string, Notification[]>);

  // Send batched email to each user
  for (const [userId, userNotifications] of Object.entries(groupedByUser)) {
    await sendBatchedEmail(userId, userNotifications);
    
    // Mark as sent
    await prisma.notification.updateMany({
      where: { id: { in: userNotifications.map(n => n.id) } },
      data: { sentAt: new Date() },
    });
  }
}
```

### Architecture Alignment

**Infrastructure:**
- Requires Redis server
- BullMQ for job queue
- Cron jobs for digests

**Scalability:**
- Handles high notification volume
- Prevents email spam
- Reliable delivery with retries

### Affected Components

**New Files:**
- `lib/queue.ts` - BullMQ queue setup
- `lib/workers/notification-worker.ts` - Queue worker
- `lib/cron/daily-digest.ts` - Daily digest job
- `lib/cron/weekly-digest.ts` - Weekly digest job
- `app/settings/notifications/page.tsx` - Preferences UI

**Modified Files:**
- `prisma/schema.prisma` - Add NotificationPreferences model
- `lib/email.ts` - Queue jobs instead of direct sending
- `package.json` - Add BullMQ and Redis dependencies

### Prerequisites

**Required:**
- Redis server installed and running
- Stories 4.4a-4.4d complete
- Cron job scheduler (or Next.js cron routes)

**Optional:**
- Redis Cloud for production
- Monitoring for queue health

---

## Definition of Done

- [ ] BullMQ and Redis configured
- [ ] NotificationPreferences model created
- [ ] Queue processing works
- [ ] Batching implemented
- [ ] Preferences UI complete
- [ ] Daily digest works
- [ ] Weekly digest works
- [ ] No console errors
- [ ] Code reviewed and approved
- [ ] Load tested

---

## Notes

**This story is OPTIONAL and can be deferred.**

The basic notification system (Stories 4.4a-4.4d) provides immediate value without the complexity of job queues and batching. This story should only be implemented if:
1. Users report too many emails
2. System needs to handle high notification volume
3. Team has Redis infrastructure available

Consider implementing Stories 4.4a-4.4d first, gather user feedback, then decide if batching is needed.

---

## Dev Agent Record

### File List

(To be filled during implementation)
