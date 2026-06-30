import { createRequire } from 'node:module'
import { getPayload } from 'payload'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')

const LABELS = {
  en: {
    pageTitle:           'Build Your Career',
    filterAllLabel:      'All Departments',
    openPosition:        'open position',
    openPositions:       'open positions',
    noOpeningsMessage:   'No current openings in this category.',
    paginationItemLabel: 'positions',
    perks: {
      title:        'Why Join RAHATLYK?',
      growthTitle:  'Career Growth',
      growthDesc:   'Clear pathways and ongoing training',
      healthTitle:  'Health Benefits',
      healthDesc:   'Comprehensive medical coverage',
      cultureTitle: 'Great Culture',
      cultureDesc:  'Collaborative, inclusive workplace',
      impactTitle:  'Real Impact',
      impactDesc:   'Work that matters to millions',
    },
    postedLabel:         'Posted',
    tabOverview:         'Overview',
    tabResponsibilities: 'Responsibilities',
    tabRequirements:     'Requirements',
    benefitsPerks:       'Benefits & Perks',
    required:            'Required',
    niceToHave:          'Nice to Have',
    otherOpenings:       'Other Openings',
  },
  ru: {
    pageTitle:           'Постройте Карьеру',
    filterAllLabel:      'Все отделы',
    openPosition:        'открытая вакансия',
    openPositions:       'открытых вакансий',
    noOpeningsMessage:   'В данной категории нет вакансий.',
    paginationItemLabel: 'вакансий',
    perks: {
      title:        'Почему RAHATLYK?',
      growthTitle:  'Карьерный рост',
      growthDesc:   'Чёткие пути развития',
      healthTitle:  'Медицинский пакет',
      healthDesc:   'Комплексное страхование',
      cultureTitle: 'Отличная культура',
      cultureDesc:  'Инклюзивная среда',
      impactTitle:  'Реальный результат',
      impactDesc:   'Работа, которая важна',
    },
    postedLabel:         'Опубликовано',
    tabOverview:         'Обзор',
    tabResponsibilities: 'Обязанности',
    tabRequirements:     'Требования',
    benefitsPerks:       'Льготы и привилегии',
    required:            'Обязательно',
    niceToHave:          'Желательно',
    otherOpenings:       'Другие вакансии',
  },
  tm: {
    pageTitle:           'Karýeraňyzy Guruň',
    filterAllLabel:      'Ähli bölümler',
    openPosition:        'açyk iş orny',
    openPositions:       'açyk iş orunlary',
    noOpeningsMessage:   'Bu kategoriýada boş iş orunlary ýok.',
    paginationItemLabel: 'iş orunlary',
    perks: {
      title:        'Näme üçin RAHATLYK?',
      growthTitle:  'Karýera ösüşi',
      growthDesc:   'Yzygiderli ösüş ýollary',
      healthTitle:  'Saglygy goraýyş',
      healthDesc:   'Giň lukmançylyk ätiýaçlandyrmasy',
      cultureTitle: 'Ajaýyp medeniýet',
      cultureDesc:  'Hyzmatdaşlyk gurşawy',
      impactTitle:  'Hakyky täsir',
      impactDesc:   'Möhüm iş',
    },
    postedLabel:         'Çap edildi',
    tabOverview:         'Gysgaça',
    tabResponsibilities: 'Borçlar',
    tabRequirements:     'Talaplar',
    benefitsPerks:       'Ýeňillikler',
    required:            'Hökmany',
    niceToHave:          'Isleg bildirilýän',
    otherOpenings:       'Beýleki boş iş orunlary',
  },
} as const

async function seedVacancyLabels() {
  loadEnvConfig(process.cwd())
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  console.log('Seeding Vacancy Labels...')

  for (const locale of ['en', 'ru', 'tm'] as const) {
    await payload.updateGlobal({
      slug: 'vacancy-labels',
      locale,
      data: LABELS[locale],
    })
    console.log(`  [global] vacancy-labels updated for locale: ${locale}`)
  }

  console.log('Done.')
  process.exit(0)
}

seedVacancyLabels().catch((err) => {
  console.error(err)
  process.exit(1)
})
