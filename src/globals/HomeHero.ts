import type { GlobalConfig } from 'payload'
import { revalidateHomeGlobal } from '@/lib/revalidation/payloadHooks'

export const HomeHero: GlobalConfig = {
  slug: 'home-hero',
  hooks: { afterChange: [revalidateHomeGlobal] },
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
      label: 'Desktop Cover Image',
      admin: {
        description: 'Loaded first for desktop/tablet home hero. The intro exits when this image is ready; the video loads afterward.',
      },
    },
    {
      name: 'mobilePoster',
      type: 'upload',
      relationTo: 'media',
      label: 'Mobile Cover Image',
      admin: {
        description: 'Used on mobile phones. If empty, the desktop cover image is used.',
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
