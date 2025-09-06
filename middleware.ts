import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          // The `set` method was called from a Server Component.
          // This cookie will be set on `response.headers`.
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          // The `delete` method was called from a Server Component.
          // This cookie will be set on `response.headers` with an expired date.
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // Define protected and public routes
  const { pathname } = request.nextUrl;

  // Public API routes (no auth). Callback should not be protected.
  const publicApiRoutes = [
    '/api/generate/kie/callback',
  ];

  const protectedRoutes = ['/dashboard']; // Add any other routes that need protection
  const authRoutes = ['/signin', '/signup']; // Add any routes related to auth flow (e.g. /forgot-password)
  const protectedApiRoutes = [
    '/api/generate', 
    '/api/account',
    '/api/checkout',
    '/api/customerPortal',
    '/api/user/credits',
    '/api/user/claim-free-trial'
  ]; // API routes that require auth

  // Early allow-list: skip auth for public API routes
  if (publicApiRoutes.some(route => pathname.startsWith(route))) {
    return response;
  }

  // Check if this is a protected API route
  if (protectedApiRoutes.some(route => pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Add user info to headers for API routes to use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', session.user.id);
    requestHeaders.set('x-user-email', session.user.email || '');
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // If trying to access a protected route without a session, redirect to signin
  if (!session && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // If there is a session and the user tries to access an auth route (e.g. /signin), redirect to dashboard
  if (session && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
