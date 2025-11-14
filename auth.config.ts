import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isEmailVerified = !!auth?.user?.emailVerified;
      
      // Protected routes that require authentication
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnRanchManagement = nextUrl.pathname.startsWith('/ranch/create') || 
                                   nextUrl.pathname.startsWith('/ranch/edit');
      const isOnBullCreation = nextUrl.pathname.startsWith('/bulls/create');
      
      // Routes that require email verification
      const requiresVerification = isOnDashboard || isOnRanchManagement || isOnBullCreation;
      
      // Allow access to verification and check-email pages
      const isOnVerificationPage = nextUrl.pathname.startsWith('/verify-email') || 
                                     nextUrl.pathname.startsWith('/check-email');
      
      // DEVELOPMENT: Skip email verification in development mode
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      if (requiresVerification) {
        if (!isLoggedIn) return false; // Redirect to login
        if (!isEmailVerified && !isOnVerificationPage && !isDevelopment) {
          // Redirect unverified users to check-email page (skip in dev)
          return Response.redirect(new URL('/check-email', nextUrl));
        }
        return true;
      }
      
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
