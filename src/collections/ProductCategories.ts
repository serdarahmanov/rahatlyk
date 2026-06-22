import type { CollectionConfig } from 'payload'
import {
  revalidateProductCategoriesChange,
  revalidateProductCategoriesDelete,
} from '@/lib/revalidation/payloadHooks'

export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  hooks: {
    afterChange: [revalidateProductCategoriesChange],
    afterDelete: [revalidateProductCategoriesDelete],
  },
  access: { read: () => true },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['slug', 'label'],
    group: 'Products',
  },
  fields: [
    { name: 'slug',  type: 'text', required: true, unique: true },
    { name: 'label', type: 'text', required: true, localized: true },
  ],
}
