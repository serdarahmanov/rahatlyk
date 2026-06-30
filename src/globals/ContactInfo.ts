import type { GlobalConfig } from 'payload'
import { revalidateContactInfoGlobal } from '@/lib/revalidation/payloadHooks'

export const ContactInfo: GlobalConfig = {
  slug: 'contact-info',
  hooks: { afterChange: [revalidateContactInfoGlobal] },
  access: { read: () => true },
  admin: {
    group: 'Contact Page',
  },
  fields: [
    {
      name: 'siteIcon',
      type: 'upload',
      relationTo: 'media',
      label: 'Site Icon (browser tab / favicon)',
      admin: { description: 'Recommended: square PNG or ICO, at least 512×512 px. Displayed in browser tabs, bookmarks and mobile home screens.' },
    },
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
    {
      name: 'socialLinks',
      type: 'group',
      label: 'Social Media Links',
      fields: [
        { name: 'instagramUrl', type: 'text', label: 'Instagram URL' },
        { name: 'youtubeUrl', type: 'text', label: 'YouTube URL' },
        { name: 'facebookUrl', type: 'text', label: 'Facebook URL' },
      ],
    },
  ],
}
