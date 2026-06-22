import type { GlobalConfig } from 'payload'
import { revalidateAboutGlobal } from '@/lib/revalidation/payloadHooks'

export const AboutOurStory: GlobalConfig = {
  slug: 'about-our-story',
  hooks: { afterChange: [revalidateAboutGlobal] },
  label: 'Our Story Section',
  access: { read: () => true },
  admin: {
    group: 'About',
  },
  fields: [
    {
      name: 'sectionLabel',
      type: 'text',
      localized: true,
      label: 'Section Label',
      admin: { description: 'e.g. "Our story"' },
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      label: 'Title',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      localized: true,
      label: 'Subtitle',
    },
    {
      name: 'milestones',
      type: 'array',
      label: 'History Cards',
      fields: [
        {
          name: 'year',
          type: 'text',
          label: 'Year',
          admin: { description: 'e.g. "2003" or "Now"' },
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          label: 'Title',
        },
        {
          name: 'body',
          type: 'textarea',
          localized: true,
          label: 'Body Text',
        },
        {
          name: 'isCurrent',
          type: 'checkbox',
          label: 'Mark as current milestone',
          defaultValue: false,
        },
      ],
    },
  ],
}
