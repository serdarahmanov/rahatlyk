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

### About Page global — fully CMS-driven contact form

Added `src/globals/AboutPage.ts` — Payload Global (About group, slug `about-page`) with five field groups, all text fields localized in `en`, `tm`, `ru`:

| Group | Fields |
|---|---|
| Hero Content | `title`, `description` |
| Form Labels | `firstName`, `lastName`, `email`, `phone`, `subject`, `message`, `submitButton` |
| Form Messages | `success`, `error`, `sending`, `thankYou`, `whatHappensNext`, `step1`, `step2`, `step3`, `sendAnother` |
| Form Placeholders | `firstName`, `lastName`, `email`, `phone`, `subject`, `message` |

`thankYou`, `step2`, and `step3` use `{name}`, `{email}`, and `{phone}` tokens — swapped for real values at render time by the `injectTokens` helper in `ContactPageClient.tsx`.

Added `src/lib/data/about-content.ts` — seed data for all five groups in all three locales.

Added `src/seed-about.ts` — idempotent seed script.

```bash
npx tsx --env-file=.env.local src/seed-about.ts
```

### Contact page — split into server wrapper + locale-aware client

`src/app/(frontend)/contact/page.tsx` is now a server component that reads the `RAHATLYK-locale` cookie, fetches the `about-page` global from Payload with the correct locale, and passes every string as props to the client.

`src/app/(frontend)/contact/ContactPageClient.tsx` — extracted client component. No hardcoded strings remain: heading, description, all six field labels, all six placeholders, submit/sending button text, and the entire success panel (thank-you line, "What happens next" heading, steps 01–03, "Send Another Message" button) all come from Payload. English fallbacks are defined in `page.tsx` so the page renders correctly before seeding.

Language switching now triggers a full server re-render via `router.refresh()`, fetching the correct locale from Payload.

### Contact page — success panel redesign

- All `brand-*` colours replaced with greys (`bg-gray-100`, `text-gray-500`, `border-gray-100`, etc.).
- Hero heading and description hidden (`hidden`) once the form is submitted successfully.
- Success heading changed from `text-xl font-light` to `text-2xl font-semibold`.
- "What happens next" label changed from `text-[10px] font-light` to `text-xs font-medium`.
- Name and email in the thank-you line rendered as `text-black underline` via the `injectTokens` helper (same helper used for step 2 email and step 3 phone tokens).

### About page — ScrollTrigger refresh on language switch

The about page is a `'use client'` component with GSAP ScrollTrigger. `router.refresh()` (called by the language switcher) does a soft server re-render without unmounting the component, so the existing `useEffect([], [])` never re-ran and ScrollTrigger kept stale position calculations from the original layout. Different locales have different text lengths which shift element heights, causing triggers to fire at wrong scroll positions and produce a laggy feel.

Fix: imported `useLanguage` and added a `useEffect` keyed on `locale` that calls `ScrollTrigger.refresh()` inside a `requestAnimationFrame` after the DOM settles. An `isFirstLocaleRef` guard prevents it firing on initial mount. Matches the identical fix already applied to `HomeClient.tsx`.

### ContactInfo global — localized section label

Added `sectionLabel` (localized text) to `src/globals/ContactInfo.ts` — the "Contact Information" heading shown in the right panel of the contact page. `ContactInfoContext.tsx` now exposes `sectionLabel` and resolves it per locale, falling back to `'Contact Information'` if empty. `ContactPageClient.tsx` uses `contactInfo.sectionLabel` instead of the hardcoded string.

---

## What Changed In The Previous Commit

### Vacancies — image field, seed data, and card photo

- Added `image` (upload relationship to `media`) field to `src/collections/Vacancies.ts`.
- `normalizeVacancy` in `src/lib/payload-normalize.ts` now maps the media relation to `imageUrl`; `PayloadVacancy` type in `src/types/payload.ts` updated accordingly (`image` omitted from spread, `imageUrl: string | null` added).
- Vacancy cards in `VacanciesClient` render the uploaded photo. If no image is attached, the card falls back to the existing department-coloured gradient with SVG icon.
- Added `src/lib/data/vacancies-payload.ts` — 8 vacancies across 5 departments, all three locales, with responsibilities, requirements, nice-to-haves, and benefits.
- Added `src/seed-vacancies.ts` — idempotent seed for departments and vacancies. Uses an ID-passing helper so localized array fields (`responsibilities`, `requirements`, etc.) are matched to existing rows instead of duplicated.
- Added `src/seed-vacancy-images.ts` — uploads PNGs from `public/vacancy images/` to Payload Media and links each to the matching vacancy.

