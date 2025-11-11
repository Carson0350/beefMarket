# Story 4.3: Breeder Account Creation & Favorites [DEPRECATED]

**Epic:** 4 - Bull Comparison & Favorites  
**Story ID:** 4-3-breeder-account-creation-favorites  
**Status:** deprecated  
**Created:** 2025-11-11  
**Deprecated:** 2025-11-11  
**Developer:**

---

## DEPRECATION NOTICE

**This story has been split into two smaller, more manageable stories:**

- **Story 4.3a: Breeder Account Creation & Login** - `docs/stories/4-3a-breeder-account-creation.md`
- **Story 4.3b: Bull Favorites System** - `docs/stories/4-3b-bull-favorites-system.md`

**Reason for split:** The original story was too large, combining authentication infrastructure with favorites feature implementation. Splitting allows for better sprint planning, clearer dependencies, and more focused development.

**Please use Stories 4.3a and 4.3b instead of this deprecated story.**

---

## User Story

As a **breeder**,
I want to create an account and save bulls to favorites,
So that I can track bulls of interest across browsing sessions.

---

## Acceptance Criteria

### AC1: Breeder Account Creation
**Given** I'm browsing bulls as a guest  
**When** I want to create a breeder account  
**Then** I should see:
- "Sign Up" or "Create Account" button in navigation
- Registration form with fields: Name, Email, Password
- Role automatically set to "Breeder"
- Form validation for all fields
- Password strength requirements

**And** account is created with Breeder role

### AC2: Breeder Login
**Given** I have a breeder account  
**When** I log in  
**Then** I should:
- See login form with email and password
- Be authenticated successfully
- See my name in navigation
- Have access to breeder-specific features

**And** session persists across page reloads

### AC3: Favorite Button on Bull Cards
**Given** I'm logged in as a breeder  
**When** I view bull cards on browse page  
**Then** I should see:
- Heart or star icon on each bull card
- Icon is unfilled for non-favorited bulls
- Icon is filled for favorited bulls
- Clicking icon toggles favorite status
- Optimistic UI update (immediate visual feedback)

**And** favorite state persists after page reload

### AC4: Favorite Button on Bull Detail Page
**Given** I'm logged in as a breeder  
**When** I view a bull detail page  
**Then** I should see:
- Prominent favorite button (heart/star icon)
- Button shows current favorite status
- Clicking toggles favorite status
- Optimistic UI update

**And** favorite state syncs with browse page

### AC5: Favorites Page
**Given** I'm logged in as a breeder  
**When** I navigate to my favorites page  
**Then** I should see:
- List of all favorited bulls
- Bulls displayed in card grid (same as browse page)
- Empty state if no favorites ("No favorites yet")
- Link to browse bulls from empty state
- Remove from favorites functionality

**And** favorites page is accessible from navigation

### AC6: Remove from Favorites
**Given** I have favorited bulls  
**When** I click unfavorite button  
**Then** the system should:
- Remove bull from favorites immediately
- Update UI optimistically
- Sync state across all pages
- Show confirmation (optional)

**And** bull is removed from favorites page

### AC7: Guest User Experience
**Given** I'm not logged in  
**When** I try to favorite a bull  
**Then** I should see:
- Prompt to sign up or log in
- Modal or redirect to login page
- Return to current page after login
- Favorite action completes after login

**And** guest users can still browse without account

### AC8: Favorite Count Display
**Given** I'm logged in as a breeder  
**When** I view navigation  
**Then** I should see:
- Favorites link with count badge
- Count updates when favorites change
- Count is visible and clear

**And** I can quickly see how many favorites I have

---

## Tasks / Subtasks

**Task 1: Extend User Model for Breeder Role (AC1, AC2)**
- [ ] Update Prisma User model to support "Breeder" role
- [ ] Create migration for role field
- [ ] Update NextAuth configuration for Breeder role
- [ ] Test user creation with Breeder role
- [ ] Verify role persists in session

**Task 2: Create Breeder Registration Flow (AC1)**
- [ ] Create registration page `/app/register/page.tsx`
- [ ] Build registration form component
- [ ] Implement form validation
- [ ] Create API endpoint for registration
- [ ] Set role to "Breeder" automatically
- [ ] Test registration flow

**Task 3: Update Login Flow (AC2)**
- [ ] Verify login page exists (from Epic 1)
- [ ] Test login with Breeder role
- [ ] Ensure session includes role
- [ ] Update navigation for logged-in breeders
- [ ] Test session persistence

