import type { CollectionConfig } from 'payload'

export const VacancyDepartments: CollectionConfig = {
  slug: 'vacancy-departments',
  access: { read: () => true },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['slug', 'label'],
  },
  fields: [
    { name: 'slug',  type: 'text', required: true, unique: true },
    { name: 'label', type: 'text', required: true, localized: true },
  ],
}
