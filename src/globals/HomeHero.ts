import type { GlobalConfig } from 'payload'

export const HomeHero: GlobalConfig = {
  slug: 'home-hero',
  label: 'Hero Section',
  access: { read: () => true },
  admin: {
    group: 'Home',
  },
  fields: [
    {
      name: 'video',
      type: 'relationship',
      relationTo: 'media' as const,
      label: 'Background Video',
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      label: 'Video Poster',
      admin: {
        description: 'Shown immediately while the background video loads or if it cannot play.',
      },
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      label: 'Title (line 1)',
    },
    {
      name: 'titleAccent',
      type: 'text',
      localized: true,
      label: 'Title Accent (line 2)',
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
      label: 'Subtitle',
    },
  ],
}
