import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'date'],
  },
  fields: [
    { name: 'name',            type: 'text',     required: true },
    { name: 'tagline',         type: 'text' },
    { name: 'date',            type: 'date',
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy-MM-dd' } } },
    { name: 'category',        type: 'text',     required: true },
    { name: 'description',     type: 'textarea' },
    { name: 'longDescription', type: 'textarea' },
    {
      name: 'features',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'nutrition',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
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
  ],
}
