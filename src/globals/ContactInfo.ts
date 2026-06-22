import type { GlobalConfig } from 'payload'
import { revalidateContactInfoGlobal } from '@/lib/revalidation/payloadHooks'

export const ContactInfo: GlobalConfig = {
  slug: 'contact-info',
  hooks: { afterChange: [revalidateContactInfoGlobal] },
  access: { read: () => true },
  admin: {
    group: 'Settings',
  },
  fields: [
    { name: 'sectionLabel', type: 'text', localized: true, label: 'Section Label (e.g. "Contact Information")' },
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
