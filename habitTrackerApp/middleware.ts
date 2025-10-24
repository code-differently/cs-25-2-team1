import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  // Routes that can be visited while signed out
  publicRoutes: ['/', '/login', '/signup'],
  
  // Routes that can always be visited
  ignoredRoutes: ['/api/public'],
  
  // After sign in, redirect to dashboard
  afterAuth(auth, req) {
    // If signed in and trying to access sign in/sign up pages, redirect to dashboard
    if (auth.userId && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')) {
      return Response.redirect(new URL('/dashboard', req.url));
    }
    
    // If not signed in and trying to access protected routes, redirect to login
    if (!auth.userId && req.nextUrl.pathname !== '/' && req.nextUrl.pathname !== '/login' && req.nextUrl.pathname !== '/signup') {
      return Response.redirect(new URL('/login', req.url));
    }
  },
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
