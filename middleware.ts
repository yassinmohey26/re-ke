import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

// Create the next-intl middleware
const handleI18nRouting = createMiddleware(routing);

// Routes that require authentication (admin panel)
const PROTECTED_ROUTES = ['/ZAIMOZ'];

// Public API routes that need rate-limit tracking
const PUBLIC_API_ROUTES = ['/api/contact', '/api/booking'];

// Listing-only pages where NEXT_LOCALE cookie should override the URL locale
// on back/forward navigation. Tour detail pages are intentionally excluded
// so shared/direct links to a specific locale keep working.
const LISTING_PATHS = ['/touren', '/airport-transfer', '/blog', '/kontakt', '/terms'];

function getLocaleFromPath(pathname: string) {
  const match = pathname.match(/^\/(de|en|ru|ar|fr|hu)(\/.*)?$/);
  if (!match) return null;
  return { locale: match[1], rest: match[2] || '/' };
}

// --- Simple in-memory rate limiter (per IP, resets on edge restart) ---
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string, limit = 10, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

function hasUsableAccessToken(token: string): boolean {
  try {
    const payloadPart = token.split('.')[1];
    if (!payloadPart) return false;

    const normalized = payloadPart
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const payload = JSON.parse(atob(padded)) as { exp?: number };

    return typeof payload.exp === 'number'
      && payload.exp * 1000 > Date.now() + 60_000;
  } catch {
    return false;
  }
}

function clearSessionCookies(response: NextResponse) {
  response.cookies.set('sb-access-token', '', { maxAge: 0, path: '/' });
  response.cookies.set('sb-refresh-token', '', { maxAge: 0, path: '/' });
}

async function refreshAdminSession(
  request: NextRequest,
  redirectToLogin: boolean,
): Promise<NextResponse | null> {
  const accessToken = request.cookies.get('sb-access-token')?.value;
  if (!accessToken || hasUsableAccessToken(accessToken)) return null;

  const refreshToken = request.cookies.get('sb-refresh-token')?.value;
  if (!refreshToken) {
    const response = redirectToLogin
      ? NextResponse.redirect(new URL('/login', request.url))
      : NextResponse.json({ error: 'Session expired' }, { status: 401 });
    clearSessionCookies(response);
    return response;
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/+$/, '');
    const refreshResponse = await fetch(
      `${baseUrl}/auth/v1/token?grant_type=refresh_token`,
      {
        method: 'POST',
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      },
    );

    const session = await refreshResponse.json();
    if (
      !refreshResponse.ok
      || typeof session.access_token !== 'string'
      || typeof session.refresh_token !== 'string'
    ) {
      const response = redirectToLogin
        ? NextResponse.redirect(new URL('/login', request.url))
        : NextResponse.json({ error: 'Session expired' }, { status: 401 });
      clearSessionCookies(response);
      return response;
    }

    request.cookies.set('sb-access-token', session.access_token);
    request.cookies.set('sb-refresh-token', session.refresh_token);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('cookie', request.cookies.toString());

    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });

    response.cookies.set('sb-access-token', session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
    response.cookies.set('sb-refresh-token', session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch {
    const response = redirectToLogin
      ? NextResponse.redirect(new URL('/login', request.url))
      : NextResponse.json({ error: 'Session expired' }, { status: 401 });
    clearSessionCookies(response);
    return response;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith('/ZAIMOZ');
  const isAdminApi =
    pathname.startsWith('/api/admin') || pathname.startsWith('/api/upload');

  if (isAdminPage || isAdminApi) {
    const sessionResponse = await refreshAdminSession(request, isAdminPage);
    if (sessionResponse) {
      addSecurityHeaders(sessionResponse, true);
      return sessionResponse;
    }
  }

  // ── Skip i18n for admin, API, login, and static assets ─────────────────────
  if (
    pathname.startsWith('/ZAIMOZ') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    // Still apply rate limiting and security for these paths
    if (PUBLIC_API_ROUTES.some((r) => pathname.startsWith(r))) {
      const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
        '127.0.0.1';
      if (!rateLimit(ip)) {
        return new NextResponse('Too Many Requests', {
          status: 429,
          headers: { 'Retry-After': '60' },
        });
      }
    }

    if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
      const sessionToken = request.cookies.get('sb-access-token');
      if (!sessionToken) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    // Block WordPress legacy paths
    const wpPaths = [
      '/wp-admin', '/wp-login', '/wp-json', '/xmlrpc.php',
      '/wp-config', '/.env', '/wp-content',
    ];
    if (wpPaths.some((p) => pathname.startsWith(p) || pathname.includes(p))) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // Add security headers for non-i18n routes
    const response = NextResponse.next();
    addSecurityHeaders(
      response,
      pathname.startsWith('/ZAIMOZ') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/login')
    );
    return response;
  }

  // ── WordPress legacy block for locale-prefixed paths ──────────────────────
  const wpPaths = [
    '/wp-admin', '/wp-login', '/wp-json', '/xmlrpc.php',
    '/wp-config', '/.env', '/wp-content',
  ];
  if (wpPaths.some((p) => pathname.includes(p))) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // ── Rate limiting on public API routes ───────────────────────────────────
  if (PUBLIC_API_ROUTES.some((r) => pathname.startsWith(r))) {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      '127.0.0.1';
    if (!rateLimit(ip)) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: { 'Retry-After': '60' },
      });
    }
  }

  // ── Sync locale with cookie on listing pages only ────────────────────────
  // If the visitor previously switched language (NEXT_LOCALE cookie) but
  // lands back on a listing page with an older locale in the URL (e.g. via
  // browser Back), redirect to the cookie's locale. Detail pages are
  // excluded so a shared link to a specific locale still works as-is.
  const parsedLocale = getLocaleFromPath(pathname);
  if (parsedLocale) {
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    if (
      cookieLocale &&
      cookieLocale !== parsedLocale.locale &&
      (routing.locales as readonly string[]).includes(cookieLocale) &&
      LISTING_PATHS.includes(parsedLocale.rest)
    ) {
      const url = request.nextUrl.clone();
      url.pathname = `/${cookieLocale}${parsedLocale.rest === '/' ? '' : parsedLocale.rest}`;
      return NextResponse.redirect(url);
    }
  }

  // ── Apply i18n routing ──────────────────────────────────────────────────
  const response = handleI18nRouting(request);
  addSecurityHeaders(response);
  return response;
}

function addSecurityHeaders(response: NextResponse, noStore = false) {
  const isDev = process.env.NODE_ENV === 'development';
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://js.stripe.com https://maps.googleapis.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https://cdn.sanity.io https://hurghada-reiseplaner.at https://images.unsplash.com https://res.cloudinary.com",
    "connect-src 'self' https://api.stripe.com https://*.sanity.io",
    "media-src 'self'",
    "frame-src https://js.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );

  if (noStore) {
    response.headers.set(
      'Cache-Control',
      'private, no-cache, no-store, must-revalidate'
    );
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|mp4)$).*)',
  ],
};
