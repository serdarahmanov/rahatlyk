# RAHATLYK Website

Corporate website for RAHATLYK, built with Next.js App Router and Payload CMS.

The public site is localized in Turkmen, Russian, and English. Most page content, labels, media, and form text are managed through Payload globals and collections.

## Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 15 App Router |
| CMS | Payload CMS 3 |
| Database | PostgreSQL |
| Styling | Tailwind CSS v3 |
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
| `/:locale/products/:slug` | Product detail |
| `/:locale/news` | News listing |
| `/:locale/news/:slug` | Article detail |
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
| About | `about-hero`, `about-who-we-are`, `about-our-story`, `about-numbers`, `about-final-section` |
| Contact Page | `about-page` / Contact Hero, `forms`, `contact-info` |
| Article | `article-labels` |
| Products | `product-detail-labels` |
| Vacancies | `vacancy-labels` |

Notes:

- The old `product-lines` collection was replaced by the `our-collection` global.
- The old `site-settings` global was merged into `contact-info`.
- The old About Mosaic global was removed; its images now live inside `about-our-story`.
- Product, article, and vacancy listing/detail labels are CMS-managed.
- The certificate section component is currently not connected to a CMS global or rendered by the About page.
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

- Site: `http://localhost:3000` (default Turkmen locale)
- Russian site: `http://localhost:3000/ru`
- English site: `http://localhost:3000/en`
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

Seed scripts are stored under `scripts/seed/` and are idempotent. They are development/recovery-only tooling and are not required by the production standalone runtime. Run them only from an approved environment with access to the target database and source media files.

The canonical current-content workflow is:

```bash
npm run seed:export-current-content
SEED_TARGET=local npm run seed:current-content
```

The export captures current public text and relationships, excludes media and private/admin collections, and writes `scripts/seed/data/current-public-content.json`. The importer refuses to run unless `SEED_TARGET=local` is set. Media must be uploaded separately in the target environment.

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
- Do not run seed scripts on the VPS or against the production database. Use them only for a local or disposable database.
- After running seeds, make sure revalidation succeeds or rebuild/restart the app.
- With `output: 'standalone'`, run the deployed `server.js` from the standalone output as the `rahatlyk.service` systemd unit and serve it behind Nginx.

## Verification

```bash
npx tsc --noEmit
npm run lint
npm run build
npx playwright install chromium
```

The production build requires a reachable PostgreSQL database and valid Payload environment variables.

Known lint/build warnings should be resolved before deployment. If `.next` cache produces stale generated pages, delete `.next` and rebuild.
