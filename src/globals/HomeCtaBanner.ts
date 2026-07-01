import type { GlobalConfig } from 'payload'
import { revalidateHomeGlobal } from '@/lib/revalidation/payloadHooks'

export const HomeCtaBanner: GlobalConfig = {
  slug: 'home-cta-banner',
  hooks: { afterChange: [revalidateHomeGlobal] },
  label: 'CTA Banner (Last Section)',
  access: { read: () => true },
  admin: {
    group: 'Home',
    description: 'Manage the background image, text, and button link for the final home section.',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Desktop Background Image',
      admin: { description: 'Desktop background image for the final CTA section.' },
    },
    {
      name: 'mobileImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Mobile Background Image',
      admin: { description: 'Optional mobile background image. Falls back to desktop image when empty.' },
    },
    { name: 'title',    type: 'text',     localized: true },
    { name: 'subtitle', type: 'text',     localized: true },
    { name: 'ctaLabel', type: 'text',     localized: true },
    { name: 'ctaHref',  type: 'text' },
  ],
}
