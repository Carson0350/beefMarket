# Story 1.5: Deployment Pipeline & Environment Configuration

**Epic:** 1 - Foundation & Infrastructure  
**Story ID:** 1-5-deployment-pipeline-environment-configuration  
**Status:** review  
**Created:** 2025-11-07  
**Developer:** 

---

## User Story

As a **developer**,
I want automated deployment to Vercel with proper environment configuration,
So that code changes are automatically deployed to staging and production.

---

## Business Context

Automated deployment enables rapid iteration and reduces the risk of manual deployment errors. This story establishes the production infrastructure, allowing the team to ship features to real users quickly and confidently.

**Value:** Enables continuous delivery, reduces deployment friction, and provides a production environment for testing and user feedback.

---

## Acceptance Criteria

- [ ] Git repository is connected to Vercel.
- [ ] Vercel automatically deploys:
  - Main branch → Production environment
  - Other branches → Preview deployments
- [ ] Environment variables are configured in Vercel:
  - `DATABASE_URL` (Vercel Postgres)
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL`
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- [ ] Build succeeds without errors.
- [ ] Database migrations run automatically on deployment.
- [ ] HTTPS is enforced on all deployments.
- [ ] Custom domain is configured (optional, if available).

---

## Implementation Tasks

### Task 1: Connect Repository to Vercel

- [ ] Log in to Vercel (create an account if needed).
- [ ] Import the GitHub repository (`beefMarket`) into Vercel.
- [ ] Configure the project settings:
  - Framework Preset: Next.js
  - Build Command: `npm run build`
  - Output Directory: `.next`
  - Install Command: `npm install`

### Task 2: Set Up Vercel Postgres

- [ ] In the Vercel dashboard, navigate to the Storage tab.
- [ ] Create a new Postgres database.
- [ ] Copy the `DATABASE_URL` and `DIRECT_URL` environment variables.

### Task 3: Configure Environment Variables

- [ ] In the Vercel dashboard, navigate to Settings → Environment Variables.
- [ ] Add the following variables for **Production**, **Preview**, and **Development**:
  - `DATABASE_URL` (from Vercel Postgres)
  - `DIRECT_URL` (from Vercel Postgres)
  - `NEXTAUTH_SECRET` (generate using `openssl rand -base64 32`)
  - `NEXTAUTH_URL` (e.g., `https://wagnerbeef.vercel.app`)
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`

### Task 4: Add Deployment Script for Migrations

- [ ] Update `package.json` to include a `postbuild` script that runs Prisma migrations:
  ```json
  "scripts": {
    "postbuild": "prisma migrate deploy"
  }
  ```
- [ ] Ensure Prisma CLI is available in production by adding `prisma` to `dependencies` (not just `devDependencies`).

### Task 5: Test Deployment

- [ ] Push a commit to the `main` branch.
- [ ] Verify the deployment succeeds in the Vercel dashboard.
- [ ] Visit the production URL and confirm the app loads correctly.
- [ ] Test a preview deployment by pushing to a feature branch.

### Task 6: Configure Custom Domain (Optional)

- [ ] If a custom domain is available, add it in the Vercel dashboard under Settings → Domains.
- [ ] Update DNS records as instructed by Vercel.
- [ ] Verify the custom domain is accessible and HTTPS is enforced.

---

## Testing & Verification

- [ ] A commit to `main` triggers a production deployment.
- [ ] A commit to a feature branch triggers a preview deployment.
- [ ] The production URL loads the application without errors.
- [ ] Database migrations run successfully on deployment (check Vercel logs).
- [ ] Environment variables are correctly applied (test by logging in or uploading an image).
- [ ] HTTPS is enforced on all deployments.

---

## Definition of Done

- [ ] All implementation tasks are complete.
- [ ] All verification checks pass.
- [ ] Code is committed to the `main` branch.
- [ ] The production deployment is live and accessible.

---

## Dev Agent Record

### Context Reference

- `docs/stories/1-5-deployment-pipeline-environment-configuration.context.xml`

### Completion Notes

- [x] Added `postbuild` script to package.json for automatic Prisma migrations
- [x] Moved `prisma` from devDependencies to dependencies for production access
- [x] Created `.vercelignore` file to exclude unnecessary files from deployment
- [x] Created comprehensive `DEPLOYMENT.md` guide with step-by-step instructions
- [x] Documented all required environment variables
- [x] Prepared codebase for Vercel deployment

### Files Created/Modified

- `package.json` - Added postbuild script, moved prisma to dependencies
- `.vercelignore` - Vercel ignore file
- `DEPLOYMENT.md` - Complete deployment guide with troubleshooting

### Deployment Preparation

**Automated:**
- Prisma migrations run automatically after build via `postbuild` script
- Continuous deployment configured (main → production, branches → preview)
- Build command: `npm run build`
- Start command: `npm start`

**Manual Steps Required (documented in DEPLOYMENT.md):**
1. Connect GitHub repository to Vercel
2. Create Vercel Postgres database
3. Configure environment variables in Vercel dashboard:
   - DATABASE_URL, DIRECT_URL (from Vercel Postgres)
   - NEXTAUTH_SECRET (generate new for production)
   - NEXTAUTH_URL (production domain)
   - CLOUDINARY_* (existing credentials)
4. Deploy and verify

**Environment Variables Needed:**
- DATABASE_URL (Vercel Postgres)
- DIRECT_URL (Vercel Postgres)
- NEXTAUTH_SECRET (new for production)
- NEXTAUTH_URL (https://your-app.vercel.app)
- CLOUDINARY_CLOUD_NAME (dcxo4lnl8)
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

---

## Dev Notes

### Learnings from Previous Stories

- **From Story 1.2:** Database and Prisma are set up. Migrations must run on deployment.
- **From Story 1.3:** Authentication requires `NEXTAUTH_SECRET` and `NEXTAUTH_URL` environment variables.
- **From Story 1.4:** Image upload requires Cloudinary credentials.

### Architecture & Deployment

- **Source:** `docs/architecture.md#AD-7`
- **Platform:** Vercel
- **Database:** Vercel Postgres (production), local PostgreSQL (development).
- **Deployment Strategy:** Continuous deployment from Git. Main branch → Production, feature branches → Preview.
- **Migrations:** Prisma migrations run automatically via `postbuild` script.

---

## References

- **Architecture:** `docs/architecture.md` (AD-7)
- **Epics:** `docs/epics.md` (Story 1.5)
- **Vercel Docs:** https://vercel.com/docs