Run order (after `npx payload migrate`):
```bash
npx tsx --env-file=.env.local src/seed-vacancies.ts
npx tsx --env-file=.env.local src/seed-vacancy-images.ts
```

### News articles — seed data, card redesign, and detail page bug fix

- Added `src/lib/data/news-seed.ts` — 8 articles across 3 categories (Company News, Product Updates, Sustainability), all three locales, with 2 body paragraphs each.
- Added `src/seed-news.ts` — idempotent seed for article categories and articles. Uploads images from `media/` to Payload Media (cached within the same run), creates articles in English first then updates `tm`/`ru` locales with proper body array IDs.
- News listing cards redesigned: aspect ratio changed from portrait (`paddingBottom: 125%`) to landscape (`62%`); grid changed from 3 columns to 2 (`grid-cols-1 sm:grid-cols-2`); title weight/size increased from `15px / font-normal` to `18px / font-medium`; vertical row gap increased to `gap-y-16`.
- Fixed `NaN` error on the article detail page (`src/app/(frontend)/news/[id]/page.tsx`): the "related articles" and "fallback" Payload queries were passing the whole `PayloadCategory` object as the `category` filter value instead of `Number(category.id)`.

```bash
npx tsx --env-file=.env.local src/seed-news.ts
```

### Language switch fixes

- **Hero double-animation** (`HomeClient.tsx`): added `prevLocaleRef` — the hero animation `useEffect` now compares `locale` to the previous render's locale. If they match (triggered by `router.refresh()` re-firing after the server fetch, not by the user actually switching language), the effect swaps the text nodes silently without re-running the GSAP animation.
- **Horizontal scroll pin drift** (`HomeClient.tsx` — `HorizontalScrollSection`): after a language switch, sections above the pinned area can shift height (different text lengths in different locales). Added a `useEffect` keyed on `data` that calls `ScrollTrigger.refresh()` inside a `requestAnimationFrame` after the DOM updates, so the pin's `start: 'top top'` position is recalculated against the current layout.

### Detail pages — locale-aware queries

- `src/app/(frontend)/vacancies/[id]/page.tsx` and `src/app/(frontend)/products/[id]/page.tsx` now read the `RAHATLYK-locale` cookie via `next/headers` `cookies()` and pass it to all Payload queries, so translated content is returned when the user has switched language.

### News article detail page — redesign prototype

- Added `news-detail-design.html` — standalone HTML prototype for a new article detail layout. Key differences from the current page: no full-viewport cover image; instead the typography is the visual anchor (very large Cormorant Garamond title); the featured image sits below the title in a contained cinematic-wide frame (100:44 ratio, rounded corners); sticky blurred top bar; inline article images at 16:9 within the reading column; pull quote with decorative opening mark; dark "More to Read" section with horizontal image-left / text-right cards. Apply to `ArticleDetailClient.tsx` once approved.

---

### Previous batch — Home page fully CMS-driven

### Home page — fully CMS-driven

All five major home page sections are now managed from Payload CMS. The server component at `src/app/(frontend)/page.tsx` fetches all five globals and the product lines collection in a single `Promise.allSettled` call and passes normalised data down to `HomeClient`.

#### Hero Section global (`home-hero`)

- Added `src/globals/HomeHero.ts` — Payload Global (Home group) with `video` (media relationship), `title`, `titleAccent`, and `subtitle` — all text fields localized in `en`, `tm`, `ru`.
- Hero background changed from a static Next.js `Image` to a full-screen looping `<video>` element. Falls back to a solid brand colour if no video is uploaded yet.
- Text (title, titleAccent, subtitle) is read from Payload with translation fallback so the page still renders correctly before the global is seeded.
- Added `src/lib/data/hero-content.ts` — reference file with the original hero text in all three languages and the video filename, for copying into Payload Admin.
- Added `src/seed-hero.ts` — standalone seed script that uploads `public/hero section/hero-section-intro-video.mp4` to Payload Media and populates the global in all three locales.

