/**
 * Current content for the Hero section.
 * Media files are uploaded to Payload Media by src/seed-hero.ts.
 */
export const HERO_CONTENT = {
  desktopPoster: {
    filename: 'Rahatly-hero section video cover image-desktop.webp',
    path: 'public/home page/hero section/webp/Rahatly-hero section video cover image-desktop.webp',
    mimetype: 'image/webp',
    alt: 'Home hero desktop cover image',
  },
  mobilePoster: {
    filename: 'Rahatly-hero section video cover image-mobile.webp',
    path: 'public/home page/hero section/webp/Rahatly-hero section video cover image-mobile.webp',
    mimetype: 'image/webp',
    alt: 'Home hero mobile cover image',
  },
  parallaxImages: Array.from({ length: 15 }, (_, index) => {
    const filename = `${index + 1}.webp`
    return {
      fileName: filename,
      filename,
      path: `public/home page/hero section/hero parallax/${filename}`,
      mimetype: 'image/webp',
      alt: `Home hero parallax image ${index + 1}`,
    }
  }),
  bottleImage: {
    fileName: 'bottle.webp',
    filename: 'bottle.webp',
    path: 'public/home page/hero section/hero parallax/bottle.webp',
    mimetype: 'image/webp',
    alt: 'Home hero bottle image',
  },
  mobileBottleImage: {
    fileName: 'bottle-mobile.webp',
    filename: 'bottle-mobile.webp',
    path: 'public/home page/hero section/hero parallax/bottle-mobile.webp',
    mimetype: 'image/webp',
    alt: 'Home hero mobile bottle image',
  },
  title: {
    en: 'Pure Nature,',
    ru: 'Чистая природа,',
    tm: 'Arassa tebigat,',
  },
  titleAccent: {
    en: 'Pure Life',
    ru: 'Чистая жизнь',
    tm: 'Arassa ýaşaýyş',
  },
  subtitle: {
    en: 'Premium beverages crafted from the finest natural sources of Turkmenistan',
    ru: 'Премиальные напитки из лучших природных источников Туркменистана',
    tm: 'Türkmenistanyň iň arassa tebigy çeşmelerinden öndürilen premium içgiler',
  },
}
