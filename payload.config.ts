import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { setDefaultResultOrder } from 'node:dns'
import nodemailer from 'nodemailer'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Articles } from './src/collections/Articles'
import { Media } from './src/collections/Media'
import { Products } from './src/collections/Products'
import { Users } from './src/collections/Users'
import { Vacancies } from './src/collections/Vacancies'

setDefaultResultOrder('ipv4first')

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media, Products, Articles, Vacancies],
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
