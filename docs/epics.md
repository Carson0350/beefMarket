# wagnerBeef - Epic Breakdown

**Author:** Carson
**Date:** 2025-11-07
**Project Level:** Medium Complexity
**Target Scale:** 5-15 ranches, 500 bulls, 1,000 visitors/month (Year 1)

---

## Overview

This document provides the complete epic and story breakdown for wagnerBeef, decomposing the requirements from the [PRD](./PRD.md) into implementable stories.

### Epic Structure

**Epic 1: Foundation & Infrastructure** (5 stories)
Establish the technical foundation, project structure, authentication, and deployment pipeline. This epic creates the base that all subsequent features build upon.

**Epic 2: Ranch Owner Onboarding** (6 stories)
Enable ranch owners to create accounts, set up their ranch profile, and add their first bull. Delivers the core value proposition for sellers.

**Epic 3: Bull Discovery & Browsing** (7 stories)
Build the breeder-facing discovery experience with visual browsing, search, filtering, and detailed bull pages. Enables the "find perfect bull in 5 minutes" magic moment.

**Epic 4: Bull Comparison & Favorites** (4 stories)
Add side-by-side comparison and favorites/watchlist functionality for breeders to efficiently evaluate multiple bulls.

**Epic 5: Inquiry & Communication** (5 stories)
Implement the inquiry system connecting breeders with ranch owners, including email notifications and inquiry management dashboard.

**Epic 6: Polish & Production Readiness** (4 stories)
Responsive design refinement, performance optimization, accessibility compliance, and production deployment preparation.

**Total: 31 stories across 6 epics**

**Sequencing Rationale:**
- Epic 1 establishes foundation (must be first)
- Epic 2 enables ranch owners to add content (seller side)
- Epic 3 enables breeders to discover content (buyer side)
- Epic 4 enhances breeder evaluation capabilities
- Epic 5 connects buyers and sellers (completes core loop)
- Epic 6 ensures production quality and performance

This structure delivers incremental value: after Epic 2, ranchers can showcase bulls; after Epic 3, breeders can discover them; after Epic 5, the full marketplace loop is complete.

---

## Epic 1: Foundation & Infrastructure

**Goal:** Establish the technical foundation for wagnerBeef, including project structure, core dependencies, authentication system, database setup, and deployment pipeline. This epic creates the base infrastructure that all subsequent features will build upon.

**Business Value:** Enables rapid, reliable development of all user-facing features with proper security, scalability, and deployment automation from day one.

### Story 1.1: Project Initialization & Core Setup

As a **developer**,
I want a properly structured Next.js project with core dependencies configured,
So that I have a solid foundation to build features efficiently.

**Acceptance Criteria:**

**Given** I'm starting a new project
**When** I initialize the repository
**Then** the project structure includes:
- Next.js 14+ with App Router
- TypeScript configuration
- Tailwind CSS setup
- ESLint and Prettier configured
- Git repository with .gitignore

**And** the project runs locally with `npm run dev`
**And** basic folder structure exists: `/app`, `/components`, `/lib`, `/types`

**Prerequisites:** None (first story)

**Technical Notes:** 
- Use `create-next-app` with TypeScript and Tailwind
- Configure absolute imports with `@/` alias
- Set up Vercel project for deployment
- Initialize Git repository

---

### Story 1.2: Database Setup & ORM Configuration

As a **developer**,
I want a PostgreSQL database with Prisma ORM configured,
So that I can store and query data efficiently with type safety.

**Acceptance Criteria:**

**Given** the project is initialized
**When** I set up the database
**Then** PostgreSQL database is provisioned (local + Vercel Postgres)
**And** Prisma is installed and configured
**And** initial schema includes: `User`, `Ranch`, `Bull` models with basic fields
**And** Prisma migrations run successfully
**And** Prisma Client is generated and importable

**And** database connection works in development environment

**Prerequisites:** Story 1.1 (Project Initialization)

**Technical Notes:**
- Use Vercel Postgres for production
- Local development: PostgreSQL via Docker or Postgres.app
- Define schema in `prisma/schema.prisma`
- Set up environment variables for DATABASE_URL
- Include indexes on frequently queried fields (ranch_id, breed)

---

### Story 1.3: Authentication System with NextAuth.js

As a **developer**,
I want a secure authentication system with session management,
So that users can register, log in, and access protected routes.

**Acceptance Criteria:**

**Given** the database is configured
**When** I implement authentication
**Then** NextAuth.js is configured with:
- Email/password provider (Credentials)
- Session strategy with JWT
- Secure password hashing (bcrypt)
- Email verification flow (basic)

**And** API routes exist: `/api/auth/signin`, `/api/auth/signup`, `/api/auth/signout`
**And** middleware protects authenticated routes
**And** session data is accessible in server components
**And** login/signup pages are functional

