# Story 1.1: Project Initialization & Core Setup

**Epic:** 1 - Foundation & Infrastructure  
**Story ID:** 1-1-project-initialization-core-setup  
**Status:** ready-for-dev  
**Created:** 2025-11-07  
**Developer:** Carson

---

## User Story

As a **developer**,  
I want a properly structured Next.js project with core dependencies configured,  
So that I have a solid foundation to build features efficiently.

---

## Business Context

This is the foundational story for the wagnerBeef platform. It establishes the technical infrastructure that all subsequent features will build upon. Without this foundation, no other development can proceed.

**Value:** Enables rapid, reliable development of all user-facing features with proper tooling, type safety, and deployment automation from day one.

---

## Acceptance Criteria

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

---

## Prerequisites

- None (first story in the project)
- Node.js 18+ installed locally
- npm or yarn package manager
- Git installed
- Vercel account (for deployment setup)

---

## Technical Context

### Architecture Decisions

From **AD-1: Framework Selection**:
- **Framework:** Next.js 14+ with App Router
- **Rationale:** Full-stack framework with built-in API routes, excellent Vercel integration, image optimization, and server/client components
- **Initialization Command:** `npx create-next-app@latest wagnerbeef --typescript --tailwind --app --eslint`

From **AD-8: Styling Strategy**:
- **Styling:** Tailwind CSS (included in initialization)
- **Components:** shadcn/ui will be added in later stories as needed

### Project Structure

