import type { GlobalConfig } from 'payload'
import { revalidateVacancyLabelsGlobal } from '@/lib/revalidation/payloadHooks'

export const VacancyLabels: GlobalConfig = {
  slug: 'vacancy-labels',
  hooks: { afterChange: [revalidateVacancyLabelsGlobal] },
  label: 'Vacancy Labels',
  access: { read: () => true },
  admin: {
    group: 'Vacancies',
    description: 'Localized vacancy listing and detail page titles, tab labels, and section headings.',
  },
  fields: [
    { name: 'pageTitle',           type: 'text', localized: true, label: 'Page title' },
    { name: 'filterAllLabel',      type: 'text', localized: true, label: 'Filter "All departments" label' },
    { name: 'openPosition',        type: 'text', localized: true, label: 'Open position label (singular)' },
    { name: 'openPositions',       type: 'text', localized: true, label: 'Open positions label (plural)' },
    { name: 'noOpeningsMessage',   type: 'text', localized: true, label: 'No openings message' },
    { name: 'paginationItemLabel', type: 'text', localized: true, label: 'Pagination item label' },
    {
      name: 'perks',
      type: 'group',
      label: 'Why Join RAHATLYK?',
      fields: [
        { name: 'title',        type: 'text', localized: true, label: 'Section heading' },
        { name: 'growthTitle',  type: 'text', localized: true, label: 'Career growth — title' },
        { name: 'growthDesc',   type: 'text', localized: true, label: 'Career growth — description' },
        { name: 'healthTitle',  type: 'text', localized: true, label: 'Health benefits — title' },
        { name: 'healthDesc',   type: 'text', localized: true, label: 'Health benefits — description' },
        { name: 'cultureTitle', type: 'text', localized: true, label: 'Great culture — title' },
        { name: 'cultureDesc',  type: 'text', localized: true, label: 'Great culture — description' },
        { name: 'impactTitle',  type: 'text', localized: true, label: 'Real impact — title' },
        { name: 'impactDesc',   type: 'text', localized: true, label: 'Real impact — description' },
      ],
    },
    { name: 'postedLabel',         type: 'text', localized: true, label: 'Posted date label' },
    { name: 'tabOverview',         type: 'text', localized: true, label: 'Tab: Overview' },
    { name: 'tabResponsibilities', type: 'text', localized: true, label: 'Tab: Responsibilities' },
    { name: 'tabRequirements',     type: 'text', localized: true, label: 'Tab: Requirements' },
    { name: 'benefitsPerks',       type: 'text', localized: true, label: 'Benefits & Perks section heading' },
    { name: 'required',            type: 'text', localized: true, label: 'Required requirements heading' },
    { name: 'niceToHave',          type: 'text', localized: true, label: 'Nice to have heading' },
    { name: 'otherOpenings',       type: 'text', localized: true, label: 'Other openings section heading' },
  ],
}