**Prerequisites:** Story 1.2 (Database Setup)

**Technical Notes:**
- Use NextAuth.js v5 (Auth.js)
- Store sessions in database (Prisma adapter)
- Implement rate limiting on auth endpoints (5 attempts/15min)
- Hash passwords with bcrypt (cost factor 12)
- Set up NEXTAUTH_SECRET environment variable

---

### Story 1.4: Image Upload & Storage with Cloudinary

As a **developer**,
I want image upload functionality with cloud storage,
So that users can upload bull photos with automatic optimization.

**Acceptance Criteria:**

**Given** authentication is working
**When** I implement image upload
**Then** Cloudinary SDK is configured
**And** upload API route exists: `/api/upload`
**And** images are uploaded to Cloudinary with:
- Automatic WebP conversion
- Multiple size transformations (thumbnail, medium, large)
- Secure signed uploads

**And** upload component handles:
- File validation (JPG, PNG, max 10MB)
- Progress indication
- Error handling
**And** uploaded image URLs are returned and storable in database

**Prerequisites:** Story 1.3 (Authentication)

**Technical Notes:**
- Use Cloudinary Node.js SDK
- Configure upload presets for automatic optimization
- Implement signed uploads for security
- Store Cloudinary credentials in environment variables
- Create reusable upload utility function

---

### Story 1.5: Deployment Pipeline & Environment Configuration

As a **developer**,
I want automated deployment to Vercel with proper environment configuration,
So that code changes are automatically deployed to staging and production.

**Acceptance Criteria:**

**Given** the core features are implemented
**When** I push code to Git
**Then** Vercel automatically deploys:
- Main branch → Production
- Other branches → Preview deployments

**And** environment variables are configured:
- DATABASE_URL (Vercel Postgres)
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- CLOUDINARY_* credentials

**And** build succeeds without errors
**And** database migrations run on deployment
**And** HTTPS is enforced
**And** custom domain is configured (if available)

**Prerequisites:** Stories 1.1-1.4 (All foundation components)

**Technical Notes:**
- Connect Git repository to Vercel
- Configure build command: `npm run build`
- Set up Vercel Postgres integration
- Configure environment variables in Vercel dashboard
- Test deployment with a simple page
- Set up preview deployments for testing

---

## Epic 2: Ranch Owner Onboarding

**Goal:** Enable ranch owners to create accounts, set up their ranch profile, and add their first bull with complete genetic information and photos. This epic delivers the core seller-side value proposition.

**Business Value:** Ranch owners can professionally showcase their bulls online in under 30 minutes, reaching a national market of breeders.

### Story 2.1: Ranch Owner Registration & Role Assignment

As a **ranch owner**,
I want to create an account with my email and password,
So that I can access the platform to manage my ranch and bulls.

**Acceptance Criteria:**

**Given** I'm on the signup page
**When** I enter my email, password, and confirm password
**Then** my account is created with "Ranch Owner" role
**And** my password is securely hashed
**And** an email verification link is sent to my email
**And** I'm redirected to complete my ranch profile

**And** I cannot access ranch management features until email is verified

**Prerequisites:** Story 1.3 (Authentication System)

**Technical Notes:**
- Extend User model with `role` enum (RANCH_OWNER, BREEDER, ADMIN)
- Implement email verification token generation and validation
- Use React Hook Form for form validation
- Display clear error messages for duplicate emails or weak passwords

---

### Story 2.2: Ranch Profile Creation & Branding

As a **ranch owner**,
I want to create my ranch profile with name, location, and contact information,
So that breeders can learn about my operation and contact me.

**Acceptance Criteria:**

**Given** I've verified my email
**When** I complete the ranch profile form
**Then** my ranch profile is created with:
- Ranch name (required)
- State/location (required)
- Contact email (required)
- Phone number (required)
- About section (optional, 500 char max)
- Website URL (optional)

**And** a unique ranch slug is generated (e.g., "wagner-ranch")
**And** my ranch URL is: `wagnerbeef.com/[ranch-slug]`
**And** I'm redirected to the "Add Your First Bull" page

**Prerequisites:** Story 2.1 (Ranch Owner Registration)

**Technical Notes:**
- Create Ranch model in Prisma with one-to-one relationship to User
- Generate slug from ranch name (lowercase, hyphens, ensure uniqueness)
- Validate phone number format
- Create ranch profile page component
- Implement form with inline validation

---

### Story 2.3: Bull Profile Creation Form - Basic Info & Photos

As a **ranch owner**,
I want to add a bull with basic information and photos,
So that I can start showcasing my genetics to breeders.

**Acceptance Criteria:**