```
wagnerbeef/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components (empty initially)
├── lib/                   # Utilities and helpers (empty initially)
├── types/                 # TypeScript types (empty initially)
├── public/               # Static assets
├── .gitignore
├── .eslintrc.json
├── next.config.js
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

### Technology Stack

**Core Dependencies (auto-installed):**
- `next` ^14.0.0
- `react` ^18.2.0
- `react-dom` ^18.2.0
- `typescript` ^5.3.0
- `tailwindcss` ^3.3.0
- `eslint` ^8.54.0
- `@types/node`, `@types/react`, `@types/react-dom`

---

## Implementation Tasks

### Task 1: Initialize Next.js Project

**Command:**
```bash
cd /Users/ErinAntoine/Desktop/Repos/wagnerBeef
npx create-next-app@latest . --typescript --tailwind --app --eslint
```

**Prompts and Responses:**
- Would you like to use TypeScript? → **Yes**
- Would you like to use ESLint? → **Yes**
- Would you like to use Tailwind CSS? → **Yes**
- Would you like to use `src/` directory? → **No**
- Would you like to use App Router? → **Yes**
- Would you like to customize the default import alias? → **No** (uses `@/*` by default)

**Expected Output:**
- Project initialized in current directory
- All dependencies installed
- Basic Next.js structure created

---

### Task 2: Verify Project Structure

**Check that these directories exist:**
```bash
ls -la
```

**Expected directories/files:**
- `app/` - App Router directory
- `public/` - Static assets
- `node_modules/` - Dependencies
- `package.json` - Project manifest
- `tsconfig.json` - TypeScript config
- `tailwind.config.ts` - Tailwind config
- `next.config.js` - Next.js config
- `.eslintrc.json` - ESLint config
- `.gitignore` - Git ignore rules

---

### Task 3: Create Additional Folder Structure

**Create empty directories for organization:**
```bash
mkdir -p components lib types
```

**Purpose:**
- `components/` - Reusable React components
- `lib/` - Utility functions, helpers, API clients
- `types/` - Shared TypeScript type definitions

---

### Task 4: Configure Absolute Imports

**Verify `tsconfig.json` includes:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Note:** This should be configured automatically by `create-next-app`, but verify it's present.

---

### Task 5: Initialize Git Repository

**If not already initialized:**
```bash
git init
git add .
git commit -m "Initial commit: Next.js project setup"
```

**Verify `.gitignore` includes:**
- `node_modules/`
- `.next/`
- `.env*.local`
- `.vercel`

---

### Task 6: Test Local Development Server

**Start the development server:**
```bash
npm run dev
```

**Expected output:**
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Ready in Xs
```

**Verify:**
1. Open browser to `http://localhost:3000`
2. See default Next.js welcome page
3. Hot reload works (edit `app/page.tsx` and see changes)

---

### Task 7: Set Up Vercel Project (Optional but Recommended)

**Link to Vercel:**
```bash
npx vercel link
```

**Follow prompts:**
- Set up and deploy? → **Yes**
- Which scope? → Select your account
- Link to existing project? → **No**
- Project name? → **wagnerbeef**
- Directory? → **./`**
- Override settings? → **No**

**Note:** This creates `.vercel/` directory with project configuration. Actual deployment happens in Story 1.5.

---

### Task 8: Configure Prettier (Optional but Recommended)

**Install Prettier:**
```bash
npm install --save-dev prettier
```

**Create `.prettierrc`:**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 100
}
```

**Create `.prettierignore`:**
```
node_modules
.next
.vercel
```

**Add script to `package.json`:**
```json
{
  "scripts": {
    "format": "prettier --write ."
  }
}
```

---

## Testing & Verification

### Verification Checklist

- [ ] `npm run dev` starts without errors
- [ ] Browser shows Next.js app at `http://localhost:3000`
- [ ] TypeScript compilation works (no errors in terminal)
- [ ] ESLint runs without errors: `npm run lint`
- [ ] Hot reload works (edit `app/page.tsx` and see changes)
- [ ] All required directories exist: `app/`, `components/`, `lib/`, `types/`
- [ ] Git repository initialized with proper `.gitignore`
- [ ] Absolute imports configured (`@/*` alias)
- [ ] Tailwind CSS working (check `app/globals.css` imports)

### Manual Testing Steps

1. **Test TypeScript:**
   - Edit `app/page.tsx`
   - Add a type error intentionally
   - Verify TypeScript catches it in terminal

2. **Test Tailwind:**
   - Edit `app/page.tsx`
   - Add Tailwind classes (e.g., `className="text-blue-500"`)
   - Verify styles apply in browser

3. **Test Hot Reload:**
   - With dev server running, edit `app/page.tsx`
   - Save file
   - Verify browser updates without manual refresh

---

## Definition of Done

- [ ] Next.js 14+ project initialized with App Router
- [ ] TypeScript configured and working
- [ ] Tailwind CSS configured and working
- [ ] ESLint configured and passing
- [ ] Prettier configured (optional)
- [ ] Git repository initialized with proper `.gitignore`
- [ ] Folder structure created: `app/`, `components/`, `lib/`, `types/`
- [ ] Absolute imports configured (`@/*` alias)
- [ ] Development server runs successfully (`npm run dev`)
- [ ] Vercel project linked (optional but recommended)
- [ ] All verification tests pass
- [ ] Code committed to Git

---

## Notes for Next Story

**Story 1.2 will add:**
- Prisma ORM
- PostgreSQL database
- Database schema for User, Ranch, Bull models

**Prepare for Story 1.2:**
- Ensure PostgreSQL is installed locally (or use Docker)
- Have Vercel Postgres ready (can provision in Story 1.2)

---

## Dev Agent Record

### Completion Notes
- [ ] Project initialized successfully
- [ ] All dependencies installed
- [ ] Development server tested and working
- [ ] Git repository initialized

### Files Created
- `app/layout.tsx` (NEW)
- `app/page.tsx` (NEW)
- `app/globals.css` (NEW)
- `package.json` (NEW)
- `tsconfig.json` (NEW)
- `tailwind.config.ts` (NEW)
- `next.config.js` (NEW)
- `.eslintrc.json` (NEW)
- `.gitignore` (NEW)
- `.prettierrc` (NEW, optional)

### Debug Log
_Add any issues encountered during implementation here_

---

## References

- **Architecture:** `/docs/architecture.md` (AD-1, AD-8)
- **Epic Breakdown:** `/docs/epics.md` (Epic 1, Story 1.1)
- **PRD:** `/docs/PRD.md`
- **Next.js Documentation:** https://nextjs.org/docs
- **Tailwind CSS Documentation:** https://tailwindcss.com/docs

---

**Story Status:** ready-for-dev  
**Ready for Development:** Yes  
**Estimated Effort:** 30 minutes - 1 hour

### Context Reference
- `docs/stories/1-1-project-initialization-core-setup.context.xml`
