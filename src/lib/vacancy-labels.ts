import { translations, type Locale } from '@/lib/i18n/translations'
import type { VacancyLabelsData } from '@/types/payload'

type VacancyPerksRaw = {
  title?: string | null
  growthTitle?: string | null
  growthDesc?: string | null
  healthTitle?: string | null
  healthDesc?: string | null
  cultureTitle?: string | null
  cultureDesc?: string | null
  impactTitle?: string | null
  impactDesc?: string | null
} | null | undefined

type VacancyLabelsRaw = {
  pageTitle?: string | null
  filterAllLabel?: string | null
  openPosition?: string | null
  openPositions?: string | null
  noOpeningsMessage?: string | null
  paginationItemLabel?: string | null
  perks?: VacancyPerksRaw
  postedLabel?: string | null
  tabOverview?: string | null
  tabResponsibilities?: string | null
  tabRequirements?: string | null
  benefitsPerks?: string | null
  required?: string | null
  niceToHave?: string | null
  otherOpenings?: string | null
} | null | undefined

export function getFallbackVacancyLabels(locale: Locale): VacancyLabelsData {
  const t = translations[locale]
  return {
    pageTitle:           t.vacancies.title,
    filterAllLabel:      t.vacancies.filterAll,
    openPosition:        t.vacancies.openPosition,
    openPositions:       t.vacancies.openPositions,
    noOpeningsMessage:   t.vacancies.noCurrent,
    paginationItemLabel: locale === 'ru' ? 'вакансий' : locale === 'tm' ? 'iş orunlary' : 'positions',
    perks: {
      title:        t.vacancies.perks.title,
      growthTitle:  t.vacancies.perks.growth,
      growthDesc:   t.vacancies.perks.growthDesc,
      healthTitle:  t.vacancies.perks.health,
      healthDesc:   t.vacancies.perks.healthDesc,
      cultureTitle: t.vacancies.perks.culture,
      cultureDesc:  t.vacancies.perks.cultureDesc,
      impactTitle:  t.vacancies.perks.impact,
      impactDesc:   t.vacancies.perks.impactDesc,
    },
    postedLabel:         t.vacancies.posted,
    tabOverview:         t.vacancies.tabOverview,
    tabResponsibilities: t.vacancies.tabResponsibilities,
    tabRequirements:     t.vacancies.tabRequirements,
    benefitsPerks:       t.vacancies.benefitsPerks,
    required:            t.vacancies.required,
    niceToHave:          t.vacancies.niceToHave,
    otherOpenings:       t.vacancies.otherOpenings,
  }
}

export function resolveVacancyLabels(locale: Locale, raw: VacancyLabelsRaw): VacancyLabelsData {
  const fallback = getFallbackVacancyLabels(locale)
  const rp = raw?.perks
  const fp = fallback.perks
  return {
    pageTitle:           raw?.pageTitle           || fallback.pageTitle,
    filterAllLabel:      raw?.filterAllLabel      || fallback.filterAllLabel,
    openPosition:        raw?.openPosition        || fallback.openPosition,
    openPositions:       raw?.openPositions       || fallback.openPositions,
    noOpeningsMessage:   raw?.noOpeningsMessage   || fallback.noOpeningsMessage,
    paginationItemLabel: raw?.paginationItemLabel || fallback.paginationItemLabel,
    perks: {
      title:        rp?.title        || fp.title,
      growthTitle:  rp?.growthTitle  || fp.growthTitle,
      growthDesc:   rp?.growthDesc   || fp.growthDesc,
      healthTitle:  rp?.healthTitle  || fp.healthTitle,
      healthDesc:   rp?.healthDesc   || fp.healthDesc,
      cultureTitle: rp?.cultureTitle || fp.cultureTitle,
      cultureDesc:  rp?.cultureDesc  || fp.cultureDesc,
      impactTitle:  rp?.impactTitle  || fp.impactTitle,
      impactDesc:   rp?.impactDesc   || fp.impactDesc,
    },
    postedLabel:         raw?.postedLabel         || fallback.postedLabel,
    tabOverview:         raw?.tabOverview         || fallback.tabOverview,
    tabResponsibilities: raw?.tabResponsibilities || fallback.tabResponsibilities,
    tabRequirements:     raw?.tabRequirements     || fallback.tabRequirements,
    benefitsPerks:       raw?.benefitsPerks       || fallback.benefitsPerks,
    required:            raw?.required            || fallback.required,
    niceToHave:          raw?.niceToHave          || fallback.niceToHave,
    otherOpenings:       raw?.otherOpenings       || fallback.otherOpenings,
  }
}
