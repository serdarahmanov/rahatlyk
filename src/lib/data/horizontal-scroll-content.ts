/**
 * Current content for the Horizontal Scroll section.
 * Copy these values into the "Horizontal Scroll" global in Payload Admin.
 *
 * For images (box1, box3, box5): upload the file from public/reference/
 * to Payload Media first, then set the media relationship.
 */
export const HORIZONTAL_SCROLL_CONTENT = {
  box1: {
    // Upload: /public/reference/KarunaJuice_Photo_RainbowlFoods.jpg → Media
    image: '/reference/KarunaJuice_Photo_RainbowlFoods.jpg',
  },
  box2: {
    tag: {
      en: 'PRISTINE BY NATURE',
      tm: 'PRISTINE BY NATURE',
      ru: 'PRISTINE BY NATURE',
    },
    headline: {
      en: 'Purity you can taste — straight from the source',
      tm: 'Purity you can taste — straight from the source',
      ru: 'Чистота, которую можно попробовать — прямо из источника',
    },
  },
  box3: {
    // Upload: /public/reference/Smoothie-Drink-Product-Photography-Studio-in-London-Innocent-Smoothies-Neve-Studios-1.webp → Media
    image: '/reference/Smoothie-Drink-Product-Photography-Studio-in-London-Innocent-Smoothies-Neve-Studios-1.webp',
  },
  box4: {
    // Background gradient is static/hardcoded — not managed in Payload
    text: {
      en: 'Discover our story and what drives us',
      tm: 'Biziň taryhymyzy we bizi herekete getirýän zady açyň',
      ru: 'Узнайте нашу историю и то, что нас движет',
    },
    buttonLabel: {
      en: 'Our Story',
      tm: 'Biziň taryhymyz',
      ru: 'Наша история',
    },
    buttonHref: '/about',
  },
  box5: {
    // Upload: /public/reference/New-250ml-Juice-Banner-Website.jpg → Media
    image: '/reference/New-250ml-Juice-Banner-Website.jpg',
    tag: {
      en: 'CENTURIES OF FILTRATION',
      tm: 'ASYRLAR BOÝY FILTRLEME',
      ru: 'СТОЛЕТИЯ ФИЛЬТРАЦИИ',
    },
    headline: {
      en: 'Each sip delivers a purity you can feel',
      tm: 'Her owurt duýup boljak arassalygy getirýär',
      ru: 'Каждый глоток несёт чистоту, которую можно почувствовать',
    },
  },
  box6: {
    tag: {
      en: 'EXPLORE MORE',
      tm: 'GIŇIŞLEÝIN GÖRÜŇ',
      ru: 'УЗНАТЬ БОЛЬШЕ',
    },
    headline: {
      en: 'Clean water, real refreshment',
      tm: 'Arassa suw, hakyky serginlik',
      ru: 'Чистая вода, настоящее освежение',
    },
    buttonLabel: {
      en: 'Explore',
      tm: 'Giňişleýin',
      ru: 'Подробнее',
    },
    buttonHref: '/products',
  },
}
