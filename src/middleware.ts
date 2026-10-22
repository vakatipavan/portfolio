import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('admin_auth');
  const pathname = request.nextUrl.pathname;
  
  // Exclude login page, home page, api routes, and POS terminal
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/pos') ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  // Handle /admin direct route
  if (pathname === '/admin' || pathname === '/admin/') {
    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect to login if not authenticated
  if (!authCookie || authCookie.value !== 'authenticated') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/dashboard/:path*',
    '/billing/:path*',
    '/products/:path*',
    '/inventory/:path*',
    '/prices/:path*',
    '/reports/:path*',
    '/history/:path*',
    '/settings/:path*',
    '/predictor/:path*',
  ],
};
