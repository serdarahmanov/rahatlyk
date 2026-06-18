import type { GlobalConfig } from 'payload'

export const ContactInfo: GlobalConfig = {
  slug: 'contact-info',
  access: { read: () => true },
  admin: {
    group: 'Settings',
  },
  fields: [
    { name: 'email', type: 'email' },
    {
      name: 'phones',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'number', type: 'text', required: true },
      ],
    },
    { name: 'address', type: 'text', localized: true },
    { name: 'workingHours', type: 'text', localized: true },
  ],
}
