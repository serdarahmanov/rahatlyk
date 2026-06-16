# RAHATLYK Corporate Website

Official corporate website for RAHATLYK, a Turkmen water and beverage company.

This branch integrates Payload CMS into the existing Next.js application while keeping the public website routes and visual experience intact.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 App Router |
| CMS | Payload CMS 3 |
| Database | PostgreSQL via `@payloadcms/db-postgres` |
| Email | Payload Nodemailer adapter plus existing Nodemailer form routes |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | GSAP + ScrollTrigger |
| Smooth scrolling | Lenis |
| Images | Next.js `Image` and Payload media uploads |
| Fonts | Google Fonts via `next/font` |
| Internationalisation | Custom context in `src/lib/i18n/` for `tm`, `ru`, and `en` |

## What Changed Since The Last Commit

### Homepage "Our Collection" carousel managed from Payload

The hardcoded `CATEGORIES` array that drove the homepage product-line carousel has been replaced with a `product-lines` Payload collection.

- Added `src/collections/ProductLines.ts` with fields: `key` (unique slug), `name`, `description`, `body` (all localized), `image` (media relationship), `order`.
- Registered `ProductLines` in `payload.config.ts`.
- Added `ProductLine` / `ProductLinesSelect` to `payload-types.ts` and `PayloadProductLine` to `src/types/payload.ts`.
- Added `normalizeProductLine` to `src/lib/payload-normalize.ts`.
- Removed the dead fields (`icon`, `from`, `to`, `border`, `text`, `dot`) that were in the old `CATEGORIES` array but never referenced in the rendered JSX.

### Homepage split into server + client component

`src/app/(frontend)/page.tsx` was a 1 300-line `'use client'` file. It has been split:

- `page.tsx` is now a server component that reads the locale cookie, fetches product lines from Payload with the correct locale, and renders `<HomeClient lines={lines} />`.
- `HomeClient.tsx` contains all the animation and UI code. `CollectionsSection` now accepts `lines: PayloadProductLine[]` instead of the `cats` translation map, so text content (name, description, body) and images come directly from Payload.
- Each product-line bottle image uses `line.imageUrl` with a fallback to the default PNG.

### Detail page category/department fixes

After the category and department fields were converted from plain text to relationships, the detail client components still used the raw field value as a string. Fixed:

- `ArticleDetailClient` — `article.category.slug` for config lookups, `article.category.label` for display; removed the now-unused `getCatLabel` helper.
- `ProductDetailClient` — `product.category.slug` / `p.category.slug` for config lookups.
- `VacancyDetailClient` — `vacancy.department.slug` for config lookups, `vacancy.department.label` for display; same fix for the "Other Openings" cards.

### Dynamic category filtering from Payload

Replaced hardcoded filter arrays in `ProductsClient`, `NewsClient`, and `VacanciesClient` with categories driven entirely from Payload CMS.

- Added three dedicated collections:
  - `product-categories` — `slug` + localized `label`
  - `article-categories` — `slug` + localized `label`
  - `vacancy-departments` — `slug` + localized `label`
- Changed the `category` field on `products` and `articles`, and the `department` field on `vacancies`, from plain `text` to `relationship` pointing at the new collections.
- Each `page.tsx` now fetches the relevant category collection and passes it to the client component, so filter options are always in sync with what exists in the CMS.
- Filtering queries use the related document's numeric ID rather than a raw string.

### Payload localization (en / tm / ru)

- Added `localization` config to `payload.config.ts` with `en` (default), `tm`, and `ru` locales, with `fallback: true`.
- The localized `label` field in all three category collections lets editors enter translations per locale directly in the Payload admin.
- All user-facing text fields across `products`, `articles`, and `vacancies` are now marked `localized: true`:
  - **Products**: `name`, `tagline`, `description`, `longDescription`, `features[].text`, `nutrition[].label`
  - **Articles**: `title`, `body[].text`
  - **Vacancies**: `title`, `location`, `overview`, `responsibilities[].text`, `requirements[].text`, `niceToHave[].text`, `benefits[].text`
  - Non-text fields (`date`, `salary`, `volumes`, media/photo arrays) remain non-localized.
- `LanguageContext` now writes the selected locale to a cookie (`RAHATLYK-locale`) alongside the existing `localStorage` write, so server components can read it.
- All three `page.tsx` files read the locale cookie and pass it to every `payload.find()` call, so Payload returns already-resolved strings for the active language — no locale-picking logic needed in client components.

## Routes

| Route | Description |
|---|---|
| `/` | Public home page |
| `/about` | About page |
| `/products` | Payload-backed products listing |
| `/products/[id]` | Payload-backed product detail |
| `/news` | Payload-backed news listing |
| `/news/[id]` | Payload-backed article detail |
| `/vacancies` | Payload-backed vacancies listing |
| `/vacancies/[id]` | Payload-backed vacancy detail with application form |
| `/contact` | Contact page with email form |
| `/admin` | Payload admin UI |
| `/api/[...slug]` | Payload REST API |
| `/api/contact` | Existing contact form email handler |
| `/api/vacancy` | Existing vacancy application email handler with CV attachment |

## Project Structure

```text
payload.config.ts
payload-types.ts

src/
  app/
    (frontend)/
      layout.tsx
      page.tsx        ← server component (fetches product lines)
      HomeClient.tsx  ← all homepage animation/UI code
      about/page.tsx
      contact/page.tsx
      products/
      news/
      vacancies/
    (payload)/
      admin/
      api/[...slug]/route.ts
      layout.tsx
      custom.scss
    api/
      contact/route.ts
      vacancy/route.ts
    globals.css
  collections/
    ArticleCategories.ts
    Articles.ts
    Media.ts
    ProductCategories.ts
    ProductLines.ts
    Products.ts
    Users.ts
    VacancyDepartments.ts
    Vacancies.ts
  components/
  lib/
    email/
    i18n/
    payload.ts
    payload-normalize.ts
  types/
    payload.ts
  seed.ts
```