#### Horizontal Scroll global (`horizontal-scroll`)

- Added `src/globals/HorizontalScroll.ts` — Payload Global (Home group) with six grouped boxes.
- Box 1 — portrait photo (image relationship).
- Box 2 — dark text panel: optional background image + localized tag and headline.
- Box 3 — product photo (image relationship).
- Box 4 — CTA panel: localized text, button label, and button href. Animated gradient background is static code.
- Box 5 — wide video panel: `video` and `coverImage` media relationships + localized tag and headline. Uses native HTML `<video poster>` attribute — single element, no layering.
- Box 6 — closing light panel: optional background image + localized tag, headline, button label, and button href.
- Added `src/lib/data/horizontal-scroll-content.ts` — reference file for seeding the global from Admin.

#### Our Story Section global (`home-story`)

- Added `src/globals/HomeStory.ts` — Payload Global (Home group) with `image` (media relationship), `tag`, `title`, and `text` — all text fields localized.
- Section redesigned: removed black overlays, height changed to `80vh`, image wrapped in a ref div extended `±15%` beyond section bounds for a GSAP ScrollTrigger scrub parallax effect.
- Section text colours changed to black (`text-black`, `text-black/70`, `text-black/50`) with `font-semibold` title and `font-medium` body.
- Award badge restored: trophy SVG + "Best Beverage Brand / Central Asia Award 2025" in a frosted-glass pill, positioned bottom-right. Text is hardcoded for now; `badge` and `badgeSub` values saved to `src/lib/data/home-story-content.ts` for future Payload field addition.
- Added `src/lib/data/home-story-content.ts` — reference file for seeding the global from Admin.

#### CTA Banner global (`home-cta-banner`)

- Added `src/globals/HomeCtaBanner.ts` — Payload Global (Home group) with `title`, `subtitle`, `ctaLabel` (localized) and `ctaHref` (non-localized). Animated water gradient background is static code.
- Added `src/lib/data/home-cta-content.ts` — reference file for seeding the global from Admin.

#### Latest News carousel

- News carousel on the home page now fetches the five most recent articles from Payload (`articles` collection, sorted by `-date`) instead of the static `NEWS_ITEMS` array.
- `NewsCarousel` component accepts `{ articles: PayloadArticle[] }` and uses `article.images[0]?.url`, `article.date`, and `article.title` from Payload data.

### Our Collection — seed script

- Added `src/lib/data/product-lines.ts` — five product line records (still water, sparkling water, fresh juices, energy drinks, herbal tea) with `key`, `imageFile`, `order`, and `name`/`description`/`body` in all three locales.
- Added `src/seed-product-lines.ts` — standalone seed script. For each entry it uploads the corresponding image from `public/our collection images/` to Payload Media (skips if already uploaded), then creates or updates the product-line record in all three locales.
- Image mapping: `1 (1).png` → water, `1 (2).png` → sparkling, `1 (3).png` → juice, `1 (4).png` → energy, `1 (5).png` → tea.

Run:
```bash
npx tsx --env-file=.env.local src/seed-product-lines.ts
npx tsx --env-file=.env.local src/seed-hero.ts
```

Both scripts are idempotent — safe to re-run. They update existing records instead of duplicating.

### Shared EmptyState component

- Added `src/components/EmptyState.tsx` — magnifying glass SVG + message prop, no border. Used on the vacancies, products, and news pages when a filtered view returns zero results.

### News page — multiple featured articles

- Featured articles query changed from `limit: 1` to `limit: 10` so multiple articles can be marked featured simultaneously.
- `NewsClient` featured rendering adapts: single featured article renders full-width; two or more render in a `grid-cols-2` layout.

### Contact page — phone number grouping

- All phone numbers are now grouped into a single bordered section with dashed internal separators between entries, instead of one separate bordered row per number.

### Form submissions stored in Payload

Contact form submissions and vacancy applications are now persisted in Payload CMS after the email sends. CV files are stored on disk.