**Given** I'm logged in as a ranch owner
**When** I fill out the bull creation form (Part 1: Basics & Photos)
**Then** I can enter:
- Bull name (required)
- Registration number (optional)
- Breed (required, dropdown)
- Birth date (optional)
- Hero photo (required, upload)
- Additional photos (optional, up to 6)

**And** photos are uploaded to Cloudinary with progress indication
**And** I can reorder photos via drag-and-drop
**And** I can save as draft or continue to genetic data
**And** form validation prevents submission without required fields

**Prerequisites:** Story 2.2 (Ranch Profile), Story 1.4 (Image Upload)

**Technical Notes:**
- Create Bull model in Prisma with relationship to Ranch
- Multi-step form with state management (React Context or Zustand)
- Use Cloudinary upload widget or custom component
- Store image URLs in Bull model (array of strings)
- Implement draft saving (status: DRAFT vs PUBLISHED)

---

### Story 2.4: Bull Profile Creation Form - Genetic Data & Pedigree

As a **ranch owner**,
I want to add genetic data and pedigree information for my bull,
So that breeders can evaluate the genetics and bloodlines.

**Acceptance Criteria:**

**Given** I've completed basic info and photos
**When** I fill out genetic data section (Part 2)
**Then** I can enter:
- EPD values (birth weight, weaning weight, yearling weight, milk, etc.)
- Genetic markers (optional text fields)
- DNA test results (optional text area)
- Sire name (optional)
- Dam name (optional)
- Notable ancestors (optional, up to 6)

**And** EPD fields have inline help text explaining each metric
**And** I can save as draft or continue to performance data
**And** all fields are optional (flexibility for incomplete data)

**Prerequisites:** Story 2.3 (Basic Info & Photos)

**Technical Notes:**
- Extend Bull model with genetic data fields (JSON or separate columns)
- Create EPD input component with tooltips
- Implement help text for ranchers unfamiliar with digital entry
- Consider using JSON field for flexible genetic marker storage
- Validate numeric fields (EPDs should be numbers)

---

### Story 2.5: Bull Profile Creation Form - Performance & Inventory

As a **ranch owner**,
I want to add performance data and semen inventory count,
So that breeders know the bull's track record and availability.

**Acceptance Criteria:**

**Given** I've completed genetic data
**When** I fill out performance section (Part 3)
**Then** I can enter:
- Weight data (birth, weaning, yearling weights)
- Progeny performance notes (text area)
- Available semen straw count (number, required)
- Price per straw (optional)

**And** I can preview the complete bull profile
**And** I can publish or save as draft
**And** published bulls appear on my ranch page immediately

**Prerequisites:** Story 2.4 (Genetic Data & Pedigree)

**Technical Notes:**
- Complete Bull model with performance fields
- Implement preview modal showing how bull will appear to breeders
- Update bull status to PUBLISHED on final submission
- Redirect to ranch dashboard showing all bulls
- Display success message with shareable bull URL

---

### Story 2.6: Ranch Dashboard & Bull Management

As a **ranch owner**,
I want a dashboard showing all my bulls with edit and archive capabilities,
So that I can manage my inventory and keep information current.

**Acceptance Criteria:**

**Given** I'm logged in as a ranch owner
**When** I visit my dashboard
**Then** I see a list/grid of all my bulls (published and draft)
**And** each bull shows: Photo, name, breed, status, inventory count
**And** I can click "Edit" to modify any bull
**And** I can click "Archive" to hide sold-out bulls
**And** I can click "Add New Bull" to create another
**And** I see my ranch URL with a "Copy Link" button

**And** archived bulls are hidden from public view but visible to me

**Prerequisites:** Story 2.5 (Performance & Inventory)

**Technical Notes:**
- Create dashboard page at `/dashboard`
- Implement bull list with filter tabs (All, Published, Draft, Archived)
- Add soft delete/archive functionality (archived boolean field)
- Create edit flow reusing creation form components
- Display ranch statistics (total bulls, active listings, inquiries)

---

## Epic 3: Bull Discovery & Browsing

**Goal:** Build the breeder-facing discovery experience with visual browsing, advanced search and filtering, and detailed bull pages. This epic enables the "find perfect bull in 5 minutes" magic moment.

**Business Value:** Breeders can efficiently discover and evaluate bulls from multiple ranches with all genetic data in one place.

### Story 3.1: Public Bull Browse Page with Card Grid

As a **breeder**,
I want to browse all available bulls in a visual grid,
So that I can quickly scan options and find bulls that catch my eye.

**Acceptance Criteria:**

