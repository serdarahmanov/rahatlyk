import type { GlobalConfig } from 'payload'
import { revalidateFooterGlobal } from '@/lib/revalidation/payloadHooks'

export const Footer: GlobalConfig = {
  slug: 'footer',
  hooks: { afterChange: [revalidateFooterGlobal] },
  label: 'Footer',
  access: { read: () => true },
  admin: {
    group: 'Footer',
    description: 'Localized footer tagline, column headings, and copyright line. Shown on every page.',
  },
  fields: [
    { name: 'tagline',        type: 'text', localized: true, label: 'Tagline', admin: { description: 'e.g. "Premium beverages from the heart of Turkmenistan"' } },
    { name: 'quickLinksLabel', type: 'text', localized: true, label: 'Quick Links heading' },
    { name: 'companyLabel',   type: 'text', localized: true, label: 'Company heading' },
    { name: 'rights',         type: 'text', localized: true, label: 'Copyright line', admin: { description: 'e.g. "© 2025 RAHATLYK. All rights reserved." — update the year annually.' } },
  ],
}
