import type { CollectionConfig } from 'payload'

export const VacancyApplications: CollectionConfig = {
  slug: 'vacancy-applications',
  access: {
    read:   ({ req: { user } }) => Boolean(user),
    create: () => false,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstName', 'lastName', 'email', 'vacancy', 'createdAt'],
    group: 'Submissions',
  },
  fields: [
    { name: 'firstName',   type: 'text',         required: true,  admin: { readOnly: true } },
    { name: 'lastName',    type: 'text',         required: true,  admin: { readOnly: true } },
    { name: 'email',       type: 'email',        required: true,  admin: { readOnly: true } },
    { name: 'phone',       type: 'text',                          admin: { readOnly: true } },
    { name: 'dateOfBirth', type: 'text',         required: true,  admin: { readOnly: true } },
    { name: 'cover',       type: 'textarea',                      admin: { readOnly: true } },
    {
      name: 'vacancy',
      type: 'relationship',
      relationTo: 'vacancies' as const,
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'cv',
      type: 'relationship',
      relationTo: 'cv-documents' as const,
      admin: { readOnly: true },
    },
  ],
}
