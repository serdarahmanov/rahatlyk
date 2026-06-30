import type { GlobalConfig } from 'payload'
import { revalidateProductLabelsGlobal } from '@/lib/revalidation/payloadHooks'

export const ProductDetailLabels: GlobalConfig = {
  slug: 'product-detail-labels',
  hooks: { afterChange: [revalidateProductLabelsGlobal] },
  label: 'Product Labels',
  access: { read: () => true },
  admin: {
    group: 'Products',
    description: 'Localized product listing and detail page titles, section names, and button labels.',
  },
  fields: [
    { name: 'listingTitle',        type: 'text', localized: true, label: 'Product listing page title' },
    { name: 'filterAllLabel',      type: 'text', localized: true, label: 'All filter label' },
    { name: 'noProductsMessage',   type: 'text', localized: true, label: 'No products message' },
    { name: 'paginationItemLabel', type: 'text', localized: true, label: 'Pagination item label' },
    { name: 'sizeLabel',           type: 'text', localized: true, label: 'Size label' },
    { name: 'nutritionLabel',      type: 'text', localized: true, label: 'Nutrition accordion label' },
    { name: 'aboutLabel',          type: 'text', localized: true, label: 'About section heading' },
    { name: 'relatedHeading',      type: 'text', localized: true, label: 'Related products heading', admin: { description: 'Use {category} where the category name should appear.' } },
    { name: 'mineralLabel',        type: 'text', localized: true, label: 'Nutrition table - Mineral column header' },
    { name: 'perLitreLabel',       type: 'text', localized: true, label: 'Nutrition table - Per Litre column header' },
  ],
}
