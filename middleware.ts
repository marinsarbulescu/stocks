// middleware.ts
import { type NextRequest, NextResponse } from 'next/server';
import { fetchAuthSession } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/utils/amplifyServerUtils'; // Adjust path if needed - see below

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // runWithAmplifyServerContext requires the request and response objects
  // It enables server-side Auth functions to access cookies and other request data
  const authenticated = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        // Try to fetch the session tokens
        const session = await fetchAuthSession(contextSpec);
        // Return true if session tokens exist, false otherwise
        return session.tokens !== undefined;
      } catch (error) {
        console.log('Auth middleware error:', error);
        // If error fetching session (e.g., tokens expired, etc.), treat as unauthenticated
        return false;
      }
    },
  });

  // If user is authenticated, allow the request to proceed
  if (authenticated) {
    return response;
  }

  // If user is not authenticated, redirect to the login page
  // Avoid infinite redirect loop by checking if the current path is already /login
  if (request.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If already on /login and not authenticated, allow rendering the login page
  return response;
}

// Configure the middleware to run on specific paths
export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * - login (the login page itself)
   * - amplify_outputs.json (Amplify config) - Added precaution
   */
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login|amplify_outputs.json).*)',
  ],
};