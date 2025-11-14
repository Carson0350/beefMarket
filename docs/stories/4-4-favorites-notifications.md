# Story 4.4: Favorites Notifications

**Epic:** 4 - Bull Comparison & Favorites  
**Story ID:** 4-4-favorites-notifications  
**Status:** ready-for-dev  
**Created:** 2025-11-11  
**Developer:**

---

## User Story

As a **breeder**,
I want to receive notifications when favorited bulls' details change,
So that I stay informed about bulls I'm interested in.

---

## Acceptance Criteria

### AC1: Email Notification on Bull Updates
**Given** I have favorited bulls  
**When** a bull's details are updated by the ranch owner  
**Then** I should receive an email notification with:
- Bull name and link to bull page
- What changed (inventory, price, EPDs, etc.)
- Ranch owner contact information
- Timestamp of the change

**And** email is sent within 5 minutes of the update

### AC2: Inventory Change Notifications
**Given** I have favorited a bull  
**When** the bull's available straws count changes  
**Then** I should receive notification if:
- Straws become available (0 → positive number)
- Straws are running low (threshold: 5 or fewer)
- Bull becomes sold out (positive → 0)

**And** notification includes new inventory count

### AC3: Price Change Notifications
**Given** I have favorited a bull  
**When** the bull's price per straw changes  
**Then** I should receive notification with:
- Old price and new price
- Percentage change
- Link to bull page

**And** notification highlights if price decreased

### AC4: Notification Preferences Per Bull
**Given** I have favorited bulls  
**When** I view my favorites page  
**Then** I should see:
- Notification toggle for each favorited bull
- Option to enable/disable notifications per bull
- Current notification status visible

**And** preferences are saved immediately

### AC5: Global Notification Settings
**Given** I'm logged in as a breeder  
**When** I navigate to account settings  
**Then** I should see:
- Global notification preferences
- Option to disable all favorite notifications
- Email frequency settings (immediate, daily digest, weekly)
- Types of changes to notify about (checkboxes)

**And** settings apply to all favorited bulls

### AC6: Notification History
**Given** I have received notifications  
**When** I view my account or favorites page  
**Then** I should see:
- Recent notifications (last 30 days)
- What changed for each notification
- Link to affected bull
- Mark as read functionality

**And** notification history is accessible

### AC7: Unsubscribe Functionality
**Given** I receive notification emails  
**When** I click unsubscribe link in email  
**Then** I should:
- Be taken to unsubscribe confirmation page
- See options to unsubscribe from specific bull or all
- Confirm unsubscribe action
- See confirmation message

**And** no more emails are sent after unsubscribe

### AC8: Notification Batching
**Given** multiple favorited bulls are updated  
**When** changes occur within a short time period  
**Then** the system should:
- Batch notifications into single email (if multiple changes)
- List all changes in one email
- Avoid sending multiple emails rapidly

**And** user receives max 1 email per hour (configurable)

---

## Tasks / Subtasks

**Task 1: Extend Favorite Model for Notifications (AC4)**
- [ ] Add notification preferences to Favorite model
- [ ] Add fields: notificationsEnabled (boolean)
- [ ] Create migration
- [ ] Test model updates

**Task 2: Create Notification Preferences Model (AC5)**
- [ ] Create NotificationPreferences model
- [ ] Link to User model (one-to-one)
- [ ] Add fields: globalEnabled, frequency, changeTypes
- [ ] Create migration
- [ ] Test preferences model

**Task 3: Implement Change Detection (AC1-AC3)**
- [ ] Create bull update hook/middleware
- [ ] Detect field changes (inventory, price, EPDs)
- [ ] Compare old vs new values
- [ ] Identify significant changes
- [ ] Test change detection logic

**Task 4: Create Notification Queue System (AC1, AC8)**
- [ ] Set up job queue (e.g., BullMQ, pg-boss)
- [ ] Create notification job processor
- [ ] Implement batching logic
- [ ] Add retry mechanism for failed sends
- [ ] Test queue system

**Task 5: Build Email Templates (AC1-AC3)**
- [ ] Create email template for inventory changes
- [ ] Create email template for price changes
- [ ] Create email template for general updates
- [ ] Create batched notification template
- [ ] Add unsubscribe link to all templates
- [ ] Test email rendering

**Task 6: Implement Email Sending (AC1)**
- [ ] Integrate email service (Resend/SendGrid)
- [ ] Create email sending function
- [ ] Handle email failures gracefully
- [ ] Log email sends
- [ ] Test email delivery

**Task 7: Create Notification Preferences UI (AC4, AC5)**
- [ ] Add notification toggle to favorites page
- [ ] Create account settings page for notifications
- [ ] Build notification preferences form
- [ ] Implement save functionality
- [ ] Test preferences UI

**Task 8: Create Notification History (AC6)**
- [ ] Create Notification model for history
- [ ] Store sent notifications
- [ ] Create notification history page
- [ ] Implement mark as read
- [ ] Test notification history

