import { createRequire } from 'node:module'
import { getPayload } from 'payload'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')

const DATA = {
  en: {
    home:      { title: 'RAHATLYK — Premium Beverages',    description: 'Pure. Natural. Life. Premium beverages from the heart of Turkmenistan — drinking water, mineral water, juices and more.' },
    about:     { title: 'About Us',                        description: "About RAHATLYK — our story, values, certifications and the team behind Turkmenistan's premium beverage brand." },
    products:  { title: 'Products',                        description: 'Explore the full RAHATLYK range — drinking water, mineral water, juices, energy drinks, herbal tea and more.' },
    news:      { title: 'News',                            description: 'Latest news and updates from RAHATLYK — product launches, company news and more.' },
    vacancies: { title: 'Careers',                         description: 'Build your career at RAHATLYK. Browse open positions in production, sales, marketing, logistics and more.' },
    contact:   { title: 'Contact',                         description: 'Get in touch with RAHATLYK. Send us a message and our team will respond as soon as possible.' },
  },
  tm: {
    home:      { title: 'RAHATLYK — Premium Içgiler',      description: 'Arassa. Tebigy. Durmuş. Türkmenistanyň arassa tebigy çeşmelerinden öndürilen premium içgiler — içme suwy, mineral suw, şireler we ş.m.' },
    about:     { title: 'Biz hakda',                       description: 'RAHATLYK hakda — taryhymyz, gymmatlyklarymyz, şahadatnamalarymyz we Türkmenistanyň premium içgi brendiniň topary.' },
    products:  { title: 'Önümler',                         description: 'RAHATLYK önümleriniň doly toplumyny açyň — içimlik suw, mineral suw, şireler, energetik içgiler, otly çaý we beýlekiler.' },
    news:      { title: 'Habarlar',                        description: 'RAHATLYK-dan iň soňky habarlar — önüm çykarylyşlary, kompaniýa täzelikleri we beýlekiler.' },
    vacancies: { title: 'Boş iş orunlary',                 description: 'RAHATLYK-da karýeraňyzy guruň. Önümçilik, satuw, marketing, logistika we beýleki ugurlarda açyk iş orunlaryny görüň.' },
    contact:   { title: 'Habarlaşmak',                     description: 'RAHATLYK bilen habarlaşyň. Habar iberiň, toparymyz gysga wagtda jogap berer.' },
  },
  ru: {
    home:      { title: 'RAHATLYK — Премиальные Напитки',  description: 'Чистый. Натуральный. Жизнь. Премиальные напитки из чистейших природных источников Туркменистана — питьевая вода, минеральная вода, соки и другое.' },
    about:     { title: 'О компании',                      description: 'О компании RAHATLYK — наша история, ценности, сертификаты и команда за брендом премиальных напитков.' },
    products:  { title: 'Продукты',                        description: 'Откройте весь ассортимент RAHATLYK — питьевая вода, минеральная вода, соки, энергетики, травяной чай и другое.' },
    news:      { title: 'Новости',                         description: 'Последние новости RAHATLYK — запуски продуктов, новости компании и другое.' },
    vacancies: { title: 'Вакансии',                        description: 'Постройте карьеру в RAHATLYK. Откройте вакансии в производстве, продажах, маркетинге, логистике и других отделах.' },
    contact:   { title: 'Контакты',                        description: 'Свяжитесь с RAHATLYK. Отправьте сообщение, и наша команда ответит как можно скорее.' },
  },
} as const

async function seedSiteMetadata() {
  loadEnvConfig(process.cwd())
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  console.log('Seeding Site Metadata...')

  for (const locale of ['en', 'tm', 'ru'] as const) {
    await payload.updateGlobal({
      slug: 'site-metadata',
      locale,
      data: {
        home:      DATA[locale].home,
        about:     DATA[locale].about,
        products:  DATA[locale].products,
        news:      DATA[locale].news,
        vacancies: DATA[locale].vacancies,
        contact:   DATA[locale].contact,
        organizationJsonLd: { name: 'RAHATLYK' },
        websiteJsonLd:      { name: 'RAHATLYK' },
      },
    })
    console.log(`  [global] site-metadata updated for locale: ${locale}`)
  }

  console.log('Done.')
  process.exit(0)
}

seedSiteMetadata().catch((err) => {
  console.error(err)
  process.exit(1)
})
