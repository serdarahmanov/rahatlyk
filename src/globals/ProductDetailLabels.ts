import type { GlobalConfig } from 'payload'

export const ProductDetailLabels: GlobalConfig = {
  slug: 'product-detail-labels',
  label: 'Product Detail Labels',
  access: { read: () => true },
  admin: {
    group: 'Products',
    description: 'UI labels shown on the product detail page — size, nutrition, about, and table headers.',
  },
  fields: [
    { name: 'sizeLabel',      type: 'text', localized: true, label: 'Size label' },
    { name: 'nutritionLabel', type: 'text', localized: true, label: 'Nutrition accordion label' },
    { name: 'aboutLabel',     type: 'text', localized: true, label: 'About section heading' },
    { name: 'mineralLabel',   type: 'text', localized: true, label: 'Nutrition table — Mineral column header' },
    { name: 'perLitreLabel',  type: 'text', localized: true, label: 'Nutrition table — Per Litre column header' },
  ],
}
