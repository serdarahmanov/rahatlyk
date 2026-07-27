# Learnings From The Sarwan / RAHATLYK Project

This document records the practical lessons from this project so they can be reused on the next one. It is based on the current codebase and the git history from the initial Next.js app through the Payload CMS integration, caching work, security hardening, media/performance work, deployment changes, and the late Safari/GSAP scroll debugging.

## Project Timeline

- The project started as a static Next.js corporate website.
- It grew into a full localized site with products, news, vacancies, contact forms, custom animations, and a large visual home page.
- Payload CMS was added later, which moved most public content, labels, media, email templates, footer, 404/error content, SEO metadata, and page sections into admin-managed globals and collections.
- The routing model changed so locale is part of the URL. This was a major turning point because it made Next.js caching practical per locale.
- A security pass added anti-spam checks, server-side validation, CSV/XSS escaping, CV file validation, private CV storage, auth-protected CV downloads, and security headers.
- Later work focused heavily on performance and mobile Safari stability, especially around GSAP `ScrollTrigger`, Lenis, pinned sections, dynamic browser chrome, safe-area insets, the page intro, and hero image readiness.

## Architecture Lessons

Build the route and data architecture early. Moving from non-localized routes to `/:locale` routes later created a lot of churn across pages, metadata, links, cache keys, revalidation paths, sitemap generation, and language switching. On the next multilingual project, decide the URL model before building the page tree.

Use route groups deliberately. The current app separates the public app under `src/app/(frontend)/[locale]` and Payload under `src/app/(payload)`. That separation is useful because the public website and CMS admin have different layouts, cache behavior, and access rules.

Keep page components server-first where possible. Current page files fetch cached Payload data on the server, normalize it, and pass plain data into client components. This is the right shape for SEO, lower client fetch complexity, and caching.

Normalize CMS data before it reaches complex UI. `src/lib/payload-normalize.ts` prevents UI components from knowing every possible Payload upload/relationship shape. This matters because animation-heavy UI is already complex; it should not also be responsible for CMS shape cleanup.

Avoid temporary names becoming permanent. The code still has some historical names such as `AboutPage` being used for contact page content and an alias route named `site-settings` backed by `contact-info`. Backwards compatibility can be useful, but unclear names become mental tax.

Do not let prototype files and generated assets drift into the main repo unless they are intentionally part of the product. The history shows reference HTML files, generated images, and large media moving in and out. Future projects should define a clear rule for `references/`, source media, optimized media, and generated outputs.

## Payload CMS Lessons

Payload globals are a good fit for one-off page sections and shared labels. This project moved home hero, horizontal scroll, collection content, home story, CTA, brand statement, About sections, footer, error pages, forms, navigation labels, and SEO metadata into globals. That made the public site much easier to edit without code changes.

Collections are better for repeatable entities. Products, articles, vacancies, categories, submissions, CV documents, and users are correctly collections because they need listing, detail pages, relationships, sorting, or admin records.

Admin-managed labels are worth it on multilingual sites. Product detail labels, article labels, vacancy labels, form messages, footer text, navigation labels, 404/error text, and email templates became CMS-managed. This avoids hardcoded translation sprawl and makes the site easier to maintain.

The CMS model should match page ownership. The old `product-lines` collection was replaced by the `our-collection` global because the home collection section behaves like a curated homepage section, not a public product taxonomy. That is a useful lesson: not every repeated UI item needs to be a collection.

Write idempotent seed scripts. This repo has many seed scripts for home, products, news, vacancies, labels, email templates, and About sections. Idempotency lets seeds be safely rerun during deployment and content model changes.

Treat migrations and seeds as separate responsibilities. Migrations define schema/data structure changes; seeds provide useful content. Mixing those responsibilities makes production changes harder to reason about.

## Caching And Revalidation Lessons

URL-based locales made caching practical. Earlier locale state outside the URL would have made cached pages ambiguous. The current `withLocale`, `getValidLocale`, middleware, and `[locale]` routes make cache keys, canonical URLs, and sitemap entries deterministic.

