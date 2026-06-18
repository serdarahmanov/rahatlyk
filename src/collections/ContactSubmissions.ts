import type { CollectionConfig } from 'payload'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  access: {
    read:   ({ req: { user } }) => Boolean(user),
    create: () => false,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstName', 'lastName', 'email', 'subject', 'createdAt'],
    group: 'Submissions',
  },
  fields: [
    { name: 'firstName', type: 'text',     required: true,  admin: { readOnly: true } },
    { name: 'lastName',  type: 'text',     required: true,  admin: { readOnly: true } },
    { name: 'email',     type: 'email',    required: true,  admin: { readOnly: true } },
    { name: 'phone',     type: 'text',                      admin: { readOnly: true } },
    { name: 'subject',   type: 'text',     required: true,  admin: { readOnly: true } },
    { name: 'message',   type: 'textarea', required: true,  admin: { readOnly: true } },
    {
      name: 'locale',
      type: 'select',
      options: ['en', 'ru', 'tm'],
      admin: { readOnly: true },
    },
  ],
}
