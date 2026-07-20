import type { GlobalConfig } from 'payload'
import { revalidateHomeGlobal } from '@/lib/revalidation/payloadHooks'

export const HorizontalScroll: GlobalConfig = {
  slug: 'horizontal-scroll',
  hooks: { afterChange: [revalidateHomeGlobal] },
  label: 'Horizontal Scroll',
  access: { read: () => true },
  admin: {
    group: 'Home',
  },
  fields: [
    {
      type: 'group',
      name: 'box1',
      label: 'Box 1 — Photo',
      fields: [
        { name: 'image', type: 'relationship', relationTo: 'media' as const },
      ],
    },
    {
      type: 'group',
      name: 'box2',
      label: 'Box 2 — Dark Text Panel',
      fields: [
        { name: 'image',    type: 'relationship', relationTo: 'media' as const },
        { name: 'tag',      type: 'text', localized: true },
        { name: 'headline', type: 'text', localized: true },
      ],
    },
    {
      type: 'group',
      name: 'box3',
      label: 'Box 3 — Product Photo',
      fields: [
        { name: 'image', type: 'relationship', relationTo: 'media' as const },
      ],
    },
    {
      type: 'group',
      name: 'box4',
      label: 'Box 4 — CTA (Gradient Background — Static)',
      admin: {
        description: 'The animated blue gradient background is static code. Manage the text and button here.',
      },
      fields: [
        { name: 'text',        type: 'text', localized: true },
        { name: 'buttonLabel', type: 'text', localized: true },
        { name: 'buttonHref',  type: 'text' },
      ],
    },
    {
      type: 'group',
      name: 'box5',
      label: 'Box 5 — Wide Video with Overlay',
      admin: {
        description: 'Upload a cover image and video. The site loads the cover first and delays this video until the page is ready.',
      },
      fields: [
        { name: 'video',      type: 'relationship', relationTo: 'media' as const },
        { name: 'coverImage', type: 'relationship', relationTo: 'media' as const },
        { name: 'tag',        type: 'text', localized: true },
        { name: 'headline',   type: 'text', localized: true },
      ],
    },
    {
      type: 'group',
      name: 'box6',
      label: 'Box 6 — Closing Light Panel',
      fields: [
        { name: 'image',       type: 'relationship', relationTo: 'media' as const },
        { name: 'tag',         type: 'text', localized: true },
        { name: 'headline',    type: 'text', localized: true },
        { name: 'buttonLabel', type: 'text', localized: true },
        { name: 'buttonHref',  type: 'text' },
      ],
    },
  ],
}