**Given** I visit the browse page
**When** the page loads
**Then** I see a responsive grid of bull cards:
- 4 columns on desktop, 2 on tablet, 1 on mobile
- Each card shows: Hero photo, bull name, breed, 2-3 key EPDs, ranch name
- Cards are clickable to view details

**And** bulls are paginated (20 per page) or infinite scroll
**And** only published, non-archived bulls are shown
**And** default sort is by recently added

**Prerequisites:** Story 2.5 (Bulls can be published)

**Technical Notes:**
- Create `/browse` page
- Fetch bulls with Prisma (include ranch data)
- Implement responsive grid with Tailwind
- Use Next.js Image component for optimized loading
- Add loading skeleton for better UX

---

### Story 3.2: Advanced Filtering System

As a **breeder**,
I want to filter bulls by breed, EPD ranges, location, and availability,
So that I can narrow down to bulls matching my specific breeding goals.

**Acceptance Criteria:**

**Given** I'm on the browse page
**When** I apply filters
**Then** I can filter by:
- Breed (multi-select dropdown)
- EPD ranges (sliders for birth weight, weaning weight, yearling weight)
- State/location (dropdown)
- Availability (in stock toggle)
- Price range (slider, if listed)

**And** filters apply instantly without page reload
**And** filter state persists during session
**And** I can clear all filters with one click
**And** active filters are visually indicated

**Prerequisites:** Story 3.1 (Bull Browse Page)

**Technical Notes:**
- Implement filter sidebar component
- Use URL query parameters for filter state (shareable filtered views)
- Client-side filtering for <100 bulls, server-side for larger datasets
- Debounce slider inputs (300ms)
- Store filter state in URL for bookmarking

---

### Story 3.3: Text Search Functionality

As a **breeder**,
I want to search by bull name, registration number, or ranch name,
So that I can quickly find specific bulls or ranches.

**Acceptance Criteria:**

**Given** I'm on the browse page
**When** I type in the search box
**Then** results update as I type (debounced 300ms)
**And** search matches: Bull name, registration number, ranch name
**And** partial matches are supported
**And** matching terms are highlighted in results
**And** search works in combination with filters

**Prerequisites:** Story 3.2 (Advanced Filtering)

**Technical Notes:**
- Add search input to browse page header
- Implement full-text search (Prisma or PostgreSQL full-text)
- Debounce search input
- Highlight matching terms in results
- Consider search analytics for future improvements

---

### Story 3.4: Detailed Bull Profile Page

As a **breeder**,
I want to view complete bull information on a dedicated page,
So that I have all genetic data needed to evaluate the bull.

**Acceptance Criteria:**

**Given** I click on a bull card
**When** the detail page loads
**Then** I see:
- Photo gallery with zoom capability (hero + additional photos)
- Basic info: Name, registration number, breed, birth date
- Genetic data: All EPDs in formatted table, genetic markers, DNA results
- Pedigree: Sire, dam, notable ancestors (visual tree if possible)
- Performance: Weight data, progeny performance notes
- Inventory: Available semen straw count
- Ranch info: Ranch name (link to ranch page), contact button

**And** the page has unique URL: `/bulls/[bull-slug]`
**And** social media meta tags for rich previews
**And** page is mobile-responsive

**Prerequisites:** Story 3.3 (Search Functionality)

**Technical Notes:**
- Create `/bulls/[slug]` dynamic route
- Fetch bull with related ranch data
- Implement image gallery component with lightbox
- Create pedigree tree visualization (simple 3-generation display)
- Add Open Graph meta tags for social sharing
- Implement breadcrumb navigation

---

### Story 3.5: Ranch Public Profile Page

As a **breeder**,
I want to view a ranch's profile and all their bulls,
So that I can learn about the operation and browse their full inventory.

**Acceptance Criteria:**

**Given** I visit a ranch URL
**When** the page loads at `/[ranch-slug]`
**Then** I see:
- Ranch name, location, about section
- Contact information (email, phone)
- Website link (if provided)
- Grid of all their published bulls
- Total bull count

**And** clicking a bull opens its detail page
**And** the page is shareable (ranch owners can send this URL to clients)
**And** page is mobile-responsive

**Prerequisites:** Story 3.4 (Bull Detail Page)

**Technical Notes:**
- Create `/[ranch-slug]` dynamic route
- Fetch ranch with all published bulls
- Reuse bull card component from browse page
- Add "Contact Ranch" button (links to inquiry form)
- Handle 404 for non-existent ranch slugs

---

### Story 3.6: Shareable Bull Links & Copy Functionality

As a **ranch owner** or **breeder**,
I want to easily copy and share bull URLs,
So that I can send specific bulls to others via email, text, or social media.

**Acceptance Criteria:**

**Given** I'm viewing a bull detail page
**When** I click the "Share" or "Copy Link" button
**Then** the bull's URL is copied to my clipboard
**And** a confirmation message appears
**And** the URL works when pasted (opens the bull detail page)