- Added `src/collections/ContactSubmissions.ts` — stores `firstName`, `lastName`, `email`, `phone`, `subject`, `message`, `locale`. All fields read-only in admin. Authenticated-only read access.
- Added `src/collections/CVDocuments.ts` — Payload upload collection. Files written to `public/cv/` with UUID-generated filenames (unpredictable, not guessable). Read access restricted to authenticated users.
- Added `src/collections/VacancyApplications.ts` — stores applicant fields plus a relationship to `vacancies` and `cv-documents`. Authenticated-only read access.
- Updated `/api/contact/route.ts` — after sending email, calls `payload.create()` to persist the submission. DB failure logs but does not break the 200 response.
- Updated `/api/vacancy/route.ts` — after sending email, uploads the CV buffer via Payload's local API (`file:` property), then creates the `vacancy-applications` record referencing both the vacancy and the stored CV document.
- All three submission collections use `access: { create: () => false }` so the public REST API cannot create records directly; only the route handler's local API call bypasses this.

### Import/Export plugin

Added `@payloadcms/plugin-import-export` to enable CSV/JSON export from the Payload admin.

- `contact-submissions` and `vacancy-applications` have `import: false` — export-only.

### Admin sidebar grouping

| Group | Collections / Globals |
|---|---|
| About | About Page (global) |
| Home | Hero Section (global), Horizontal Scroll (global), Our Story Section (global), CTA Banner (global), Our Collection |
| Products | Product Categories, Products |
| Articles | Article Categories, Articles |
| Vacancies | Vacancy Departments, Vacancies |
| Submissions | Contact Submissions, CV Documents, Vacancy Applications |
| Settings | Contact Info (global) |

### Contact Info Global

Company contact information is managed from Payload instead of being hardcoded.

- Added `src/globals/ContactInfo.ts` — `email`, `phones` array (`label` + `number`), localized `address` and `workingHours`.
- Added `GET /api/contact-info` route — returns the global in all three locales.
- Added `src/lib/contact-info/ContactInfoContext.tsx` — client context that fetches once on mount and resolves per locale.
- `Footer`, `Navbar`, and Contact page info panel read from `useContactInfo()`.

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
| `/api/contact` | Contact form email handler — also persists to Payload |
| `/api/vacancy` | Vacancy application email handler — stores CV file and application in Payload |
| `/api/contact-info` | Returns the Contact Info global (all locales) for client-side context |

## Project Structure

```text
payload.config.ts
payload-types.ts

src/
  app/
    (frontend)/
      layout.tsx
      page.tsx          ← server component — fetches all home globals + product lines + news
      HomeClient.tsx    ← all homepage animation/UI code
      about/page.tsx
      contact/
        page.tsx                ← server component — fetches about-page global + locale
        ContactPageClient.tsx   ← all form/animation/UI code, receives strings as props
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
      contact-info/route.ts
    globals.css
  collections/
    ArticleCategories.ts
    Articles.ts
    Media.ts
    ProductCategories.ts
    ProductLines.ts
    Products.ts
    CVDocuments.ts
    ContactSubmissions.ts
    Users.ts
    VacancyApplications.ts
    VacancyDepartments.ts
    Vacancies.ts
  components/
    EmptyState.tsx
  globals/
    AboutPage.ts
    ContactInfo.ts
    HomeCtaBanner.ts
    HomeHero.ts
    HomeStory.ts
    HorizontalScroll.ts
  lib/
    contact-info/
      ContactInfoContext.tsx
    data/
      about-content.ts
      hero-content.ts
      home-cta-content.ts
      home-story-content.ts
      horizontal-scroll-content.ts
      product-lines.ts
    email/
    i18n/
    payload.ts
    payload-normalize.ts
  types/
    payload.ts
  seed.ts
  seed-about.ts
  seed-hero.ts
  seed-product-lines.ts
```

## Payload CMS

Payload is configured in `payload.config.ts`.

Key points:

- Admin user collection: `users`
- Public read collections: `media`, `product-categories`, `product-lines`, `products`, `article-categories`, `articles`, `vacancy-departments`, `vacancies`
- Authenticated-only collections: `contact-submissions`, `cv-documents`, `vacancy-applications`
- Globals: `about-page`, `contact-info`, `home-hero`, `horizontal-scroll`, `home-story`, `home-cta-banner`
- Database adapter: PostgreSQL
- Rich text editor: Lexical
- Image processing: Sharp
- Email adapter: `@payloadcms/email-nodemailer`
- Localization: `en` (default), `tm`, `ru` — `fallback: true`

