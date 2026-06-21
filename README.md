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

### June 21, 2026 — Article detail page: mobile layout

The article detail page uses a two-column pinned layout (sticky image left, scrollable text right) that works well on desktop and tablet but was broken on mobile — the fixed percentage widths (`w-[60%]` / `w-[40%]`), viewport-height column, and `pt-[calc(50vh-8rem)]` offset produced an unusable layout on small screens.

#### Approach

A separate `sm:hidden` single-column block was added **above** the existing desktop section. The desktop section received `hidden sm:flex` so it is completely removed from the layout on mobile. No classes or structure inside the desktop/tablet section were changed.

#### Mobile layout order (`src/app/(frontend)/news/[id]/ArticleDetailClient.tsx`)

1. Breadcrumb navigation
2. Article title (`text-2xl`)
3. Category badge · featured badge · date (same badge style as desktop)
4. Hero image — fixed 62 % aspect ratio with prev/next controls and dot indicators (shares the same `activeIdx` / `incoming` slideshow state as desktop)
5. Body paragraphs — first paragraph `text-[17px] font-medium`, remaining `text-base`
6. "View All News" button

#### Related articles grid

Changed from `grid-cols-3` to `grid-cols-1 sm:grid-cols-3` so related cards stack in a single column on mobile.

---

### June 21, 2026 — Client-side maxLength attributes added to form inputs

Both the contact form and the vacancy application form previously enforced field length limits only on the server. Inputs had no `maxLength` attributes, so users could type unlimited characters before hitting a server rejection.

`maxLength` attributes have been added to every text input in both forms, matching the server-side limits exactly:

| Field | Limit | Forms |
|---|---|---|
| First name | 100 | Contact, Vacancy |
| Last name | 100 | Contact, Vacancy |
| Email | 254 | Contact, Vacancy |
| Phone | 30 | Contact, Vacancy |
| Subject | 200 | Contact only |
| Message / Cover letter | 5 000 | Contact, Vacancy |

Files changed:
- `src/app/(frontend)/contact/ContactPageClient.tsx` — 6 inputs
- `src/app/(frontend)/vacancies/[id]/VacancyDetailClient.tsx` — 5 inputs

The CV file and date-of-birth fields already had client-side constraints (`accept`, `max`, and file-size check) and are unchanged.

---

### June 20, 2026 — Contact info panel: separate gradient class, white-fade removed

#### Root cause

The contact page's right-side info panel was using `about-mosaic-bg`, the same CSS class as the About page numbers section background. That class carries:

```css
mask-image: linear-gradient(to bottom, transparent 12%, transparent 20%, black 62%);
```

This mask is intentional on the About page — it creates a scroll-in fade as the dark section enters the viewport. On the contact page's sticky panel it had no purpose and made the top portion of the gradient appear white/transparent.

#### Fix (`src/app/globals.css`, `src/app/(frontend)/contact/ContactPageClient.tsx`)

Added `.contact-info-bg` — identical to `about-mosaic-bg` (`inset: -12% 0`, `z-index: 0`, `overflow: hidden`, `will-change: transform`) but without `mask-image`. The `-12% 0` inset is preserved so the GSAP parallax animation (`y: -10%` → `y: 10%`) still has overflow room and no gaps appear during scroll.

`ContactPageClient.tsx` now uses `contact-info-bg` on the background wrapper div. The About page numbers section continues to use the original `about-mosaic-bg` class unchanged.

---

### June 20, 2026 — Forms global, vacancy form CMS integration, and multilingual error handling

#### Forms global (`src/globals/Forms.ts`)

New Payload global (slug `forms`, Settings group, public read access) centralising all form UI strings for both forms in one place.

Three top-level groups:

| Group | Purpose |
|---|---|
| `commonFields` | Labels and placeholders shared across forms: firstName, lastName, email, phone |
| `contactForm` | Labels, placeholders, messages, and validation error strings for the contact form |
| `vacancyForm` | Labels, placeholders, upload hint, messages, and validation error strings for the vacancy form |

Every field is `localized: true` — a single `findGlobal` call with the correct locale returns all strings translated.

The `errors` subgroup in both `contactForm` and `vacancyForm` maps camelCase error codes to locale-specific text:

- **Contact errors (8):** `requiredFields`, `emailInvalid`, `nameTooLong`, `emailTooLong`, `phoneTooLong`, `subjectTooLong`, `messageTooLong`, `serverError`
- **Vacancy errors (13):** `requiredFields`, `emailInvalid`, `vacancyInvalid`, `nameTooLong`, `emailTooLong`, `phoneTooLong`, `dobInvalid`, `coverTooLong`, `cvRequired`, `cvTypeInvalid`, `cvTooLarge`, `cvContentMismatch`, `serverError`

#### Static seed data (`src/lib/data/forms-content.ts`)

New file. All form strings and error messages in all three locales. Used both as the seed source for `seed-forms.ts` and as runtime fallbacks when Payload is unavailable.

#### Seed script (`src/seed-forms.ts`)

```bash
npx tsx --env-file=.env.local src/seed-forms.ts
```

