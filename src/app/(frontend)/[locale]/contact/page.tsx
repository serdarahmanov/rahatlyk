import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FORMS_CONTENT } from '@/lib/data/forms-content'
import { getValidLocale, defaultLocale } from '@/lib/i18n/locale'
import { buildLanguageAlternates } from '@/lib/i18n/metadata'
import type { Locale } from '@/lib/i18n/translations'
import { getCachedContactData } from '@/lib/payload/cachedQueries'
import ContactPageClient from './ContactPageClient'

const LOCALE_FALLBACK = 'en' as const

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

function buildFallbackLabels(locale: Locale) {
  const common = FORMS_CONTENT.commonFields.labels
  const contact = FORMS_CONTENT.contactForm.labels
  return {
    firstName:    common.firstName[locale],
    lastName:     common.lastName[locale],
    email:        common.email[locale],
    phone:        common.phone[locale],
    subject:      contact.subject[locale],
    message:      contact.message[locale],
    submitButton: contact.submitButton[locale],
  }
}

function buildFallbackPlaceholders(locale: Locale) {
  const common = FORMS_CONTENT.commonFields.placeholders
  const contact = FORMS_CONTENT.contactForm.placeholders
  return {
    firstName: common.firstName[locale],
    lastName:  common.lastName[locale],
    email:     common.email[locale],
    phone:     common.phone[locale],
    subject:   contact.subject[locale],
    message:   contact.message[locale],
  }
}

function buildFallbackMessages(locale: Locale) {
  const messages = FORMS_CONTENT.contactForm.messages
  return {
    success:         messages.success[locale],
    error:           messages.error[locale],
    sending:         messages.sending[locale],
    thankYou:        messages.thankYou[locale],
    whatHappensNext: messages.whatHappensNext[locale],
    step1:           messages.step1[locale],
    step2:           messages.step2[locale],
    step3:           messages.step3[locale],
    sendAnother:     messages.sendAnother[locale],
    errors:          buildFallbackErrors(locale),
  }
}

const FALLBACK = {
  hero: {
    title: "We'd Love to Hear From You",
    description:
      "We are as passionate about your experience as we are about the purity of each and every RAHATLYK bottle. We rely on our connection with you - whatever you need, we'll be only too happy to help.",
  },
  formLabels:       buildFallbackLabels(LOCALE_FALLBACK),
  formPlaceholders: buildFallbackPlaceholders(LOCALE_FALLBACK),
  formMessages:     buildFallbackMessages(LOCALE_FALLBACK),
}

type Props = {
  params: Promise<{ locale: string }>
}

const TITLES: Record<string, string> = {
  tm: 'Habarlaşmak',
  ru: 'Контакты',
  en: 'Contact',
}

const DESCRIPTIONS: Record<string, string> = {
  tm: 'RAHATLYK bilen habarlaşyň. Habar iberiň, toparymyz gysga wagtda jogap berer.',
  ru: 'Свяжитесь с RAHATLYK. Отправьте сообщение, и наша команда ответит как можно скорее.',
  en: 'Get in touch with RAHATLYK. Send us a message and our team will respond as soon as possible.',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = getValidLocale((await params).locale) ?? defaultLocale
  return {
    title: TITLES[locale] ?? TITLES[defaultLocale],
    description: DESCRIPTIONS[locale] ?? DESCRIPTIONS[defaultLocale],
    alternates: {
      canonical: `/${locale}/contact`,
      languages: buildLanguageAlternates('/contact'),
    },
  }
}

export default async function ContactPage({ params }: Props) {
  const locale = getValidLocale((await params).locale)
  if (!locale) notFound()

  const fallbackLabels = buildFallbackLabels(locale)
  const fallbackPlaceholders = buildFallbackPlaceholders(locale)
  const fallbackMessages = buildFallbackMessages(locale)
  const fallbackErrors = buildFallbackErrors(locale)

  let hero        = FALLBACK.hero
  let formLabels  = fallbackLabels
  let formPlaceholders = fallbackPlaceholders
  let formMessages = fallbackMessages

  try {
    const { page: pageRaw, forms: formsRaw } = await getCachedContactData(locale)
    const data = pageRaw
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const forms: any = formsRaw ?? {}
    const commonLabels = forms.commonFields?.labels ?? {}
    const commonPlaceholders = forms.commonFields?.placeholders ?? {}
    const contactLabels = forms.contactForm?.labels ?? {}
    const contactPlaceholders = forms.contactForm?.placeholders ?? {}
    const contactMessages = forms.contactForm?.messages ?? {}
    const fe: Record<string, string> = forms.contactForm?.errors ?? {}

    hero = {
      title:       data?.hero?.title       || FALLBACK.hero.title,
      description: data?.hero?.description || FALLBACK.hero.description,
    }
    formLabels = {
      firstName:    commonLabels.firstName     || fallbackLabels.firstName,
      lastName:     commonLabels.lastName      || fallbackLabels.lastName,
      email:        commonLabels.email         || fallbackLabels.email,
      phone:        commonLabels.phone         || fallbackLabels.phone,
      subject:      contactLabels.subject      || fallbackLabels.subject,
      message:      contactLabels.message      || fallbackLabels.message,
      submitButton: contactLabels.submitButton || fallbackLabels.submitButton,
    }
    formPlaceholders = {
      firstName: commonPlaceholders.firstName || fallbackPlaceholders.firstName,
      lastName:  commonPlaceholders.lastName  || fallbackPlaceholders.lastName,
      email:     commonPlaceholders.email     || fallbackPlaceholders.email,
      phone:     commonPlaceholders.phone     || fallbackPlaceholders.phone,
      subject:   contactPlaceholders.subject  || fallbackPlaceholders.subject,
      message:   contactPlaceholders.message  || fallbackPlaceholders.message,
    }
    formMessages = {
      success:         contactMessages.success         || fallbackMessages.success,
      error:           contactMessages.error           || fallbackMessages.error,
      sending:         contactMessages.sending         || fallbackMessages.sending,
      thankYou:        contactMessages.thankYou        || fallbackMessages.thankYou,
      whatHappensNext: contactMessages.whatHappensNext || fallbackMessages.whatHappensNext,
      step1:           contactMessages.step1           || fallbackMessages.step1,
      step2:           contactMessages.step2           || fallbackMessages.step2,
      step3:           contactMessages.step3           || fallbackMessages.step3,
      sendAnother:     contactMessages.sendAnother     || fallbackMessages.sendAnother,
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
