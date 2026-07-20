import { createRequire } from 'node:module'
import { getPayload } from 'payload'
import { emailI18n, type EmailLocale } from './lib/email/i18n'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')

function buildEmailTemplateDefaults(locale: EmailLocale) {
  const s = emailI18n[locale]

  return {
    contactEmail: {
      confirmation: {
        subject:         s.contactConfirm.subject('{subject}'),
        preheader:       s.contactConfirm.preheader,
        title:           s.contactConfirm.title,
        subtitle:        s.contactConfirm.subtitle,
        greeting:        s.contactConfirm.greeting('{firstName}', '{lastName}'),
        intro:           s.contactConfirm.intro,
        summaryHeading:  s.contactConfirm.summaryHeading,
        subjectLabel:    s.contactConfirm.subjectLabel,
        messageLabel:    s.contactConfirm.messageLabel,
        whatNextHeading: s.contactConfirm.whatNextHeading,
        step1:           s.contactConfirm.step1,
        step2:           s.contactConfirm.step2('{email}'),
        step3:           s.contactConfirm.step3,
        ctaBtn:          s.contactConfirm.ctaBtn,
      },
      notification: {
        subject:        s.contactNotify.subject('{fullName}', '{subject}'),
        title:          s.contactNotify.title,
        subtitle:       s.contactNotify.subtitle('{fullName}', '{email}'),
        firstNameLabel: s.contactNotify.firstNameLabel,
        lastNameLabel:  s.contactNotify.lastNameLabel,
        emailLabel:     s.contactNotify.emailLabel,
        phoneLabel:     s.contactNotify.phoneLabel,
        subjectLabel:   s.contactNotify.subjectLabel,
        messageHeading: s.contactNotify.messageHeading,
        replyBtn:       s.contactNotify.replyBtn('{firstName}'),
      },
    },
    vacancyEmail: {
      confirmation: {
        subject:                s.vacancyConfirm.subject('{vacancyTitle}'),
        preheader:              s.vacancyConfirm.preheader('{vacancyTitle}'),
        title:                  s.vacancyConfirm.title,
        subtitle:               s.vacancyConfirm.subtitle('{vacancyTitle}'),
        greeting:               s.vacancyConfirm.greeting('{firstName}', '{lastName}'),
        intro:                  s.vacancyConfirm.intro('{vacancyTitle}'),
        appliedPositionHeading: s.vacancyConfirm.appliedPositionHeading,
        positionLabel:          s.vacancyConfirm.positionLabel,
        companyLabel:           s.vacancyConfirm.companyLabel,
        locationLabel:          s.vacancyConfirm.locationLabel,
        companyValue:           s.vacancyConfirm.companyValue,
        locationValue:          s.vacancyConfirm.locationValue,
        whatNextHeading:        s.vacancyConfirm.whatNextHeading,
        step1:                  s.vacancyConfirm.step1,
        step2:                  s.vacancyConfirm.step2,
        step3:                  s.vacancyConfirm.step3,
        ctaBtn:                 s.vacancyConfirm.ctaBtn,
      },
      notification: {
        subject:        s.vacancyNotify.subject('{vacancyTitle}', '{fullName}'),
        title:          s.vacancyNotify.title,
        subtitle:       s.vacancyNotify.subtitle('{vacancyTitle}'),
        firstNameLabel: s.vacancyNotify.firstNameLabel,
        lastNameLabel:  s.vacancyNotify.lastNameLabel,
        dobLabel:       s.vacancyNotify.dobLabel,
        emailLabel:     s.vacancyNotify.emailLabel,
        phoneLabel:     s.vacancyNotify.phoneLabel,
        positionLabel:  s.vacancyNotify.positionLabel,
        cvLabel:        s.vacancyNotify.cvLabel,
        cvNote:         s.vacancyNotify.cvNote,
        coverHeading:   s.vacancyNotify.coverHeading,
        replyBtn:       s.vacancyNotify.replyBtn,
      },
    },
  }
}

async function seedEmailTemplates() {
  loadEnvConfig(process.cwd())
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  console.log('Seeding Email Templates...')

  for (const locale of ['en', 'ru', 'tm'] as const) {
    await payload.updateGlobal({
      slug: 'email-templates',
      locale,
      data: buildEmailTemplateDefaults(locale),
    })
    console.log(`  [global] email-templates updated for locale: ${locale}`)
  }

  console.log('Done.')
  process.exit(0)
}

seedEmailTemplates().catch((error) => {
  console.error(error)
  process.exit(1)
})
