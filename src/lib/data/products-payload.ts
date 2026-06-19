export const PRODUCT_CATEGORIES = [
  {
    slug: 'still-water',
    label: { en: 'Still Water', tm: 'Gazsyz Suw', ru: 'Негазированная вода' },
  },
  {
    slug: 'mineral-water',
    label: { en: 'Mineral Water', tm: 'Mineral Suw', ru: 'Минеральная вода' },
  },
  {
    slug: 'juice',
    label: { en: 'Juice', tm: 'Şire', ru: 'Сок' },
  },
  {
    slug: 'functional',
    label: { en: 'Functional Drinks', tm: 'Funksiýaly Içgiler', ru: 'Функциональные напитки' },
  },
]

type LocaleMap = { en: string; tm: string; ru: string }

export type ProductSeedEntry = {
  nameEn:    string
  category:  string
  date:      string
  photos:    { folder: string; filename: string; mimetype: string }[]
  video?:    { folder: string; filename: string }
  name:            LocaleMap
  tagline:         LocaleMap
  description:     LocaleMap
  longDescription: LocaleMap
  nutrition: { label: LocaleMap; value: LocaleMap }[]
  volumes:   string[]
}

export const PRODUCTS_SEED: ProductSeedEntry[] = [
  // ── 1 · Still Water ───────────────────────────────────────────────
  {
    nameEn:   'Still Water',
    category: 'still-water',
    date:     '2026-06-17',
    photos: [
      { folder: '1', filename: 'still water (1).png', mimetype: 'image/png' },
      { folder: '1', filename: 'still water (2).png', mimetype: 'image/png' },
      { folder: '1', filename: 'still water (3).png', mimetype: 'image/png' },
    ],
    name:    { en: 'Still Water',          tm: 'Gazsyz Suw',       ru: 'Негазированная вода' },
    tagline: { en: 'Pure hydration for every moment.', tm: 'Her pursat üçin arassa täzelik.', ru: 'Чистая свежесть для каждого момента.' },
    description: {
      en: 'Clean, soft and refreshing still water for everyday hydration.',
      tm: 'Gündelik suwuklyk deňagramlylygy üçin arassa, ýumşak we serginlediji gazsyz suw.',
      ru: 'Чистая, мягкая и освежающая негазированная вода для ежедневного питья.',
    },
    longDescription: {
      en: 'Still Water is created for simple, clean refreshment throughout the day. With its smooth taste and light character, it is ideal for work, sport, travel, meals or quiet moments of rest. Available in practical 0.5 L and 1 L formats.',
      tm: 'Gazsyz Suw günüň dowamynda ýönekeý we arassa serginlik üçin döredildi. Ýumşak tagamy we ýeňil häsiýeti bilen işde, sportda, ýolda, nahar wagtynda ýa-da dynç alyş pursatlarynda amatlydyr. 0.5 L we 1 L görnüşlerinde hödürlenýär.',
      ru: 'Негазированная вода создана для чистого и лёгкого освежения в течение дня. Благодаря мягкому вкусу она подходит для работы, спорта, дороги, приёма пищи и спокойного отдыха. Доступна в удобных форматах 0.5 L и 1 L.',
    },
    nutrition: [
      {
        label: { en: 'Calories',    tm: 'Kaloriýa',      ru: 'Калории' },
        value: { en: '0 kcal',      tm: '0 kcal',        ru: '0 ккал' },
      },
      {
        label: { en: 'Sugar',       tm: 'Şeker',         ru: 'Сахар' },
        value: { en: '0 g',         tm: '0 g',           ru: '0 г' },
      },
      {
        label: { en: 'Fat',         tm: 'Ýag',           ru: 'Жир' },
        value: { en: '0 g',         tm: '0 g',           ru: '0 г' },
      },
      {
        label: { en: 'Carbonation', tm: 'Karbonlaşma',   ru: 'Газирование' },
        value: { en: 'Still',       tm: 'Gazsyz',        ru: 'Негазированная' },
      },
    ],
    volumes: ['0.5', '1', '10'],
  },

  // ── 2 · Mineral Water ─────────────────────────────────────────────
  {
    nameEn:   'Mineral Water',
    category: 'mineral-water',
    date:     '2026-06-17',
    photos: [
      { folder: '2', filename: 'mineral water (1).png', mimetype: 'image/png' },
      { folder: '2', filename: 'mineral water (2).png', mimetype: 'image/png' },
      { folder: '2', filename: 'mineral water (3).png', mimetype: 'image/png' },
    ],
    name:    { en: 'Mineral Water',        tm: 'Mineral Suw',      ru: 'Минеральная вода' },
    tagline: { en: 'Naturally balanced, refreshingly pure.', tm: 'Tebigy deňagramly, arassa serginlik.', ru: 'Естественный баланс и чистая свежесть.' },
    description: {
      en: 'Premium mineral water with a clean taste and naturally refreshing character.',
      tm: 'Arassa tagamly we tebigy serginlediji häsiýetli premium mineral suw.',
      ru: 'Премиальная минеральная вода с чистым вкусом и естественной свежестью.',
    },
    longDescription: {
      en: 'Mineral Water brings a calm, refreshing experience with a naturally balanced profile. Its clean taste and mineral character make it a refined choice for daily hydration, dining, wellness routines and premium refreshment moments.',
      tm: 'Mineral Suw tebigy deňagramly düzümi bilen rahat we serginlediji täsir berýär. Arassa tagamy we mineral häsiýeti ony gündelik suw içmek, nahar wagty, sagdyn durmuş endikleri we premium serginlik pursatlary üçin ajaýyp saýlaw edýär.',
      ru: 'Минеральная вода дарит мягкое освежение и естественный баланс. Чистый вкус и минеральный характер делают её отличным выбором для ежедневного питья, еды, здорового образа жизни и премиальных моментов.',
    },
    nutrition: [
      {
        label: { en: 'Calories',  tm: 'Kaloriýa',       ru: 'Калории' },
        value: { en: '0 kcal',    tm: '0 kcal',         ru: '0 ккал' },
      },
      {
        label: { en: 'Sugar',     tm: 'Şeker',          ru: 'Сахар' },
        value: { en: '0 g',       tm: '0 g',            ru: '0 г' },
      },
      {
        label: { en: 'Fat',       tm: 'Ýag',            ru: 'Жир' },
        value: { en: '0 g',       tm: '0 g',            ru: '0 г' },
      },
      {
        label: { en: 'Minerals',  tm: 'Minerallar',     ru: 'Минералы' },
        value: { en: 'Natural minerals', tm: 'Tebigy minerallar', ru: 'Природные минералы' },
      },
    ],
    volumes: ['0.5', '1', '10'],
  },

  // ── 3 · Orange Juice ──────────────────────────────────────────────
  {
    nameEn:   'Orange Juice',
    category: 'juice',
    date:     '2026-06-17',
    photos: [
      { folder: '3', filename: 'orange juice (1).png', mimetype: 'image/png' },
      { folder: '3', filename: 'orange juice (2).png', mimetype: 'image/png' },
      { folder: '3', filename: 'orange juice (3).png', mimetype: 'image/png' },
    ],
    name:    { en: 'Orange Juice',         tm: 'Apelsin Şiresi',   ru: 'Апельсиновый сок' },
    tagline: { en: 'Bright citrus energy in every sip.', tm: 'Her owurtçada sitrusyň ýagty täsiri.', ru: 'Яркая цитрусовая свежесть в каждом глотке.' },
    description: {
      en: 'A fresh and vibrant orange juice with a rich citrus taste.',
      tm: 'Baý sitrus tagamly, täze we janly apelsin şiresi.',
      ru: 'Свежий и насыщенный апельсиновый сок с ярким цитрусовым вкусом.',
    },
    longDescription: {
      en: 'Orange Juice is made for bright mornings, refreshing breaks and moments that need a natural citrus lift. Its rich orange colour, smooth texture and lively taste make it a perfect choice for breakfast, work breaks or everyday refreshment.',
      tm: 'Apelsin Şiresi ýagty ertirler, sergin arakesmeler we tebigy sitrus täsirini isleýän pursatlar üçin döredildi. Baý apelsin reňki, ýumşak gurluşy we janly tagamy ony ertirlik, iş arakesmesi ýa-da gündelik serginlik üçin amatly edýär.',
      ru: 'Апельсиновый сок создан для яркого утра, освежающих перерывов и моментов, когда хочется натурального цитрусового вкуса. Насыщенный цвет, мягкая текстура и живой вкус делают его отличным выбором для завтрака и ежедневной свежести.',
    },
    nutrition: [
      {
        label: { en: 'Calories',  tm: 'Kaloriýa',       ru: 'Калории' },
        value: { en: '45 kcal / 100 ml', tm: '45 kcal / 100 ml', ru: '45 ккал / 100 мл' },
      },
      {
        label: { en: 'Sugar',     tm: 'Şeker',          ru: 'Сахар' },
        value: { en: '10 g / 100 ml', tm: '10 g / 100 ml', ru: '10 г / 100 мл' },
      },
      {
        label: { en: 'Fat',       tm: 'Ýag',            ru: 'Жир' },
        value: { en: '0 g',       tm: '0 g',            ru: '0 г' },
      },
      {
        label: { en: 'Vitamin C', tm: 'C Witamini',     ru: 'Витамин C' },
        value: { en: 'Source of vitamin C', tm: 'C witamininiň çeşmesi', ru: 'Источник витамина C' },
      },
    ],
    volumes: ['0.5', '1', '10'],
  },

  // ── 4 · Apple Juice ───────────────────────────────────────────────
  {
    nameEn:   'Apple Juice',
    category: 'juice',
    date:     '2026-06-17',
    photos: [
      { folder: '4', filename: 'apple juice (1).png', mimetype: 'image/png' },
      { folder: '4', filename: 'apple juice (2).png', mimetype: 'image/png' },
      { folder: '4', filename: 'apple juice (3).png', mimetype: 'image/png' },
    ],
    name:    { en: 'Apple Juice',          tm: 'Alma Şiresi',      ru: 'Яблочный сок' },
    tagline: { en: 'Crisp orchard freshness.', tm: 'Bagyň arassa we ýeňil täzeligi.', ru: 'Свежесть яблоневого сада.' },
    description: {
      en: 'A smooth and refreshing apple juice with a naturally crisp taste.',
      tm: 'Tebigy ýeňil tagamly, ýumşak we serginlediji alma şiresi.',
      ru: 'Мягкий и освежающий яблочный сок с естественно свежим вкусом.',
    },
    longDescription: {
      en: 'Apple Juice offers a clean orchard-inspired flavour with a smooth golden character. Refreshing and easy to enjoy, it is suitable for breakfast, family moments, lunch breaks or any time you want a light fruit drink.',
      tm: 'Alma Şiresi bagdan gelen ýaly arassa tagamy we altynsow ýumşak häsiýeti bilen tapawutlanýar. Ol serginlediji we içmäge ýeňil bolup, ertirlik, maşgala pursatlary, günortan arakesmeleri ýa-da ýeňil miweli içgi isleýän wagtyňyz üçin amatlydyr.',
      ru: 'Яблочный сок передаёт чистый вкус сада и мягкий золотистый характер. Он освежает, легко пьётся и подходит для завтрака, семейных моментов, обеденных перерывов и любого времени, когда хочется лёгкого фруктового напитка.',
    },
    nutrition: [
      {
        label: { en: 'Calories',  tm: 'Kaloriýa',       ru: 'Калории' },
        value: { en: '46 kcal / 100 ml', tm: '46 kcal / 100 ml', ru: '46 ккал / 100 мл' },
      },
      {
        label: { en: 'Sugar',     tm: 'Şeker',          ru: 'Сахар' },
        value: { en: '10 g / 100 ml', tm: '10 g / 100 ml', ru: '10 г / 100 мл' },
      },
      {
        label: { en: 'Fat',       tm: 'Ýag',            ru: 'Жир' },
        value: { en: '0 g',       tm: '0 g',            ru: '0 г' },
      },
      {
        label: { en: 'Fruit',     tm: 'Miwe',           ru: 'Фрукт' },
        value: { en: 'Apple',     tm: 'Alma',           ru: 'Яблоко' },
      },
    ],
    volumes: ['0.5', '1', '10'],
  },

  // ── 5 · Stress Less Tincture ──────────────────────────────────────
  {
    nameEn:   'Stress Less Tincture',
    category: 'functional',
    date:     '2026-06-17',
    photos: [
      { folder: '5', filename: 'stress-less-tincture_max_packshots_01_v01.webp',                                        mimetype: 'image/webp' },
      { folder: '5', filename: 'stress-less-tincture_min_packshots_02_v01.webp',                                        mimetype: 'image/webp' },
      { folder: '5', filename: 'stress-less-tincture_swatch_03_v01_a9ec978e-9655-4a2a-bd58-6b47506294bc.webp',          mimetype: 'image/webp' },
      { folder: '5', filename: 'stress-less-tincture_coctail_05_v01.webp',                                              mimetype: 'image/webp' },
    ],
    name:    { en: 'Stress Less Tincture', tm: 'Stressiz Tinktura', ru: 'Настойка от стресса' },
    tagline: { en: 'Calm and balance, naturally.', tm: 'Tebigy rahatlyga we deňagramlylyga.', ru: 'Спокойствие и баланс — естественно.' },
    description: {
      en: 'A calming herbal tincture formulated to soften stress responses and encourage emotional ease.',
      tm: 'Stres täsirini ýumşatmak we duýgy deňagramlylygyny höweslendirmek üçin döredilen aýratyn ösümlik tinktury.',
      ru: 'Успокаивающая растительная настойка для снятия стресса и поддержания эмоционального равновесия.',
    },
    longDescription: {
      en: 'Stress Less Tincture is a calming blend of grounding herbs designed to soften stress responses and encourage relaxation and emotional ease — without sedation. Created for moments when you want to decompress gently and return to balance. Available in 700 ml and 1 L formats.',
      tm: 'Stressiz Tinktura stres täsirini ýumşatmak, rahatlygy we duýgy deňagramlylygyny höweslendirmek üçin döredilen ösümlik garyndysydyr — uklandyrmazdan. Ýuwaşlyk bilen boşanmak we deňagramlylyga gaýdyp gelmek isleýän pursatlar üçin döredildi. 700 ml we 1 L görnüşlerinde elýeterli.',
      ru: 'Настойка "Stress Less" — это успокаивающая смесь трав, созданная для мягкого снятия стресса и поощрения расслабления без седативного эффекта. Создана для моментов, когда нужно спокойно расслабиться и вернуться к балансу. Доступна в форматах 700 мл и 1 L.',
    },
    nutrition: [
      {
        label: { en: 'Calories',   tm: 'Kaloriýa',           ru: 'Калории' },
        value: { en: '5 kcal / serving', tm: '5 kcal / porsiya', ru: '5 ккал / порция' },
      },
      {
        label: { en: 'Sugar',      tm: 'Şeker',              ru: 'Сахар' },
        value: { en: '0 g',        tm: '0 g',                ru: '0 г' },
      },
      {
        label: { en: 'Fat',        tm: 'Ýag',                ru: 'Жир' },
        value: { en: '0 g',        tm: '0 g',                ru: '0 г' },
      },
      {
        label: { en: 'Botanicals', tm: 'Ösümlikler',         ru: 'Растительные компоненты' },
        value: { en: 'Herbal blend', tm: 'Ösümlik garyndysy', ru: 'Растительная смесь' },
      },
    ],
    volumes: ['0.7', '1'],
  },

  // ── 6 · Mineral Restore ───────────────────────────────────────────
  {
    nameEn:   'Mineral Restore',
    category: 'functional',
    date:     '2026-06-17',
    video: { folder: '6', filename: 'a5fc7af2b12a441587012a84a050fb64.HD-1080p-4.8Mbps-81416877.mp4' },
    photos: [
      { folder: '6', filename: 'mineral_restore_max_packshots_01_v01.webp',  mimetype: 'image/webp' },
      { folder: '6', filename: 'mineral_restore_mini_packshots_02_v01.webp', mimetype: 'image/webp' },
      { folder: '6', filename: 'mineral_restore_swatch_03_v01.webp',         mimetype: 'image/webp' },
      { folder: '6', filename: 'mineral_restore_cocktail_05_v01.webp',       mimetype: 'image/webp' },
    ],
    name:    { en: 'Mineral Restore',      tm: 'Mineral Dikeldiji', ru: 'Минеральное восстановление' },
    tagline: { en: 'Restore balance, stay refreshed.', tm: 'Deňagramlylygy dikelt, sergin bol.', ru: 'Восстанови баланс, оставайся свежим.' },
    description: {
      en: 'A hydrating mineral drink with electrolytes and botanicals for daily replenishment.',
      tm: 'Gündelik täzelenmek üçin elektrolitler we ösümlikler bilen baýlaşdyrylan nemiçi mineral içgi.',
      ru: 'Увлажняющий минеральный напиток с электролитами и растительными компонентами для ежедневного восстановления.',
    },
    longDescription: {
      en: 'Mineral Restore is a hydrating mineral drink formulated to restore balance after work, travel or activity. Essential electrolytes and botanicals support the nervous system while maintaining a fresh, clean taste. A dependable choice for daily replenishment, with a light cucumber, lemon and aloe flavour profile. Available in 700 ml and 1 L.',
      tm: 'Mineral Dikeldiji iş, syýahat ýa-da işjeňlikden soň deňagramlylygy dikeltmek üçin döredilen nemiçi mineral içgidir. Esasy elektrolitler we ösümlikler nerw ulgamyny goldaýar, arassa we täze tagamy saklap galýar. Salyrça, limon we aloe tagamly gündelik täzelenme üçin ygtybarly saýlaw. 700 ml we 1 L görnüşlerinde elýeterli.',
      ru: 'Mineral Restore — это увлажняющий напиток для восстановления баланса после работы, путешествия или активности. Электролиты и растительные компоненты поддерживают нервную систему, сохраняя свежий и чистый вкус. Лёгкий вкус огурца, лимона и алоэ. Доступен в 700 мл и 1 L.',
    },
    nutrition: [
      {
        label: { en: 'Calories',     tm: 'Kaloriýa',          ru: 'Калории' },
        value: { en: '10 kcal / 100 ml', tm: '10 kcal / 100 ml', ru: '10 ккал / 100 мл' },
      },
      {
        label: { en: 'Sugar',        tm: 'Şeker',             ru: 'Сахар' },
        value: { en: '2 g / 100 ml', tm: '2 g / 100 ml',     ru: '2 г / 100 мл' },
      },
      {
        label: { en: 'Electrolytes', tm: 'Elektrolitler',     ru: 'Электролиты' },
        value: { en: 'Essential blend', tm: 'Esasy garyndy', ru: 'Необходимая смесь' },
      },
      {
        label: { en: 'Botanicals',   tm: 'Ösümlikler',        ru: 'Растительные компоненты' },
        value: { en: 'Cucumber, lemon, aloe', tm: 'Salyrça, limon, aloe', ru: 'Огурец, лимон, алоэ' },
      },
    ],
    volumes: ['0.7', '1'],
  },

  // ── 7 · Blueberry Brain ───────────────────────────────────────────
  {
    nameEn:   'Blueberry Brain',
    category: 'functional',
    date:     '2026-06-17',
    video: { folder: '7', filename: '9979d507be774f99aa86b44e7d7d4f1e.HD-1080p-4.8Mbps-81414463.mp4' },
    photos: [
      { folder: '7', filename: 'blueberry-brain_max_packshots_01_v01.webp',  mimetype: 'image/webp' },
      { folder: '7', filename: 'blueberry-brain_mini_packshots_02_v01.webp', mimetype: 'image/webp' },
      { folder: '7', filename: 'blueberry-brain_swatch_03_v01.webp',         mimetype: 'image/webp' },
      { folder: '7', filename: 'blueberry-brain_lifestyle_04_v01.webp',      mimetype: 'image/webp' },
    ],
    name:    { en: 'Blueberry Brain',      tm: 'Blueberry Brain',  ru: 'Черничный Энергетик' },
    tagline: { en: 'Focus and clarity in every sip.', tm: 'Her owurtçada üns we aýdyňlyk.', ru: 'Фокус и ясность в каждом глотке.' },
    description: {
      en: 'A sparkling berry drink formulated to support clear thinking and calm concentration.',
      tm: 'Aýdyň pikirlenmegi we rahat üns bermegi goldamak üçin döredilen köpürjikli miweli içgi.',
      ru: 'Игристый ягодный напиток для поддержания ясного мышления и спокойной концентрации.',
    },
    longDescription: {
      en: 'Blueberry Brain is a sparkling berry drink built to keep your mind engaged during long days. Antioxidant-rich fruits combine with gentle amino acids to support clear thinking and balanced concentration without caffeine jitters. Deep blueberry notes with a touch of basil create a sweet-tart flavour with a rich violet-blue tint. Ideal for study, creative work or calm productivity. Available in 500 ml and 330 ml.',
      tm: 'Blueberry Brain uzyn günlerde akylyňy işjeň saklamak üçin döredilen köpürjikli miweli içgidir. Antioksidantlara baý miweler ýumşak aminokislotalar bilen birleşip, ynçgadan aýdyň pikirlenmegi we deňagramly ünsi goldaýar. Çuň blueberry notalar bilen baziligiň ýeňil tagamy süýji-turşy lezzet berýär. Okuw, döredijilik iş ýa-da köpürjikli önümçilik üçin amatly. 500 ml we 330 ml görnüşlerinde elýeterli.',
      ru: 'Blueberry Brain — игристый ягодный напиток для поддержания умственной активности в течение долгого дня. Антиоксидантные фрукты с мягкими аминокислотами поддерживают ясное мышление без кофеиновых скачков. Глубокие черничные ноты с базиликом создают кисло-сладкий вкус с фиолетово-синим оттенком. Для учёбы, творческой работы и спокойной продуктивности. Доступен в 500 мл и 330 мл.',
    },
    nutrition: [
      {
        label: { en: 'Calories',     tm: 'Kaloriýa',           ru: 'Калории' },
        value: { en: '25 kcal / 100 ml', tm: '25 kcal / 100 ml', ru: '25 ккал / 100 мл' },
      },
      {
        label: { en: 'Sugar',        tm: 'Şeker',              ru: 'Сахар' },
        value: { en: '5 g / 100 ml', tm: '5 g / 100 ml',      ru: '5 г / 100 мл' },
      },
      {
        label: { en: 'Amino acids',  tm: 'Aminokislotalar',    ru: 'Аминокислоты' },
        value: { en: 'Natural blend', tm: 'Tebigy garyndy',    ru: 'Природная смесь' },
      },
      {
        label: { en: 'Antioxidants', tm: 'Antioksidantlar',    ru: 'Антиоксиданты' },
        value: { en: 'Blueberry extract', tm: 'Blueberry ekstrakty', ru: 'Экстракт черники' },
      },
    ],
    volumes: ['0.33', '0.5'],
  },

  // ── 8 · Mellow Mango ─────────────────────────────────────────────
  {
    nameEn:   'Mellow Mango',
    category: 'functional',
    date:     '2026-06-17',
    photos: [
      { folder: '8', filename: 'mellow-mango_max_packshots_01_v01.webp',  mimetype: 'image/webp' },
      { folder: '8', filename: 'mellow-mango_mini_packshots_02_v01.webp', mimetype: 'image/webp' },
      { folder: '8', filename: 'mellow-mango_swatch_03_v01.webp',         mimetype: 'image/webp' },
      { folder: '8', filename: 'mellow-mango_lifestyle_04_v01.webp',      mimetype: 'image/webp' },
    ],
    name:    { en: 'Mellow Mango',         tm: 'Mellow Mango',     ru: 'Манго-Релакс' },
    tagline: { en: 'Unwind with tropical ease.', tm: 'Tropik rahatlyk bilen dynç al.', ru: 'Расслабься с тропической лёгкостью.' },
    description: {
      en: 'A mellow tropical blend with calming herbs to ease you into relaxation after a busy day.',
      tm: 'Hereketli günden soň sizi rahatlyga çykarmak üçin aýratyn ösümlikler bilen taýýarlanan mylaýym tropik garyndy.',
      ru: 'Мягкий тропический напиток с успокаивающими травами для расслабления после насыщенного дня.',
    },
    longDescription: {
      en: 'Mellow Mango is a mellow tropical blend that encourages deep relaxation after busy days. Calming herbs support unwinding while the warm fruit profile creates a comforting sipping ritual. Ripe mango blends with gentle chamomile for a mellow tropical sweetness and a warm golden glow. Helps you transition into evening mode with a light, pleasant sense of ease. Available in 500 ml and 330 ml.',
      tm: 'Mellow Mango hereketli günlerden soň çuňňur rahatlygy höweslendirýän mylaýym tropik garyndysydyr. Aýratyn ösümlikler dynç alşy goldaýar, miwäniň ýyly tagamy bolsa tesellendiriji içgi adatyny döredýär. Bişen mango ýumşak papatela bilen birleşip, mylaýym tropik süýjilik berýär. 500 ml we 330 ml görnüşlerinde elýeterli.',
      ru: 'Mellow Mango — мягкий тропический напиток для глубокого расслабления после насыщенных дней. Успокаивающие травы помогают расслабиться, а тёплый фруктовый вкус создаёт уютный ритуал. Спелое манго с мягкой ромашкой дарят тропическую сладость и тёплое золотистое настроение. Доступен в 500 мл и 330 мл.',
    },
    nutrition: [
      {
        label: { en: 'Calories',   tm: 'Kaloriýa',          ru: 'Калории' },
        value: { en: '30 kcal / 100 ml', tm: '30 kcal / 100 ml', ru: '30 ккал / 100 мл' },
      },
      {
        label: { en: 'Sugar',      tm: 'Şeker',             ru: 'Сахар' },
        value: { en: '6 g / 100 ml', tm: '6 g / 100 ml',   ru: '6 г / 100 мл' },
      },
      {
        label: { en: 'Fat',        tm: 'Ýag',               ru: 'Жир' },
        value: { en: '0 g',        tm: '0 g',               ru: '0 г' },
      },
      {
        label: { en: 'Botanicals', tm: 'Ösümlikler',        ru: 'Растительные компоненты' },
        value: { en: 'Chamomile, mango', tm: 'Papatela, mango', ru: 'Ромашка, манго' },
      },
    ],
    volumes: ['0.33', '0.5'],
  },

  // ── 9 · Still Water 19 L ──────────────────────────────────────────
  {
    nameEn:   'Still Water 19L',
    category: 'still-water',
    date:     '2026-06-17',
    photos: [
      { folder: '9', filename: 'still water -19L (1).png', mimetype: 'image/png' },
      { folder: '9', filename: 'still water -19L (2).png', mimetype: 'image/png' },
      { folder: '9', filename: 'still water -19L (3).png', mimetype: 'image/png' },
    ],
    name:    { en: 'Still Water 19L',      tm: 'Gazsyz Suw 19L',   ru: 'Негазированная вода 19 л' },
    tagline: { en: 'Family and office hydration, always ready.', tm: 'Maşgala we iş ýeri üçin hemişe taýýar.', ru: 'Для семьи и офиса — всегда под рукой.' },
    description: {
      en: 'A large-format 19 L still water bottle for home, office and family use.',
      tm: 'Öý, iş ýeri we maşgala ulanylyşy üçin uly göwrümli 19 L gazsyz suw çüýşesi.',
      ru: 'Большой формат 19 л негазированной воды для дома, офиса и семьи.',
    },
    longDescription: {
      en: 'Still Water 19L is the practical large-format choice for homes, offices and families that value a constant, clean water supply. The same pure, soft water that RAHATLYK is known for, now in an economical 19 L format designed for dispensers. Easy to install, easy to store and always ready when you need it.',
      tm: 'Gazsyz Suw 19L arassa we yzygiderli suw üpjünçiligini gymmatly hasaplaýan öýler, iş ýerleri we maşgalalar üçin amaly uly göwrümli saýlawdyr. RAHATLYK bilen tanalýan şol bir arassa we ýumşak suw, indi dispenserlere niýetlenen amatly 19 L formatynda. Gurnamak aňsat, saklamak aňsat we hemişe taýýar.',
      ru: 'Вода 19L — это удобный большой формат для домов, офисов и семей, которые ценят постоянное обеспечение чистой водой. Та же чистая и мягкая вода, которой известен RAHATLYK, теперь в экономичном формате 19 л для кулеров. Легко устанавливать, легко хранить и всегда готова к использованию.',
    },
    nutrition: [
      {
        label: { en: 'Calories',    tm: 'Kaloriýa',       ru: 'Калории' },
        value: { en: '0 kcal',      tm: '0 kcal',         ru: '0 ккал' },
      },
      {
        label: { en: 'Sugar',       tm: 'Şeker',          ru: 'Сахар' },
        value: { en: '0 g',         tm: '0 g',            ru: '0 г' },
      },
      {
        label: { en: 'Fat',         tm: 'Ýag',            ru: 'Жир' },
        value: { en: '0 g',         tm: '0 g',            ru: '0 г' },
      },
      {
        label: { en: 'Carbonation', tm: 'Karbonlaşma',    ru: 'Газирование' },
        value: { en: 'Still',       tm: 'Gazsyz',         ru: 'Негазированная' },
      },
    ],
    volumes: ['10', '19'],
  },
]