Seeds the Forms global for all three locales. Idempotent — safe to re-run.

#### Vacancy form — fully CMS-driven

`src/app/(frontend)/vacancies/[id]/page.tsx` now fetches the `forms` global alongside the vacancy data in the same `Promise.allSettled` call. All vacancy form strings (labels, placeholders, upload hints, success panel messages, and error messages) come from Payload with English fallbacks from `forms-content.ts`. Language switching calls `router.refresh()`, which re-runs the server component with the new locale cookie and delivers freshly translated strings.

#### Contact page — also pulls error strings from Forms global

`src/app/(frontend)/contact/page.tsx` previously fetched only the `about-page` global. It now also fetches `forms` in the same `Promise.all` call to get the localized `contactForm.errors` map. Hero text, field labels, and success panel messages still come from `about-page`.

#### Error codes in API routes

Both `/api/contact/route.ts` and `/api/vacancy/route.ts` now return camelCase error codes instead of hardcoded English strings:

```ts
// Before
return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })

// After
return NextResponse.json({ error: 'emailInvalid' }, { status: 400 })
```

#### Locale-reactive error display

Both client components store the error **code** in React state, not the translated string. The displayed message is derived from current props at render time:

```ts
// State holds the raw code
setFormError(code)                                            // e.g. 'cvTooLarge'

// Render resolves it through the current locale's errors map
{forms.vacancyForm.errors[formError] || vm.error}            // → "Резюме не должно превышать 2 МБ."
```

When the user switches language, `router.refresh()` delivers new props with updated translations. Because the code is in state (not the translated string), the rendered error updates immediately — no re-submission needed. Network failures (`'Failed to fetch'`) map to the `serverError` code and go through the same translation path.

---

### June 20, 2026 — Security hardening: vacancyId injection fix, HTTP headers, field length limits, anti-spam, XSS, CSV injection, CV file validation, private CV storage

#### `vacancyId` integer validation — HTML injection fix (`src/app/api/vacancy/route.ts`)

`vacancyId` is submitted by the client as a form field. Previously it was used directly to construct `vacancyUrl`, which was then interpolated into the `href` attribute of internal notification emails without escaping. A crafted `vacancyId` containing `"` could break out of the attribute and inject arbitrary HTML into the admin email.

Fix: `parseInt(vacancyId, 10)` is now validated to be a positive integer before any use. `vacancyUrl` and the Payload `vacancy:` relationship field both use the parsed integer `vacancyIdNum`. Requests with a non-integer `vacancyId` are rejected with `400`.

#### HTTP security headers (`next.config.ts`)

Added a global `headers()` function that applies four headers to every response:

| Header | Value | Purpose |
|---|---|---|
| `X-Frame-Options` | `SAMEORIGIN` | Prevents the site being embedded in iframes on other domains (clickjacking) |
| `X-Content-Type-Options` | `nosniff` | Prevents browsers from MIME-sniffing responses away from the declared content type |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Sends only the origin (not full path) when navigating to external sites |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Explicitly disables unused browser APIs |

#### Field length limits (`src/app/api/contact/route.ts`, `src/app/api/vacancy/route.ts`)

Both routes now reject oversized inputs before they reach Nodemailer or Payload. Without these limits a single POST with a megabyte-long message would pass all other validation, send a massive email to the admin inbox, and persist garbage data in Payload.

| Field | Limit |
|---|---|
| First / Last name | 100 characters |
| Email | 254 characters (RFC 5321 maximum) |
| Phone | 30 characters |
| Subject (contact) | 200 characters |
| Message / Cover letter | 5 000 characters |

#### Anti-spam — honeypot + timing check (`src/lib/spam-check.ts`)

New shared module used by both `/api/contact` and `/api/vacancy`.

- **Honeypot field** — a hidden `website` input is added to each form, positioned off-screen (`position: absolute; left: -9999px`) so real users never see it, but bots filling all fields will set it. Any non-empty value triggers silent rejection.
- **Timing check** — `loadedAt = Date.now()` is recorded on component mount (`useEffect`) and sent with the payload. Submissions arriving less than **4 seconds** after page load are rejected — no human can complete the form that fast.
- **Silent 200 response** — detected bots receive `{ success: true }` with a 200 status instead of a 4xx error, so they think the submission succeeded and do not retry or adapt.

`isSpam(honeypot, loadedAt)` — returns `true` if the honeypot is filled or the elapsed time is under 4 000 ms.

Applied to:
- `src/app/(frontend)/contact/ContactPageClient.tsx` — `loadedAtRef`, hidden `website` input, `loadedAt` in fetch body.
- `src/app/(frontend)/vacancies/[id]/VacancyDetailClient.tsx` — same pattern, `loadedAt` appended to `FormData`.

#### XSS prevention in email templates (`src/lib/email/templates.ts`)

Added `escapeHtml()` — replaces `&`, `<`, `>`, `"`, `'` with their HTML entities before any user-supplied value is interpolated into a Nodemailer HTML string. All four exported template functions (`contactConfirmation`, `contactNotification`, `vacancyConfirmation`, `vacancyNotification`) escape every user input at entry point.

