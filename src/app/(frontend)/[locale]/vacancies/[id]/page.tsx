import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import VacancyDetailClient from './VacancyDetailClient'
import { getValidLocale, supportedLocales, defaultLocale } from '@/lib/i18n/locale'
import { buildCanonicalPath, buildLanguageAlternates } from '@/lib/i18n/metadata'
import { normalizeVacancy } from '@/lib/payload-normalize'
import { FORMS_CONTENT } from '@/lib/data/forms-content'
import { resolveVacancyLabels } from '@/lib/vacancy-labels'
import type { VacancyFormStrings } from './VacancyDetailClient'
import type { Locale } from '@/lib/i18n/translations'
import {
  getCachedVacancyDetail,
  getCachedVacancyStaticIDs,
} from '@/lib/payload/cachedQueries'

export async function generateStaticParams() {
  const params = await Promise.all(
    supportedLocales.map(async (locale) => {
      const ids = await getCachedVacancyStaticIDs(locale)
      return ids.map((id) => ({ locale, id }))
    }),
  )
  return params.flat()
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { id, locale: localeParam } = await params
  const locale = getValidLocale(localeParam) ?? defaultLocale
  const vacancyID = Number(id)
  if (!Number.isFinite(vacancyID)) return {}

  try {
    const cached = await getCachedVacancyDetail(locale, vacancyID)
    const vacancy = cached.vacancy
    if (!vacancy) return {}

    const title = vacancy.title ?? ''
    const dept = typeof vacancy.department === 'object' ? (vacancy.department?.label ?? '') : ''
    const description = vacancy.overview
      ?? (dept ? `${title} — ${dept}.` : title)

    return {
      title,
      description,
      alternates: {
        canonical: buildCanonicalPath(locale, `/vacancies/${id}`),
        languages: buildLanguageAlternates(`/vacancies/${id}`),
      },
      robots: {
        index: false,
        follow: true,
        googleBot: { index: false, follow: true },
      },
      openGraph: { title, description },
    }
  } catch {
    return {}
  }
}

function buildFallbackVacancyErrors(locale: Locale) {
  const E = FORMS_CONTENT.vacancyForm_errors
  return {
    requiredFields:    E.requiredFields[locale],
    emailInvalid:      E.emailInvalid[locale],
    vacancyInvalid:    E.vacancyInvalid[locale],
    nameTooLong:       E.nameTooLong[locale],
    emailTooLong:      E.emailTooLong[locale],
    phoneTooLong:      E.phoneTooLong[locale],
    dobInvalid:        E.dobInvalid[locale],
    coverTooLong:      E.coverTooLong[locale],
    cvRequired:        E.cvRequired[locale],
    cvTypeInvalid:     E.cvTypeInvalid[locale],
    cvTooLarge:        E.cvTooLarge[locale],
    cvContentMismatch: E.cvContentMismatch[locale],
    serverError:       E.serverError[locale],
  }
}

