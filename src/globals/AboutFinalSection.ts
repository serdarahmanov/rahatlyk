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
      label: 'Background Image',
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