**And** on ranch dashboard, each bull has a "Copy Link" button
**And** shared links include Open Graph tags for rich previews

**Prerequisites:** Story 3.5 (Ranch Profile Page)

**Technical Notes:**
- Implement copy-to-clipboard functionality
- Add share button to bull detail pages
- Add copy link button to ranch dashboard
- Ensure Open Graph meta tags are present for rich social previews
- Consider adding QR code generation (deferred to Phase 2)

---

### Story 3.7: Guest Browsing (No Account Required)

As a **breeder**,
I want to browse and view bulls without creating an account,
So that I can explore the platform before committing to sign up.

**Acceptance Criteria:**

**Given** I'm not logged in
**When** I visit the browse page or bull detail pages
**Then** I can view all public content without restrictions
**And** I see a subtle prompt to create an account for favorites/notifications
**And** the inquiry form works for guests (requires email input)

**And** account creation is optional, not forced

**Prerequisites:** Story 3.6 (Shareable Links)

**Technical Notes:**
- Ensure all public pages work without authentication
- Add conditional rendering for logged-in features (favorites, saved comparisons)
- Display subtle CTAs for account benefits
- Track guest vs authenticated user analytics
- Inquiry form captures guest email for responses

---

## Epic 4: Bull Comparison & Favorites

**Goal:** Add side-by-side comparison and favorites/watchlist functionality for breeders to efficiently evaluate multiple bulls and track bulls of interest.

**Business Value:** Breeders can make informed decisions faster by comparing bulls directly and organizing their research.

### Story 4.1: Bull Comparison Selection

As a **breeder**,
I want to select 2-3 bulls for comparison,
So that I can evaluate them side-by-side.

**Acceptance Criteria:**

**Given** I'm browsing bulls
**When** I click "Compare" checkbox on bull cards
**Then** selected bulls are added to comparison (max 3)
**And** a floating comparison bar appears showing selected bulls
**And** I can remove bulls from comparison
**And** comparison state persists during session
**And** I see a "Compare Now" button when 2+ bulls are selected

**Prerequisites:** Story 3.7 (Guest Browsing)

**Technical Notes:**
- Add comparison state management (React Context or Zustand)
- Store selected bull IDs in session storage
- Create floating comparison bar component
- Add checkbox to bull cards
- Implement max 3 bulls validation

---

### Story 4.2: Side-by-Side Comparison View

As a **breeder**,
I want to view selected bulls in aligned columns,
So that I can easily compare their genetic data and photos.

**Acceptance Criteria:**

**Given** I've selected 2-3 bulls for comparison
**When** I click "Compare Now"
**Then** I see a comparison page with:
- Bulls displayed in aligned columns (2-3 columns)
- Photos at top of each column
- Genetic data (EPDs) in aligned rows
- Differences highlighted (higher/lower values)
- Pedigree information aligned
- Performance data aligned

**And** I can remove bulls from comparison
**And** I can click bull names to view detail pages
**And** I can add more bulls (up to 3 total)
**And** comparison is responsive (stacks on mobile)

**Prerequisites:** Story 4.1 (Comparison Selection)

**Technical Notes:**
- Create `/compare` page
- Fetch selected bulls data
- Implement comparison table with aligned rows
- Highlight differences (color coding for higher/lower EPDs)
- Make comparison responsive (horizontal scroll or stack on mobile)
- Add print-friendly styling

---

### Story 4.3a: Breeder Account Creation & Login

As a **breeder**,
I want to create an account and log in,
So that I can access breeder-specific features like favorites and notifications.

**Acceptance Criteria:**

**Given** I'm browsing bulls as a guest
**When** I want to create a breeder account
**Then** I see a registration form with Name, Email, Password fields
**And** my account is created with "Breeder" role automatically
**And** I can log in with my credentials
**And** my session persists across page reloads
**And** I see my name in navigation when logged in
**And** I can log out successfully

**Prerequisites:** Story 4.2 (Comparison View)

**Technical Notes:**
- User model already has Role enum with BREEDER
- Create registration page `/app/register/page.tsx`
- Create registration API endpoint
- Update navigation for authenticated state
- Implement logout functionality

---

### Story 4.3b: Bull Favorites System

As a **logged-in breeder**,
I want to save bulls to my favorites,
So that I can track bulls of interest and easily find them later.

**Acceptance Criteria:**

**Given** I'm logged in as a breeder
**When** I view bull cards or detail pages
**Then** I can save bulls to favorites with heart icon
**And** favorited bulls are stored in my account
**And** I can view all favorites on a dedicated page
**And** I can remove bulls from favorites
**And** favorite state is visible on bull cards (filled heart icon)
**And** guest users are prompted to login when favoriting

