# Deployment Guide - WagnerBeef

This guide walks you through deploying the WagnerBeef application to Vercel.

## Prerequisites

- GitHub repository with the code pushed
- Vercel account (free tier is sufficient)
- Cloudinary account with credentials

## Step 1: Connect Repository to Vercel

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository (`beefMarket`)
4. Configure project settings:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

## Step 2: Set Up Vercel Postgres

1. In your Vercel project dashboard, go to the **Storage** tab
2. Click "Create Database" → Select "Postgres"
3. Follow the prompts to create a new Postgres database
4. Once created, Vercel will automatically add these environment variables:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`

## Step 3: Configure Environment Variables

Go to **Settings** → **Environment Variables** and add the following for **Production**, **Preview**, and **Development**:

### Database (from Vercel Postgres)
- `DATABASE_URL` = Use the `POSTGRES_PRISMA_URL` value
- `DIRECT_URL` = Use the `POSTGRES_URL_NON_POOLING` value

### NextAuth
- `NEXTAUTH_SECRET` = Generate using: `openssl rand -base64 32`
- `NEXTAUTH_URL` = Your production URL (e.g., `https://your-app.vercel.app`)

### Cloudinary
- `CLOUDINARY_CLOUD_NAME` = Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` = Your Cloudinary API key
- `CLOUDINARY_API_SECRET` = Your Cloudinary API secret

## Step 4: Deploy

1. Push your code to the `main` branch on GitHub
2. Vercel will automatically detect the push and start a deployment
3. Monitor the deployment in the Vercel dashboard
4. The `postbuild` script will automatically run Prisma migrations

## Step 5: Verify Deployment

1. Visit your production URL
2. Test the following:
   - Home page loads
   - Sign up and create an account
   - Log in with your account
   - Navigate to `/dashboard`
   - Test image upload at `/test-upload`

## Continuous Deployment

- **Main branch** → Automatically deploys to **Production**
- **Other branches** → Automatically create **Preview deployments**

## Troubleshooting

### Build Fails
- Check the build logs in Vercel dashboard
- Ensure all environment variables are set correctly
- Verify Prisma migrations are valid

### Database Connection Issues
- Verify `DATABASE_URL` and `DIRECT_URL` are correct
- Check that Vercel Postgres is in the same region as your deployment

### Authentication Issues
- Ensure `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your production domain
- Check that it uses `https://` (not `http://`)

### Image Upload Issues
- Verify all Cloudinary environment variables are set
- Test Cloudinary credentials locally first

## Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` to use your custom domain

## Environment Variables Summary

```
# Database
DATABASE_URL=<from Vercel Postgres>
DIRECT_URL=<from Vercel Postgres>

# NextAuth
NEXTAUTH_SECRET=<generate with openssl>
NEXTAUTH_URL=https://your-app.vercel.app

# Cloudinary
CLOUDINARY_CLOUD_NAME=dcxo4lnl8
CLOUDINARY_API_KEY=<your-key>
CLOUDINARY_API_SECRET=<your-secret>
```

## Notes

- Migrations run automatically on every deployment via `postbuild` script
- Preview deployments use the same database as production (consider separate databases for staging)
- Free tier includes 100GB bandwidth and unlimited preview deployments