Cache keys must include every dimension that changes output. Current cached queries include locale, page number, category ID, slug, or vacancy ID. This prevents cross-locale or cross-filter data leaks.

Cache tags should map to ownership, not implementation detail. Tags like `home:tm`, `products:ru`, `news:en`, `contact-info`, `footer:en`, and `site-metadata:tm` give Payload hooks a clear way to invalidate affected data.

`unstable_cache` needs explicit invalidation strategy. The project uses a long revalidate window of 345600 seconds, so correctness depends on Payload hooks calling `/api/revalidate`. Without working revalidation, content can stay stale until rebuild.

Revalidation needs both paths and tags. Tags clear cached data functions; paths clear prerendered/ISR page output. For detail pages, the project revalidates route patterns like `/products/[slug]` and `/news/[slug]` on update/delete to avoid stale detail pages.

Create and update need different treatment. The hooks skip detail path revalidation on create because the detail page may not exist in cache yet, but include it on update/delete because stale generated output may already exist.

Do not revalidate `/admin`, `/api`, or Next internals. The revalidate endpoint validates paths and rejects admin/API/_next paths. Keep this kind of guard on any manual revalidation endpoint.

Use constant-time secret comparison. The revalidation endpoint uses `timingSafeEqual`, which is the right pattern for bearer-style secrets.

Log revalidation failures without failing CMS writes. `revalidateNext` warns or logs if env vars are missing or the call fails. That is pragmatic: content saves should not necessarily fail because the frontend was not reachable, but deployment docs must tell you to rebuild or manually revalidate afterward.

## Performance Lessons

Performance is mostly sequencing. The final home page does not load everything immediately. It waits for the page load event and cover image readiness before loading the horizontal-scroll video. Product hover media only loads on desktop hover-capable devices. Hero readiness is explicitly tracked before dismissing the intro.

Use `next/image` priority only for assets that matter for first paint. The project uses priority for important hero/detail/news images but avoids treating every image as urgent.

Use skeletons carefully. `ImageWithShimmer` checks `img.complete` after mount so cached images do not leave a shimmer stuck forever. Always handle the browser-cache path, not only the normal `onLoad` path.

Video needs posters/covers and delayed loading. The home horizontal video waits for its cover image and page load before starting. Product card hover video is desktop-only. This avoids unnecessary mobile bandwidth and CPU use.

Large decorative blur and backdrop effects are expensive. The history includes work around blur overlays, backdrop-filter panels, and animated gradient blobs. Use blur sparingly, promote only what needs it, and test on mobile Safari, not only desktop Chrome.

`will-change` is a tool, not a default. Current code applies it to active moving layers, the horizontal track, and navbar layers. It also removes it from off-screen carousel bottles. Too much `will-change` wastes compositor memory, especially on phones.

Avoid double smoothing. Lenis smooths scroll on desktop. GSAP scrub also smooths animation progress if given a numeric duration. The final horizontal pin uses `scrub: true`, not `scrub: 1`, because two smoothing systems stacked together caused lag and snapping.

Do not load hover media on touch devices. `ProductVisual` checks `(hover: hover) and (pointer: fine) and (min-width: 768px)` before loading hover video or secondary hover images. That prevents wasted bytes on mobile.

Keep layout dimensions stable. Pinned sections and carousels need explicit heights and constraints. If content, images, fonts, or viewport units change during setup, ScrollTrigger will measure the wrong layout and later correct it visibly.

## Animation Lessons

Animations need ownership boundaries. React should own stateful UI state; GSAP should own temporary transforms/opacity for selected DOM nodes. The navbar comments show that imperative writes can desync React's virtual DOM from the real DOM.

Always clean up GSAP triggers. Several components track their created `ScrollTrigger` instances or use `gsap.context()` and kill/revert on unmount. This prevents stale triggers after route changes.

Wait for assets before measuring pins. The home hero waits for required hero images before setting up the hero pin. This prevents the first ScrollTrigger measurement from using an unsettled layout and later causing a jump.

