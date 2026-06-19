import type { GlobalConfig } from 'payload'

export const AboutCertificates: GlobalConfig = {
  slug: 'about-certificates',
  label: 'Certificates Section',
  access: { read: () => true },
  admin: {
    group: 'About',
  },
  fields: [
    {
      name: 'intro',
      type: 'group',
      label: 'Our standards, on the record.',
      fields: [
        {
          name: 'headingText',
          type: 'text',
          localized: true,
          label: 'Heading',
          admin: { description: 'e.g. "Our standards,"' },
        },
        {
          name: 'headingAccent',
          type: 'text',
          localized: true,
          label: 'Heading Accent (italic)',
          admin: { description: 'e.g. "on the record."' },
        },
        {
          name: 'subtitle',
          type: 'textarea',
          localized: true,
          label: 'Subtitle',
        },
      ],
    },
    {
      name: 'seal',
      type: 'group',
      label: 'TLYK  ·  CERTIFIED QUALITY  ·  EST. 20',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Seal Text (circular spinning text)',
        },
      ],
    },
    {
      name: 'certificates',
      type: 'array',
      label: 'Certificates',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Certificate Name',
          admin: { description: 'e.g. "ISO 9001"' },
        },
        {
          name: 'tag',
          type: 'text',
          localized: true,
          label: 'Tag',
          admin: { description: 'e.g. "Quality management"' },
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          label: 'Brief Description',
        },
        {
          name: 'expiryDate',
          type: 'text',
          label: 'Expiry Date',
          admin: { description: 'e.g. "Issued 2019 · Valid"' },
        },
        {
          name: 'photo',
          type: 'relationship',
          relationTo: 'media' as const,
          label: 'Certificate Photo',
        },
      ],
    },
  ],
}
