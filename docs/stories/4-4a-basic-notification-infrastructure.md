# Story 4.4a: Basic Notification Infrastructure

**Epic:** 4 - Bull Comparison & Favorites  
**Story ID:** 4-4a-basic-notification-infrastructure  
**Status:** drafted  
**Created:** 2025-11-11  
**Developer:**

---

## User Story

As a **breeder**,
I want to receive email notifications when favorited bulls' inventory changes,
So that I stay informed about availability of bulls I'm interested in.

---

## Acceptance Criteria

### AC1: Favorite Model Extension
**Given** the Favorite model exists  
**When** I favorite a bull  
**Then** the system should:
- Store a `notificationsEnabled` field (default: true)
- Allow toggling notifications on/off per favorite

**And** field is added via database migration

### AC2: Inventory Change Detection
**Given** I have favorited a bull with notifications enabled  
**When** the ranch owner updates the bull's available straws  
**Then** the system should:
- Detect the inventory change
- Identify all users who favorited this bull
- Filter for users with notifications enabled

**And** change detection happens on bull update

### AC3: Email Notification for Inventory Changes
**Given** a favorited bull's inventory changes  
**When** notifications are enabled for that favorite  
**Then** I should receive an email with:
- Bull name and link to bull page
- Old inventory count and new inventory count
- Change type (became available, running low, sold out)
- Ranch name and contact information
- Timestamp of the change

**And** email is sent immediately after update

### AC4: Inventory Change Types
**Given** I have favorited a bull with notifications enabled  
**When** inventory changes occur  
**Then** I should be notified for:
- **Became Available**: Straws go from 0 to positive number
- **Running Low**: Straws decrease to 5 or fewer (but not 0)
- **Sold Out**: Straws go from positive to 0
- **Restocked**: Straws increase by 10 or more

**And** notification indicates the change type

### AC5: Email Template Design
**Given** an inventory change notification is sent  
**When** I receive the email  
**Then** it should include:
- Professional HTML email template
- Clear subject line (e.g., "Inventory Update: [Bull Name]")
- Bull hero image
- Prominent call-to-action button to view bull
- Footer with unsubscribe option (simple text for now)

**And** email is mobile-responsive

---

## Tasks / Subtasks

**Task 1: Database Schema Update**
- [ ] Add `notificationsEnabled` boolean field to Favorite model (default: true)
- [ ] Create and run Prisma migration
- [ ] Verify migration in database
- [ ] Update TypeScript types

**Task 2: Change Detection Hook**
- [ ] Identify bull update endpoint(s)
- [ ] Add change detection logic for inventory updates
- [ ] Compare old vs new inventory values
- [ ] Determine change type (became available, running low, sold out, restocked)
- [ ] Test change detection

**Task 3: Notification Query Logic**
- [ ] Create function to find users who favorited a bull
- [ ] Filter for users with notificationsEnabled = true
- [ ] Fetch user email addresses
- [ ] Test query performance

**Task 4: Email Template Creation**
- [ ] Create HTML email template for inventory changes
- [ ] Add bull information (name, image, link)
- [ ] Add inventory change details (old/new counts, change type)
- [ ] Add ranch information
- [ ] Add CTA button to view bull
- [ ] Make template mobile-responsive
- [ ] Test email rendering

**Task 5: Email Sending Integration**
- [ ] Use existing Resend email service (lib/email.ts)
- [ ] Create sendInventoryChangeNotification function
- [ ] Pass bull, user, and change data to email function
- [ ] Handle email sending errors gracefully
- [ ] Log email sending attempts
- [ ] Test email delivery

**Task 6: Integration & Testing**
- [ ] Connect change detection to notification sending
- [ ] Test end-to-end flow (update bull → email sent)
- [ ] Test with multiple users favoriting same bull
- [ ] Test with notifications disabled
- [ ] Verify email content accuracy
- [ ] Check email deliverability

---

## Technical Notes

### Implementation Guidance

**Database Migration:**
```prisma
model Favorite {
  id                String    @id @default(cuid())
  userId            String
  bullId            String
  notificationsEnabled Boolean @default(true)  // NEW FIELD
  createdAt         DateTime  @default(now())
  
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  bull              Bull      @relation(fields: [bullId], references: [id], onDelete: Cascade)
  
  @@unique([userId, bullId])
  @@index([userId])
  @@index([bullId])
}
```

