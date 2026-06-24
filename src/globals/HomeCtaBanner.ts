import type { GlobalConfig } from 'payload'
import { revalidateHomeGlobal } from '@/lib/revalidation/payloadHooks'

export const HomeCtaBanner: GlobalConfig = {
  slug: 'home-cta-banner',
  hooks: { afterChange: [revalidateHomeGlobal] },
  label: 'CTA Banner (Last Section)',
  access: { read: () => true },
  admin: {
    group: 'Home',
    description: 'Manage the background video, text, and button link for the final home section.',
  },
  fields: [
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Background video for the final CTA section.' },
    },
    { name: 'title',    type: 'text',     localized: true },
    { name: 'subtitle', type: 'text',     localized: true },
    { name: 'ctaLabel', type: 'text',     localized: true },
    { name: 'ctaHref',  type: 'text' },
  ],
}
