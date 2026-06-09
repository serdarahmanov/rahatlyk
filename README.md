# RAHATLYK — Corporate Website

Official corporate website for **RAHATLYK**, a Turkmen water and beverage company.

## Platform & Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Animations | [GSAP](https://gsap.com/) + ScrollTrigger |
| Images | Next.js `<Image>` (optimised) |
| Fonts | Google Fonts via `next/font` |
| Internationalisation | Custom context (`src/lib/i18n/`) — Turkmen & Russian |

## Features

- **Multi-language support** — Turkmen (`tk`) and Russian (`ru`) with a language switcher in the Navbar.
- **Product Catalogue** — filterable grid with category tabs; individual product detail pages with image gallery (prev/next arrows appear only when a product has more than one photo).
- **News / Blog** — filterable by category (Company, Health, Products, Sustainability); featured article banner; individual article pages with sidebar and "More Articles" section.
- **Vacancies** — filterable by department; individual vacancy detail pages with rich job description and "Other Openings" sidebar.
- **URL-driven filtering** — all listing pages (`/products`, `/news`, `/vacancies`) read their active filter from query params (`?category=`, `?department=`) so category links from detail pages deep-link directly to the filtered view.
- **Responsive design** — mobile-first, fully responsive across all breakpoints.
- **GSAP animations** — hero entrances, scroll-triggered reveals, staggered card animations, and smooth carousel transitions.

## Project Structure

```
src/
├── app/
│   ├── page.tsx               # Home page (hero, brand statement, collections carousel, news, etc.)
│   ├── products/
│   │   ├── page.tsx           # Products listing with category filter
│   │   └── [id]/page.tsx      # Product detail with image gallery
│   ├── news/
│   │   ├── page.tsx           # News listing with category filter
│   │   └── [id]/page.tsx      # Article detail with sidebar & related articles
│   ├── vacancies/
│   │   ├── page.tsx           # Vacancies listing with department filter
│   │   └── [id]/page.tsx      # Vacancy detail with other openings
│   ├── contact/page.tsx       # Contact page
│   ├── layout.tsx             # Root layout (Navbar, fonts, metadata)
│   └── globals.css            # Global styles & Tailwind theme (brand colours, etc.)
├── components/
│   ├── Navbar.tsx             # Sticky navigation with language switcher
│   └── PageIntro.tsx          # Reusable page hero component
└── lib/
    ├── i18n/
    │   ├── LanguageContext.tsx # Language provider & useLanguage hook
    │   └── translations.ts    # All UI strings in Turkmen and Russian
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

## Build & Deploy

```bash
npm run build
npm start
```

The project is a standard Next.js app and can be deployed to **Vercel**, **Netlify**, or any Node.js hosting environment.

## Brand Colours

The site uses a custom `brand` colour palette defined in `globals.css`:

- `brand-50` — lightest background tint
- `brand-100` / `brand-200` — subtle fills & borders
- `brand-400` / `brand-500` / `brand-600` — mid tones (secondary text, accents)
- `brand-700` / `brand-800` — interactive states
- `brand-950` — near-black headings & primary text