**Change Detection Logic:**
```typescript
// In bull update API endpoint
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  // ... existing update logic
  
  const oldBull = await prisma.bull.findUnique({ where: { id: params.id } });
  const updatedBull = await prisma.bull.update({ ... });
  
  // Detect inventory change
  if (oldBull.availableStraws !== updatedBull.availableStraws) {
    await notifyInventoryChange(oldBull, updatedBull);
  }
  
  return NextResponse.json(updatedBull);
}

async function notifyInventoryChange(oldBull: Bull, newBull: Bull) {
  const changeType = determineChangeType(oldBull.availableStraws, newBull.availableStraws);
  
  // Find users who favorited this bull with notifications enabled
  const favorites = await prisma.favorite.findMany({
    where: {
      bullId: newBull.id,
      notificationsEnabled: true,
    },
    include: {
      user: {
        select: { email: true },
      },
    },
  });
  
  // Send email to each user
  for (const favorite of favorites) {
    await sendInventoryChangeEmail({
      userEmail: favorite.user.email,
      bull: newBull,
      oldInventory: oldBull.availableStraws,
      newInventory: newBull.availableStraws,
      changeType,
    });
  }
}

function determineChangeType(oldCount: number, newCount: number): string {
  if (oldCount === 0 && newCount > 0) return 'became_available';
  if (oldCount > 0 && newCount === 0) return 'sold_out';
  if (newCount <= 5 && newCount > 0) return 'running_low';
  if (newCount - oldCount >= 10) return 'restocked';
  return 'inventory_updated';
}
```

**Email Template:**
```typescript
// lib/email.ts - Add new function
export async function sendInventoryChangeEmail({
  userEmail,
  bull,
  oldInventory,
  newInventory,
  changeType,
}: {
  userEmail: string;
  bull: Bull & { ranch: Ranch };
  oldInventory: number;
  newInventory: number;
  changeType: string;
}) {
  const subject = getSubjectForChangeType(changeType, bull.name);
  
  await resend.emails.send({
    from: FROM_EMAIL,
    to: userEmail,
    subject,
    html: getInventoryChangeEmailHTML({
      bull,
      oldInventory,
      newInventory,
      changeType,
    }),
  });
}

function getSubjectForChangeType(changeType: string, bullName: string): string {
  switch (changeType) {
    case 'became_available':
      return `🎉 ${bullName} is now available!`;
    case 'sold_out':
      return `⚠️ ${bullName} is sold out`;
    case 'running_low':
      return `⏰ Limited availability: ${bullName}`;
    case 'restocked':
      return `📦 ${bullName} restocked`;
    default:
      return `Inventory update: ${bullName}`;
  }
}
```

### Architecture Alignment

**Email Service:**
- Uses existing Resend integration (lib/email.ts)
- No new dependencies required
- Leverages existing email templates pattern

**Database:**
- Single field addition to Favorite model
- Simple migration, no complex relationships
- Backward compatible (default: true)

**API Integration:**
- Hooks into existing bull update endpoint
- Minimal changes to existing code
- Async email sending (non-blocking)

### Affected Components

**New Files:**
- None (extends existing files)

**Modified Files:**
- `prisma/schema.prisma` - Add notificationsEnabled to Favorite model
- `lib/email.ts` - Add sendInventoryChangeEmail function
- `app/api/bulls/[id]/route.ts` - Add change detection hook (if exists)
- Create migration file via `npx prisma migrate dev`

### Edge Cases

- User has notifications enabled but email is invalid
- Multiple rapid inventory changes (send multiple emails for now)
- Bull deleted while notification is being sent
- User unfavorites bull while notification is being sent
- Email service is down (log error, don't crash)
- Very large number of users favorited same bull (performance)

### Testing Considerations

- Test with 0 users favoriting bull
- Test with 1 user favoriting bull
- Test with multiple users favoriting same bull
- Test with notifications disabled
- Test each change type (became available, sold out, running low, restocked)
- Test email content accuracy
- Test email deliverability
- Test error handling when email fails

---

## Prerequisites

**Required:**
- Story 4.3b complete (Favorites system exists)
- Resend email service configured
- Bull update API endpoint exists

**Data Requirements:**
- Test bulls with varying inventory
- Test user accounts with favorites

---

## Definition of Done

- [ ] Favorite model has notificationsEnabled field
- [ ] Database migration created and applied
- [ ] Change detection works for inventory updates
- [ ] Email template created and tested
- [ ] Emails sent to users with notifications enabled
- [ ] All change types handled correctly
- [ ] Email content is accurate and professional
- [ ] Error handling implemented
- [ ] No console errors
- [ ] Code reviewed and approved
- [ ] Tested with multiple scenarios
- [ ] Email deliverability verified

---

## Dev Agent Record

### Context Reference

(To be created during implementation)

### Agent Model Used

(To be filled during implementation)

### Debug Log References

(To be filled during implementation)

### Completion Notes List

(To be filled during implementation)

### File List

(To be filled during implementation)
