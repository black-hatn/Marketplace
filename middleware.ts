import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { getToken } from 'next-auth/jwt';

const intlMiddleware = createIntlMiddleware(routing);

// Routes qui nécessitent le rôle ADMIN (sauf /admin/login)
const ADMIN_PATTERN = /^(\/(?:fr|en|ar))?\/admin(?!\/login)/;
// Routes qui nécessitent le rôle VENDOR ou ADMIN
const VENDOR_PATTERN = /^(\/(?:fr|en|ar))?\/vendeur/;

function getLoginUrl(request: NextRequest, pathname: string): URL {
  const locale = pathname.match(/^\/(fr|en|ar)\//)?.[1];
  const loginPath = locale ? `/${locale}/admin/login` : '/admin/login';
  const url = new URL(loginPath, request.url);
  url.searchParams.set('callbackUrl', pathname);
  return url;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = ADMIN_PATTERN.test(pathname);
  const isVendorRoute = VENDOR_PATTERN.test(pathname);

  if (isAdminRoute || isVendorRoute) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.redirect(getLoginUrl(request, pathname));
    }

    if (isAdminRoute && token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (isVendorRoute && token.role !== 'VENDOR' && token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(fr|en|ar)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
