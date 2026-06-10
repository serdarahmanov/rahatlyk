# RAHATLYK — Corporate Website

Official corporate website for **RAHATLYK**, a Turkmen water and beverage company.

## Platform & Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Language | TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Animations | [GSAP](https://gsap.com/) + ScrollTrigger |
| Images | Next.js `<Image>` (optimised) |
| Fonts | Google Fonts via `next/font` |
| Internationalisation | Custom context (`src/lib/i18n/`) — Turkmen, Russian & English |
| Email | Nodemailer + Gmail SMTP (contact & vacancy forms) |

## Features

- **Multi-language support** — Turkmen (`tm`), Russian (`ru`) and English (`en`) with a dropdown language switcher in the Navbar visible at all breakpoints.
- **Full-screen mobile menu** — frosted-glass overlay with large nav links, social icons (Instagram, email), and smooth open/close transitions.
- **Product Catalogue** — filterable grid with category tabs; individual product detail pages with image gallery (prev/next arrows appear only when a product has more than one photo).
- **News / Blog** — filterable by category (Company, Health, Products, Sustainability); featured article banner; individual article pages with sidebar and "More Articles" section. Homepage news section is a full-viewport auto-play infinite carousel.
- **Vacancies** — filterable by department; individual vacancy detail pages with rich job description and "Other Openings" sidebar.
- **Contact & Vacancy forms** — minimalist design (gray-fill inputs, no labels, black submit button); server-side email handling via `/api/contact` and `/api/vacancy` routes; sends a confirmation email to the user and a notification email with CV attachment to the company.
- **URL-driven filtering** — all listing pages (`/products`, `/news`, `/vacancies`) read their active filter from query params (`?category=`, `?department=`) so category links from detail pages deep-link directly to the filtered view.
- **Responsive design** — mobile-first, fully responsive across all breakpoints. Footer link groups display in a 2-column grid on mobile.
- **GSAP animations** — hero word-mask reveals, scroll-triggered section entrances, staggered card animations, smooth carousel transitions, and pinned horizontal scroll section.
- **Live water gradient** — animated CSS blob gradient on the CTA banner, about-page stats band, and collection panels using layered radial blurs with keyframe drift + pulse animations.
- **Global typography** — site-wide `font-light` / `font-normal` weight system for a clean, editorial feel.

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, brand statement, horizontal scroll showcase, collections carousel, full-viewport news carousel, CTA banner |
| `/about` | About — parallax hero, live-gradient stats band (20+ years, 50+ products, 5M+ customers), story timeline, mission, values, team |
| `/products` | Products listing with category filter |
| `/products/[id]` | Product detail with image gallery |
| `/news` | News listing — featured article banner + iPhone-style portrait card grid with category filter |
| `/news/[id]` | Article detail with sidebar & related articles |
| `/vacancies` | Vacancies listing with department filter |
| `/vacancies/[id]` | Vacancy detail with application form |
| `/contact` | Contact page with minimalist form & contact info |

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