#### CSV formula injection protection (`src/lib/spam-check.ts`)

Added `sanitizeCsv(value)` — prefixes values starting with `=`, `+`, `-`, `@`, `\t`, or `\r` with a single quote so Excel/Sheets treat them as literal text instead of executing them as formulas. Applied to every user-supplied string passed to `payload.create()` in both route handlers.

#### CV file type validation — upgraded to `file-type` package (`src/app/api/vacancy/route.ts`)

Replaced the manual magic-byte table and custom `isValidDocx` buffer scan with [`file-type`](https://github.com/sindresorhus/file-type).

```ts
const detected = await fileTypeFromBuffer(cvBuffer)
if (!detected || detected.mime !== cvFile.type) { /* reject */ }
```

`file-type` inspects actual file content — not the browser-supplied `Content-Type`:

| Format | How it validates |
|---|---|
| PDF | Reads `%PDF` magic bytes |
| DOC | Reads OLE2 compound document header (`D0 CF 11 E0`) |
| DOCX | Reads ZIP magic bytes **and** inspects `[Content_Types].xml` inside the archive to confirm it is an OOXML document |

A plain ZIP renamed to `.docx` is detected as `application/zip` and rejected.

#### CV file size limit reduced

Maximum CV upload size reduced from **5 MB** to **2 MB** — enforced on both the server (`MAX_SIZE_BYTES` in `route.ts`) and the client (form validation in `VacancyDetailClient.tsx`). UI hint updated from "up to 5 MB" to "up to 2 MB".

#### Private CV storage + authenticated serving route

CV files are no longer stored inside `public/` where Next.js serves them statically to anyone.

- `src/collections/CVDocuments.ts` — `staticDir` changed from `public/cv` to `cv` (project root, outside `public/`). Payload v3 serves files via its built-in endpoint at `/api/cv-documents/file/{filename}`, enforcing `access.read` automatically — no `staticURL` configuration is needed or available in v3.
- `src/app/api/cv/[filename]/route.ts` — **additional route handler** as an explicit auth layer. Validates the Payload session via `payload.auth({ headers: req.headers })`, prevents path traversal with `path.basename(filename)`, reads the file from the root `cv/` directory, and streams it with:
  - `Content-Disposition: attachment` — forces download, not inline render
  - `X-Content-Type-Options: nosniff` — prevents MIME sniffing
  - `Cache-Control: private, no-cache` — no shared-proxy caching

Unauthenticated requests receive `401`. Missing files receive `404`.

> **Note for existing deployments:** CV files already stored in `public/cv/` must be moved to the root `cv/` directory manually. Payload admin download links will be broken until files are migrated.

---

### June 20, 2026 — Article body richText migration: hyperlink support

#### Articles collection (`src/collections/Articles.ts`)

`body[].text` changed from `textarea` (plain string) to `richText` with the Payload Lexical editor. Three features enabled:

| Feature | Purpose |
|---|---|
| `ParagraphFeature` | Basic paragraph rendering |
| `InlineToolbarFeature` | Floating toolbar appears on text selection |
| `LinkFeature` | Insert external hyperlinks on selected words |

**How to insert a link in the admin:**
1. Open any article → click inside a body paragraph
2. Select the word(s) to link
3. Click the link icon in the floating toolbar that appears
4. Paste the external URL and press Enter
5. Save the article

#### Custom Lexical serializer (`src/lib/lexical-serialize.tsx`)

New file. Walks the Lexical `SerializedEditorState` AST and returns React nodes without any Payload runtime dependency.

- **`LexicalContent`** — React component that renders inline content (text with bold/italic/underline/strikethrough/code formatting + `<a>` tags for links). Links render as `text-brand-700 underline` with `hover:text-brand-950`. Falls back to rendering the raw string if data is a plain string (backward compatibility for unmigrated rows).
- **`lexicalToPlainText`** — extracts a plain string from Lexical JSON for use in truncated previews (news listing card). Also falls back to returning the string directly if data is not structured Lexical JSON.

#### Type and normalizer updates

- `src/types/payload.ts` — `PayloadArticle.body[].text` type changed from `string` to `unknown` (Lexical `SerializedEditorState`).
- `src/lib/payload-normalize.ts` — added `richTextRows` helper that passes Lexical JSON objects through without string coercion. `normalizeArticle` now uses `richTextRows` instead of `textRows`.

#### Frontend rendering updates

- `ArticleDetailClient.tsx` — `{para.text}` replaced with `<LexicalContent data={para.text} />`. GSAP `.article-para` selector and paragraph styling are unchanged.
- `NewsClient.tsx` — featured article preview changed from `{article.body[0]?.text}` to `{lexicalToPlainText(article.body[0]?.text)}`.

#### Seed script updates

- `src/seed.ts` line 20 — `body.map((text) => ({ text }))` updated to `body.map((text) => ({ text: toRichText(text) }))`. `toRichText` wraps a plain string in the minimal Lexical document structure.
- `src/seed-news.ts` — same `toRichText` wrapper added (was already there from this session).

#### One-time database migration (`src/migrate-article-body-to-richtext.ts`)

The `articles_body_locales.text` column must be cast from `varchar` to `jsonb`. Payload's automatic schema push cannot do this cast without a `USING` clause. Run this script once against the live database **before** starting the dev server after pulling:

```bash
npx tsx --env-file=.env.local src/migrate-article-body-to-richtext.ts
```

The script connects directly via `pg` (bypassing Payload's init), runs `ALTER COLUMN … SET DATA TYPE jsonb USING jsonb_build_object(…)`, and wraps every existing plain-text value in the correct Lexical document structure so no content is lost.

---

### June 20, 2026 — product-detail UI overhaul, ProductDetailLabels global, nutrition localisation, features removal

#### Product Detail page (`ProductDetailClient.tsx`)

- **Icon sizing** — X (close) icon on the nutrition bar is now `16×16 / strokeWidth 1.8` to match the Back/Next arrow icons.
- **Nutrition label** — `font-medium` weight.
- **Volume icon hover** — `scale-105` (was `scale-110`), `text-gray-600 opacity-80 drop-shadow-sm` (was fully black).
- **About section background** — `bg-white` (was `bg-gray-50`); top/bottom padding increased to `py-24`.
- **About section layout** — "About" heading sits above a two-column CSS grid (`grid-cols-1 sm:grid-cols-[200px_1fr]`). Both columns sit inside grey `rounded-[10px] bg-black/[0.06] px-5 py-4` boxes, aligned at their top edges.
- **"About" heading** — `text-5xl sm:text-6xl font-medium text-black/[0.12]` (large, light grey — Apple-style). `mb-10` gap between heading and grid.
- **Product name in left box** — `text-xl font-semibold` (EN/TM) / `font-medium` (RU). Matches the boldness of the heading.
- **Description text** — tagline `text-xl`; body text `text-[17px]`.
- **Section border** — removed `border-t border-gray-200` from the About section.
- **Thumbnail selected indicator** — absolutely positioned `<span>` overlay with `border-2 border-black/[0.06]` (sits above the image, visible at all times).
- **Thumbnail clip-path fix** — added `onComplete: () => gsap.set(thumbCol.children, { clearProps: 'clipPath' })` to the entry animation so the GSAP inline `clip-path` style is cleared after the animation, allowing the selection border to render correctly.
- **GSAP pin (About section, tablet/desktop only)** — `nameColRef` (left column) is pinned with `ScrollTrigger`:
  - `start: 'top 80%'` on the grid container.
  - `endTrigger: descBoxRef` (right column); `end` is a dynamic function so the pin releases when the bottom of the right box aligns with the bottom of the pinned name.
  - `pinSpacing: false`, `pinType: 'transform'` — required because Lenis smooth scroll breaks the default `position: fixed` pin strategy.
  - Guard: `window.innerWidth >= 768` — no pin on mobile.
- **Labels from Payload** — `sizeLabel`, `nutritionLabel`, `aboutLabel`, `mineralLabel`, `perLitreLabel` are now fetched from the new `product-detail-labels` global (with inline fallbacks).

#### `ProductDetailLabels` Payload global (`src/globals/ProductDetailLabels.ts`)

New global registered under the **Products** admin group. Five localized text fields:

| Field | EN default | TM | RU |
|---|---|---|---|
| `sizeLabel` | Size | Göwrüm | Объём |
| `nutritionLabel` | Nutrition | Iýmit gymmaty | Питательная ценность |
| `aboutLabel` | About | Barada | О продукте |
| `mineralLabel` | Mineral | Mineral | Минерал |
| `perLitreLabel` | Per Litre | Litrde | На литр |

#### Seed script for ProductDetailLabels (`src/seed-product-detail-labels.ts`)

New seed script. Seeds all five labels in EN, TM, and RU.

```bash
npx tsx src/seed-product-detail-labels.ts
```

#### Products collection — nutrition localisation (`src/collections/Products.ts`)

`nutrition[].label` and `nutrition[].value` are now `localized: true`. Run a migration after pulling:

```bash
npx.cmd payload migrate
```

#### Features field removed

- `features` array removed from `src/collections/Products.ts`.
- `features` removed from `PayloadProduct` type (`src/types/payload.ts`).
- `features` removed from `normalizeProduct` (`src/lib/payload-normalize.ts`).
- `features` removed from `ProductSeedEntry` type and all 9 product seed entries (`src/lib/data/products-payload.ts`).
- `features` removed from `src/seed-products.ts`.

#### Seed data updates (`src/lib/data/products-payload.ts`)

- **Nutrition translations** — every nutrition row now carries EN/TM/RU values for `label` and `value`.
- **Volume format** — values are plain numbers without units: `0.5`, `0.33`, `0.7`, `1`, `10`, `19`.
- **10 L added** — Still Water, Mineral Water, Orange Juice, Apple Juice, and Still Water 19 L product lines now include a `10` volume entry.

#### Seed script fix — localized array item IDs (`src/seed-products.ts`)

Payload requires existing array item IDs when updating non-default locales of a localized array field; omitting them replaces the array entirely. Fix: after seeding EN, fetch the product with `findByID` to retrieve the auto-assigned nutrition IDs, then pass those IDs in every TM/RU update:

```ts
const fresh = await payload.findByID({ collection: 'products', id, locale: 'en', depth: 0 })
const nutritionIds = (fresh.nutrition ?? []).map((n: any) => n.id)
// passed as { id: nutritionIds[i], label: ..., value: ... } in TM/RU updates
```

---

### June 20, 2026 — home, news, and product-detail polish

#### Home page

- **Our Collection title handling**
  - Long localized titles no longer split inside a word.
  - The title mask is wider on desktop while the description/body column keeps its original width.
- **Our Collection pin progress**
  - Added a short, rounded vertical progress track on the left side.
  - The black fill follows the collection pin's `ScrollTrigger.progress`.
  - The track expands when pinning starts and collapses directionally when the user leaves the pin.
  - Collection geometry and ScrollTrigger positions are recalculated after locale/content changes.
- **Our Story**
  - Section height changed from `80vh` to `100svh`.
  - Removed the section tag.
  - Added a `bg-white/20` image overlay for black-text readability.
  - Body text is full black and title/body spacing was increased.
  - Award badge now uses the same `bg-white/70 backdrop-blur-sm` surface as image navigation controls.
- **Latest News**
  - Header previous/next buttons now match the rounded gray controls used by Our Collection.
  - Card captions use a translucent white blurred surface with darker, medium-weight titles.
- **Final CTA**
  - Subtitle changed to `text-white/70`.
  - "Explore Products" now uses the same translucent white blurred button treatment as image controls.
- **Footer**
  - Facebook, Instagram, and YouTube controls changed from circles to the shared rounded-square navigation style.

#### Home hero poster and video readiness

- Added `poster` to the `home-hero` Payload global.
- Added `posterUrl` to `HomeHeroData` and Payload normalization.
- The poster image renders immediately behind the hero video.
- The video starts at `opacity: 0` and fades in only after `onCanPlay`.
- The poster remains visible when the video is slow or fails to load.
- Added migration `src/migrations/20260619_225600.ts` and regenerated `payload-types.ts`.

After pulling these changes:

```bash
npx.cmd payload migrate
```

Then select an image in **Payload Admin → Home → Hero Section → Video Poster**.

#### Client navigation and ScrollTrigger lifecycle

- `ScrollReset` now runs on every pathname change and resets both native scroll and Lenis.
- Our Collection's asynchronous ScrollTrigger setup is guarded against initialization after unmount.
- Horizontal-scroll cleanup restores the persistent header transform.
- Contact, vacancy, product-detail, and article-detail pages now kill only their own ScrollTriggers instead of calling `ScrollTrigger.getAll().kill()`.
- These changes fix pin drift and broken horizontal/collection pins after navigating away from and back to the home page.

#### News listing and article detail

- News card image navigation now matches the article-detail gallery:
  - `w-9 h-9 rounded-md bg-white/70 backdrop-blur-sm` previous/next controls.
  - Centered active pill and inactive progress dots.
- "Read article" links are now light-gray rounded buttons with the same label/arrow anatomy as the home CTA button.
- Related article cards use the same controls and progress indicators.
- Article detail category/featured/date badge text increased from 10px to 12px.
- Article detail now reads the `RAHATLYK-locale` cookie and passes `locale` to the main, related, and fallback Payload queries.

#### Product detail

- Replaced all warm `brand-*` colors in the product-detail component with neutral grays.
- Breadcrumbs now match article detail: gray links/separators and a black current item.
- Product image previous/next controls now match article-detail image controls.
- Previous/next product links now use the rounded gray icon-button style from Home → Latest News.
- Nutrition is now a rounded certificate-style gray row whose background expands with its content.
- The "Size" label uses normal casing/tracking.
- Main product titles use Plus Jakarta Sans weight 500 for English/Turkmen and retain the lighter Russian treatment.
- Added the 500 font file to the `next/font` Plus Jakarta Sans configuration.
- Product category labels use medium weight.

---

### About page — Payload-driven content, animation polish, and layout fixes

#### Our Story — `sectionLabel` field

- Added `sectionLabel: string` to the `AboutPageData` type (`story` sub-object in `AboutPageClient.tsx`).
- Replaced the hardcoded `"Our story"` label in the JSX with `{data.story.sectionLabel}`.
- `src/globals/AboutOurStory.ts`: added `sectionLabel` (text, localized) field.
- `src/lib/data/about-our-story-content.ts`: added `sectionLabel` in all three locales (`"Our story"` / `"Biziň taryhymyz"` / `"Наша история"`).
- `src/seed-about-our-story.ts`: seeds `sectionLabel` for `en` on first pass and for `tm`/`ru` in the locale loop.
- `src/app/(frontend)/about/page.tsx`: maps `storyRaw?.sectionLabel` with fallback; `sectionLabel` added to `FALLBACK.story`.

Run after pulling to populate the new field:
```bash
npm run seed:about-our-story
```

#### Numbers section — count-up animation and layout

- **Root cause fixed**: wrapping the stat value in `<span data-count-to>` caused GSAP's `fromTo({ innerText: 0 })` to reset the number to `"0"` immediately on mount, making digits appear tiny before the scroll trigger fired.
- **Fix**: moved `data-count-to` to the `<strong>` element (no span wrapper). GSAP finds the first text-node child of `strong` and updates only that, leaving the suffix `<i>` untouched.
- **Count-up now uses `onEnter`**: `ScrollTrigger.create({ once: true, onEnter })` wraps a `gsap.to(proxy)` with `onUpdate` writing to the text node — the number holds its rendered value until the element scrolls into view, then counts from 0 to target.
- **Font size**: explicit inline style `clamp(48px, 6vw, 88px)` on `<strong>` so the size is always applied regardless of CSS cascade order or hot-reload state.
- **Grid layout**: removed `width: min(980px, 100%)` cap → `width: 100%`; columns changed to `repeat(4, 1fr)` so `"100%"` no longer overflows its column divider.
- **Column spacing**: stat item padding increased to `clamp(32px, 5vw, 72px)` (was `clamp(12px, 2vw, 28px)`).

#### Statement paragraph — typography and alignment

- Font weight is now locale-conditional: `font-[550]` for `en`/`tm`, `font-normal` for `ru` (Cyrillic renders heavier at the same weight in the heading font).
- Accent word `<em>` gets explicit `font-semibold` so the serif fallback doesn't drop to 400.
- Text alignment changed to `text-right`; block stays centred via `mx-auto`.

#### Statement opacity animation — scroll timing

- Changed `gsap.to()` → `gsap.fromTo()` with explicit `{ opacity: 0.12 }` from-state so stale inline styles from a previous locale never leave words at `opacity: 1` before the trigger fires.
- `duration: 0.09` added (fade band ≈ 2 words at once; previously defaulted to 0.5 s → ~11 words).
- **Trigger changed** from `.about-statement` (section) to `.about-statement p` (the paragraph itself). The section has `pt-[clamp(140px,22vh,260px)]`, so firing on the section top caused ~4 first-line words to reach `opacity: 1` before they were even on screen.
- `start: 'top 90%'`, `end: 'bottom 50%'`.

#### Body paragraph opacity animation

- `duration: 0.07` added for the same 2-word fade band (`0.07 / 0.035 stagger = 2`).
- `start` changed from `'top 88%'` to `'top 90%'`.

#### Mosaic section — dark background fade from top

- `background: #0c3a52` removed from `.about-mosaic-field`; the field is now transparent, letting the page background (`#FAFAF8`) show through at the top.
- `mask-image` applied to `.about-mosaic-bg` (which wraps the base gradient, colour blobs, and grain layer):

  ```css
  mask-image: linear-gradient(to bottom, transparent 12%, transparent 20%, black 62%);
  ```

  `12%` aligns to the field's visible top edge (the bg element has `inset: -12% 0`). The background fades from fully transparent at the top, holds transparent through the first photo row, then becomes fully opaque by 62% of the bg height — well within the photos section. Photo rows (`z-index: 2`) are above the bg and are unaffected by the mask.

---

## What Changed In The Previous Session

### Article detail page — two-column redesign (`ArticleDetailClient.tsx`)

The article detail page was completely redesigned from a single-column hero/content layout into a two-column pinned layout.

#### Layout structure

```
┌─────────────────────────── section (max-w-screen-2xl, pt-32 pb-40) ───────────────────────────┐
│  Left  60% (sticky top-32, h-[calc(100vh-8rem)], pb-8)  │  Right 40% (pt-[calc(50vh-8rem)])  │
│  ┌───────────────────────────────────────────────────┐   │  ┌─────────────────────────────┐   │
│  │ Breadcrumb                                        │   │  │ Paragraph 1 (font-medium)   │   │
│  │ Title (mb-10 mt-2)                                │   │  │ Paragraph 2 …               │   │
│  │ [Category badge] [Featured badge]  [Date ml-auto] │   │  │ …                           │   │
│  │ ┌─────────────────────────────────────────────┐   │   │  │ "View All News" button      │   │
│  │ │ Main photo (flex-1, news-slide-in anim)     │   │   │  └─────────────────────────────┘   │
│  │ │  [← pill dots →] (bottom centre)           │   │   │  sticky white mask (h-8, bottom-0)  │
│  │ └─────────────────────────────────────────────┘   │   └─────────────────────────────────────┘
│  └───────────────────────────────────────────────────┘
└────────────────────────────────────────────────────────────────────────────────────────────────┘
```

- Left column: `sticky top-32`, `h-[calc(100vh-8rem)]`, `flex-col`, `pb-8` — stays fixed while the right column scrolls.
- Right column: `pt-[calc(50vh-8rem)]` — first paragraph begins at the vertical centre of the viewport on load.
- Sticky white mask (`sticky bottom-0 h-8 bg-white`) at the end of the right column so paragraphs scroll behind white space instead of reaching the raw viewport edge.

#### Info section (left column, top)

- Breadcrumb: `Home / News / Category / Article title` — article title rendered in `text-black` (was `text-gray-500`).
- Title: `font-normal`, `mb-10`, `mt-2`.
- Badges + date row sits directly above the photo (not overlaid on it):
  - `[Category badge]` — `bg-gray-100 text-gray-600 rounded-md uppercase tracking-wider text-[10px]`
  - `[Featured badge]` — same style, rendered only when `article.featured === true`
  - `[Date]` — same badge style, `ml-auto` to push it right

#### Photo (left column, bottom — `flex-1 min-h-0`)

- Single main photo fills the remaining height of the left column.
- **Image transition**: dual-layer CSS `news-slide-in` (same as news listing cards) — incoming image slides in from right at z-index 2 over the current image at z-index 1. Replaces previous GSAP opacity fade.
- **Navigation controls** (bottom of photo, `zIndex: 10`):
  - Prev / Next buttons: `rounded-md` (was `rounded-full`) with `bg-white/70 backdrop-blur-sm`
  - Pill-dot indicators between the buttons — active dot: `w-6 h-[4px] bg-white`, inactive: `w-[4px] h-[4px] bg-white/40`. Matches the Our Collection carousel on the home page. Replaces the `1 / 3` text counter.

#### Article body (right column)

- All paragraphs: `text-black` (was `text-gray-800` / `text-gray-600`).
- First paragraph: additional `font-medium`.
- "View All News" button: same style as "Explore the collection" on the About page.

#### "More Articles" section

- Background changed from `bg-gray-50` to `bg-white`.
- Heading changed from `font-light` to `font-normal`.
- `RelatedCard` component fully replaced with the same card pattern as the news listing page:
  - Multi-image slideshow (auto-advance, `news-slide-in` CSS transition, same interval range as listing cards)
  - Same layout: image → category · date row → title (`text-[21px] font-medium`) → "Read article →"
  - Navigation via `useRouter().push` instead of `<Link>`
- Grid changed from `sm:grid-cols-3 gap-5` to `grid-cols-3 gap-6` (always 3 columns).

---

## What Changed In The Previous Commit

### News listing page — card redesign and multilingual polish

#### "Read article" button — multilingual

Added `readArticle` key to all three locales in `src/lib/i18n/translations.ts`:

| Locale | Value |
|---|---|
| `en` | `Read article` |
| `ru` | `Читать статью` |
| `tm` | `Makalany oka` |

`NewsCard` now calls `useLanguage()` and renders `{t.news.readArticle}` instead of a hardcoded string.

#### Featured cards — card-style layout

Featured articles previously rendered as full-viewport hero banners with an overlaid frosted-glass text block. They now share the same `NewsCard` component as regular cards, rendered with a `featured` prop that adds:

- **Featured badge** — top-left of the image, `bg-sky-500 text-white rounded-md` (water blue, low radius pill)
- **Description line** — one truncated line of body text below the title (`text-[12px] text-gray-500 truncate`)

All other card anatomy (aspect ratio, category · date row, title, "Read article →") is identical to regular cards.

#### Featured / regular card divider

A thin `<hr className="border-t border-brand-200 mb-16" />` is rendered between the featured grid and the regular grid when both have content.

#### Photo slideshow on featured cards

The multi-image slideshow (auto-advance interval, progress dashes, prev/next buttons, `news-slide-in` CSS transition) previously only ran on regular cards. Featured cards now go through the same `NewsCard` component and therefore get identical slideshow behaviour. The `Link` wrapper used in the old featured JSX was removed; `NewsCard` uses `router.push` via `onClick` for both card types. The `Link` import was removed as it is no longer used.

#### Slideshow timing

| Setting | Before | After |
|---|---|---|
| Auto-advance interval | 2 000 – 5 000 ms | 5 000 – 8 000 ms |
| Slide-in animation duration (`globals.css`) | 1.1 s | 1.6 s |

#### Typography and colour

- Card title size: `text-[18px]` → `text-[21px]` (applied to both regular and featured via `replace_all`)
- All secondary card text (category, date, separator dot, description, "Read article", arrow) changed from `text-brand-400/300/500` (warm beige) to `text-gray-400/300/500` (neutral grey)
- Category · date row added to regular `NewsCard` (previously only on featured cards)

#### Grid bottom spacing

Added `mb-24` to the regular cards grid container so there is adequate breathing room between the last card row and the footer.

#### News seed — multi-image support

`ArticleSeed` type in `src/lib/data/news-seed.ts` changed from single `imageFile` + `mimeType` fields to an `images: ArticleImage[]` array where each entry carries `file`, `dir` (`'media' | 'news-photos'`), and `mimeType`.

`src/seed-news.ts` updated accordingly:

- Added `NEWS_PHOTOS_DIR` → `<cwd>/public/news/photos/`
- `uploadImage` now accepts `dir` and resolves the correct base path; cache key is `dir:file`
- All images uploaded in parallel with `Promise.all`; article `images` field set from the resulting ID array

Image assignment from `public/news/photos/`:

| Article | Category | Images |
|---|---|---|
| Rahatlyk Wins Best Beverage Brand 2025 | Company News | All 3 Company News photos (slideshow) |
| Introducing Our New Sparkling Water Range | Product Updates | Photo (4) |
| New 19-Litre Home & Office Delivery Service | Product Updates | Photo (5) |
| Zero-Waste Packaging by 2026 | Sustainability | Photo (7) |
| Our Annual Water Stewardship Report | Sustainability | Photo (8) |

Remaining Company News articles retain their original `media/` images.

---

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

- Added `src/globals/HomeHero.ts` — Payload Global (Home group) with `video`, `poster`, `title`, `titleAccent`, and `subtitle`. Text fields are localized in `en`, `tm`, and `ru`.
- Hero background uses a full-screen looping `<video>` over a CMS-selected poster. The poster stays visible until the video can play and remains as the fallback if loading fails.
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
- Added `src/collections/CVDocuments.ts` — Payload upload collection. Files written to `cv/` (project root, outside `public/`) with UUID-generated filenames (unpredictable, not guessable). Read access restricted to authenticated users.
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
| Settings | Contact Info (global), Forms (global) |

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
| `/api/cv/[filename]` | Authenticated CV file download — requires active Payload admin session |

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
      cv/[filename]/route.ts
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
    AboutOurStory.ts
    AboutPage.ts
    ContactInfo.ts
    Forms.ts
    HomeCtaBanner.ts
    HomeHero.ts
    HomeStory.ts
    HorizontalScroll.ts
    ProductDetailLabels.ts
  lib/
    contact-info/
      ContactInfoContext.tsx
    data/
      about-content.ts
      about-our-story-content.ts
      forms-content.ts
      hero-content.ts
      home-cta-content.ts
      home-story-content.ts
      horizontal-scroll-content.ts
      product-lines.ts
      products-payload.ts
      vacancies-payload.ts
      news-seed.ts
    email/
    i18n/
    lexical-serialize.tsx
    payload.ts
    payload-normalize.ts
    spam-check.ts
  types/
    payload.ts
  seed.ts
  seed-about.ts
  seed-about-our-story.ts
  seed-forms.ts
  seed-hero.ts
  seed-news.ts
  seed-product-detail-labels.ts
  seed-product-lines.ts
  seed-products.ts
  seed-vacancies.ts
  seed-vacancy-images.ts
```

## Payload CMS

Payload is configured in `payload.config.ts`.

Key points:

- Admin user collection: `users`
- Public read collections: `media`, `product-categories`, `product-lines`, `products`, `article-categories`, `articles`, `vacancy-departments`, `vacancies`
- Authenticated-only collections: `contact-submissions`, `cv-documents`, `vacancy-applications`
- Globals: `about-page`, `about-our-story`, `contact-info`, `forms`, `home-hero`, `horizontal-scroll`, `home-story`, `home-cta-banner`, `product-detail-labels`
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
| `src/seed-about-our-story.ts` | About Our Story global (sectionLabel + story content — 3 locales) |
| `src/seed-forms.ts` | Forms global (labels, placeholders, messages, and all error codes for contact + vacancy forms — 3 locales) |
| `src/seed-hero.ts` | Hero Section global (video + text in 3 locales) |
| `src/seed-product-lines.ts` | Our Collection (5 product lines + images) |
| `src/seed-products.ts` | Products with localized nutrition data (3 locales) |
| `src/seed-product-detail-labels.ts` | ProductDetailLabels global (size, nutrition, about, mineral, per-litre labels — 3 locales) |
| `src/seed-vacancies.ts` | Vacancy departments + 8 vacancies (3 locales, localized arrays) |
| `src/seed-vacancy-images.ts` | Uploads vacancy images and links them to vacancies |
| `src/seed-news.ts` | 3 article categories + 8 articles with images (3 locales) |

#### One-time migrations

| Script | Purpose |
|---|---|
| `src/migrate-article-body-to-richtext.ts` | Casts `articles_body_locales.text` from `varchar` to `jsonb`, wrapping existing strings in Lexical document structure. Run once after pulling the richText body change. |

```bash
npx tsx --env-file=.env.local src/migrate-article-body-to-richtext.ts
```

```bash
npx tsx --env-file=.env.local src/seed-about.ts
npx tsx --env-file=.env.local src/seed-about-our-story.ts
npx tsx --env-file=.env.local src/seed-forms.ts
npx tsx --env-file=.env.local src/seed-hero.ts
npx tsx --env-file=.env.local src/seed-product-lines.ts
npx tsx --env-file=.env.local src/seed-products.ts
npx tsx --env-file=.env.local src/seed-product-detail-labels.ts
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
- Add `badge` and `badgeSub` fields to the `home-story` Payload global so the award badge text is CMS-managed. Current values are in `src/lib/data/home-story-content.ts`.
- Update `.env.example` to include `DATABASE_URI` / `DATABASE_URL` and `PAYLOAD_SECRET`.
- Add rate limiting to `/api/contact` and `/api/vacancy` as an additional layer on top of the honeypot/timing check.

## Quality Notes

- ESLint passes.
- TypeScript `--noEmit` passes.
- The dirty `.claude/worktrees/...` subproject marker is local agent metadata and is not part of the application change set.
