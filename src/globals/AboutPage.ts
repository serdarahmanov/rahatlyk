import type { GlobalConfig } from 'payload'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About Page',
  access: { read: () => true },
  admin: {
    group: 'About',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Hero Content',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          label: 'Title',
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          label: 'Description',
        },
      ],
    },
    {
      name: 'formLabels',
      type: 'group',
      label: 'Form Labels',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          localized: true,
          label: 'First Name',
        },
        {
          name: 'lastName',
          type: 'text',
          localized: true,
          label: 'Last Name',
        },
        {
          name: 'email',
          type: 'text',
          localized: true,
          label: 'Email',
        },
        {
          name: 'phone',
          type: 'text',
          localized: true,
          label: 'Phone',
        },
        {
          name: 'subject',
          type: 'text',
          localized: true,
          label: 'Subject',
        },
        {
          name: 'message',
          type: 'text',
          localized: true,
          label: 'Message',
        },
        {
          name: 'submitButton',
          type: 'text',
          localized: true,
          label: 'Submit Button',
        },
      ],
    },
    {
      name: 'formMessages',
      type: 'group',
      label: 'Form Messages',
      fields: [
        {
          name: 'success',
          type: 'text',
          localized: true,
          label: 'Success Message',
        },
        {
          name: 'error',
          type: 'text',
          localized: true,
          label: 'Error Message',
        },
        {
          name: 'sending',
          type: 'text',
          localized: true,
          label: 'Sending State (button text)',
        },
        {
          name: 'thankYou',
          type: 'text',
          localized: true,
          label: 'Thank You Line (use {name} and {email} as tokens)',
        },
        {
          name: 'whatHappensNext',
          type: 'text',
          localized: true,
          label: 'What Happens Next — heading',
        },
        {
          name: 'step1',
          type: 'text',
          localized: true,
          label: 'Step 1 text',
        },
        {
          name: 'step2',
          type: 'text',
          localized: true,
          label: 'Step 2 text (use {email} as token)',
        },
        {
          name: 'step3',
          type: 'text',
          localized: true,
          label: 'Step 3 text (use {phone} as token)',
        },
        {
          name: 'sendAnother',
          type: 'text',
          localized: true,
          label: 'Send Another Message (button text)',
        },
      ],
    },
    {
      name: 'formPlaceholders',
      type: 'group',
      label: 'Form Placeholders',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          localized: true,
          label: 'First Name',
        },
        {
          name: 'lastName',
          type: 'text',
          localized: true,
          label: 'Last Name',
        },
        {
          name: 'email',
          type: 'text',
          localized: true,
          label: 'Email',
        },
        {
          name: 'phone',
          type: 'text',
          localized: true,
          label: 'Phone',
        },
        {
          name: 'subject',
          type: 'text',
          localized: true,
          label: 'Subject',
        },
        {
          name: 'message',
          type: 'text',
          localized: true,
          label: 'Message',
        },
      ],
    },
  ],
}