**Prerequisites:** Story 4.3a (Breeder Account Creation)

**Technical Notes:**
- Favorite model already exists in schema
- Create FavoriteButton component
- Add favorite toggle to bull cards and detail pages
- Create `/favorites` page showing all saved bulls
- Implement optimistic UI updates for favorite toggling
- Add favorites count to navigation

---

### Story 4.4: Favorites Notifications

As a **breeder**,
I want to receive notifications when favorited bulls' details change,
So that I stay informed about bulls I'm interested in.

**Acceptance Criteria:**

**Given** I've favorited bulls
**When** a bull's inventory count changes or details are updated
**Then** I receive an email notification
**And** the email includes: Bull name, what changed, link to bull page
**And** I can opt-in/out of notifications per bull or globally
**And** notification preferences are in my account settings

**Prerequisites:** Story 4.3 (Favorites)

**Technical Notes:**
- Create notification preferences in User model
- Implement change detection on bull updates (compare old vs new values)
- Queue email notifications (consider using a job queue for scale)
- Create email template for bull update notifications
- Add notification settings page
- Implement unsubscribe functionality

---

## Epic 5: Inquiry & Communication

**Goal:** Implement the inquiry system connecting breeders with ranch owners, including contact forms, email notifications, and inquiry management dashboard. This completes the buyer-seller connection loop.

**Business Value:** Enables the core transaction: breeders can contact ranch owners, and ranch owners receive sales leads.

### Story 5.1: Inquiry Contact Form

As a **breeder**,
I want to submit an inquiry about a bull,
So that I can contact the ranch owner to discuss purchasing semen.

**Acceptance Criteria:**

**Given** I'm viewing a bull detail page
**When** I click "Contact Ranch" button
**Then** a contact form appears with fields:
- Name (required)
- Email (required)
- Phone (optional)
- Message (required, pre-filled with bull name)

**And** form validation prevents submission without required fields
**And** I see a confirmation message after submission
**And** the form works for both logged-in and guest users

**Prerequisites:** Story 4.4 (Favorites Notifications)

**Technical Notes:**
- Create Inquiry model (breeder info, bull reference, ranch reference, message, timestamp)
- Implement contact form component (modal or dedicated page)
- Add form validation with React Hook Form
- Store inquiry in database
- Display success confirmation

---

### Story 5.2: Inquiry Email Notifications to Ranch Owners

As a **ranch owner**,
I want to receive email notifications when breeders inquire about my bulls,
So that I can respond quickly to sales opportunities.

**Acceptance Criteria:**

**Given** a breeder submits an inquiry
**When** the inquiry is saved
**Then** an email is sent immediately to the ranch owner
**And** the email includes:
- Breeder name, email, phone
- Bull name and link to bull page
- Message content
- Link to inquiry dashboard
- Reply-to set to breeder's email

**And** email is mobile-responsive and professional

**Prerequisites:** Story 5.1 (Inquiry Form)

**Technical Notes:**
- Set up email service (Resend, SendGrid, or similar)
- Create email template for inquiry notifications
- Implement email sending in API route
- Add email configuration to environment variables
- Test email delivery in development and production

---

### Story 5.3: Inquiry Dashboard for Ranch Owners

As a **ranch owner**,
I want to view and manage all inquiries in a dashboard,
So that I can track leads and follow up appropriately.

**Acceptance Criteria:**

**Given** I'm logged in as a ranch owner
**When** I visit my inquiry dashboard
**Then** I see a list of all inquiries with:
- Date received
- Breeder name and contact info
- Bull name
- Message preview
- Status (Unread, Responded, Archived)

**And** I can filter by status
**And** I can click to view full inquiry details
**And** I can mark as responded or archived
**And** I can click breeder email to open email client

**Prerequisites:** Story 5.2 (Email Notifications)

**Technical Notes:**
- Create `/dashboard/inquiries` page
- Fetch inquiries for logged-in ranch owner
- Implement status update functionality
- Add filter tabs (All, Unread, Responded, Archived)
- Display inquiry count badge on dashboard nav
- Sort by date (newest first)

---

### Story 5.4: Inquiry Response Tracking

As a **ranch owner**,
I want to mark inquiries as responded and add notes,
So that I can track my follow-up activities.

**Acceptance Criteria:**

**Given** I'm viewing an inquiry
**When** I mark it as responded
**Then** the status updates to "Responded"
**And** I can add internal notes (not visible to breeder)
**And** I can see response timestamp
**And** I can reopen an inquiry if needed

**And** notes are saved and displayed on inquiry detail view

**Prerequisites:** Story 5.3 (Inquiry Dashboard)