**Task 9: Implement Unsubscribe Flow (AC7)**
- [ ] Create unsubscribe page
- [ ] Generate unsubscribe tokens
- [ ] Handle unsubscribe requests
- [ ] Show confirmation
- [ ] Test unsubscribe flow

**Task 10: Add Notification APIs (AC4, AC5)**
- [ ] Create API to update per-bull preferences
- [ ] Create API to update global preferences
- [ ] Create API to fetch notification history
- [ ] Test all API endpoints

---

## Technical Notes

### Implementation Guidance

**Extended Prisma Schema:**
```prisma
// prisma/schema.prisma

model Favorite {
  id                    String   @id @default(cuid())
  userId                String
  bullId                String
  notificationsEnabled  Boolean  @default(true)
  createdAt             DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  bull Bull @relation(fields: [bullId], references: [id], onDelete: Cascade)
  
  @@unique([userId, bullId])
  @@index([userId])
  @@index([bullId])
}

enum NotificationFrequency {
  IMMEDIATE
  DAILY_DIGEST
  WEEKLY_DIGEST
}

enum ChangeType {
  INVENTORY
  PRICE
  EPD
  GENERAL
}

model NotificationPreferences {
  id                String                 @id @default(cuid())
  userId            String                 @unique
  globalEnabled     Boolean                @default(true)
  frequency         NotificationFrequency  @default(IMMEDIATE)
  changeTypes       ChangeType[]
  createdAt         DateTime               @default(now())
  updatedAt         DateTime               @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Notification {
  id          String   @id @default(cuid())
  userId      String
  bullId      String
  changeType  ChangeType
  message     String
  oldValue    String?
  newValue    String?
  read        Boolean  @default(false)
  sentAt      DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  bull Bull @relation(fields: [bullId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([bullId])
}
```

**Change Detection Hook:**
```typescript
// lib/notifications/detectChanges.ts

interface BullChanges {
  inventory?: { old: number; new: number };
  price?: { old: number; new: number };
  epds?: { field: string; old: number; new: number }[];
}

export function detectBullChanges(
  oldBull: Bull,
  newBull: Bull
): BullChanges | null {
  const changes: BullChanges = {};
  
  // Check inventory
  if (oldBull.availableStraws !== newBull.availableStraws) {
    changes.inventory = {
      old: oldBull.availableStraws,
      new: newBull.availableStraws
    };
  }
  
  // Check price
  if (oldBull.pricePerStraw !== newBull.pricePerStraw) {
    changes.price = {
      old: oldBull.pricePerStraw,
      new: newBull.pricePerStraw
    };
  }
  
  // Check EPDs
  const epdChanges = [];
  const epdFields = ['birthWeight', 'weaningWeight', 'yearlingWeight'];
  for (const field of epdFields) {
    if (oldBull.epdData?.[field] !== newBull.epdData?.[field]) {
      epdChanges.push({
        field,
        old: oldBull.epdData?.[field],
        new: newBull.epdData?.[field]
      });
    }
  }
  if (epdChanges.length > 0) {
    changes.epds = epdChanges;
  }
  
  return Object.keys(changes).length > 0 ? changes : null;
}
```

**Notification Queue (using BullMQ):**
```typescript
// lib/notifications/queue.ts
import { Queue, Worker } from 'bullmq';
import { sendNotificationEmail } from './email';

export const notificationQueue = new Queue('notifications', {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
  }
});

// Worker to process notifications
const worker = new Worker('notifications', async (job) => {
  const { userId, bullId, changes } = job.data;
  
  // Fetch user preferences
  const prefs = await prisma.notificationPreferences.findUnique({
    where: { userId }
  });
  
  if (!prefs?.globalEnabled) return;
  
  // Check if notifications enabled for this bull
  const favorite = await prisma.favorite.findUnique({
    where: { userId_bullId: { userId, bullId } }
  });
  
  if (!favorite?.notificationsEnabled) return;
  
  // Send email
  await sendNotificationEmail(userId, bullId, changes);
  
  // Store notification history
  await prisma.notification.create({
    data: {
      userId,
      bullId,
      changeType: determineChangeType(changes),
      message: formatChangeMessage(changes),
      oldValue: JSON.stringify(changes.old),
      newValue: JSON.stringify(changes.new),
    }
  });
}, {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
  }
});
```

