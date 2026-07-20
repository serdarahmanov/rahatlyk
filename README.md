# RAHATLYK Website

Corporate website for RAHATLYK, built with Next.js App Router and Payload CMS.

The public site is localized in Turkmen, Russian, and English. Most page content, labels, media, and form text are managed through Payload globals and collections.

## Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 15 App Router |
| CMS | Payload CMS 3 |
| Database | PostgreSQL |
| Styling | Tailwind CSS v4 |
| Animation | GSAP, ScrollTrigger, Lenis |
| Email | Nodemailer and Payload email adapter |
| Media | Payload media uploads |
| Localization | Custom locale routing for `tm`, `ru`, `en` |
| Browser checks | Playwright |

## Routes

| Route | Purpose |
| --- | --- |
| `/:locale` | Home page |
| `/:locale/about` | About page |
| `/:locale/products` | Product listing |
| `/:locale/products/:id` | Product detail |
| `/:locale/news` | News listing |
| `/:locale/news/:id` | Article detail |
| `/:locale/vacancies` | Vacancy listing |
| `/:locale/vacancies/:id` | Vacancy detail and application form |
| `/:locale/contact` | Contact page and contact form |
| `/admin` | Payload admin |
| `/api/[...slug]` | Payload REST API |
| `/api/contact` | Contact form handler |
| `/api/vacancy` | Vacancy application handler |
| `/api/revalidate` | Cache revalidation endpoint |
| `/api/site-icon` | Redirects to the CMS-managed site icon |
| `/api/cv/:filename` | Authenticated CV download |
| `/favicon.ico` | Rewritten to `/api/site-icon` |

## Payload Structure

### Collections

- `media`
- `product-categories`
- `products`
- `article-categories`
- `articles`
- `vacancy-departments`
- `vacancies`
- `contact-submissions`
- `cv-documents`
- `vacancy-applications`
- `users`

### Globals

| Group | Globals |
| --- | --- |
| Home | `home-hero`, `horizontal-scroll`, `our-collection`, `home-story`, `home-cta-banner` |
| About | `about-hero`, `about-who-we-are`, `about-our-story`, `about-numbers`, `about-certificates`, `about-final-section` |
| Contact Page | `about-page` / Contact Hero, `forms`, `contact-info` |
| Article | `article-labels` |
| Products | `product-detail-labels` |
| Vacancies | `vacancy-labels` |

Notes:

- The old `product-lines` collection was replaced by the `our-collection` global.
- The old `site-settings` global was merged into `contact-info`.
- The old About Mosaic global was removed; its images now live inside `about-our-story`.
- Product, article, and vacancy listing/detail labels are CMS-managed.
- Home hero, home CTA, about hero, and about final section support mobile-specific media with desktop fallbacks.
- The site icon is managed in `contact-info` and served through `/api/site-icon`.

## Environment Variables

Create `.env.local` for local development or production env vars on the VPS.

```env
DATABASE_URI=postgres://user:password@host:5432/database
PAYLOAD_SECRET=replace-with-a-long-random-secret

NEXT_PUBLIC_SITE_URL=https://example.com
NEXT_APP_URL=http://localhost:3000
REVALIDATION_SECRET=replace-with-a-long-random-secret

CONTACT_FORM_TO_EMAIL=info@example.com
NOREPLY_EMAIL=noreply@example.com
WEBSITE_EMAIL=website@example.com
GMAIL_USER=your.gmail@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

`NEXT_APP_URL` is used by Payload hooks to call `/api/revalidate`. On the VPS it can usually be `http://localhost:3000` if the app runs on port 3000.

## Development

```bash
npm install
npm run dev
```

Open:

- Site: `http://localhost:3000/tm`
- Admin: `http://localhost:3000/admin`

For browser-level checks, install the Chromium browser used by Playwright:

```bash
npx playwright install chromium
```

## Build

```bash
npm run build
npm run start
```

The project uses:

```ts
output: 'standalone'
```

For standalone VPS deploys, copy all of these:

```text
.next/standalone
.next/static
public
```

If cached page data looks stale after seed changes, clear the build cache before rebuilding:

```bash
rm -rf .next
npm run build
```

PowerShell equivalent:

```powershell
Remove-Item -Recurse -Force .next
npm run build
```

## Cache And Revalidation

Server data uses `unstable_cache` with locale-specific tags. Payload hooks call `/api/revalidate` after collection/global changes.

Revalidation requires:

- the Next app to be running
- `NEXT_APP_URL` to point to the running app
- `REVALIDATION_SECRET` to match between the hook and `/api/revalidate`

If seed output includes:

```text
[revalidation] Unable to notify Next.js
```

the database update can still succeed, but generated pages may stay stale until the app is rebuilt or manually revalidated.

Payload media responses are configured with long-lived cache headers:

```text
Cache-Control: public, max-age=31536000, immutable
```

## Seeding

Seed scripts are idempotent. Run them from the environment that has access to the target database and source media files.

Common seed commands:

```bash
npm run seed:home-hero
npm run seed:horizontal-scroll
npm run seed:home-story
npm run seed:home-cta-banner
npm run seed:product-lines
npm run seed:products
npm run seed:news
npm run seed:vacancies
npm run seed:vacancy-images
npm run seed:about-all
npm run seed:about-final-section
npm run seed:article-labels
npm run seed:product-labels
npm run seed:vacancy-labels
```

Important media behavior:

- Home hero desktop and mobile cover images are managed by `home-hero`.
- Home hero desktop and mobile posters are preloaded with media hints.
- Horizontal-scroll videos wait for page load and their cover image before starting video loads.
- The home CTA uses responsive desktop/mobile images, not a video.
- About hero and about final section use responsive desktop/mobile images.
- Product listing hover media loads only on desktop hover-capable devices.
- Product detail galleries can include product videos.
- News and vacancy image seeds prefer optimized WebP files when available.

## Production Notes

- Linux filesystems are case-sensitive. Keep source media filenames and folder names exact.
- Do not delete Payload's upload directory during deployment.
- If using local Payload uploads on the VPS, keep the media directory persistent across releases.
- Run seeds on the VPS or against the production database only when the correct env vars are loaded.
- After running seeds, make sure revalidation succeeds or rebuild/restart the app.
- With `output: 'standalone'`, run the deployed `server.js` from the standalone output and serve it behind Nginx/PM2.

## Verification

```bash
npx tsc --noEmit
npm run build
npx playwright install chromium
```

Known lint/build warnings should be resolved before deployment. If `.next` cache produces stale generated pages, delete `.next` and rebuild.
