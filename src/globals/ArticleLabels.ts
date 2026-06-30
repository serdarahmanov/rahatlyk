import type { GlobalConfig } from 'payload'
import { revalidateArticleLabelsGlobal } from '@/lib/revalidation/payloadHooks'

export const ArticleLabels: GlobalConfig = {
  slug: 'article-labels',
  hooks: { afterChange: [revalidateArticleLabelsGlobal] },
  label: 'Article Labels',
  access: { read: () => true },
  admin: {
    group: 'Articles',
    description: 'Localized section names and button labels for news listing, detail, and home article sections.',
  },
  fields: [
    { name: 'homeSectionTag', type: 'text', localized: true, label: 'Home news section tag' },
    { name: 'pageTitle', type: 'text', localized: true, label: 'News page title' },
    { name: 'filterAllLabel', type: 'text', localized: true, label: 'All filter label' },
    { name: 'featuredLabel', type: 'text', localized: true, label: 'Featured badge label' },
    { name: 'readArticleLabel', type: 'text', localized: true, label: 'Read article button label' },
    { name: 'backToNewsLabel', type: 'text', localized: true, label: 'Back to news button label' },
    { name: 'moreArticlesHeading', type: 'text', localized: true, label: 'More articles section heading' },
    { name: 'noArticlesMessage', type: 'text', localized: true, label: 'Empty state message' },
  ],
}
