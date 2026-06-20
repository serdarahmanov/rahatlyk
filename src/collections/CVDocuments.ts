import type { CollectionConfig } from 'payload'

export const CVDocuments: CollectionConfig = {
  slug: 'cv-documents',
  access: {
    read:   ({ req: { user } }) => Boolean(user),
    create: () => false,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'applicantName', 'mimeType', 'createdAt'],
    group: 'Submissions',
  },
  upload: {
    staticDir: 'cv',
    staticURL: '/api/cv',
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
  fields: [
    {
      name: 'applicantName',
      type: 'text',
      admin: { readOnly: true },
    },
  ],
}
