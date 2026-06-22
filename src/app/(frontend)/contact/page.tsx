import { cookies } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { FORMS_CONTENT } from '@/lib/data/forms-content'
import ContactPageClient from './ContactPageClient'

const LOCALE_FALLBACK = 'en' as const
type Locale = 'en' | 'tm' | 'ru'

function buildFallbackErrors(locale: Locale) {
  const E = FORMS_CONTENT.contactForm_errors
  return {
    requiredFields: E.requiredFields[locale],
    emailInvalid:   E.emailInvalid[locale],
    nameTooLong:    E.nameTooLong[locale],
    emailTooLong:   E.emailTooLong[locale],
    phoneTooLong:   E.phoneTooLong[locale],
    subjectTooLong: E.subjectTooLong[locale],
    messageTooLong: E.messageTooLong[locale],
    serverError:    E.serverError[locale],
  }
}

const FALLBACK = {
  formMessages: {
    success:         "Your message has been sent! We'll be in touch soon.",
    error:           'Something went wrong. Please try again.',
    sending:         'Sending…',
    thankYou:        "Thanks {name} — we'll be in touch at {email}.",
    whatHappensNext: 'What happens next',
    step1:           'Our team reviews your message within 1 business day.',
    step2:           "We'll reply directly to {email}.",
    step3:           'For urgent enquiries call {phone}.',
    sendAnother:     'Send Another Message',
    errors:          buildFallbackErrors(LOCALE_FALLBACK),
  },
  hero: {
    title: "We'd Love to Hear From You",
    description:
      "We are as passionate about your experience as we are about the purity of each and every RAHATLYK bottle. We rely on our connection with you — whatever you need, we'll be only too happy to help.",
  },
  formLabels: {
    firstName:    'First name',
    lastName:     'Last name',
    email:        'Email',
    phone:        'Phone',
    subject:      'Subject',
    message:      'Message',
    submitButton: 'Send',
  },
  formPlaceholders: {
    firstName: 'John',
    lastName:  'Smith',
    email:     'you@example.com',
    phone:     '+993 ...',
    subject:   'What is this about?',
    message:   'Your message…',
  },
}

export default async function ContactPage() {
  const locale = ((await cookies()).get('RAHATLYK-locale')?.value ?? 'en') as Locale
  const payload = await getPayloadClient()
  const fallbackErrors = buildFallbackErrors(locale)

  let hero        = FALLBACK.hero
  let formLabels  = FALLBACK.formLabels
  let formPlaceholders = FALLBACK.formPlaceholders
  let formMessages = { ...FALLBACK.formMessages, errors: fallbackErrors }

  try {
    const [pageRaw, formsRaw] = await Promise.all([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (payload.findGlobal as any)({ slug: 'about-page', locale, depth: 0 }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (payload.findGlobal as any)({ slug: 'forms', locale, depth: 0 }),
    ])
    const data = pageRaw
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fe: Record<string, string> = (formsRaw as any)?.contactForm?.errors ?? {}

    hero = {
      title:       data?.hero?.title       || FALLBACK.hero.title,
      description: data?.hero?.description || FALLBACK.hero.description,
    }
    formLabels = {
      firstName:    data?.formLabels?.firstName    || FALLBACK.formLabels.firstName,
      lastName:     data?.formLabels?.lastName     || FALLBACK.formLabels.lastName,
      email:        data?.formLabels?.email        || FALLBACK.formLabels.email,
      phone:        data?.formLabels?.phone        || FALLBACK.formLabels.phone,
      subject:      data?.formLabels?.subject      || FALLBACK.formLabels.subject,
      message:      data?.formLabels?.message      || FALLBACK.formLabels.message,
      submitButton: data?.formLabels?.submitButton || FALLBACK.formLabels.submitButton,
    }
    formPlaceholders = {
      firstName: data?.formPlaceholders?.firstName || FALLBACK.formPlaceholders.firstName,
      lastName:  data?.formPlaceholders?.lastName  || FALLBACK.formPlaceholders.lastName,
      email:     data?.formPlaceholders?.email     || FALLBACK.formPlaceholders.email,
      phone:     data?.formPlaceholders?.phone     || FALLBACK.formPlaceholders.phone,
      subject:   data?.formPlaceholders?.subject   || FALLBACK.formPlaceholders.subject,
      message:   data?.formPlaceholders?.message   || FALLBACK.formPlaceholders.message,
    }
    formMessages = {
      success:         data?.formMessages?.success         || FALLBACK.formMessages.success,
      error:           data?.formMessages?.error           || FALLBACK.formMessages.error,
      sending:         data?.formMessages?.sending         || FALLBACK.formMessages.sending,
      thankYou:        data?.formMessages?.thankYou        || FALLBACK.formMessages.thankYou,
      whatHappensNext: data?.formMessages?.whatHappensNext || FALLBACK.formMessages.whatHappensNext,
      step1:           data?.formMessages?.step1           || FALLBACK.formMessages.step1,
      step2:           data?.formMessages?.step2           || FALLBACK.formMessages.step2,
      step3:           data?.formMessages?.step3           || FALLBACK.formMessages.step3,
      sendAnother:     data?.formMessages?.sendAnother     || FALLBACK.formMessages.sendAnother,
      errors: {
        requiredFields: fe.requiredFields || fallbackErrors.requiredFields,
        emailInvalid:   fe.emailInvalid   || fallbackErrors.emailInvalid,
        nameTooLong:    fe.nameTooLong    || fallbackErrors.nameTooLong,
        emailTooLong:   fe.emailTooLong   || fallbackErrors.emailTooLong,
        phoneTooLong:   fe.phoneTooLong   || fallbackErrors.phoneTooLong,
        subjectTooLong: fe.subjectTooLong || fallbackErrors.subjectTooLong,
        messageTooLong: fe.messageTooLong || fallbackErrors.messageTooLong,
        serverError:    fe.serverError    || fallbackErrors.serverError,
      },
    }
  } catch {
    // props stay as fallback values
  }

  return <ContactPageClient hero={hero} formLabels={formLabels} formPlaceholders={formPlaceholders} formMessages={formMessages} />
}
