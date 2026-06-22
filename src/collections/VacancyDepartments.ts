import type { CollectionConfig } from 'payload'
import {
  revalidateVacancyDepartmentsChange,
  revalidateVacancyDepartmentsDelete,
} from '@/lib/revalidation/payloadHooks'

export const VacancyDepartments: CollectionConfig = {
  slug: 'vacancy-departments',
  hooks: {
    afterChange: [revalidateVacancyDepartmentsChange],
    afterDelete: [revalidateVacancyDepartmentsDelete],
  },
  access: { read: () => true },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['slug', 'label'],
    group: 'Vacancies',
  },
  fields: [
    { name: 'slug',  type: 'text', required: true, unique: true },
    { name: 'label', type: 'text', required: true, localized: true },
  ],
}
