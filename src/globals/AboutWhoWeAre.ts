import type { GlobalConfig } from 'payload'

export const AboutWhoWeAre: GlobalConfig = {
  slug: 'about-who-we-are',
  label: 'Who We Are Section',
  access: { read: () => true },
  admin: {
    group: 'About',
  },
  fields: [
    {
      name: 'statement',
      type: 'group',
      label: 'Statement Paragraph',
      fields: [
        {
          name: 'text',
          type: 'textarea',
          localized: true,
          label: 'Statement Text',
        },
        {
          name: 'accentWordIndex',
          type: 'number',
          localized: true,
          label: 'Accent Word Number (1-based position of the italic cyan word)',
          defaultValue: 0,
        },
      ],
    },
    {
      name: 'whoWeAre',
      type: 'group',
      label: 'Who We Are',
      fields: [
        {
          name: 'sectionTitle',
          type: 'text',
          localized: true,
          label: 'Section Title',
        },
        {
          name: 'paragraph1',
          type: 'textarea',
          localized: true,
          label: 'Paragraph 1',
        },
        {
          name: 'paragraph2',
          type: 'textarea',
          localized: true,
          label: 'Paragraph 2',
        },
        {
          name: 'paragraph3',
          type: 'textarea',
          localized: true,
          label: 'Paragraph 3',
        },
      ],
    },
    {
      name: 'fullViewportImage',
      type: 'relationship',
      relationTo: 'media' as const,
      label: 'Full Viewport Image',
    },
  ],
}
