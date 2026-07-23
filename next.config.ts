import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

// Vercel sets this during its own build; the real production deployment
// (standalone output + manually-copied media folder) never sets it.
const isVercel = process.env.VERCEL === '1'

const nextConfig: NextConfig = {
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  // On Vercel, Payload's media-serving API route reads files from the
  // root-level `media` folder via dynamic fs access, which Next's file
  // tracer can't always detect on its own — this forces those files into
  // every API route's serverless function bundle. Skipped outside Vercel
  // since the standalone-output deploy copies `media` in manually instead.
  ...(isVercel
    ? {
        outputFileTracingIncludes: {
          '/api/**/*': ['./media/**/*'],
        },
      }
    : {}),
  async headers() {
    return [
      {
        source: '/api/media/file/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/home page/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',                value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',          value: 'nosniff' },
          { key: 'Referrer-Policy',                 value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',              value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
};

export default withPayload(nextConfig);
