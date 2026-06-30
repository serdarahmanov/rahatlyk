import type { GlobalConfig } from 'payload'
import { revalidateContactGlobal } from '@/lib/revalidation/payloadHooks'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  hooks: { afterChange: [revalidateContactGlobal] },
  label: 'Contact Hero',
  access: { read: () => true },
  admin: {
    group: 'Contact Page',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Hero Content',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          label: 'Title',
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          label: 'Description',
        },
      ],
    },
  ],
}
