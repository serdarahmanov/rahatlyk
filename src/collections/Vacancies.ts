import type { CollectionConfig } from 'payload'

export const Vacancies: CollectionConfig = {
  slug: 'vacancies',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'department', 'location', 'postedDate'],
    group: 'Vacancies',
  },
  fields: [
    { name: 'title',      type: 'text', required: true, localized: true },
    { name: 'department', type: 'relationship', relationTo: 'vacancy-departments' as const, required: true },
    { name: 'location',   type: 'text', localized: true },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Full Time', value: 'fullTime' },
        { label: 'Part Time', value: 'partTime' },
      ],
    },
    { name: 'overview', type: 'textarea', localized: true },
    {
      name: 'responsibilities',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true, localized: true }],
    },
    {
      name: 'requirements',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true, localized: true }],
    },
    {
      name: 'niceToHave',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true, localized: true }],
    },
    {
      name: 'benefits',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true, localized: true }],
    },
    { name: 'salary',     type: 'text' },
    { name: 'postedDate', type: 'date',
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy-MM-dd' } } },
  ],
}
