# Test Scripts

This directory contains utility scripts for testing and development.

## Inquiry Test Scripts

### Create Test Inquiries

Creates realistic test inquiries for all published bulls in your database.

```bash
npm run test:inquiries
```

**What it does:**
- Finds all ranches with published bulls
- Creates 2-3 inquiries per bull
- Randomizes inquiry status (UNREAD, RESPONDED, ARCHIVED)
- Spreads inquiries across the last 7 days
- Uses realistic breeder names, emails, and messages

**Output:**
- Shows which ranches and bulls received inquiries
- Displays total inquiries created
- Shows breakdown by status

### Clear All Inquiries

Removes all inquiries from the database (useful for resetting test data).

```bash
npm run clear:inquiries
```

**Warning:** This deletes ALL inquiries. Use with caution!

## Development Mode Settings

### Email Verification Disabled

Email verification is automatically disabled in development mode (`NODE_ENV=development`).

This means:
- Users can access protected routes without verifying their email
- No verification emails are sent during registration
- You can test the full application flow immediately

**Location:** `auth.config.ts` - Line 25-26

To re-enable email verification in development, remove or comment out:
```typescript
const isDevelopment = process.env.NODE_ENV === 'development';
```

## Prerequisites

Before running test scripts, ensure you have:

1. **A ranch owner account** - Create one through the registration flow
2. **Published bulls** - Add bulls to your ranch and set status to PUBLISHED
3. **Database connection** - Ensure your `.env` file has valid `DATABASE_URL`

## Example Workflow

1. Register as a ranch owner
2. Create a ranch
3. Add some bulls and publish them
4. Run `npm run test:inquiries` to generate test data
5. Navigate to `/dashboard/inquiries` to see the inquiries
6. Test the dashboard features (filtering, expanding, etc.)
7. Run `npm run clear:inquiries` when you want to reset

## Troubleshooting

**"No ranches found"**
- Create a ranch owner account and ranch first

**"No published bulls"**
- Add bulls to your ranch and set their status to PUBLISHED

**"Module not found" errors**
- Run `npm install` to ensure all dependencies are installed
- Make sure you're in the project root directory
