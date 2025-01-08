import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/explore',
    '/api/explore',
    '/pipeline', // Add the pipeline route here
  ],
  afterAuth: (auth, req) => {
    const url = req.nextUrl.clone();

    // Check if the user is logged in
    const isLoggedIn = !!auth.userId;

    // If logged in and trying to access guest mode
    if (isLoggedIn && url.pathname === '/explore' && url.searchParams.get('mode') === 'guest') {
      url.searchParams.delete('mode'); // Remove 'guest' mode param
      return NextResponse.redirect(url); // Redirect to explore without guest mode
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