The public listing/detail pages call `getPayloadClient()` on the server and normalize Payload's generated collection types into frontend-friendly shapes.

## Seeding Data

| Script | What it seeds |
|---|---|
| `src/seed-about.ts` | About Page global (hero, form labels, placeholders, messages — 3 locales) |
| `src/seed-hero.ts` | Hero Section global (video + text in 3 locales) |
| `src/seed-product-lines.ts` | Our Collection (5 product lines + images) |
| `src/seed-vacancies.ts` | Vacancy departments + 8 vacancies (3 locales, localized arrays) |
| `src/seed-vacancy-images.ts` | Uploads vacancy images and links them to vacancies |
| `src/seed-news.ts` | 3 article categories + 8 articles with images (3 locales) |

```bash
npx tsx --env-file=.env.local src/seed-about.ts
npx tsx --env-file=.env.local src/seed-hero.ts
npx tsx --env-file=.env.local src/seed-product-lines.ts
npx tsx --env-file=.env.local src/seed-vacancies.ts
npx tsx --env-file=.env.local src/seed-vacancy-images.ts
npx tsx --env-file=.env.local src/seed-news.ts
```

All seed scripts are idempotent — safe to re-run.

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

The config also calls `setDefaultResultOrder('ipv4first')` before creating the transporter.

### Email Problems Encountered And Fixes

| Problem | Cause | Fix Applied |
|---|---|---|
| Public contact/vacancy forms sent email, but Payload admin email failed. | Forms and Payload used different Nodemailer configurations. | Changed Payload to use a real Nodemailer `transport` with the same `service: 'gmail'` style. |
| `connect ECONNREFUSED ... :465` during Payload verify. | Explicit Gmail SMTP host/port resolved to an IPv6 endpoint the local network refused. | Added `setDefaultResultOrder('ipv4first')` and removed explicit host/port. |
| `self-signed certificate in certificate chain` during Payload verify. | Local certificate trust chain rejected the SMTP TLS path. | Added `tls: { rejectUnauthorized: false }`. |
| TypeScript rejected `transportOptions: { service: 'gmail' }`. | `transportOptions` type is `SMTPConnection.Options`, which excludes Nodemailer's `service` shortcut. | Used Payload's `transport` option with `nodemailer.createTransport(...)` instead. |

Important production note: `rejectUnauthorized: false` is a local compatibility workaround. Remove it in production once the CA trust chain is fixed.

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

## Getting Started

```bash
npm install
npm run dev
```

Open:

- Public site: `http://localhost:3000`
- Payload admin: `http://localhost:3000/admin`

## Verification

```bash
npm.cmd run lint
npx.cmd tsc --noEmit
```

Both pass after each change set.

`npm.cmd run build` fails locally due to `next/font/google` being unable to fetch Google Fonts (`UNABLE_TO_VERIFY_LEAF_SIGNATURE`). This is a local certificate/network trust issue, not a TypeScript or Payload compilation error.

## Known Follow-Up Work

- Remove `tls.rejectUnauthorized: false` after the certificate trust chain is fixed.
- Make public form routes use the same shared Payload/Nodemailer email path.
- Use `CONTACT_FORM_TO_EMAIL` for internal form notifications instead of `GMAIL_USER`.
- Add rate limiting, CAPTCHA/honeypot, or another anti-abuse control to `/api/contact` and `/api/vacancy`.
- Escape user-submitted text before interpolating it into HTML email templates.
- Add `badge` and `badgeSub` fields to the `home-story` Payload global so the award badge text is CMS-managed. Current values are in `src/lib/data/home-story-content.ts`.
- Update `.env.example` to include `DATABASE_URI` / `DATABASE_URL` and `PAYLOAD_SECRET`.
- Move `public/cv/` CV file storage to a private location for production — files in `public/` are statically served.

## Quality Notes

- ESLint passes.
- TypeScript `--noEmit` passes.
- The dirty `.claude/worktrees/...` subproject marker is local agent metadata and is not part of the application change set.
