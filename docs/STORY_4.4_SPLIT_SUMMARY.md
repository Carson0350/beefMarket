# Story 4.4 Split Summary

**Date:** 2025-11-11  
**Reason:** Original Story 4.4 was too large and complex for a single sprint

---

## Original Story

**Story 4.4: Favorites Notifications**
- Email notifications for all bull changes
- Notification preferences (per-bull and global)
- Notification history
- Unsubscribe functionality
- Notification batching with job queue
- Required: BullMQ + Redis infrastructure

**Complexity:** Very Large  
**Estimated Effort:** 3-5 days

---

## New Story Breakdown

### Story 4.4a: Basic Notification Infrastructure ⭐ START HERE
**Focus:** Get basic notifications working quickly  
**Complexity:** Medium  
**Estimated Effort:** 4-6 hours

**Includes:**
- Add `notificationsEnabled` field to Favorite model
- Email notifications for inventory changes only
- Simple immediate email (no batching)
- Uses existing Resend email service
- 4 notification types: became available, running low, sold out, restocked

**Dependencies:** Story 4.3b complete  
**Status:** drafted

---

### Story 4.4b: Notification Preferences UI
**Focus:** Give users control over notifications  
**Complexity:** Small  
**Estimated Effort:** 2-3 hours

**Includes:**
- Per-bull notification toggle on favorites page
- Simple on/off switch for each favorited bull
- API endpoint to update preferences
- Bulk enable/disable all notifications

**Dependencies:** Story 4.4a complete  
**Status:** drafted

---

### Story 4.4c: Price Change Notifications
**Focus:** Expand notification types  
**Complexity:** Small-Medium  
**Estimated Effort:** 3-4 hours

**Includes:**
- Price change detection
- Email template for price changes
- Highlight price decreases (green/positive)
- Show price increases (neutral)
- Calculate percentage change

**Dependencies:** Story 4.4a complete  
**Status:** drafted

---

### Story 4.4d: Notification History & Management
**Focus:** Track and manage notifications  
**Complexity:** Medium  
**Estimated Effort:** 4-5 hours

**Includes:**
- Notification model for history storage
- Notification history page (last 30 days)
- Mark as read functionality
- Unread count badge in navigation
- Unsubscribe flow with secure tokens
- Filter notifications by type/status

**Dependencies:** Stories 4.4a, 4.4b complete  
**Status:** drafted

---

### Story 4.4e: Notification Batching & Queue (OPTIONAL)
**Focus:** Advanced optimization  
**Complexity:** Large  
**Estimated Effort:** 6-8 hours

**Includes:**
- BullMQ + Redis setup
- Job queue for reliable processing
- Batch multiple notifications into single email
- Daily/weekly digest options
- Global notification preferences
- Cron jobs for scheduled digests

**Dependencies:** Stories 4.4a-4.4d complete  
**Status:** backlog (can be deferred)

**⚠️ Note:** This story requires Redis infrastructure and should only be implemented if:
- Users report too many emails
- System needs to handle high notification volume
- Team has Redis available

---

## Recommended Implementation Order

1. **Story 4.4a** - Get basic notifications working
2. **Story 4.4b** - Add user control (quick win)
3. **Story 4.4c** - Expand to price notifications
4. **Story 4.4d** - Add history and management
5. **Story 4.4e** - (Optional) Add batching if needed

---

## Benefits of This Split

### ✅ Faster Time to Value
- Story 4.4a delivers working notifications in one session
- Users get value immediately without waiting for full feature set

### ✅ Incremental Complexity
- Each story builds on previous work
- Easier to test and debug
- Less risk of breaking changes

### ✅ Flexible Scope
- Story 4.4e can be deferred or skipped entirely
- Team can stop after 4.4d if batching isn't needed
- Easier to prioritize based on user feedback

### ✅ Better Testing
- Smaller stories are easier to test thoroughly
- Can deploy and validate each piece independently
- Reduces regression risk

### ✅ Clearer Dependencies
- Each story has clear prerequisites
- Easier to parallelize work if needed
- Better sprint planning

---

## Migration Notes

**Old Story File:** `docs/stories/4-4-favorites-notifications.md`  
**Action:** Kept for reference, marked as split

**New Story Files:**
- `docs/stories/4-4a-basic-notification-infrastructure.md`
- `docs/stories/4-4b-notification-preferences-ui.md`
- `docs/stories/4-4c-price-change-notifications.md`
- `docs/stories/4-4d-notification-history-management.md`
- `docs/stories/4-4e-notification-batching-queue.md`

**Sprint Status:** Updated to reflect new story breakdown
