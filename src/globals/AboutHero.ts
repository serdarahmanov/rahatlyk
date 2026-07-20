import type { GlobalConfig } from 'payload'
import { revalidateAboutGlobal } from '@/lib/revalidation/payloadHooks'

export const AboutHero: GlobalConfig = {
  slug: 'about-hero',
  hooks: { afterChange: [revalidateAboutGlobal] },
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
      label: 'Desktop Cover Image',
    },
    {
      name: 'mobileCoverImage',
      type: 'relationship',
      relationTo: 'media' as const,
      label: 'Mobile Cover Image',
      admin: { description: 'Optional mobile hero image. Falls back to desktop cover image when empty.' },
    },
    {
      name: 'heroVideo',
      type: 'relationship',
      relationTo: 'media' as const,
      label: 'Desktop / Tablet Hero Video',
      admin: {
        description: 'Horizontal hero video for desktop and tablet screens. The page shows the cover image first, delays video loading until existing About media is ready, then swaps to video.',
      },
    },
    {
      name: 'mobileHeroVideo',
      type: 'relationship',
      relationTo: 'media' as const,
      label: 'Mobile Hero Video',
      admin: {
        description: 'Vertical hero video for mobile screens. Falls back to the desktop/tablet hero video when empty.',
      },
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
