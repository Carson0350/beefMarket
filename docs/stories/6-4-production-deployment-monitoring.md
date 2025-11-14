# Story 6.4: Production Deployment & Monitoring

Status: ready-for-dev

## Story

As a **developer**,
I want the platform deployed to production with monitoring,
so that I can track performance and quickly respond to issues.

## Acceptance Criteria

1. **Platform is live** at production URL with custom domain (if available)
2. **All environment variables** are configured correctly in production
3. **Database migrations** have run successfully in production
4. **HTTPS is enforced** on all pages
5. **Error tracking** is set up (Sentry or similar)
6. **Uptime monitoring** is configured with alerts
7. **Analytics** are tracking page views and user behavior
8. **Performance monitoring** is active (Core Web Vitals)
9. **Email notifications** work in production
10. **Image delivery** works via Cloudinary CDN
11. **Security headers** are configured (CSP, HSTS, X-Frame-Options)
12. **Backup strategy** is in place for database

## Tasks / Subtasks

- [ ] Task 1: Production Environment Setup (AC: #1, #2)
  - [ ] Verify Vercel project is connected to Git repository
  - [ ] Configure production environment variables in Vercel dashboard:
    - DATABASE_URL (Vercel Postgres production)
    - NEXTAUTH_SECRET (generate secure secret)
    - NEXTAUTH_URL (production URL)
    - CLOUDINARY_CLOUD_NAME
    - CLOUDINARY_API_KEY
    - CLOUDINARY_API_SECRET
    - RESEND_API_KEY (or email service API key)
  - [ ] Configure custom domain in Vercel (if available)
  - [ ] Verify DNS settings for custom domain
  - [ ] Test environment variables are loaded correctly

- [ ] Task 2: Database Migration and Setup (AC: #3, #12)
  - [ ] Verify Vercel Postgres is provisioned for production
  - [ ] Run database migrations in production
  - [ ] Verify schema is correct in production database
  - [ ] Set up automated daily backups (Vercel Postgres feature)
  - [ ] Configure 30-day backup retention
  - [ ] Document database backup and restore process
  - [ ] Test database connection from production app

- [ ] Task 3: HTTPS and Security Configuration (AC: #4, #11)
  - [ ] Verify HTTPS is enforced (Vercel default)
  - [ ] Configure security headers in next.config.js:
    - Content-Security-Policy (CSP)
    - Strict-Transport-Security (HSTS)
    - X-Frame-Options (prevent clickjacking)
    - X-Content-Type-Options (prevent MIME sniffing)
    - Referrer-Policy
  - [ ] Test security headers with securityheaders.com
  - [ ] Verify no mixed content warnings
  - [ ] Test HTTPS redirect from HTTP

- [ ] Task 4: Error Tracking Setup (AC: #5)
  - [ ] Create Sentry account (or alternative: LogRocket, Rollbar)
  - [ ] Install Sentry SDK: `npm install @sentry/nextjs`
  - [ ] Configure Sentry in next.config.js
  - [ ] Add SENTRY_DSN to environment variables
  - [ ] Configure error reporting for client and server
  - [ ] Set up source maps for better error debugging
  - [ ] Configure alert rules (email on critical errors)
  - [ ] Test error tracking by triggering test error
  - [ ] Verify errors appear in Sentry dashboard

- [ ] Task 5: Uptime Monitoring Setup (AC: #6)
  - [ ] Create UptimeRobot account (or alternative: Pingdom, StatusCake)
  - [ ] Configure uptime monitor for production URL
  - [ ] Set check interval (5 minutes recommended)
  - [ ] Configure alert notifications (email, SMS)
  - [ ] Add multiple check locations (US, EU)
  - [ ] Monitor critical endpoints: home, browse, API health check
  - [ ] Test alerts by simulating downtime
  - [ ] Document monitoring setup

- [ ] Task 6: Analytics Setup (AC: #7)
  - [ ] Choose analytics provider (Plausible, Google Analytics, or Vercel Analytics)
  - [ ] Create analytics account
  - [ ] Install analytics script (prefer privacy-friendly option like Plausible)
  - [ ] Configure analytics in production only (not in development)
  - [ ] Set up key event tracking:
    - Page views
    - Bull profile views
    - Inquiry submissions
    - Favorite additions
    - Comparison usage
  - [ ] Verify analytics data is being collected
  - [ ] Set up analytics dashboard for key metrics

- [ ] Task 7: Performance Monitoring Setup (AC: #8)
  - [ ] Enable Vercel Analytics (Speed Insights)
  - [ ] Configure Core Web Vitals monitoring
  - [ ] Set up performance alerts for degradation
  - [ ] Monitor key pages: browse, bull detail, compare
  - [ ] Set performance budgets (LCP <2.5s, FID <100ms, CLS <0.1)
  - [ ] Verify performance data is being collected
  - [ ] Create performance monitoring dashboard

- [ ] Task 8: Email Service Production Configuration (AC: #9)
  - [ ] Verify Resend (or email service) production API key is configured
  - [ ] Test inquiry notification emails in production
  - [ ] Test email verification emails
  - [ ] Test password reset emails
  - [ ] Test favorite notification emails
  - [ ] Verify email deliverability (check spam folders)
  - [ ] Configure SPF and DKIM records for custom domain (if applicable)
  - [ ] Monitor email sending logs

- [ ] Task 9: Image Delivery Verification (AC: #10)
  - [ ] Verify Cloudinary production credentials are configured
  - [ ] Test image upload in production
  - [ ] Verify images are delivered via CDN
  - [ ] Test image transformations (WebP, resizing)
  - [ ] Verify lazy loading works in production
  - [ ] Monitor Cloudinary usage and bandwidth
  - [ ] Set up Cloudinary usage alerts (approaching limits)

- [ ] Task 10: API Rate Limiting and Security (AC: #11)
  - [ ] Implement rate limiting on API routes (100 requests/minute per IP)
  - [ ] Implement stricter rate limiting on auth endpoints (5 attempts/15min)
  - [ ] Configure CORS policy (restrict to production domain)
  - [ ] Verify CSRF protection is active
  - [ ] Test API security with unauthorized requests
  - [ ] Monitor API usage and abuse

- [ ] Task 11: Production Deployment Checklist (AC: #1-12)
  - [ ] Run final build locally: `npm run build`
  - [ ] Fix any build errors or warnings
  - [ ] Run final tests (if test suite exists)
  - [ ] Merge feature branch to main
  - [ ] Verify automatic deployment to production
  - [ ] Monitor deployment logs for errors
  - [ ] Verify deployment succeeded
  - [ ] Test production URL loads correctly

- [ ] Task 12: Post-Deployment Verification (AC: #1-12)
  - [ ] Manual test: Home page loads correctly
  - [ ] Manual test: Browse page loads with bulls
  - [ ] Manual test: Bull detail page loads with images
  - [ ] Manual test: Comparison feature works
  - [ ] Manual test: User registration works
  - [ ] Manual test: User login works
  - [ ] Manual test: Ranch owner can create bull
  - [ ] Manual test: Inquiry form works and sends email
  - [ ] Manual test: Favorite feature works
  - [ ] Manual test: Dashboard loads for ranch owner
  - [ ] Manual test: All images load via Cloudinary
  - [ ] Manual test: HTTPS is enforced
  - [ ] Verify error tracking is working (check Sentry)
  - [ ] Verify uptime monitoring is active (check UptimeRobot)
  - [ ] Verify analytics are tracking (check dashboard)

- [ ] Task 13: Production Documentation (AC: #1-12)
  - [ ] Document production deployment process
  - [ ] Document environment variables and their purpose
  - [ ] Document monitoring and alerting setup
  - [ ] Document backup and restore process
  - [ ] Document incident response process
  - [ ] Create production runbook for common issues
  - [ ] Document how to roll back deployment if needed
  - [ ] Create production support checklist

- [ ] Task 14: Performance and Security Audit (AC: #4, #8, #11)
  - [ ] Run Lighthouse audit on production (Performance, Accessibility, Best Practices, SEO)
  - [ ] Run security audit with securityheaders.com
  - [ ] Verify all security headers are present
  - [ ] Check for any security vulnerabilities
  - [ ] Verify Core Web Vitals meet targets
  - [ ] Document any remaining issues for future sprints

- [ ] Task 15: Launch Preparation (AC: #1-12)
  - [ ] Create launch checklist
  - [ ] Notify stakeholders of production URL
  - [ ] Prepare launch announcement (if applicable)
  - [ ] Set up customer support process
  - [ ] Create user onboarding documentation
  - [ ] Plan for initial user feedback collection
  - [ ] Celebrate launch! 🎉

## Dev Notes

### Requirements Context

**From Epics (epics.md - Story 6.4):**
- Platform live at production URL
- All environment variables configured
- Database migrations run successfully
- HTTPS enforced
- Error tracking set up (Sentry or similar)
- Uptime monitoring configured
- Analytics tracking (Google Analytics or Plausible)
- Alerts for critical errors

**From PRD (PRD.md - NFR-11, NFR-12):**
- 99.5% uptime target (3.6 hours downtime/month acceptable)
- Graceful degradation if services fail
- Error boundaries prevent full app crashes
- Daily automated database backups
- 30-day backup retention
- Point-in-time recovery capability
- Image storage redundancy (Cloudinary)

**From Architecture (architecture.md - AD-5):**
- Deploy on Vercel with automated CI/CD
- Main branch → Production
- Feature branches → Preview deployments
- Database migrations run on deployment
- Environment variables configured in Vercel dashboard
- Vercel Postgres for production database
- Serverless functions (API routes scale automatically)

**From Architecture (architecture.md - System Architecture):**
- Vercel Edge Network for CDN and load balancing
- PostgreSQL (Vercel) for database
- Cloudinary for images/CDN
- Resend for email
- HTTPS only (enforced by Vercel)

**Architecture Constraints:**
- Vercel deployment platform
- Vercel Postgres for database
- Cloudinary for image storage
- Resend for email service
- Next.js serverless functions
- Environment variable management via Vercel

### Learnings from Previous Story

**From Story 6-3-accessibility-compliance-wcag-21-aa (Status: drafted)**

- Accessibility audit completed with Lighthouse and axe DevTools
- ARIA labels and semantic HTML implemented
- Keyboard navigation tested
- Screen reader compatibility verified

**Implications for Story 6.4:**
- Include accessibility in production verification checklist
- Monitor accessibility scores in production
- Ensure error tracking captures accessibility issues
- Document accessibility compliance for stakeholders

**From Story 6-2-performance-optimization (Status: drafted)**

- Performance optimization completed
- Lighthouse Performance score >85 target
- Image optimization with Cloudinary
- Code splitting and lazy loading implemented
- Loading states and skeletons added

**Implications for Story 6.4:**
- Monitor performance metrics in production (Core Web Vitals)
- Set up performance alerts for degradation
- Verify performance optimizations work in production
- Track performance over time with Vercel Analytics

**From Story 6-1-responsive-design-refinement (Status: drafted)**
- Responsive design tested across devices
- Touch-friendly interface implemented
- Mobile navigation working

**Implications for Story 6.4:**
- Test responsive design in production on real devices
- Monitor mobile vs desktop usage in analytics
- Ensure mobile performance is tracked separately

### Project Structure Notes

**Production Configuration Files:**
- `next.config.js` - Configure security headers, Sentry, image domains
- `.env.production` - Production environment variables (not committed to Git)
- `vercel.json` - Vercel configuration (if needed for custom settings)
- `prisma/schema.prisma` - Database schema (migrations run on deployment)

**Environment Variables (Production):**
- `DATABASE_URL` - Vercel Postgres connection string
- `NEXTAUTH_SECRET` - NextAuth.js secret (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL` - Production URL (e.g., https://wagnerbeef.com)
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `RESEND_API_KEY` - Resend API key for email
- `SENTRY_DSN` - Sentry error tracking DSN
- `NEXT_PUBLIC_ANALYTICS_ID` - Analytics tracking ID (if using Google Analytics)

**Monitoring Services:**
- **Error Tracking:** Sentry (https://sentry.io) - Free tier: 5K errors/month
- **Uptime Monitoring:** UptimeRobot (https://uptimerobot.com) - Free tier: 50 monitors
- **Analytics:** Plausible (privacy-friendly) or Vercel Analytics (built-in)
- **Performance:** Vercel Speed Insights (built-in)

**Security Headers (next.config.js):**
```javascript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains'
        }
      ]
    }
  ]
}
```

**Production Deployment Process:**
1. Merge feature branch to main
2. Vercel automatically deploys to production
3. Database migrations run automatically
4. Verify deployment succeeded
5. Run post-deployment verification tests
6. Monitor error tracking and uptime

**Production Verification Checklist:**
- [ ] Production URL loads correctly
- [ ] HTTPS is enforced
- [ ] All pages load without errors
- [ ] Images load via Cloudinary
- [ ] Forms work (registration, login, inquiry)
- [ ] Email notifications send correctly
- [ ] Database queries work
- [ ] Error tracking is active
- [ ] Uptime monitoring is active
- [ ] Analytics are tracking
- [ ] Performance meets targets
- [ ] Security headers are present
- [ ] Backups are configured

**Incident Response Process:**
1. Receive alert (error tracking, uptime monitoring)
2. Check Sentry for error details
3. Check Vercel deployment logs
4. Check database status
5. Roll back deployment if needed (Vercel dashboard)
6. Fix issue and redeploy
7. Verify fix in production
8. Document incident and resolution

### References

- [Source: docs/epics.md#Epic 6 - Story 6.4]
- [Source: docs/PRD.md#NFR-11: Uptime]
- [Source: docs/PRD.md#NFR-12: Data Backup]
- [Source: docs/architecture.md#AD-5: Deployment - Vercel]
- [Source: docs/architecture.md#System Architecture]
- [Source: docs/stories/6-3-accessibility-compliance-wcag-21-aa.md]
- [Source: docs/stories/6-2-performance-optimization.md]
- [Source: docs/stories/6-1-responsive-design-refinement.md]
- [Vercel Deployment Docs: https://vercel.com/docs/deployments]
- [Sentry Next.js Setup: https://docs.sentry.io/platforms/javascript/guides/nextjs/]
- [Security Headers: https://securityheaders.com]

## Dev Agent Record

### Context Reference

- `docs/stories/6-4-production-deployment-monitoring.context.xml`

### Agent Model Used

<!-- To be filled during implementation -->

### Debug Log References

<!-- To be filled during implementation -->

### Completion Notes List

<!-- To be filled during implementation -->

### File List

<!-- To be filled during implementation -->
