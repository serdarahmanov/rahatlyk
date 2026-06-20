import { getPayload } from 'payload'
import config from '../payload.config'
import { FORMS_CONTENT as F } from './lib/data/forms-content'
const CE = F.contactForm_errors
const VE = F.vacancyForm_errors

async function seedForms() {
  const payload = await getPayload({ config })

  console.log('Seeding Forms global…')

  for (const locale of ['en', 'tm', 'ru'] as const) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (payload.updateGlobal as any)({
      slug: 'forms',
      locale,
      data: {
        commonFields: {
          labels: {
            firstName: F.commonFields.labels.firstName[locale],
            lastName:  F.commonFields.labels.lastName[locale],
            email:     F.commonFields.labels.email[locale],
            phone:     F.commonFields.labels.phone[locale],
          },
          placeholders: {
            firstName: F.commonFields.placeholders.firstName[locale],
            lastName:  F.commonFields.placeholders.lastName[locale],
            email:     F.commonFields.placeholders.email[locale],
            phone:     F.commonFields.placeholders.phone[locale],
          },
        },
        contactForm: {
          labels: {
            subject:      F.contactForm.labels.subject[locale],
            message:      F.contactForm.labels.message[locale],
            submitButton: F.contactForm.labels.submitButton[locale],
          },
          placeholders: {
            subject: F.contactForm.placeholders.subject[locale],
            message: F.contactForm.placeholders.message[locale],
          },
          messages: {
            success:         F.contactForm.messages.success[locale],
            error:           F.contactForm.messages.error[locale],
            sending:         F.contactForm.messages.sending[locale],
            thankYou:        F.contactForm.messages.thankYou[locale],
            whatHappensNext: F.contactForm.messages.whatHappensNext[locale],
            step1:           F.contactForm.messages.step1[locale],
            step2:           F.contactForm.messages.step2[locale],
            step3:           F.contactForm.messages.step3[locale],
            sendAnother:     F.contactForm.messages.sendAnother[locale],
          },
          errors: {
            requiredFields: CE.requiredFields[locale],
            emailInvalid:   CE.emailInvalid[locale],
            nameTooLong:    CE.nameTooLong[locale],
            emailTooLong:   CE.emailTooLong[locale],
            phoneTooLong:   CE.phoneTooLong[locale],
            subjectTooLong: CE.subjectTooLong[locale],
            messageTooLong: CE.messageTooLong[locale],
            serverError:    CE.serverError[locale],
          },
        },
        vacancyForm: {
          labels: {
            formTitle:    F.vacancyForm.labels.formTitle[locale],
            applyButton:  F.vacancyForm.labels.applyButton[locale],
            dateOfBirth:  F.vacancyForm.labels.dateOfBirth[locale],
            cv:           F.vacancyForm.labels.cv[locale],
            coverLetter:  F.vacancyForm.labels.coverLetter[locale],
            submitButton: F.vacancyForm.labels.submitButton[locale],
          },
          placeholders: {
            coverLetter: F.vacancyForm.placeholders.coverLetter[locale],
          },
          upload: {
            clickToUpload: F.vacancyForm.upload.clickToUpload[locale],
            dragAndDrop:   F.vacancyForm.upload.dragAndDrop[locale],
            hint:          F.vacancyForm.upload.hint[locale],
          },
          messages: {
            successHeading:  F.vacancyForm.messages.successHeading[locale],
            successThankYou: F.vacancyForm.messages.successThankYou[locale],
            whatHappensNext: F.vacancyForm.messages.whatHappensNext[locale],
            step1:           F.vacancyForm.messages.step1[locale],
            step2:           F.vacancyForm.messages.step2[locale],
            step3:           F.vacancyForm.messages.step3[locale],
            submitting:      F.vacancyForm.messages.submitting[locale],
            submitAnother:   F.vacancyForm.messages.submitAnother[locale],
            error:           F.vacancyForm.messages.error[locale],
          },
          errors: {
            requiredFields:    VE.requiredFields[locale],
            emailInvalid:      VE.emailInvalid[locale],
            vacancyInvalid:    VE.vacancyInvalid[locale],
            nameTooLong:       VE.nameTooLong[locale],
            emailTooLong:      VE.emailTooLong[locale],
            phoneTooLong:      VE.phoneTooLong[locale],
            dobInvalid:        VE.dobInvalid[locale],
            coverTooLong:      VE.coverTooLong[locale],
            cvRequired:        VE.cvRequired[locale],
            cvTypeInvalid:     VE.cvTypeInvalid[locale],
            cvTooLarge:        VE.cvTooLarge[locale],
            cvContentMismatch: VE.cvContentMismatch[locale],
            serverError:       VE.serverError[locale],
          },
        },
      },
    })
    console.log(`  [global] forms updated for locale: ${locale}`)
  }

  console.log('Done.')
  process.exit(0)
}

seedForms().catch((err) => {
  console.error(err)
  process.exit(1)
})
