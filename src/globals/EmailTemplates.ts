import type { Field, GlobalConfig } from 'payload'

const textField = (name: string, label: string, textarea = false): Field => {
  if (textarea) {
    return { name, type: 'textarea', localized: true, label }
  }

  return { name, type: 'text', localized: true, label }
}

const contactConfirmationFields = [
  textField('subject', 'Subject'),
  textField('preheader', 'Preheader'),
  textField('title', 'Title'),
  textField('subtitle', 'Subtitle'),
  textField('greeting', 'Greeting - tokens: {firstName} {lastName}', true),
  textField('intro', 'Intro', true),
  textField('summaryHeading', 'Summary heading'),
  textField('subjectLabel', 'Subject label'),
  textField('messageLabel', 'Message label'),
  textField('whatNextHeading', 'What next heading'),
  textField('step1', 'Step 1', true),
  textField('step2', 'Step 2 - token: {email}', true),
  textField('step3', 'Step 3', true),
  textField('ctaBtn', 'CTA button'),
]

const contactNotificationFields = [
  textField('subject', 'Subject - tokens: {fullName} {subject}'),
  textField('title', 'Title'),
  textField('subtitle', 'Subtitle - tokens: {fullName} {email}'),
  textField('firstNameLabel', 'First name label'),
  textField('lastNameLabel', 'Last name label'),
  textField('emailLabel', 'Email label'),
  textField('phoneLabel', 'Phone label'),
  textField('subjectLabel', 'Subject label'),
  textField('messageHeading', 'Message heading'),
  textField('replyBtn', 'Reply button - token: {firstName}'),
]

const vacancyConfirmationFields = [
  textField('subject', 'Subject - token: {vacancyTitle}'),
  textField('preheader', 'Preheader - token: {vacancyTitle}', true),
  textField('title', 'Title'),
  textField('subtitle', 'Subtitle - token: {vacancyTitle}'),
  textField('greeting', 'Greeting - tokens: {firstName} {lastName}', true),
  textField('intro', 'Intro - token: {vacancyTitle}', true),
  textField('appliedPositionHeading', 'Applied position heading'),
  textField('positionLabel', 'Position label'),
  textField('companyLabel', 'Company label'),
  textField('locationLabel', 'Location label'),
  textField('companyValue', 'Company value'),
  textField('locationValue', 'Location value'),
  textField('whatNextHeading', 'What next heading'),
  textField('step1', 'Step 1', true),
  textField('step2', 'Step 2', true),
  textField('step3', 'Step 3', true),
  textField('ctaBtn', 'CTA button'),
]

const vacancyNotificationFields = [
  textField('subject', 'Subject - tokens: {vacancyTitle} {fullName}'),
  textField('title', 'Title'),
  textField('subtitle', 'Subtitle - token: {vacancyTitle}'),
  textField('firstNameLabel', 'First name label'),
  textField('lastNameLabel', 'Last name label'),
  textField('dobLabel', 'Date of birth label'),
  textField('emailLabel', 'Email label'),
  textField('phoneLabel', 'Phone label'),
  textField('positionLabel', 'Position label'),
  textField('cvLabel', 'CV label'),
  textField('cvNote', 'CV note'),
  textField('coverHeading', 'Cover heading'),
  textField('replyBtn', 'Reply button'),
]

export const EmailTemplates: GlobalConfig = {
  slug: 'email-templates',
  label: 'Email Templates',
  access: { read: () => true },
  admin: {
    group: 'Email',
    description: 'Localized copy for contact and vacancy confirmation/notification emails.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact Email',
          fields: [
            {
              name: 'contactEmail',
              type: 'group',
              fields: [
                {
                  name: 'confirmation',
                  type: 'group',
                  label: 'Confirmation email to visitor',
                  fields: contactConfirmationFields,
                },
                {
                  name: 'notification',
                  type: 'group',
                  label: 'Notification email to admin',
                  fields: contactNotificationFields,
                },
              ],
            },
          ],
        },
        {
          label: 'Vacancy Email',
          fields: [
            {
              name: 'vacancyEmail',
              type: 'group',
              fields: [
                {
                  name: 'confirmation',
                  type: 'group',
                  label: 'Confirmation email to applicant',
                  fields: vacancyConfirmationFields,
                },
                {
                  name: 'notification',
                  type: 'group',
                  label: 'Notification email to admin',
                  fields: vacancyNotificationFields,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
