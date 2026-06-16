import type { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
  slug: 'articles',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'date', 'featured'],
  },
  fields: [
    { name: 'title',    type: 'text',     required: true },
    { name: 'category', type: 'text',     required: true },
    { name: 'date',     type: 'date',     required: true,
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy-MM-dd' } } },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'emoji',    type: 'text' },
    {
      name: 'images',
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
      name: 'body',
      type: 'array',
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
  ],
}
