import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { setDefaultResultOrder } from 'node:dns'
import nodemailer from 'nodemailer'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { ContactInfo } from './src/globals/ContactInfo'
import { HomeCtaBanner } from './src/globals/HomeCtaBanner'
import { HomeHero } from './src/globals/HomeHero'
import { HomeStory } from './src/globals/HomeStory'
import { HorizontalScroll } from './src/globals/HorizontalScroll'
import { ArticleCategories } from './src/collections/ArticleCategories'
import { Articles } from './src/collections/Articles'
import { ContactSubmissions } from './src/collections/ContactSubmissions'
import { CVDocuments } from './src/collections/CVDocuments'
import { Media } from './src/collections/Media'
import { ProductCategories } from './src/collections/ProductCategories'
import { ProductLines } from './src/collections/ProductLines'
import { Products } from './src/collections/Products'
import { Users } from './src/collections/Users'
import { VacancyApplications } from './src/collections/VacancyApplications'
import { VacancyDepartments } from './src/collections/VacancyDepartments'
import { Vacancies } from './src/collections/Vacancies'

setDefaultResultOrder('ipv4first')

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  plugins: [
    importExportPlugin({
      collections: [
        { slug: 'product-categories' },
        { slug: 'product-lines' },
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
  globals: [ContactInfo, HomeHero, HorizontalScroll, HomeStory, HomeCtaBanner],
  collections: [Users, Media, ProductCategories, ProductLines, Products, ArticleCategories, Articles, VacancyDepartments, Vacancies, CVDocuments, ContactSubmissions, VacancyApplications],
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Türkmen', code: 'tm' },
      { label: 'Русский', code: 'ru' },
    ],
    defaultLocale: 'en',
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
      tls: {
        rejectUnauthorized: false,
      },
    }),
  }),
  secret: process.env.PAYLOAD_SECRET ?? '',
  sharp,
})
