import type { CollectionConfig } from 'payload'
import {
  revalidateMediaChange,
  revalidateMediaDelete,
} from '@/lib/revalidation/payloadHooks'

export const Media: CollectionConfig = {
  slug: 'media',
  hooks: {
    afterChange: [revalidateMediaChange],
    afterDelete: [revalidateMediaDelete],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
