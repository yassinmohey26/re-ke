import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://www.hurghada-reiseplaner.at',
  },
  images: {
    qualities: [75, 80, 85],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hurghada-reiseplaner.at',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/trip', destination: '/de/touren', permanent: true },
      { source: '/trip/:slug', destination: '/de/touren/:slug', permanent: true },
      { source: '/de/trip', destination: '/de/touren', permanent: true },
      { source: '/de/trip/:slug', destination: '/de/touren/:slug', permanent: true },
      { source: '/contact-us', destination: '/de/kontakt', permanent: true },
      { source: '/de/contact-us', destination: '/de/kontakt', permanent: true },
      { source: '/autotransport', destination: '/de/airport-transfer', permanent: true },
      { source: '/de/autotransport', destination: '/de/airport-transfer', permanent: true },
      { source: '/trip-types/kultur-ausfluege', destination: '/de/touren/kultur-ausfluege', permanent: true },
      { source: '/de/trip-types/kultur-ausfluege', destination: '/de/touren/kultur-ausfluege', permanent: true },
      { source: '/trip-types/safari-ausfluege', destination: '/de/touren/safari-ausfluege', permanent: true },
      { source: '/de/trip-types/safari-ausfluege', destination: '/de/touren/safari-ausfluege', permanent: true },
      { source: '/trip-types/schnorchel-touren', destination: '/de/touren/schnorchel-touren', permanent: true },
      { source: '/de/trip-types/schnorchel-touren', destination: '/de/touren/schnorchel-touren', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