A readiness event should mean the thing is actually ready. `home-hero-ready-and-painted` fires after required hero images are ready, parallax setup is ready, `ScrollTrigger.refresh()` has run, and two animation frames have passed. This is stronger than simply waiting for `load`.

The intro curtain can hide first-load setup, but it cannot fix SPA navigations. A measurement correction hidden behind the intro on the first visit still becomes visible when navigating back to home later without the intro. Fix the underlying timing, not only the initial mask.

Do not rebuild animated text DOM on completion. The brand statement work moved toward permanent JSX-rendered mask spans. Earlier imperative splitting and flattening caused a visible snap because masked lines had different height from plain text.

Use CSS view timelines only with fallback behavior. The global CSS uses `@supports (animation-timeline: view())` and reduced-motion media queries. That pattern is safer than assuming all browsers support scroll-linked CSS animations equally.

Respect `prefers-reduced-motion`. Smooth scrolling and several CSS animations opt out for reduced motion. This should be part of the default checklist for animation-heavy work.

## Mobile Safari And Scroll Lessons

Mobile Safari viewport units are not stable during browser chrome movement. The commit history shows experiments with `100lvh`, `100svh`, `window.innerHeight`, `visualViewport`, and frozen JS-measured heights. The final lesson is to measure carefully and avoid refreshing pins during toolbar animation.

`overflow: hidden` can break iOS scroll recovery. The page intro now locks scroll by pinning `body` with `position: fixed`, `top`, `left`, `right`, `width`, `touchAction`, and `overscrollBehavior`. This avoids tearing down Safari's native scroll view.

Unlock scroll at animation start, not only `onComplete`. The intro dispatches completion as the curtain slide starts. JS `onComplete` can be delayed behind main-thread work even when the visual animation has finished.

Avoid global `ScrollTrigger.refresh()` during intro unlock. A global refresh remeasures every pin synchronously. On Safari this caused visible freezes. Let individual sections refresh themselves when they mount or when their local layout actually changes.

Do not refresh pins on every mobile viewport resize. `ScrollTrigger.config({ ignoreMobileResize: true })` exists because Safari toolbar show/hide can emit resize-like changes that should not cause active pinned sections to remeasure.

Skip Lenis on touch devices. Native mobile momentum plus Lenis plus GSAP pinning produced jitter. The current solution uses Lenis only on non-touch devices and uses `ScrollTrigger.normalizeScroll({ allowNestedScroll: true })` on touch devices.

Register GSAP Observer before `normalizeScroll`. `normalizeScroll()` uses Observer internally; the project explicitly imports and registers `gsap/Observer` to avoid runtime errors.

Safe-area handling must be structural, not decorative. The navbar uses a separate fixed safe-area strip outside the header so the notch/Dynamic Island area remains covered even when the header itself translates away.

Navbar show/hide should have hysteresis. The final navbar logic uses an anchor scroll position, an 8px hide threshold, a 16px reveal threshold, and a dead zone. Comparing only current frame to previous frame made slow scrolls unreliable and Safari toolbar settling could falsely reveal the header.

`anticipatePin` is context-dependent. It can help native mobile scroll avoid a flash at pin start, but with Lenis desktop scroll it saw eased velocity rather than real input and caused a one-time snap. The final code uses it only on touch devices for the horizontal pin.

`pinType: transform` was not the final fix. It was tried for mobile Safari pin jumps, then removed after `normalizeScroll` and `ignoreMobileResize` became the better solution. Keep experiments documented, but do not assume a workaround is correct just because it hides one symptom.

## Media And Asset Lessons

Optimize media before building around it. The project moved from large/raw media to optimized WebP images and smaller MP4s. Performance work is harder if the visual design depends on oversized source files.

Keep production media deployment explicit. The app uses Next standalone output and Payload local uploads. Vercel needed `outputFileTracingIncludes` for `media` in API routes; VPS standalone deploys need `.next/standalone`, `.next/static`, `public`, and persistent `media`.