**Technical Notes:**
- Add status and notes fields to Inquiry model
- Implement status update API endpoint
- Create notes textarea on inquiry detail view
- Add timestamp tracking for status changes
- Consider adding tags or categories for inquiry organization

---

### Story 5.5: Inquiry Analytics for Ranch Owners

As a **ranch owner**,
I want to see inquiry statistics,
So that I can understand which bulls generate the most interest.

**Acceptance Criteria:**

**Given** I'm on my dashboard
**When** I view inquiry analytics
**Then** I see:
- Total inquiries (all time and last 30 days)
- Inquiries by bull (which bulls get most interest)
- Response rate (% of inquiries responded to)
- Inquiry trend chart (inquiries over time)

**And** I can click bull names to view their inquiries

**Prerequisites:** Story 5.4 (Response Tracking)

**Technical Notes:**
- Create analytics component for dashboard
- Aggregate inquiry data by bull
- Calculate response rate
- Implement simple chart (Chart.js or Recharts)
- Cache analytics data for performance
- Consider adding export to CSV functionality

---

## Epic 6: Polish & Production Readiness

**Goal:** Refine responsive design, optimize performance, ensure accessibility compliance, and prepare for production deployment. This epic ensures the MVP meets quality standards.

**Business Value:** Professional, fast, accessible platform that works flawlessly across devices and provides excellent user experience.

### Story 6.1: Responsive Design Refinement

As a **user**,
I want the platform to work seamlessly on all devices,
So that I can access it from desktop, tablet, or mobile.

**Acceptance Criteria:**

**Given** I access the platform on any device
**When** I navigate through pages
**Then** all layouts are responsive:
- Desktop: Multi-column layouts, hover states
- Tablet: 2-column grids, touch-friendly buttons
- Mobile: Single-column, bottom sheets, thumb-friendly nav

**And** touch gestures work (swipe galleries, pinch-to-zoom)
**And** no horizontal scrolling on mobile
**And** all interactive elements are touch-friendly (44x44px minimum)

**Prerequisites:** Story 5.5 (Inquiry Analytics)

**Technical Notes:**
- Test all pages on multiple devices and screen sizes
- Fix any responsive layout issues
- Implement touch gestures for image galleries
- Ensure proper viewport meta tags
- Test on iOS Safari, Chrome Android, and desktop browsers
- Use Tailwind responsive utilities consistently

---

### Story 6.2: Performance Optimization

As a **user**,
I want pages to load quickly,
So that I have a smooth browsing experience even on slower connections.

**Acceptance Criteria:**

**Given** I access the platform
**When** pages load
**Then** performance metrics meet targets:
- Initial page load: <3 seconds on 4G
- Time to interactive: <5 seconds
- Largest Contentful Paint: <2.5 seconds
- Lighthouse Performance score: >85

**And** images are optimized (WebP, lazy loading)
**And** code is split and tree-shaken
**And** fonts are optimized

**Prerequisites:** Story 6.1 (Responsive Design)

**Technical Notes:**
- Run Lighthouse audits and fix issues
- Implement lazy loading for images and components
- Optimize bundle size (analyze with webpack-bundle-analyzer)
- Use Next.js Image component everywhere
- Implement code splitting for routes
- Optimize Cloudinary image delivery (auto format, quality)
- Add loading skeletons for better perceived performance

---

### Story 6.3: Accessibility Compliance (WCAG 2.1 AA)

As a **user with disabilities**,
I want the platform to be accessible,
So that I can use it with assistive technologies.

**Acceptance Criteria:**

**Given** I use the platform with assistive technology
**When** I navigate and interact
**Then** accessibility standards are met:
- Keyboard navigation works for all interactive elements
- Screen reader compatible (ARIA labels, semantic HTML)
- Color contrast ratio: 4.5:1 minimum
- Focus indicators clearly visible
- Alt text for all images
- Form labels properly associated
- Skip navigation links present

**And** Lighthouse Accessibility score: >90

**Prerequisites:** Story 6.2 (Performance Optimization)

**Technical Notes:**
- Run axe DevTools and fix issues
- Add ARIA labels where needed
- Ensure semantic HTML throughout
- Test with screen reader (NVDA or VoiceOver)
- Check color contrast with tools
- Add skip-to-content links
- Ensure form labels are properly associated
- Test keyboard navigation flow

---

### Story 6.4: Production Deployment & Monitoring

As a **developer**,
I want the platform deployed to production with monitoring,
So that I can track performance and quickly respond to issues.

**Acceptance Criteria:**

**Given** the MVP is complete
**When** I deploy to production
**Then** the platform is live at production URL
**And** all environment variables are configured
**And** database migrations have run successfully
**And** HTTPS is enforced
**And** error tracking is set up (Sentry or similar)
**And** uptime monitoring is configured
**And** analytics are tracking (Google Analytics or Plausible)

