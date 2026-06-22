import type { GlobalConfig } from 'payload'
import { revalidateAboutGlobal } from '@/lib/revalidation/payloadHooks'

export const AboutNumbers: GlobalConfig = {
  slug: 'about-numbers',
  hooks: { afterChange: [revalidateAboutGlobal] },
  label: 'Numbers Section',
  access: { read: () => true },
  admin: {
    group: 'About',
  },
  fields: [
    {
      name: 'stats',
      type: 'array',
      label: 'Numbers',
      fields: [
        {
          name: 'value',
          type: 'number',
          label: 'Number',
        },
        {
          name: 'suffix',
          type: 'text',
          label: 'Suffix',
          admin: { description: 'e.g. "%" or "+" — leave empty for none' },
        },
        {
          name: 'label',
          type: 'text',
          localized: true,
          label: 'Description',
        },
      ],
    },
    {
      name: 'tagline',
      type: 'group',
      label: 'Comfort Bottled',
      fields: [
        {
          name: 'text',
          type: 'text',
          localized: true,
          label: 'Main Text',
          admin: { description: 'e.g. "Comfort,"' },
        },
        {
          name: 'accentText',
          type: 'text',
          localized: true,
          label: 'Accent Word (italic serif font)',
          admin: { description: 'e.g. "bottled."' },
        },
      ],
    },
  ],
}
