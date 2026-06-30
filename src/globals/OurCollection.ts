import type { GlobalConfig } from 'payload'
import { revalidateHomeGlobal } from '@/lib/revalidation/payloadHooks'

export const OurCollection: GlobalConfig = {
  slug: 'our-collection',
  label: 'Our Collection',
  hooks: { afterChange: [revalidateHomeGlobal] },
  access: { read: () => true },
  admin: {
    group: 'Home',
    description: 'Manage the product collection carousel shown on the home page.',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Collection Items',
      fields: [
        { name: 'key', type: 'text', required: true, label: 'Key' },
        { name: 'name', type: 'text', required: true, localized: true },
        { name: 'description', type: 'text', required: true, localized: true },
        { name: 'body', type: 'textarea', required: true, localized: true },
        { name: 'image', type: 'relationship', relationTo: 'media' as const },
        { name: 'order', type: 'number', defaultValue: 0 },
      ],
    },
  ],
}
