import type { GlobalConfig } from 'payload'
import { revalidateErrorPageGlobal } from '@/lib/revalidation/payloadHooks'

export const ErrorPage: GlobalConfig = {
  slug: 'error-page',
  hooks: { afterChange: [revalidateErrorPageGlobal] },
  label: 'Error Page',
  access: { read: () => true },
  admin: {
    group: 'General',
    description: 'Shown whenever an unexpected error happens while rendering a page.',
  },
  fields: [
    { name: 'label', type: 'text', localized: true, label: 'Eyebrow Label (e.g. "Error")' },
    { name: 'title', type: 'text', localized: true, label: 'Title' },
    { name: 'message', type: 'textarea', localized: true, label: 'Message' },
    { name: 'retryLabel', type: 'text', localized: true, label: '"Try Again" Button Label' },
    { name: 'ctaLabel', type: 'text', localized: true, label: '"Back to Home" Button Label' },
  ],
}
