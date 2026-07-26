import type { GlobalConfig } from 'payload'
import { revalidateNotFoundGlobal } from '@/lib/revalidation/payloadHooks'

export const NotFoundPage: GlobalConfig = {
  slug: 'not-found-page',
  hooks: { afterChange: [revalidateNotFoundGlobal] },
  label: 'Not Found (404) Page',
  access: { read: () => true },
  admin: {
    group: 'General',
    description: 'Shown whenever a visitor hits a page that no longer exists.',
  },
  fields: [
    { name: 'title', type: 'text', localized: true, label: 'Title' },
    { name: 'message', type: 'textarea', localized: true, label: 'Message' },
    { name: 'ctaLabel', type: 'text', localized: true, label: 'Button Label (links back to Home)' },
  ],
}