**Task 4: Create Favorite Model (AC3-AC6)**
- [ ] Create Favorite model in Prisma schema
- [ ] Define many-to-many relationship (User ↔ Bull)
- [ ] Add timestamps (createdAt)
- [ ] Create migration
- [ ] Test model relationships

**Task 5: Create Favorites API Endpoints (AC3-AC6)**
- [ ] Create `/api/favorites/route.ts` (GET all favorites)
- [ ] Create `/api/favorites/[bullId]/route.ts` (POST add, DELETE remove)
- [ ] Implement authentication check
- [ ] Return favorite status for bulls
- [ ] Test API endpoints

**Task 6: Add Favorite Button to Bull Cards (AC3)**
- [ ] Update BullCard component
- [ ] Add favorite icon (heart/star)
- [ ] Implement toggle functionality
- [ ] Add optimistic UI updates
- [ ] Show filled/unfilled state
- [ ] Test favorite toggle on cards

**Task 7: Add Favorite Button to Bull Detail Page (AC4)**
- [ ] Update bull detail page
- [ ] Add prominent favorite button
- [ ] Implement toggle functionality
- [ ] Add optimistic UI updates
- [ ] Test favorite toggle on detail page

**Task 8: Create Favorites Page (AC5, AC6)**
- [ ] Create `/app/favorites/page.tsx`
- [ ] Fetch user's favorited bulls
- [ ] Display bulls in card grid
- [ ] Implement empty state
- [ ] Add remove from favorites functionality
- [ ] Test favorites page

**Task 9: Implement Guest User Prompts (AC7)**
- [ ] Detect guest user state
- [ ] Show login prompt when favoriting
- [ ] Create login modal or redirect
- [ ] Preserve intended action after login
- [ ] Test guest user flow

**Task 10: Add Favorites Count to Navigation (AC8)**
- [ ] Update navigation component
- [ ] Fetch favorites count
- [ ] Display count badge
- [ ] Update count on favorite changes
- [ ] Test count display

---

## Technical Notes

### Implementation Guidance

**Prisma Schema Updates:**
```prisma
// prisma/schema.prisma

enum UserRole {
  RANCH_OWNER
  BREEDER
  ADMIN
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  role          UserRole  @default(BREEDER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  accounts      Account[]
  sessions      Session[]
  favorites     Favorite[]
}

model Favorite {
  id        String   @id @default(cuid())
  userId    String
  bullId    String
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  bull Bull @relation(fields: [bullId], references: [id], onDelete: Cascade)
  
  @@unique([userId, bullId])
  @@index([userId])
  @@index([bullId])
}

model Bull {
  // ... existing fields
  favorites Favorite[]
}
```

**Favorites API Endpoints:**
```typescript
// app/api/favorites/route.ts
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getServerSession();
  
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      bull: {
        include: {
          ranch: {
            select: { name: true, slug: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  return Response.json({ favorites });
}

// app/api/favorites/[bullId]/route.ts
export async function POST(
  request: Request,
  { params }: { params: { bullId: string } }
) {
  const session = await getServerSession();
  
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const favorite = await prisma.favorite.create({
    data: {
      userId: session.user.id,
      bullId: params.bullId,
    }
  });
  
  return Response.json({ favorite });
}

export async function DELETE(
  request: Request,
  { params }: { params: { bullId: string } }
) {
  const session = await getServerSession();
  
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  await prisma.favorite.deleteMany({
    where: {
      userId: session.user.id,
      bullId: params.bullId,
    }
  });
  
  return Response.json({ success: true });
}
```

**Favorite Button Component:**
```typescript
// components/FavoriteButton.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface FavoriteButtonProps {
  bullId: string;
  initialIsFavorited: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function FavoriteButton({ 
  bullId, 
  initialIsFavorited,
  size = 'md' 
}: FavoriteButtonProps) {
  const { data: session } = useSession();
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if in link
    e.stopPropagation();
    
    if (!session) {
      // Show login modal or redirect
      router.push('/login?returnTo=' + window.location.pathname);
      return;
    }
    
    // Optimistic update
    setIsFavorited(!isFavorited);
    setIsLoading(true);
    
    try {
      if (isFavorited) {
        await fetch(`/api/favorites/${bullId}`, { method: 'DELETE' });
      } else {
        await fetch(`/api/favorites/${bullId}`, { method: 'POST' });
      }
    } catch (error) {
      // Revert on error
      setIsFavorited(isFavorited);
      console.error('Failed to toggle favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const Icon = isFavorited ? HeartIconSolid : HeartIcon;
  const sizeClass = size === 'sm' ? 'h-5 w-5' : size === 'lg' ? 'h-8 w-8' : 'h-6 w-6';
  
  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`${isFavorited ? 'text-red-500' : 'text-gray-400'} hover:text-red-600 transition-colors`}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Icon className={sizeClass} />
    </button>
  );
}
```

