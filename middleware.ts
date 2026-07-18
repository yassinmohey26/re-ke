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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
    addSecurityHeaders(response);
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

  // ── Apply i18n routing ──────────────────────────────────────────────────
  const response = handleI18nRouting(request);
  addSecurityHeaders(response);
  return response;
}

function addSecurityHeaders(response: NextResponse) {
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
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.webp|.*\\.mp4).*)',
  ],
};
