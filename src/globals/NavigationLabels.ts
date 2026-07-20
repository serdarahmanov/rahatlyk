import type { GlobalConfig } from 'payload'
import { revalidateNavigationLabelsGlobal } from '@/lib/revalidation/payloadHooks'

export const NavigationLabels: GlobalConfig = {
  slug: 'navigation-labels',
  hooks: { afterChange: [revalidateNavigationLabelsGlobal] },
  label: 'Navigation Labels',
  access: { read: () => true },
  admin: {
    group: 'Navigation',
    description: 'Localized page names used by the header and footer navigation.',
  },
  fields: [
    { name: 'home',      type: 'text', localized: true, label: 'Home' },
    { name: 'products',  type: 'text', localized: true, label: 'Products' },
    { name: 'about',     type: 'text', localized: true, label: 'About Us' },
    { name: 'news',      type: 'text', localized: true, label: 'News' },
    { name: 'vacancies', type: 'text', localized: true, label: 'Vacancies' },
    { name: 'contact',   type: 'text', localized: true, label: 'Contact Us' },
  ],
}