**And** I receive alerts for critical errors

**Prerequisites:** Story 6.3 (Accessibility Compliance)

**Technical Notes:**
- Final production deployment to Vercel
- Configure custom domain (if available)
- Set up error tracking (Sentry)
- Configure uptime monitoring (UptimeRobot or similar)
- Set up analytics (privacy-friendly option like Plausible)
- Create production environment checklist
- Document deployment process
- Set up backup strategy
- Configure CORS and security headers

---

## Epic Breakdown Summary

**Complete Epic & Story Breakdown for wagnerBeef MVP**

### Coverage Validation

**All 18 Functional Requirements from PRD are covered:**
- ✅ FR-1: User Account Management (Stories 2.1, 4.3)
- ✅ FR-2: Ranch Profile Management (Story 2.2)
- ✅ FR-3: Bull Profile Management (Stories 2.3, 2.4, 2.5, 2.6)
- ✅ FR-4: Bull Discovery & Search (Stories 3.1, 3.2, 3.3)
- ✅ FR-5: Bull Detail Pages (Story 3.4)
- ✅ FR-6: Bull Comparison (Stories 4.1, 4.2)
- ✅ FR-7: Favorites & Watchlists (Stories 4.3, 4.4)
- ✅ FR-8: Inquiry Management (Stories 5.1, 5.2, 5.3, 5.4, 5.5)
- ✅ FR-9: Shareable Links (Story 3.6)
- ✅ FR-10: Responsive Design (Story 6.1)
- ✅ FR-11: Email Notifications (Stories 5.2, 4.4)

**All 14 Non-Functional Requirements are addressed:**
- ✅ Performance (Story 6.2)
- ✅ Security (Stories 1.3, 1.4, 2.1)
- ✅ Scalability (Stories 1.2, 1.5)
- ✅ Accessibility (Story 6.3)
- ✅ Reliability (Story 6.4)
- ✅ Usability (Stories 2.3, 2.4, 2.5 with inline help)

### Implementation Sequence

**Week 1-2: Foundation (Epic 1)**
- Stories 1.1-1.5: Project setup, database, auth, images, deployment
- **Deliverable:** Working infrastructure ready for feature development

**Week 3-4: Seller Side (Epic 2)**
- Stories 2.1-2.6: Ranch onboarding, bull creation, dashboard
- **Deliverable:** Ranch owners can showcase bulls professionally

**Week 5-6: Buyer Side (Epic 3)**
- Stories 3.1-3.7: Browse, search, filter, detail pages, ranch pages
- **Deliverable:** Breeders can discover and evaluate bulls

**Week 7: Enhanced Discovery (Epic 4)**
- Stories 4.1-4.4: Comparison, favorites, notifications
- **Deliverable:** Breeders can efficiently compare and track bulls

**Week 8: Connection Loop (Epic 5)**
- Stories 5.1-5.5: Inquiry system, notifications, dashboard, analytics
- **Deliverable:** Complete buyer-seller connection (MVP core loop complete)

**Week 9-10: Polish & Launch (Epic 6)**
- Stories 6.1-6.4: Responsive refinement, performance, accessibility, production
- **Deliverable:** Production-ready MVP

**Total Estimated Timeline:** 8-10 weeks (evenings/weekends pace)

### Story Characteristics

**All stories follow best practices:**
- ✅ Vertically sliced (deliver complete functionality)
- ✅ Sequentially ordered (no forward dependencies)
- ✅ BDD-style acceptance criteria (Given/When/Then)
- ✅ Clear prerequisites
- ✅ Technical implementation notes
- ✅ Sized for single-session completion

### Next Steps

**Ready for Implementation:**

1. **Architecture Design** (Recommended Next)
   - Run: `*create-architecture` (Architect agent)
   - Define database schema (User, Ranch, Bull, Inquiry, Favorite models)
   - Design API endpoints
   - Plan component architecture

2. **Sprint Planning** (After Architecture)
   - Run: `*sprint-planning` (Scrum Master agent)
   - Organize stories into 2-week sprints
   - Assign story points
   - Create sprint goals

3. **Story Implementation**
   - Run: `*create-story` for individual story implementation plans
   - Use Dev agent for implementation support
   - Follow epic sequence for logical progression

**The Magic is Preserved:**
Every epic and story connects back to the core value proposition—enabling ranch owners to reach breeders 500 miles away and helping breeders find the perfect bull in under 5 minutes.

---

_This epic breakdown transforms the PRD's 32 requirements into 31 implementable stories across 6 epics, ready for architecture design and sprint planning._