**Favorites Page:**
```typescript
// app/favorites/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import BullCard from '@/components/BullCard';

export default async function FavoritesPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login?returnTo=/favorites');
  }
  
  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      bull: {
        include: {
          ranch: {
            select: { name: true, slug: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Favorites</h1>
      
      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <HeartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No favorites yet
          </h2>
          <p className="text-gray-600 mb-6">
            Start browsing bulls and save your favorites here
          </p>
          <Link 
            href="/bulls"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Browse Bulls
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map(({ bull }) => (
            <BullCard key={bull.id} bull={bull} isFavorited={true} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Architecture Alignment

**Authentication:**
- Extend NextAuth.js configuration from Epic 1
- Add "Breeder" role to User model
- Session includes user role

**Database:**
- New Favorite model (many-to-many relationship)
- Unique constraint on userId + bullId
- Cascade delete when user or bull deleted

**Component Structure:**
- `/components/FavoriteButton.tsx` - Reusable favorite toggle
- `/app/favorites/page.tsx` - Favorites list page
- `/app/register/page.tsx` - Breeder registration
- Modify `/components/BullCard.tsx` - Add favorite button
- Modify `/app/bulls/[slug]/page.tsx` - Add favorite button

**API Routes:**
- `/app/api/favorites/route.ts` - GET all favorites
- `/app/api/favorites/[bullId]/route.ts` - POST/DELETE favorite

### Learnings from Previous Stories

**From Epic 1 (Authentication):**
- NextAuth.js already configured
- User model exists
- Session management in place

**To Extend:**
- Add Breeder role to existing User model
- Reuse authentication patterns
- Extend session to include role

### Affected Components

**New Files:**
- `/components/FavoriteButton.tsx` - Favorite toggle button
- `/app/favorites/page.tsx` - Favorites list page
- `/app/register/page.tsx` - Breeder registration
- `/app/api/favorites/route.ts` - Favorites API
- `/app/api/favorites/[bullId]/route.ts` - Toggle favorite API

**Modified Files:**
- `/prisma/schema.prisma` - Add Favorite model, update User
- `/components/BullCard.tsx` - Add favorite button
- `/app/bulls/[slug]/page.tsx` - Add favorite button
- Navigation component - Add favorites link with count

**Migrations:**
- Add UserRole enum
- Add role field to User
- Create Favorite table

### Edge Cases

- User not logged in (show login prompt)
- Duplicate favorite (unique constraint handles)
- Favoriting deleted bull
- User deletes account (cascade delete favorites)
- Network error during toggle (revert optimistic update)
- Very large number of favorites (pagination needed)
- Favorite button clicked rapidly (debounce)

### Testing Considerations

- Test breeder registration
- Test favorite toggle on cards
- Test favorite toggle on detail page
- Test favorites page with 0, 1, many favorites
- Test guest user prompts
- Test optimistic UI updates
- Test session persistence
- Test favorite count in navigation
- Test cascade deletes

---

## Prerequisites

**Required:**
- Story 1.3 complete (NextAuth.js authentication exists)
- Story 3.1 complete (Bull browse page with cards)
- Story 3.4 complete (Bull detail page)
- User model exists with authentication

**Data Requirements:**
- Bulls available for favoriting
- Test user accounts

---

## Definition of Done

- [ ] User model extended with Breeder role
- [ ] Favorite model created with relationships
- [ ] Breeder registration flow works
- [ ] Breeder login works
- [ ] Favorite button on bull cards works
- [ ] Favorite button on bull detail page works
- [ ] Favorites page displays favorited bulls
- [ ] Remove from favorites works
- [ ] Guest users prompted to login
- [ ] Favorites count in navigation
- [ ] Optimistic UI updates work
- [ ] Session persistence works
- [ ] Database migrations applied
- [ ] No console errors
- [ ] Code reviewed and approved
- [ ] Tested with multiple users
- [ ] Tested favorite/unfavorite flows

---

## Dev Agent Record

### Context Reference

- Story Context: `docs/stories/4-3-breeder-account-creation-favorites.context.xml`

### Agent Model Used

(To be filled during implementation)

### Debug Log References

(To be filled during implementation)

### Completion Notes List

(To be filled during implementation)

### File List

(To be filled during implementation)