## Payload CMS

Payload is configured in `payload.config.ts`.

Key points:

- Admin user collection: `users`
- Public read collections: `media`, `product-categories`, `product-lines`, `products`, `article-categories`, `articles`, `vacancy-departments`, `vacancies`
- Database adapter: PostgreSQL
- Rich text editor: Lexical
- Image processing: Sharp
- Email adapter: `@payloadcms/email-nodemailer`
- Payload Next integration: `withPayload(nextConfig)`
- Payload import alias: `@payload-config`
- Localization: `en` (default), `tm`, `ru` — `fallback: true`

The public listing/detail pages call `getPayloadClient()` on the server and normalize Payload's generated collection types into frontend-friendly shapes. This keeps the existing client components mostly unchanged while letting CMS content drive the pages.

## Email Integration

There are two email paths in the project:

1. Payload admin/auth email through `@payloadcms/email-nodemailer`.
2. Existing public form email through raw Nodemailer in `/api/contact` and `/api/vacancy`.

Payload email is configured to use the same Gmail service transport style that already works for the public forms:

```ts
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
})
```

The config also calls `setDefaultResultOrder('ipv4first')` before creating the transporter. This avoids local Gmail SMTP attempts resolving to IPv6 first on networks where Gmail IPv6 SMTP is refused.

### Email Problems Encountered And Fixes

| Problem | Cause | Fix Applied |
|---|---|---|
| Public contact/vacancy forms sent email, but Payload admin email failed. | Forms and Payload used different Nodemailer configurations. | Changed Payload to use a real Nodemailer `transport` with the same `service: 'gmail'` style as the working form routes. |
| `connect ECONNREFUSED ... :465` during Payload verify. | Explicit Gmail SMTP host/port could resolve to an IPv6 Gmail endpoint that the local network refused. | Added `setDefaultResultOrder('ipv4first')` and stopped using the explicit `smtp.gmail.com:465` transport options. |
| `self-signed certificate in certificate chain` during Payload verify. | Local certificate trust chain rejected the SMTP TLS certificate path. | Matched the existing form routes by adding `tls: { rejectUnauthorized: false }` to the Payload transporter. |
| TypeScript rejected `transportOptions: { service: 'gmail' }`. | Payload's `transportOptions` type is `SMTPConnection.Options`, which does not include Nodemailer's `service` shortcut. | Used Payload's `transport` option with `nodemailer.createTransport(...)` instead. |
| Payload logs `Error verifying Nodemailer transport.` but admin still loads. | The Payload Nodemailer adapter logs verify errors instead of throwing them during setup. | Fixed the transport so verify can complete locally. |

Important production note: `rejectUnauthorized: false` is a local compatibility workaround. For production, fix the server or hosting CA trust chain and remove this option from both Payload and the public form transports.

## Environment Variables

Create `.env.local` in the project root.

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

DATABASE_URI=postgres://user:password@host:5432/database
PAYLOAD_SECRET=replace-with-a-long-random-secret

CONTACT_FORM_TO_EMAIL=info@rahatlyk.com
NOREPLY_EMAIL=noreply@rahatlyk.com
WEBSITE_EMAIL=website@rahatlyk.com
GMAIL_USER=your.gmail@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

Notes:

- `DATABASE_URI` or `DATABASE_URL` is required by Payload's PostgreSQL adapter.
- `PAYLOAD_SECRET` is required for Payload auth/session security.
- Gmail requires an App Password, not the normal account password.
- `CONTACT_FORM_TO_EMAIL` exists in the environment template, but the current form routes still send internal notifications to `GMAIL_USER`. That should be cleaned up in a later pass if the business inbox should be separate from the SMTP login.

## Getting Started

```bash
npm install
npm run dev
```

Open:

- Public site: `http://localhost:3000`
- Payload admin: `http://localhost:3000/admin`

## Verification

Commands used during this integration:

```bash
npm.cmd run lint
npx.cmd tsc --noEmit
```

Both passed after the Payload email fix.

`npm.cmd run build` was also tested, but the local machine failed before app compilation completed because `next/font/google` could not fetch Google Fonts:

```text
UNABLE_TO_VERIFY_LEAF_SIGNATURE
Failed to fetch Cormorant Garamond, Inter, and Plus Jakarta Sans from Google Fonts.
```

That is a local certificate/network trust issue around Google Fonts fetching, not a TypeScript or Payload compilation error. Fix options:

- repair the local/hosting CA trust chain,
- configure Node with the correct CA bundle,
- or self-host the fonts instead of using `next/font/google`.

## Known Follow-Up Work

- Remove `tls.rejectUnauthorized: false` after the certificate trust chain is fixed.
- Make public form routes use the same shared Payload/Nodemailer email path.
- Use `CONTACT_FORM_TO_EMAIL` for internal form notifications instead of `GMAIL_USER`.
- Add rate limiting, CAPTCHA/honeypot, or another anti-abuse control to `/api/contact` and `/api/vacancy`.
- Escape user-submitted text before interpolating it into HTML email templates.
- Store contact submissions and vacancy applications in Payload for audit/history.
- Add a package script for seeding Payload data.
- Update `.env.example` to include `DATABASE_URI` / `DATABASE_URL` and `PAYLOAD_SECRET`.

## Quality Notes

- ESLint passes.
- TypeScript `--noEmit` passes.
- The Payload admin loads and the admin forgot-password email transport now verifies locally.
- The dirty `.claude/worktrees/...` subproject marker is local agent metadata and is not part of the application change set.
