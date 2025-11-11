# Story 4.4c: Price Change Notifications

**Epic:** 4 - Bull Comparison & Favorites  
**Story ID:** 4-4c-price-change-notifications  
**Status:** drafted  
**Created:** 2025-11-11  
**Developer:**

---

## User Story

As a **breeder**,
I want to receive notifications when favorited bulls' prices change,
So that I can take advantage of price decreases or plan for increases.

---

## Acceptance Criteria

### AC1: Price Change Detection
**Given** I have favorited a bull with notifications enabled  
**When** the ranch owner updates the bull's price per straw  
**Then** the system should:
- Detect the price change
- Calculate the price difference
- Calculate percentage change
- Identify if price increased or decreased

**And** change detection happens on bull update

### AC2: Price Change Email Notification
**Given** a favorited bull's price changes  
**When** notifications are enabled for that favorite  
**Then** I should receive an email with:
- Bull name and link to bull page
- Old price and new price
- Price difference (dollar amount)
- Percentage change
- Visual indicator if price decreased (highlighted/emphasized)
- Ranch name and contact information

**And** email is sent immediately after update

### AC3: Price Decrease Emphasis
**Given** a bull's price decreases  
**When** I receive the notification email  
**Then** the email should:
- Highlight the price decrease prominently
- Use green color or positive indicator
- Include "Price Drop!" or similar messaging
- Show savings amount

**And** price decreases are visually distinct from increases

### AC4: Price Increase Notification
**Given** a bull's price increases  
**When** I receive the notification email  
**Then** the email should:
- Show the price increase clearly
- Use neutral color scheme
- Include new price and increase amount
- Maintain professional tone

**And** increases are communicated clearly but not negatively

---

## Tasks / Subtasks

**Task 1: Price Change Detection**
- [ ] Add price change detection to bull update endpoint
- [ ] Compare old vs new pricePerStraw
- [ ] Calculate price difference
- [ ] Calculate percentage change
- [ ] Determine if increase or decrease
- [ ] Test detection logic

**Task 2: Price Change Email Template**
- [ ] Create HTML email template for price changes
- [ ] Add price comparison section (old → new)
- [ ] Add price difference display
- [ ] Add percentage change display
- [ ] Style price decreases (green/positive)
- [ ] Style price increases (neutral)
- [ ] Make template mobile-responsive

**Task 3: Email Sending Function**
- [ ] Create sendPriceChangeEmail function
- [ ] Pass bull, user, and price data
- [ ] Use appropriate template based on increase/decrease
- [ ] Handle email sending errors
- [ ] Log email attempts
- [ ] Test email delivery

**Task 4: Integration & Testing**
- [ ] Connect price detection to notification sending
- [ ] Test with price increase
- [ ] Test with price decrease
- [ ] Test with multiple users
- [ ] Test with notifications disabled
- [ ] Verify email content accuracy

---

## Technical Notes

### Implementation Guidance

**Price Change Detection:**
```typescript
// In bull update API endpoint
if (oldBull.pricePerStraw !== updatedBull.pricePerStraw) {
  await notifyPriceChange(oldBull, updatedBull);
}

async function notifyPriceChange(oldBull: Bull, newBull: Bull) {
  const oldPrice = oldBull.pricePerStraw || 0;
  const newPrice = newBull.pricePerStraw || 0;
  const priceDifference = newPrice - oldPrice;
  const percentageChange = oldPrice > 0 ? ((priceDifference / oldPrice) * 100) : 0;
  const isDecrease = priceDifference < 0;

  const favorites = await prisma.favorite.findMany({
    where: {
      bullId: newBull.id,
      notificationsEnabled: true,
    },
    include: {
      user: { select: { email: true } },
    },
  });

  for (const favorite of favorites) {
    await sendPriceChangeEmail({
      userEmail: favorite.user.email,
      bull: newBull,
      oldPrice,
      newPrice,
      priceDifference,
      percentageChange,
      isDecrease,
    });
  }
}
```

**Email Template:**
```typescript
function getPriceChangeEmailHTML({
  bull,
  oldPrice,
  newPrice,
  priceDifference,
  percentageChange,
  isDecrease,
}: PriceChangeEmailData): string {
  const priceChangeColor = isDecrease ? '#10b981' : '#6b7280';
  const priceChangeLabel = isDecrease ? 'Price Drop!' : 'Price Update';
  
  return `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    ${isDecrease ? '<div style="background: #10b981; color: white; padding: 10px; text-align: center; font-weight: bold;">🎉 Price Drop!</div>' : ''}
    
    <h2>${bull.name}</h2>
    
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <p style="margin: 0; color: #6b7280; font-size: 14px;">Previous Price</p>
          <p style="margin: 5px 0; font-size: 20px; text-decoration: line-through;">$${oldPrice.toFixed(2)}</p>
        </div>
        <div style="font-size: 24px;">→</div>
        <div>
          <p style="margin: 0; color: #6b7280; font-size: 14px;">New Price</p>
          <p style="margin: 5px 0; font-size: 24px; font-weight: bold; color: ${priceChangeColor};">$${newPrice.toFixed(2)}</p>
        </div>
      </div>
      
      <div style="margin-top: 15px; text-align: center;">
        <p style="margin: 0; color: ${priceChangeColor}; font-weight: bold;">
          ${isDecrease ? 'Save' : 'Increase of'} $${Math.abs(priceDifference).toFixed(2)} 
          (${Math.abs(percentageChange).toFixed(1)}%)
        </p>
      </div>
    </div>
    
    <a href="${APP_URL}/bulls/${bull.slug}" style="display: block; background: #3b82f6; color: white; text-align: center; padding: 12px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
      View Bull Details
    </a>
  </div>
</body>
</html>
  `;
}
```

### Architecture Alignment

**Email Service:**
- Extends existing email infrastructure
- Uses Resend for delivery
- Follows established template patterns

**Change Detection:**
- Hooks into same bull update endpoint as inventory
- Parallel to inventory change detection
- Non-blocking async email sending

### Affected Components

**Modified Files:**
- `lib/email.ts` - Add sendPriceChangeEmail function
- `app/api/bulls/[id]/route.ts` - Add price change detection

### Edge Cases

- Price changes from null to value
- Price changes from value to null
- Very small price changes (< $0.01)
- Very large percentage changes
- Multiple rapid price changes

### Testing Considerations

- Test price increase
- Test price decrease
- Test with null prices
- Test percentage calculations
- Test email rendering
- Test with multiple users

---

## Prerequisites

**Required:**
- Story 4.4a complete (notification infrastructure exists)
- Bull update API endpoint exists

---

## Definition of Done

- [ ] Price change detection implemented
- [ ] Email template created
- [ ] Price decreases highlighted
- [ ] Percentage change calculated correctly
- [ ] Emails sent to users with notifications enabled
- [ ] Email content accurate
- [ ] No console errors
- [ ] Code reviewed and approved
- [ ] Tested with multiple scenarios

---

## Dev Agent Record

### File List

(To be filled during implementation)
