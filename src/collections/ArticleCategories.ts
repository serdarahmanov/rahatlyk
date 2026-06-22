import type { CollectionConfig } from 'payload'
import {
  revalidateArticleCategoriesChange,
  revalidateArticleCategoriesDelete,
} from '@/lib/revalidation/payloadHooks'

export const ArticleCategories: CollectionConfig = {
  slug: 'article-categories',
  hooks: {
    afterChange: [revalidateArticleCategoriesChange],
    afterDelete: [revalidateArticleCategoriesDelete],
  },
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