Linux file paths are case-sensitive. The README already calls this out. It matters because media filenames include spaces, capitalization, and generated names.

Long-lived immutable media cache is good only for immutable URLs. The config sends `Cache-Control: public, max-age=31536000, immutable` for Payload media. If a file can be replaced at the same URL, users may see stale assets for a long time.

Separate public media from private uploads. Public media lives in Payload media routes and is cacheable. CV files live in `cv`/`cv-documents`, are authenticated, and use `private, no-cache`.

## Forms And Security Lessons

Never trust client-side validation alone. The contact and vacancy API routes repeat required field checks, email validation, field length limits, locale validation, vacancy ID validation, file type checks, and max file size checks.

Match client max lengths to server max lengths. The history added client `maxLength` attributes after server limits. Do both from the beginning so users get immediate feedback and the server remains authoritative.

Honeypot plus timing checks are cheap spam protection. `isSpam(website, loadedAt)` silently returns success for suspected bots, avoiding useful feedback to bots while keeping user-facing behavior clean.

Escape for every output context. Email HTML uses HTML escaping; stored submission text uses CSV sanitization to reduce spreadsheet formula injection risk. The needed escaping depends on where the data goes.

Validate file content, not only extension or browser MIME type. The vacancy route checks declared MIME type, size, and `file-type` detection from file bytes. That catches mismatches before email attachment/storage.

Use unpredictable names for uploaded private documents. Vacancy CV uploads are stored with `randomUUID()` filenames instead of user-supplied names.

Make sensitive collections admin-only. Contact submissions, vacancy applications, and CV documents disallow public creation through Payload access and are created only by controlled API routes.

Protect private file downloads with Payload auth. `/api/cv/:filename` verifies an authenticated Payload user before reading the file, strips path traversal with `path.basename`, and sends `X-Content-Type-Options: nosniff`.

Add security headers at the framework level. `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy` are set globally in `next.config.ts`.

## SEO And Localization Lessons

Canonical URLs and alternates must be generated from the same locale helpers used by routing. This project uses `withLocale`, `buildLanguageAlternates`, and `buildLocalizedLanguageAlternates` so metadata, sitemap, and links agree.

The public language code for Turkmen is `tk`, even though the internal locale is `tm`. The metadata helper maps `tm` to `tk` for language alternates.

Localized slugs need localized alternates. Product and article detail pages use cached localized slug maps so `hreflang` points to the correct translated slug, not just the same slug with a different prefix.

Generate sitemap entries from CMS data, but tolerate CMS failures. The sitemap uses `Promise.allSettled`; static pages are still returned if product/news slug queries fail.

Keep metadata CMS-managed but with safe fallbacks. Page metadata tries Payload first and falls back to hardcoded localized titles/descriptions if CMS data is unavailable.

Use JSON-LD at the layout level for organization/site identity. The root layout emits Organization and WebSite schema using CMS metadata where available.

Middleware affects SEO and caching. The default locale is rewritten so `/` serves Turkmen content while explicit `/tm` returns 404. This is intentional and must be understood before changing canonical links or sitemap output.

## Deployment Lessons

Standalone Next output changes deployment responsibilities. `output: 'standalone'` means the server bundle is separate from `.next/static`, `public`, and uploaded media. Missing one of these causes production-only failures.

Vercel and VPS builds do not have the same media behavior. Vercel needs file tracing hints for media used by Payload API routes. VPS deployment relies on copying/persisting the media folder.

Environment variables are part of the app contract. `DATABASE_URI`/`DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL`, `NEXT_APP_URL`, `REVALIDATION_SECRET`, Gmail credentials, sender emails, and Google Maps key all affect runtime behavior.

Revalidation can silently be skipped if env vars are missing. Seeds may succeed while pages remain stale. Deployment checklists should include confirming `NEXT_APP_URL` and `REVALIDATION_SECRET`.

Keep `.next` cache in mind. The README notes that stale generated pages may require clearing `.next` before rebuilding. This matters after seed/data changes.

