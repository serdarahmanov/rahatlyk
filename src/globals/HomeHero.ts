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
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      label: 'Desktop Cover Image',
      admin: {
        description: 'Loaded first for desktop/tablet home hero. The intro exits when this image is ready.',
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
      name: 'parallaxImages',
      type: 'array',
      label: 'Hero Parallax Bubble Images',
      admin: {
        description: 'Layered hero images. The first few are used on mobile; all are used on desktop/tablet.',
      },
      fields: [
        {
          name: 'fileName',
          type: 'text',
          required: true,
          label: 'File Name',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Image',
        },
      ],
    },
    {
      name: 'bottleImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Desktop / Tablet Bottle Image',
    },
    {
      name: 'mobileBottleImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Mobile Bottle Image',
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
    {
      name: 'ctaLabel',
      type: 'text',
      localized: true,
      label: 'CTA Button Text',
      admin: {
        description: 'Desktop/tablet hero button label (e.g. "Contact with Us"). Leave empty to hide the button.',
      },
    },
    {
      name: 'ctaHref',
      type: 'text',
      label: 'CTA Button Link',
      admin: {
        description: 'Link the CTA button points to, e.g. /contact',
      },
    },
  ],
}
