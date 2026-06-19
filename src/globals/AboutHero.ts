import type { GlobalConfig } from 'payload'

export const AboutHero: GlobalConfig = {
  slug: 'about-hero',
  label: 'Hero Section',
  access: { read: () => true },
  admin: {
    group: 'About',
  },
  fields: [
    {
      name: 'coverImage',
      type: 'relationship',
      relationTo: 'media' as const,
      label: 'Cover Image',
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      label: 'Title',
    },
    {
      name: 'accentWordIndex',
      type: 'number',
      localized: true,
      label: 'Accent Word Number (1-based position of the italic serif word in the title)',
      defaultValue: 0,
    },
  ],
}
