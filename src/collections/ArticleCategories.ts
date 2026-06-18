import type { CollectionConfig } from 'payload'

export const ArticleCategories: CollectionConfig = {
  slug: 'article-categories',
  access: { read: () => true },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['slug', 'label'],
    group: 'Articles',
  },
  fields: [
    { name: 'slug',  type: 'text', required: true, unique: true },
    { name: 'label', type: 'text', required: true, localized: true },
  ],
}
