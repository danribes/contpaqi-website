import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  const isLoggedIn = !!token;
  const isPortalRoute = request.nextUrl.pathname.startsWith('/portal');
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');

  // Redirect unauthenticated users from portal to login
  if (isPortalRoute && !isLoggedIn) {
    const loginUrl = new URL('/auth/login', request.nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from auth pages to portal
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/portal', request.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/portal/:path*', '/auth/:path*'],
};
