# RAHATLYK — Corporate Website

Official corporate website for **RAHATLYK**, a Turkmen water and beverage company.

## Platform & Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Language | TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Animations | [GSAP](https://gsap.com/) + ScrollTrigger |
| Smooth scrolling | [Lenis](https://lenis.darkroom.engineering/) |
| Images | Next.js `<Image>` (optimised) |
| Fonts | Google Fonts via `next/font` |
| Internationalisation | Custom context (`src/lib/i18n/`) — Turkmen, Russian & English |
| Email | Nodemailer + Gmail SMTP (contact & vacancy forms) |

## Features

- **Multi-language support** — Turkmen (`tm`), Russian (`ru`) and English (`en`) with a dropdown language switcher in the Navbar visible at all breakpoints.
- **Full-screen mobile menu** — frosted-glass overlay with large nav links, social icons (Instagram, email), and smooth open/close transitions.
- **Product Catalogue** — filterable grid with category tabs; individual product detail pages with image gallery (prev/next arrows appear only when a product has more than one photo).
- **News / Blog** — filterable by category (Company, Health, Products, Sustainability); featured article banner; individual article pages with sidebar and "More Articles" section. Homepage news section is a full-viewport auto-play infinite carousel.
- **Vacancies** — filterable by department; individual vacancy detail pages with rich job description, salary icon in the header, and "Other Openings" cards matching the main vacancies grid.
- **Contact & Vacancy forms** — custom JS validation with `noValidate`; per-field red ring + inline error messages; errors clear on field focus and auto-dismiss after 5 seconds; labeled fields with red asterisks for required; black submit button; in-flight submit locking to prevent duplicate requests; server-side email handling via `/api/contact` and `/api/vacancy` routes; sends a confirmation email to the user and a notification email with CV attachment to the company.
- **Apple-style vacancy cards** — department-coloured gradient header, coloured dot + department badge, salary with icon, two-line description, location pin; reused on vacancy detail recommendations with subtle lift + shadow on hover matching the `vacancy-cards-apple-v2` reference design.
- **Unified `FilterBar` component** — `src/components/FilterBar.tsx`; shared across Products, News, and Vacancies pages; mobile: horizontally scrollable pill strip with floating gradient arrow overlays (left/right); desktop: exposed via `forwardRef` for GSAP animations; grey pill palette (active: `bg-gray-900`, inactive: `border-gray-300 text-gray-500`).
- **Contact page two-column layout** — 65/35 split; left: heading + labeled contact form; right: sticky full-height panel reusing the about-page blob gradient (`about-mosaic-*` classes) with GSAP parallax scrub; contact info items (address, phone, email, hours) in solid white over the gradient.
- **URL-driven filtering** — all listing pages (`/products`, `/news`, `/vacancies`) read their active filter from query params (`?category=`, `?department=`) so category links from detail pages deep-link directly to the filtered view.
- **Responsive design** — mobile-first, fully responsive across all breakpoints. Footer link groups display in a 2-column grid on mobile, with legal policy links intentionally omitted.
- **GSAP animations** — hero word-mask reveals, scroll-triggered section entrances, staggered listing cards, filter entrances, smooth carousel transitions, pinned horizontal scroll, brand-statement word-mask reveal, and custom about-page interactions.
- **Lenis smooth scrolling** — global smooth-scroll layer integrated with ScrollTrigger refreshes.
- **Reference-led About page** — cinematic sticky image hero, scroll-darkened intro, scroll-revealed brand statement, full-viewport parallax imagery, timeline story cards, GSAP-driven mosaic rows, interactive certificates, mood selector, and a one-viewport closing link/wordmark screen.
- **Unified listing pages** — Products, News, and Vacancies share the same title/filter structure, selected-filter button treatment, and GSAP-managed card reveal behavior.
- **Reference-style header** — transparent over hero imagery, hidden background at the top of hero pages, and a blurred panel/bottom stroke that transitions in on scroll. The About page keeps the same visual treatment while hiding on scroll down and reappearing on scroll up.
- **Live water gradient** — animated CSS blob gradient on the CTA banner, about-page stats band, and collection panels using layered radial blurs with keyframe drift + pulse animations.
- **Global typography** — site-wide `font-light` / `font-normal` weight system for a clean, editorial feel.

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, brand statement, horizontal scroll showcase, collections carousel, full-viewport news carousel, CTA banner |
| `/about` | About — cinematic sticky hero, word-mask title, company story, parallax image section, timeline cards, mosaic rows, certificates, mood selector, and one-viewport closing screen. The shared footer is intentionally hidden on this route. |
| `/products` | Products listing with category filter |
| `/products/[id]` | Product detail with image gallery |
| `/news` | News listing — featured article banner + iPhone-style portrait card grid with category filter |
| `/news/[id]` | Article detail with sidebar & related articles |
| `/vacancies` | Vacancies listing with department filter |
| `/vacancies/[id]` | Vacancy detail with application form |
| `/contact` | Contact page — two-column 65/35 split; left: labeled form; right: sticky blob-gradient panel with contact info |

## Project Structure

```
src/
├── app/
│   ├── page.tsx               # Home page
│   ├── about/page.tsx         # About page
│   ├── products/
│   │   ├── page.tsx           # Products listing
│   │   └── [id]/page.tsx      # Product detail
│   ├── news/
│   │   ├── page.tsx           # News listing
│   │   └── [id]/page.tsx      # Article detail
│   ├── vacancies/
│   │   ├── page.tsx           # Vacancies listing
│   │   └── [id]/page.tsx      # Vacancy detail + application form
│   ├── contact/page.tsx       # Contact form
│   ├── api/
│   │   ├── contact/route.ts   # Contact form email handler
│   │   └── vacancy/route.ts   # Vacancy application email handler (with CV attachment)
│   ├── layout.tsx             # Root layout (Navbar, Footer, fonts, metadata)
│   └── globals.css            # Global styles, Tailwind theme, animation keyframes
├── components/
│   ├── Navbar.tsx             # Sticky navigation — desktop dropdown + full-screen mobile overlay
│   ├── Footer.tsx             # Site footer with links & social icons
│   ├── FilterBar.tsx          # Unified filter pill bar (mobile scroll + desktop forwardRef for GSAP)
│   └── ProductVisual.tsx      # Product image component (sm card / lg detail modes)
└── lib/
    ├── i18n/
    │   ├── LanguageContext.tsx # Language provider & useLanguage hook
    │   └── translations.ts    # All UI strings (tm / ru / en)
    ├── email/
    │   ├── templates.ts       # HTML email templates (warm brand palette)
    │   └── i18n.ts            # Email copy in tm / ru / en
    └── data/
        ├── products.ts        # Product catalogue data
        ├── news.ts            # News articles data
        └── vacancies.ts       # Job openings data
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
NOREPLY_EMAIL=noreply@yourdomain.com
WEBSITE_EMAIL=website@yourdomain.com
```

## Build & Deploy

```bash
npm run build
npm start
```

The project is a standard Next.js app and can be deployed to **Vercel**, **Netlify**, or any Node.js hosting environment.

## Quality Checks

Use these commands before committing or deploying:

```bash
npm run lint
npm run build
```

On Windows PowerShell, if `npm.ps1` is blocked by the execution policy, use the command shim instead:

```powershell
npm.cmd run lint
npm.cmd run build
```

Current validation status:

- ESLint passes without errors or warnings.
- Production build passes with Next.js 16.2.7 and Turbopack.
- ESLint ignores `.claude/**` so local agent worktrees are not checked as project source.
- React hook updates avoid synchronous state writes inside effects where Next.js/React lint rules flag them.
- Latest checked commands: `npm.cmd run lint` and `npm.cmd run build`.

## Brand Colours

The site uses a warm black / beige / white `brand` palette defined in `globals.css`:

| Token | Hex | Usage |
|---|---|---|
| `brand-50` | `#faf8f4` | Warm off-white backgrounds |
| `brand-100` | `#f0e8d8` | Light cream fills & borders |
| `brand-200` | `#dfd0b8` | Soft beige dividers |
| `brand-300` | `#c8ad88` | Warm tan accents |
| `brand-400` | `#a88e6a` | Secondary text, labels |
| `brand-500` | `#8a7256` | Mid warm tone |
| `brand-600` | `#6e5a44` | Hover states |
| `brand-700` | `#524030` | Dark warm |
| `brand-800` | `#382c22` | Very dark warm |
| `brand-900` | `#1e1611` | Near-black warm |
| `brand-950` | `#0f0b07` | Almost black — headings & primary text |
