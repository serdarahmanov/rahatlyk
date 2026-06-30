import type { GlobalConfig } from 'payload'
import { revalidateFormsGlobal } from '@/lib/revalidation/payloadHooks'

export const Forms: GlobalConfig = {
  slug: 'forms',
  hooks: { afterChange: [revalidateFormsGlobal] },
  label: 'Forms',
  access: { read: () => true },
  admin: {
    group: 'Contact Page',
  },
  fields: [
    // ─── Common Fields ────────────────────────────────────────────────────────
    {
      name: 'commonFields',
      type: 'group',
      label: 'Common Fields',
      fields: [
        {
          name: 'labels',
          type: 'group',
          label: 'Labels',
          fields: [
            { name: 'firstName',  type: 'text', localized: true, label: 'First Name' },
            { name: 'lastName',   type: 'text', localized: true, label: 'Last Name'  },
            { name: 'email',      type: 'text', localized: true, label: 'Email'      },
            { name: 'phone',      type: 'text', localized: true, label: 'Phone'      },
          ],
        },
        {
          name: 'placeholders',
          type: 'group',
          label: 'Placeholders',
          fields: [
            { name: 'firstName',  type: 'text', localized: true, label: 'First Name' },
            { name: 'lastName',   type: 'text', localized: true, label: 'Last Name'  },
            { name: 'email',      type: 'text', localized: true, label: 'Email'      },
            { name: 'phone',      type: 'text', localized: true, label: 'Phone'      },
          ],
        },
      ],
    },

    // ─── Contact Form ─────────────────────────────────────────────────────────
    {
      name: 'contactForm',
      type: 'group',
      label: 'Contact Form Fields',
      fields: [
        {
          name: 'labels',
          type: 'group',
          label: 'Labels',
          fields: [
            { name: 'subject',      type: 'text', localized: true, label: 'Subject'      },
            { name: 'message',      type: 'text', localized: true, label: 'Message'      },
            { name: 'submitButton', type: 'text', localized: true, label: 'Submit Button' },
          ],
        },
        {
          name: 'placeholders',
          type: 'group',
          label: 'Placeholders',
          fields: [
            { name: 'subject', type: 'text', localized: true, label: 'Subject' },
            { name: 'message', type: 'text', localized: true, label: 'Message' },
          ],
        },
        {
          name: 'messages',
          type: 'group',
          label: 'Messages',
          fields: [
            { name: 'success',         type: 'text', localized: true, label: 'Success'                                     },
            { name: 'error',           type: 'text', localized: true, label: 'Error'                                       },
            { name: 'sending',         type: 'text', localized: true, label: 'Sending (button text)'                       },
            { name: 'thankYou',        type: 'text', localized: true, label: 'Thank You line — tokens: {name} {email}'     },
            { name: 'whatHappensNext', type: 'text', localized: true, label: 'What Happens Next heading'                   },
            { name: 'step1',           type: 'text', localized: true, label: 'Step 1'                                      },
            { name: 'step2',           type: 'text', localized: true, label: 'Step 2 — token: {email}'                     },
            { name: 'step3',           type: 'text', localized: true, label: 'Step 3 — token: {phone}'                     },
            { name: 'sendAnother',     type: 'text', localized: true, label: 'Send Another Message (button text)'          },
          ],
        },
        {
          name: 'errors',
          type: 'group',
          label: 'Validation Errors',
          fields: [
            { name: 'requiredFields', type: 'text', localized: true, label: 'Required fields missing'     },
            { name: 'emailInvalid',   type: 'text', localized: true, label: 'Invalid email'               },
            { name: 'nameTooLong',    type: 'text', localized: true, label: 'Name too long'               },
            { name: 'emailTooLong',   type: 'text', localized: true, label: 'Email too long'              },
            { name: 'phoneTooLong',   type: 'text', localized: true, label: 'Phone too long'              },
            { name: 'subjectTooLong', type: 'text', localized: true, label: 'Subject too long'            },
            { name: 'messageTooLong', type: 'text', localized: true, label: 'Message too long'            },
            { name: 'serverError',    type: 'text', localized: true, label: 'Server / send failure'       },
          ],
        },
      ],
    },

    // ─── Vacancy Form ─────────────────────────────────────────────────────────
    {
      name: 'vacancyForm',
      type: 'group',
      label: 'Vacancy Form Fields',
      fields: [
        {
          name: 'labels',
          type: 'group',
          label: 'Labels',
          fields: [
            { name: 'formTitle',    type: 'text', localized: true, label: 'Form Section Heading ("Apply for this Position")' },
            { name: 'applyButton',  type: 'text', localized: true, label: 'Apply Button in Hero ("Apply for This Role")' },
            { name: 'dateOfBirth',  type: 'text', localized: true, label: 'Date of Birth'                          },
            { name: 'cv',           type: 'text', localized: true, label: 'CV / Resume'                            },
            { name: 'coverLetter',  type: 'text', localized: true, label: 'Cover Letter'                           },
            { name: 'submitButton', type: 'text', localized: true, label: 'Submit Button'                          },
          ],
        },
        {
          name: 'placeholders',
          type: 'group',
          label: 'Placeholders',
          fields: [
            { name: 'coverLetter', type: 'text', localized: true, label: 'Cover Letter' },
          ],
        },
        {
          name: 'upload',
          type: 'group',
          label: 'Upload Area',
          fields: [
            { name: 'clickToUpload', type: 'text', localized: true, label: '"Click to upload" text'   },
            { name: 'dragAndDrop',   type: 'text', localized: true, label: '"or drag and drop" text'  },
            { name: 'hint',          type: 'text', localized: true, label: 'File type / size hint'    },
          ],
        },
        {
          name: 'messages',
          type: 'group',
          label: 'Messages',
          fields: [
            { name: 'successHeading',  type: 'text', localized: true, label: 'Success Heading'                                   },
            { name: 'successThankYou', type: 'text', localized: true, label: 'Thank You line — tokens: {name} {email}'           },
            { name: 'whatHappensNext', type: 'text', localized: true, label: 'What Happens Next heading'                         },
            { name: 'step1',           type: 'text', localized: true, label: 'Step 1'                                            },
            { name: 'step2',           type: 'text', localized: true, label: 'Step 2'                                            },
            { name: 'step3',           type: 'text', localized: true, label: 'Step 3 — token: {email}'                           },
            { name: 'submitting',      type: 'text', localized: true, label: 'Submitting (button text)'                          },
            { name: 'submitAnother',   type: 'text', localized: true, label: 'Submit Another Application (button text)'          },
            { name: 'error',           type: 'text', localized: true, label: 'Generic error fallback'                            },
          ],
        },
        {
          name: 'errors',
          type: 'group',
          label: 'Validation Errors',
          fields: [
            { name: 'requiredFields',    type: 'text', localized: true, label: 'Required fields missing'             },
            { name: 'emailInvalid',      type: 'text', localized: true, label: 'Invalid email'                       },
            { name: 'vacancyInvalid',    type: 'text', localized: true, label: 'Invalid vacancy ID'                  },
            { name: 'nameTooLong',       type: 'text', localized: true, label: 'Name too long'                       },
            { name: 'emailTooLong',      type: 'text', localized: true, label: 'Email too long'                      },
            { name: 'phoneTooLong',      type: 'text', localized: true, label: 'Phone too long'                      },
            { name: 'dobInvalid',        type: 'text', localized: true, label: 'Invalid date of birth'               },
            { name: 'coverTooLong',      type: 'text', localized: true, label: 'Cover letter too long'               },
            { name: 'cvRequired',        type: 'text', localized: true, label: 'CV file required'                    },
            { name: 'cvTypeInvalid',     type: 'text', localized: true, label: 'CV wrong file type'                  },
            { name: 'cvTooLarge',        type: 'text', localized: true, label: 'CV file too large'                   },
            { name: 'cvContentMismatch', type: 'text', localized: true, label: 'CV content / extension mismatch'     },
            { name: 'serverError',       type: 'text', localized: true, label: 'Server / submit failure'             },
          ],
        },
      ],
    },
  ],
}
