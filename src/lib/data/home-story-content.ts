/**
 * Current content for the "Our Story" home section.
 * Copy these values into the "Our Story Section" global in Payload Admin.
 *
 * For the image: upload /public/reference/62e2cf43262eaf2729f83b11_4.jpg
 * to Payload Media first, then set the media relationship.
 */
export const HOME_STORY_CONTENT = {
  // Upload: /public/reference/62e2cf43262eaf2729f83b11_4.jpg → Media
  image: '/reference/62e2cf43262eaf2729f83b11_4.jpg',
  tag: {
    en: 'Our Story',
    tm: 'Biziň taryhymyz',
    ru: 'Наша история',
  },
  title: {
    en: 'Born from the Heart of Turkmenistan',
    tm: 'Türkmenistanyň kalbyndan doglan',
    ru: 'Рождённый в сердце Туркменистана',
  },
  text: {
    en: 'For over two decades, RAHATLYK has been bringing the purest waters and most refreshing beverages to families across Central Asia. Our commitment to quality is matched only by our love for the land.',
    tm: '20 ýyldan gowrak wagt bäri RAHATLYK Merkezi Aziýadaky maşgalalara iň arassa suwlary we sergin içgileri hödürleýär.',
    ru: 'Более двух десятилетий RAHATLYK поставляет чистейшую воду и освежающие напитки семьям по всей Центральной Азии. Наша преданность качеству безгранична.',
  },
  // Award badge (bottom-right corner of the section — hardcoded for now)
  badge: 'Best Beverage Brand',
  badgeSub: 'Central Asia Award 2025',
}