**Email Template:**
```typescript
// lib/notifications/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNotificationEmail(
  userId: string,
  bullId: string,
  changes: BullChanges
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const bull = await prisma.bull.findUnique({
    where: { id: bullId },
    include: { ranch: true }
  });
  
  if (!user || !bull) return;
  
  const unsubscribeToken = generateUnsubscribeToken(userId, bullId);
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_URL}/unsubscribe?token=${unsubscribeToken}`;
  
  let subject = `Update: ${bull.name}`;
  let message = '';
  
  if (changes.inventory) {
    subject = `Inventory Update: ${bull.name}`;
    message = `
      <p>The inventory for <strong>${bull.name}</strong> has changed:</p>
      <p>Available Straws: ${changes.inventory.old} → <strong>${changes.inventory.new}</strong></p>
    `;
  } else if (changes.price) {
    const priceDiff = changes.price.new - changes.price.old;
    const percentChange = ((priceDiff / changes.price.old) * 100).toFixed(1);
    subject = `Price ${priceDiff > 0 ? 'Increase' : 'Decrease'}: ${bull.name}`;
    message = `
      <p>The price for <strong>${bull.name}</strong> has changed:</p>
      <p>Price per Straw: $${changes.price.old} → <strong>$${changes.price.new}</strong> (${percentChange}%)</p>
    `;
  }
  
  await resend.emails.send({
    from: 'Wagner Beef <notifications@wagnerbeef.com>',
    to: user.email,
    subject,
    html: `
      <div>
        ${message}
        <p><a href="${process.env.NEXT_PUBLIC_URL}/bulls/${bull.slug}">View Bull Details</a></p>
        <hr />
        <p style="font-size: 12px; color: #666;">
          <a href="${unsubscribeUrl}">Unsubscribe from notifications for this bull</a>
        </p>
      </div>
    `
  });
}
```

**Notification Preferences API:**
```typescript
// app/api/notifications/preferences/route.ts
export async function GET() {
  const session = await getServerSession();
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  let prefs = await prisma.notificationPreferences.findUnique({
    where: { userId: session.user.id }
  });
  
  // Create default preferences if none exist
  if (!prefs) {
    prefs = await prisma.notificationPreferences.create({
      data: { userId: session.user.id }
    });
  }
  
  return Response.json({ preferences: prefs });
}

export async function PUT(request: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const body = await request.json();
  
  const prefs = await prisma.notificationPreferences.upsert({
    where: { userId: session.user.id },
    update: body,
    create: {
      userId: session.user.id,
      ...body
    }
  });
  
  return Response.json({ preferences: prefs });
}
```

### Architecture Alignment

**Job Queue:**
- Use BullMQ with Redis for notification queue
- Ensures reliable delivery and retry logic
- Allows batching and rate limiting

**Email Service:**
- Use Resend or SendGrid (from architecture doc)
- Transactional emails for notifications
- Track delivery status

**Change Detection:**
- Hook into bull update mutations
- Compare old vs new values
- Queue notification jobs for affected users

**Database:**
- NotificationPreferences model (one-to-one with User)
- Notification model for history
- Extend Favorite model with notification toggle

### Dependencies

**New Dependencies:**
```json
{
  "bullmq": "^4.0.0",
  "ioredis": "^5.3.0",
  "resend": "^2.0.0"
}
```

**Environment Variables:**
```env
REDIS_HOST=localhost
REDIS_PORT=6379
RESEND_API_KEY=re_xxx
NEXT_PUBLIC_URL=http://localhost:3000
```

### Affected Components

**New Files:**
- `/lib/notifications/detectChanges.ts` - Change detection logic
- `/lib/notifications/queue.ts` - BullMQ queue setup
- `/lib/notifications/email.ts` - Email sending logic
- `/app/api/notifications/preferences/route.ts` - Preferences API
- `/app/api/notifications/history/route.ts` - History API
- `/app/settings/notifications/page.tsx` - Settings page
- `/app/unsubscribe/page.tsx` - Unsubscribe page
- `/components/NotificationToggle.tsx` - Per-bull toggle

**Modified Files:**
- `/prisma/schema.prisma` - Add models
- `/app/api/bulls/[id]/route.ts` - Add change detection hook
- `/app/favorites/page.tsx` - Add notification toggles

### Edge Cases

- User has notifications disabled globally
- Bull deleted while notification queued
- User unsubscribes mid-notification
- Email service is down (retry logic)
- Multiple rapid changes to same bull (batching)
- User has no email address
- Redis connection fails
- Very large number of favorited bulls

### Testing Considerations

- Test change detection for all field types
- Test notification queue processing
- Test email sending and templates
- Test batching logic
- Test unsubscribe flow
- Test notification preferences save/load
- Test notification history display
- Test with email service mock

---

## Prerequisites

**Required:**
- Story 4.3 complete (Favorites system exists)
- Email service configured (Resend/SendGrid)
- Redis available for job queue

**Data Requirements:**
- Users with favorited bulls
- Bulls with varying data for testing changes

---

## Definition of Done

- [ ] NotificationPreferences model created
- [ ] Notification model created for history
- [ ] Change detection implemented
- [ ] Notification queue set up (BullMQ)
- [ ] Email templates created
- [ ] Email sending works
- [ ] Per-bull notification toggle works
- [ ] Global notification settings work
- [ ] Notification history displays
- [ ] Unsubscribe flow works
- [ ] Batching logic prevents spam
- [ ] Retry mechanism for failed sends
- [ ] Database migrations applied
- [ ] No console errors
- [ ] Code reviewed and approved
- [ ] Tested with real email delivery
- [ ] Tested notification batching

---

## Dev Agent Record

### Context Reference

- Story Context: `docs/stories/4-4-favorites-notifications.context.xml`

### Agent Model Used

(To be filled during implementation)

### Debug Log References

(To be filled during implementation)

### Completion Notes List

(To be filled during implementation)

### File List

(To be filled during implementation)
