import { getPayload } from 'payload'
import config from '../payload.config'
import { ABOUT_CONTENT } from './lib/data/about-content'

async function seedAbout() {
  const payload = await getPayload({ config })

  console.log('Seeding About Page...')

  for (const locale of ['en', 'tm', 'ru'] as const) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (payload.updateGlobal as any)({
      slug: 'about-page',
      locale,
      data: {
        hero: {
          title:       ABOUT_CONTENT.hero.title[locale],
          description: ABOUT_CONTENT.hero.description[locale],
        },
        formLabels: {
          firstName: ABOUT_CONTENT.formLabels.firstName[locale],
          lastName:  ABOUT_CONTENT.formLabels.lastName[locale],
          email:     ABOUT_CONTENT.formLabels.email[locale],
          phone:     ABOUT_CONTENT.formLabels.phone[locale],
          subject:   ABOUT_CONTENT.formLabels.subject[locale],
          message:      ABOUT_CONTENT.formLabels.message[locale],
          submitButton: ABOUT_CONTENT.formLabels.submitButton[locale],
        },
        formMessages: {
          success:         ABOUT_CONTENT.formMessages.success[locale],
          error:           ABOUT_CONTENT.formMessages.error[locale],
          sending:         ABOUT_CONTENT.formMessages.sending[locale],
          thankYou:        ABOUT_CONTENT.formMessages.thankYou[locale],
          whatHappensNext: ABOUT_CONTENT.formMessages.whatHappensNext[locale],
          step1:           ABOUT_CONTENT.formMessages.step1[locale],
          step2:           ABOUT_CONTENT.formMessages.step2[locale],
          step3:           ABOUT_CONTENT.formMessages.step3[locale],
          sendAnother:     ABOUT_CONTENT.formMessages.sendAnother[locale],
        },
        formPlaceholders: {
          firstName: ABOUT_CONTENT.formPlaceholders.firstName[locale],
          lastName:  ABOUT_CONTENT.formPlaceholders.lastName[locale],
          email:     ABOUT_CONTENT.formPlaceholders.email[locale],
          phone:     ABOUT_CONTENT.formPlaceholders.phone[locale],
          subject:   ABOUT_CONTENT.formPlaceholders.subject[locale],
          message:   ABOUT_CONTENT.formPlaceholders.message[locale],
        },
      },
    })
    console.log(`  [global] about-page updated for locale: ${locale}`)
  }

  console.log('Done.')
  process.exit(0)
}

seedAbout().catch((err) => {
  console.error(err)
  process.exit(1)
})
