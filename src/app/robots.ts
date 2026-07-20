import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rahatlyk.com'
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/site-icon', '/api/media/file/'],
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
