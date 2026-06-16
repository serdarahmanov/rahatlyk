import type { CollectionConfig } from 'payload'

export const ProductLines: CollectionConfig = {
  slug: 'product-lines',
  access: { read: () => true },
  admin: {
    useAsTitle: 'key',
    defaultColumns: ['key', 'name', 'order'],
  },
  fields: [
    { name: 'key',         type: 'text',        required: true, unique: true },
    { name: 'name',        type: 'text',        required: true, localized: true },
    { name: 'description', type: 'text',        required: true, localized: true },
    { name: 'body',        type: 'textarea',    required: true, localized: true },
    { name: 'image',       type: 'relationship', relationTo: 'media' as const },
    { name: 'order',       type: 'number',      defaultValue: 0 },
  ],
}
