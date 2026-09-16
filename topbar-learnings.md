# Top Bar Loading Learnings

## Purpose

A top progress bar gives immediate feedback during client-side navigation without replacing the current page content. This is different from Next.js `loading.tsx`, which renders a route-segment fallback while server content is loading.

## Current Project Approach

The project currently uses custom navigation progress logic:

- It starts when an internal link is clicked.
- It also starts for programmatic navigation, such as language changes.
- It completes when the pathname changes.
- GSAP animates the thin bar across the top of the screen.

This approach is valid for a branded, highly customized progress bar. Its main drawback is that link detection and navigation completion are maintained manually.

## Common Package Options

### 1. `nextjs-toploader`

This is probably the simplest and most popular option for a thin top progress bar. It supports the Next.js App Router and provides an App Router-compatible `useRouter` import for programmatic navigation.

```bash
npm install nextjs-toploader
```

Basic setup:

```tsx
import NextTopLoader from 'nextjs-toploader';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NextTopLoader showSpinner={false} />
        {children}
      </body>
    </html>
  );
}
```

### 2. `next-nprogress-bar`

Another well-known option. It supports both the `/app` and `/pages` routers and provides `AppProgressBar` for the App Router.

```bash
npm install next-nprogress-bar
```

### 3. `@bprogress/next`

A newer alternative that supports both the App Router and Pages Router. Its documentation also describes migration from `next-nprogress-bar`.

```bash
npm install @bprogress/next
```

## Recommended Option

For this project, evaluate `nextjs-toploader` first. It matches the existing behavior closely and can remove most of the custom click and pathname tracking logic.

## Customizing `nextjs-toploader`

`nextjs-toploader` can be customized to match the project design. Common options include:

- `color`: bar color
- `height`: bar thickness
- `showSpinner`: whether to show a spinner
- `speed`: completion animation speed
- `crawlSpeed`: simulated progress speed
- `easing`: animation easing
- `shadow`: bar shadow
- `zIndex`: stacking order
- `showAtBottom`: whether to render at the bottom instead

Example matching a minimal thin top bar:

```tsx
<NextTopLoader
  color="#0a23a5"
  height={2}
  showSpinner={false}
  shadow={false}
  zIndex={9999}
  speed={300}
  crawlSpeed={200}
  easing="ease"
/>
```

## Decision Guidance

Use the current custom implementation when the progress bar needs project-specific GSAP animation or behavior tightly integrated with the site intro and navigation animation.

Use `nextjs-toploader` when the goal is a conventional top bar with less code and lower maintenance. It is not a replacement for `loading.tsx`; both can be used together when route-level loading content and navigation feedback are both needed.

