import { translations, type Locale } from '@/lib/i18n/translations'
import type { ArticleLabelsData } from '@/types/payload'

type ArticleLabelsRaw = Partial<Record<keyof ArticleLabelsData, string | null>> | null | undefined

export function getFallbackArticleLabels(locale: Locale): ArticleLabelsData {
  const t = translations[locale]
  return {
    homeSectionTag:      t.home.news.tag,
    pageTitle:           t.news.title,
    filterAllLabel:      t.news.filterAll,
    featuredLabel:       t.news.featured,
    readArticleLabel:    t.news.readArticle,
    backToNewsLabel:     t.home.news.cta,
    moreArticlesHeading: t.news.moreArticles,
    noArticlesMessage:   t.vacancies.noCurrent,
  }
}

export function resolveArticleLabels(locale: Locale, raw: ArticleLabelsRaw): ArticleLabelsData {
  const fallback = getFallbackArticleLabels(locale)
  return {
    homeSectionTag:      raw?.homeSectionTag      || fallback.homeSectionTag,
    pageTitle:           raw?.pageTitle           || fallback.pageTitle,
    filterAllLabel:      raw?.filterAllLabel      || fallback.filterAllLabel,
    featuredLabel:       raw?.featuredLabel       || fallback.featuredLabel,
    readArticleLabel:    raw?.readArticleLabel    || fallback.readArticleLabel,
    backToNewsLabel:     raw?.backToNewsLabel     || fallback.backToNewsLabel,
    moreArticlesHeading: raw?.moreArticlesHeading || fallback.moreArticlesHeading,
    noArticlesMessage:   raw?.noArticlesMessage   || fallback.noArticlesMessage,
  }
}
