import type { GlobalConfig } from 'payload'
import { revalidateSiteMetadataGlobal } from '@/lib/revalidation/payloadHooks'

export const SiteMetadata: GlobalConfig = {
  slug: 'site-metadata',
  label: 'Site Metadata & JSON-LD',
  hooks: { afterChange: [revalidateSiteMetadataGlobal] },
  access: { read: () => true },
  admin: {
    group: 'SEO',
    description: 'Page titles, descriptions and OG images for all static pages, plus JSON-LD structured data.',
  },
  fields: [
    {
      name: 'home',
      type: 'group',
      label: 'Home Page',
      fields: [
        { name: 'title', type: 'text', localized: true, label: 'Title' },
        { name: 'description', type: 'textarea', localized: true, label: 'Description' },
        { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'OG Image', admin: { description: 'Recommended: 1200×630 px. Used for link previews on social media.' } },
      ],
    },
    {
      name: 'about',
      type: 'group',
      label: 'About Page',
      fields: [
        { name: 'title', type: 'text', localized: true, label: 'Title' },
        { name: 'description', type: 'textarea', localized: true, label: 'Description' },
        { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'OG Image', admin: { description: 'Recommended: 1200×630 px. Used for link previews on social media.' } },
      ],
    },
    {
      name: 'products',
      type: 'group',
      label: 'Products Page',
      fields: [
        { name: 'title', type: 'text', localized: true, label: 'Title' },
        { name: 'description', type: 'textarea', localized: true, label: 'Description' },
        { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'OG Image', admin: { description: 'Recommended: 1200×630 px. Used for link previews on social media.' } },
      ],
    },
    {
      name: 'news',
      type: 'group',
      label: 'News Page',
      fields: [
        { name: 'title', type: 'text', localized: true, label: 'Title' },
        { name: 'description', type: 'textarea', localized: true, label: 'Description' },
        { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'OG Image', admin: { description: 'Recommended: 1200×630 px. Used for link previews on social media.' } },
      ],
    },
    {
      name: 'vacancies',
      type: 'group',
      label: 'Vacancies Page',
      fields: [
        { name: 'title', type: 'text', localized: true, label: 'Title' },
        { name: 'description', type: 'textarea', localized: true, label: 'Description' },
        { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'OG Image', admin: { description: 'Recommended: 1200×630 px. Used for link previews on social media.' } },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      label: 'Contact Page',
      fields: [
        { name: 'title', type: 'text', localized: true, label: 'Title' },
        { name: 'description', type: 'textarea', localized: true, label: 'Description' },
        { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'OG Image', admin: { description: 'Recommended: 1200×630 px. Used for link previews on social media.' } },
      ],
    },
    {
      name: 'organizationJsonLd',
      type: 'group',
      label: 'Organization JSON-LD',
      admin: { description: 'schema.org/Organization — used by Google for Knowledge Panels and brand recognition.' },
      fields: [
        { name: 'name', type: 'text', label: 'Organization Name', admin: { description: 'Defaults to RAHATLYK if empty.' } },
      ],
    },
    {
      name: 'websiteJsonLd',
      type: 'group',
      label: 'Website JSON-LD',
      admin: { description: 'schema.org/WebSite — used by Google to display your site name in search results instead of the URL.' },
      fields: [
        { name: 'name', type: 'text', label: 'Site Name', admin: { description: 'Defaults to RAHATLYK if empty.' } },
      ],
    },
  ],
}
