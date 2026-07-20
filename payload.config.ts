import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { setDefaultResultOrder } from 'node:dns'
import nodemailer from 'nodemailer'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { AboutPage } from './src/globals/AboutPage'
import { AboutFinalSection } from './src/globals/AboutFinalSection'
import { AboutHero } from './src/globals/AboutHero'
import { AboutNumbers } from './src/globals/AboutNumbers'
import { AboutOurStory } from './src/globals/AboutOurStory'
import { AboutWhoWeAre } from './src/globals/AboutWhoWeAre'
import { ContactInfo } from './src/globals/ContactInfo'
import { EmailTemplates } from './src/globals/EmailTemplates'
import { SiteMetadata } from './src/globals/SiteMetadata'
import { Forms } from './src/globals/Forms'
import { HomeCtaBanner } from './src/globals/HomeCtaBanner'
import { HomeHero } from './src/globals/HomeHero'
import { NavigationLabels } from './src/globals/NavigationLabels'
import { OurCollection } from './src/globals/OurCollection'
import { ProductDetailLabels } from './src/globals/ProductDetailLabels'
import { HomeStory } from './src/globals/HomeStory'
import { HorizontalScroll } from './src/globals/HorizontalScroll'
import { ArticleLabels } from './src/globals/ArticleLabels'
import { VacancyLabels } from './src/globals/VacancyLabels'
import { ArticleCategories } from './src/collections/ArticleCategories'
import { Articles } from './src/collections/Articles'
import { ContactSubmissions } from './src/collections/ContactSubmissions'
import { CVDocuments } from './src/collections/CVDocuments'
import { Media } from './src/collections/Media'
import { ProductCategories } from './src/collections/ProductCategories'
import { Products } from './src/collections/Products'
import { Users } from './src/collections/Users'
import { VacancyApplications } from './src/collections/VacancyApplications'
import { VacancyDepartments } from './src/collections/VacancyDepartments'
import { Vacancies } from './src/collections/Vacancies'

setDefaultResultOrder('ipv4first')

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rahatlyk.com',
  admin: {
    user: Users.slug,
  },
  plugins: [
    importExportPlugin({
      collections: [
        { slug: 'product-categories' },
        { slug: 'products' },
        { slug: 'article-categories' },
        { slug: 'articles' },
        { slug: 'vacancy-departments' },
        { slug: 'vacancies' },
        { slug: 'contact-submissions',  import: false },
        { slug: 'vacancy-applications', import: false },
      ],
    }),
  ],
  globals: [SiteMetadata, ContactInfo, EmailTemplates, NavigationLabels, AboutPage, Forms, AboutHero, AboutWhoWeAre, AboutOurStory, AboutNumbers, AboutFinalSection, HomeHero, HorizontalScroll, OurCollection, HomeStory, HomeCtaBanner, ArticleLabels, ProductDetailLabels, VacancyLabels],
  collections: [Users, Media, ProductCategories, Products, ArticleCategories, Articles, VacancyDepartments, Vacancies, CVDocuments, ContactSubmissions, VacancyApplications],
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Türkmen', code: 'tm' },
      { label: 'Русский', code: 'ru' },
    ],
    defaultLocale: 'tm',
    fallback: true,
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI ?? process.env.DATABASE_URL,
    },
  }),
  editor: lexicalEditor(),
  email: nodemailerAdapter({
    defaultFromAddress: process.env.NOREPLY_EMAIL ?? '',
    defaultFromName: 'Rahatlyk',
    transport: nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    }),
  }),
  secret: process.env.PAYLOAD_SECRET ?? '',
  sharp,
})