## Debugging Lessons

Read the code and history before changing behavior. The late commit history shows many small experiments around the same Safari issue. Without reading that sequence, it is easy to reintroduce a previously failed fix.

Commit messages became a useful debugging log. Several commits explain exactly what was changed and why, especially around ScrollTrigger, safe-area handling, viewport-fit, and navbar thresholds. Write future commit messages with this level of diagnostic detail when debugging subtle browser bugs.

Use feature flags temporarily, but remove or document them. `DISABLE_HOME_HERO_FOR_TEST` remains in the code set to `false`. Temporary flags are useful during isolation, but they should not become unclear production switches.

Debug overlays should be explicit. `ViewportDebugOverlay` only appears when `?debug-viewport` is present. That is a good pattern for production-safe diagnostics.

Test the real failure environment. Many scroll issues here were Safari/iOS-specific and did not map cleanly to desktop Chrome behavior. For animation-heavy sites, browser/device testing is not optional.

Debug by isolating one moving part at a time. The history shows tests removing the wave divider, disabling the hero, changing pin behavior, changing viewport units, and adjusting intro timing. That is the right method for complex scroll bugs.

Keep known failed approaches in the learning document. For this project, failed or reverted approaches included relying on `overflow:hidden` scroll lock, global refresh on intro unlock, `pinType:'transform'` as the universal fix, `scrub: 1` with Lenis, visualViewport-driven refreshes during toolbar movement, and flattening animated text DOM after animation.

## Practical Checklist For The Next Project

Decide early:

- Locale URL strategy, default locale behavior, canonical URLs, and `hreflang`.
- CMS globals vs collections.
- Public media vs private upload storage.
- Deployment target: Vercel, VPS standalone, or both.
- Whether complex scroll animation is worth the maintenance cost on mobile.

Build early:

- A central locale helper.
- A central cached query layer.
- Cache tag naming conventions.
- Payload revalidation hooks.
- A secure revalidation endpoint.
- Normalizers between CMS data and UI.
- Seed scripts that can be rerun safely.
- Metadata and sitemap generation.
- A device/browser test matrix.

For animation-heavy pages:

- Load only critical first-paint assets immediately.
- Wait for images/fonts before measuring pinned layouts.
- Use one scroll-smoothing owner per device class.
- Skip Lenis on touch devices unless proven safe.
- Use `scrub: true` when scroll position is already smoothed.
- Avoid global refreshes during page transitions.
- Add reduced-motion behavior from the start.
- Clean up all GSAP tweens/triggers on unmount.
- Test first load, reload, route navigation away/back, orientation change, and mobile browser chrome show/hide.

For forms:

- Validate on the client for UX.
- Validate again on the server for security.
- Put all user-facing backend error codes in CMS/localized labels.
- Use honeypot and timing spam checks.
- Escape HTML for emails.
- Sanitize values stored for spreadsheet/admin export.
- Validate uploaded file size, declared MIME type, and actual file bytes.
- Keep private files behind authenticated routes.

For performance:

- Optimize media before integrating it.
- Use posters/covers for video.
- Defer non-critical video loading.
- Only preload/priority-load true above-the-fold assets.
- Do not load hover-only media on touch devices.
- Limit `will-change` to active animated elements.
- Avoid large blur/backdrop-filter layers unless measured on mobile.
- Keep layout dimensions stable for cards, pins, and galleries.

## Current Project State To Remember

- Branch: `main`.
- Latest inspected commit: `c0d6df7` (`Split brand section heading across lines and improve reveal reliability`).
- Worktree had three deleted tracked PDFs under `cv/` before this document was created. They were not touched.
- The app is currently a localized Next.js 15 + Payload 3 site with server-side cached Payload queries, hook-driven revalidation, static metadata/sitemap support, security-hardened form APIs, and a heavily tuned GSAP/Lenis animation layer.
- The most fragile area remains home-page scroll animation on mobile Safari because it combines pinned sections, safe-area layout, intro timing, responsive images, dynamic browser chrome, and route transitions.
