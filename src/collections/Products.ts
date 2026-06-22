import type { CollectionConfig } from 'payload'
import {
  revalidateProductChange,
  revalidateProductDelete,
} from '@/lib/revalidation/payloadHooks'

export const Products: CollectionConfig = {
  slug: 'products',
  hooks: {
    afterChange: [revalidateProductChange],
    afterDelete: [revalidateProductDelete],
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'date'],
    group: 'Products',
  },
  fields: [
    { name: 'name',            type: 'text',     required: true,  localized: true },
    { name: 'tagline',         type: 'text',                      localized: true },
    { name: 'date',            type: 'date',
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy-MM-dd' } } },
    { name: 'category',        type: 'relationship', relationTo: 'product-categories' as const, required: true },
    { name: 'description',     type: 'textarea',                  localized: true },
    { name: 'longDescription', type: 'textarea',                  localized: true },
    {
      name: 'nutrition',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'value', type: 'text', required: true, localized: true },
      ],
    },
    {
      name: 'volumes',
      type: 'array',
      fields: [{ name: 'value', type: 'text', required: true }],
    },
    {
      name: 'photos',
      type: 'array',
      fields: [
        { name: 'media', type: 'relationship', relationTo: 'media' },
        {
          name: 'url',
          type: 'text',
          admin: {
            description: 'Fallback URL used when no media item is selected.',
          },
        },
      ],
    },
    {
      name: 'video',
      type: 'relationship',
      relationTo: 'media' as const,
      label: 'Product Video',
      admin: {
        description: 'Optional product video shown on the detail page.',
      },
    },
  ],
}