const FORMS_FALLBACK: VacancyFormStrings = {
  commonFields: {
    labels:       { firstName: 'First name', lastName: 'Last name', email: 'Email', phone: 'Phone' },
    placeholders: { firstName: 'John', lastName: 'Smith', email: 'you@example.com', phone: '+993 ...' },
  },
  vacancyForm: {
    labels: {
      formTitle:    'Apply for this Position',
      applyButton:  'Apply for This Role',
      dateOfBirth:  'Date of birth',
      cv:           'CV / Resume',
      coverLetter:  'Cover letter',
      submitButton: 'Submit Application',
    },
    placeholders: { coverLetter: "Tell us why you're a great fit…" },
    upload: {
      clickToUpload: 'Click to upload',
      dragAndDrop:   'or drag and drop',
      hint:          'PDF, DOC, DOCX — up to 2 MB',
    },
    messages: {
      successHeading:  'Application Submitted',
      successThankYou: 'Thanks {name} — a confirmation has been sent to {email}.',
      whatHappensNext: 'What happens next',
      step1:           'Our HR team reviews your CV within 3–5 business days.',
      step2:           "If shortlisted, we'll reach out to schedule an interview.",
      step3:           "Check {email} — that's where we'll contact you.",
      submitting:      'Submitting…',
      submitAnother:   'Submit Another Application',
      error:           'Something went wrong. Please try again later.',
    },
    errors: buildFallbackVacancyErrors('en'),
  },
}

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export default async function VacancyDetailPage({ params }: Props) {
  const { id, locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  if (!locale) notFound()

  const vacancyID = Number(id)

  if (!Number.isFinite(vacancyID)) notFound()

  const cached = await getCachedVacancyDetail(locale, vacancyID)
  const vacancy = cached.vacancy
  if (!vacancy) notFound()

  const others = cached.others
  const labels = resolveVacancyLabels(locale, cached.vacancyLabels)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const f: any = cached.forms
  const fe = f?.vacancyForm?.errors ?? {}
  const fallbackErrors = buildFallbackVacancyErrors(locale)

  const forms: VacancyFormStrings = {
    commonFields: {
      labels: {
        firstName: f?.commonFields?.labels?.firstName || FORMS_FALLBACK.commonFields.labels.firstName,
        lastName:  f?.commonFields?.labels?.lastName  || FORMS_FALLBACK.commonFields.labels.lastName,
        email:     f?.commonFields?.labels?.email     || FORMS_FALLBACK.commonFields.labels.email,
        phone:     f?.commonFields?.labels?.phone     || FORMS_FALLBACK.commonFields.labels.phone,
      },
      placeholders: {
        firstName: f?.commonFields?.placeholders?.firstName || FORMS_FALLBACK.commonFields.placeholders.firstName,
        lastName:  f?.commonFields?.placeholders?.lastName  || FORMS_FALLBACK.commonFields.placeholders.lastName,
        email:     f?.commonFields?.placeholders?.email     || FORMS_FALLBACK.commonFields.placeholders.email,
        phone:     f?.commonFields?.placeholders?.phone     || FORMS_FALLBACK.commonFields.placeholders.phone,
      },
    },
    vacancyForm: {
      labels: {
        formTitle:    f?.vacancyForm?.labels?.formTitle    || FORMS_FALLBACK.vacancyForm.labels.formTitle,
        applyButton:  f?.vacancyForm?.labels?.applyButton  || FORMS_FALLBACK.vacancyForm.labels.applyButton,
        dateOfBirth:  f?.vacancyForm?.labels?.dateOfBirth  || FORMS_FALLBACK.vacancyForm.labels.dateOfBirth,
        cv:           f?.vacancyForm?.labels?.cv           || FORMS_FALLBACK.vacancyForm.labels.cv,
        coverLetter:  f?.vacancyForm?.labels?.coverLetter  || FORMS_FALLBACK.vacancyForm.labels.coverLetter,
        submitButton: f?.vacancyForm?.labels?.submitButton || FORMS_FALLBACK.vacancyForm.labels.submitButton,
      },
      placeholders: {
        coverLetter: f?.vacancyForm?.placeholders?.coverLetter || FORMS_FALLBACK.vacancyForm.placeholders.coverLetter,
      },
      upload: {
        clickToUpload: f?.vacancyForm?.upload?.clickToUpload || FORMS_FALLBACK.vacancyForm.upload.clickToUpload,
        dragAndDrop:   f?.vacancyForm?.upload?.dragAndDrop   || FORMS_FALLBACK.vacancyForm.upload.dragAndDrop,
        hint:          f?.vacancyForm?.upload?.hint          || FORMS_FALLBACK.vacancyForm.upload.hint,
      },
      messages: {
        successHeading:  f?.vacancyForm?.messages?.successHeading  || FORMS_FALLBACK.vacancyForm.messages.successHeading,
        successThankYou: f?.vacancyForm?.messages?.successThankYou || FORMS_FALLBACK.vacancyForm.messages.successThankYou,
        whatHappensNext: f?.vacancyForm?.messages?.whatHappensNext || FORMS_FALLBACK.vacancyForm.messages.whatHappensNext,
        step1:           f?.vacancyForm?.messages?.step1           || FORMS_FALLBACK.vacancyForm.messages.step1,
        step2:           f?.vacancyForm?.messages?.step2           || FORMS_FALLBACK.vacancyForm.messages.step2,
        step3:           f?.vacancyForm?.messages?.step3           || FORMS_FALLBACK.vacancyForm.messages.step3,
        submitting:      f?.vacancyForm?.messages?.submitting      || FORMS_FALLBACK.vacancyForm.messages.submitting,
        submitAnother:   f?.vacancyForm?.messages?.submitAnother   || FORMS_FALLBACK.vacancyForm.messages.submitAnother,
        error:           f?.vacancyForm?.messages?.error           || FORMS_FALLBACK.vacancyForm.messages.error,
      },
      errors: {
        requiredFields:    fe.requiredFields    || fallbackErrors.requiredFields,
        emailInvalid:      fe.emailInvalid      || fallbackErrors.emailInvalid,
        vacancyInvalid:    fe.vacancyInvalid    || fallbackErrors.vacancyInvalid,
        nameTooLong:       fe.nameTooLong       || fallbackErrors.nameTooLong,
        emailTooLong:      fe.emailTooLong      || fallbackErrors.emailTooLong,
        phoneTooLong:      fe.phoneTooLong      || fallbackErrors.phoneTooLong,
        dobInvalid:        fe.dobInvalid        || fallbackErrors.dobInvalid,
        coverTooLong:      fe.coverTooLong      || fallbackErrors.coverTooLong,
        cvRequired:        fe.cvRequired        || fallbackErrors.cvRequired,
        cvTypeInvalid:     fe.cvTypeInvalid     || fallbackErrors.cvTypeInvalid,
        cvTooLarge:        fe.cvTooLarge        || fallbackErrors.cvTooLarge,
        cvContentMismatch: fe.cvContentMismatch || fallbackErrors.cvContentMismatch,
        serverError:       fe.serverError       || fallbackErrors.serverError,
      },
    },
  }

  return (
    <VacancyDetailClient
      vacancy={normalizeVacancy(vacancy)}
      others={others.map(normalizeVacancy)}
      forms={forms}
      labels={labels}
    />
  )
}
