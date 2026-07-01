import type { GlobalConfig } from 'payload'
import { revalidateAboutGlobal } from '@/lib/revalidation/payloadHooks'

export const AboutFinalSection: GlobalConfig = {
  slug: 'about-final-section',
  label: 'Final Section',
  hooks: { afterChange: [revalidateAboutGlobal] },
  access: { read: () => true },
  admin: {
    group: 'About',
    description: 'The final full-screen image and message shown at the bottom of the About page.',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Desktop Background Image',
    },
    {
      name: 'mobileImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Mobile Background Image',
      admin: { description: 'Optional mobile background image. Falls back to desktop image when empty.' },
    },
    {
      name: 'heading',
      type: 'text',
      localized: true,
      required: true,
      label: 'Heading',
    },
    {
      name: 'body',
      type: 'textarea',
      localized: true,
      required: true,
      label: 'Body',
    },
  ],
}
