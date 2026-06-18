type LocalizedText = { en: string; tm: string; ru: string }

export type ArticleCategorySeed = {
  slug: string
  label: LocalizedText
}

export type ArticleImage = {
  file: string              // relative to the dir below
  dir: 'media' | 'news-photos'  // 'media' → <cwd>/media/, 'news-photos' → <cwd>/public/news/photos/
  mimeType: string
}

export type ArticleSeed = {
  titleEn: string
  title: LocalizedText
  categorySlug: string
  date: string
  featured: boolean
  images: ArticleImage[]
  body: LocalizedText[]   // each element = one paragraph
}

// ── Categories ───────────────────────────────────────────────────────────────

export const ARTICLE_CATEGORIES: ArticleCategorySeed[] = [
  {
    slug: 'company-news',
    label: {
      en: 'Company News',
      tm: 'Kompaniýa habarlary',
      ru: 'Новости компании',
    },
  },
  {
    slug: 'product-updates',
    label: {
      en: 'Product Updates',
      tm: 'Önüm täzelikleri',
      ru: 'Обновления продуктов',
    },
  },
  {
    slug: 'sustainability',
    label: {
      en: 'Sustainability',
      tm: 'Durnuklylyk',
      ru: 'Экология',
    },
  },
]

// ── Articles ─────────────────────────────────────────────────────────────────

export const ARTICLES_SEED: ArticleSeed[] = [
  // ── 1 ──────────────────────────────────────────────────────────────────────
  {
    titleEn: 'Rahatlyk Wins Best Beverage Brand 2025',
    title: {
      en: 'Rahatlyk Wins Best Beverage Brand 2025',
      tm: 'Rahatlyk 2025-nji ýylyň Iň Oňat Içgi Markasy',
      ru: 'Rahatlyk — лучший бренд напитков 2025 года',
    },
    categorySlug: 'company-news',
    date: '2025-11-15',
    featured: true,
    images: [
      { file: 'Company News/ChatGPT Image Jun 18, 2026, 08_01_43 PM (1).png', dir: 'news-photos', mimeType: 'image/png' },
      { file: 'Company News/ChatGPT Image Jun 18, 2026, 08_01_43 PM (2).png', dir: 'news-photos', mimeType: 'image/png' },
      { file: 'Company News/ChatGPT Image Jun 18, 2026, 08_01_43 PM (3).png', dir: 'news-photos', mimeType: 'image/png' },
    ],
    body: [
      {
        en: 'We are proud to announce that Rahatlyk has been recognised as the Best Beverage Brand at the Central Asia Business Excellence Awards 2025. This prestigious award celebrates our unwavering commitment to delivering pure, natural water to homes and businesses across Turkmenistan.',
        tm: 'Biz Rahatlyk markasynyň 2025-nji ýylda Merkezi Aziýanyň Iň Oňat Içgi Markasy baýragynyň eýesi bolandygyny buýsanç bilen habar berýäris. Bu abraýly baýrak Türkmenistanyň öýlerine we guramalaryna arassa, tebigy suwy ibermäge bolan tutanýerli ygrarlylygymyzy belleýär.',
        ru: 'Мы с гордостью сообщаем, что Rahatlyk был признан лучшим брендом напитков на премии Central Asia Business Excellence Awards 2025. Эта престижная награда отражает нашу неизменную приверженность обеспечению чистой, натуральной водой домов и предприятий по всему Туркменистану.',
      },
      {
        en: 'The award reflects the trust our customers place in every bottle of Rahatlyk water. We remain dedicated to the highest standards of quality, sourced from protected mountain springs and processed with world-class filtration technology.',
        tm: 'Baýrak müşderilerimiziniň her çüýşe Rahatlyk suwuna bildirýän ynamyny görkezýär. Biz goralýan dag çeşmelerinden alnan we dünýä derejesindäki süzmek tehnologiýasy bilen işlenilen iň ýokary hil standartlaryna ygrarly bolup galýarys.',
        ru: 'Награда отражает доверие наших клиентов к каждой бутылке воды Rahatlyk. Мы по-прежнему привержены высочайшим стандартам качества, источником которых являются защищённые горные родники, обрабатываемые с применением фильтрационных технологий мирового класса.',
      },
    ],
  },

  // ── 2 ──────────────────────────────────────────────────────────────────────
  {
    titleEn: 'Introducing Our New Sparkling Water Range',
    title: {
      en: 'Introducing Our New Sparkling Water Range',
      tm: 'Täze Gazly Suw Görnüşlerimiz',
      ru: 'Представляем новую линейку газированной воды',
    },
    categorySlug: 'product-updates',
    date: '2025-10-20',
    featured: true,
    images: [
      { file: 'Product Updates/ChatGPT Image Jun 18, 2026, 08_01_43 PM (4).png', dir: 'news-photos', mimeType: 'image/png' },
    ],
    body: [
      {
        en: 'Rahatlyk is delighted to introduce its new sparkling water range — naturally carbonated and available in three refreshing varieties: classic, light citrus, and mint. Each bottle captures the crisp character of our mountain spring water with a gentle effervescence.',
        tm: 'Rahatlyk täze gazly suw görnüşlerini — tebigy karbonlaşdyrylan we üç täzeländiriji görnüşde: klassiki, ýeňil limon we naça — hödürlemekden şatlanýar. Her çüýşe dag çeşme suwumyzyň arassa häsiýetini ýumşak köpürjikleme bilen saklaýar.',
        ru: 'Rahatlyk с радостью представляет новую линейку газированной воды — натуральную, с углекислым газом, в трёх освежающих вариантах: классическом, лёгком цитрусовом и мятном. Каждая бутылка сохраняет чистый характер нашей горной родниковой воды с лёгкой игристостью.',
      },
      {
        en: 'The new range is available in 0.5 L and 1 L bottles at all major retail outlets starting this month. We invite you to experience the purity of Rahatlyk in a whole new way.',
        tm: 'Täze görnüşler şu aýdan başlap ähli iri bölek satyw nokadynda 0,5 L we 1 L çüýşelerde elýeterlidir. Sizi Rahatlyk arasyýalygyny düýbünden täze usulda başdan geçirmäge çagyrýarys.',
        ru: 'Новая линейка доступна в бутылках 0,5 л и 1 л во всех крупных розничных точках начиная с этого месяца. Приглашаем вас открыть для себя чистоту Rahatlyk совершенно по-новому.',
      },
    ],
  },

  // ── 3 ──────────────────────────────────────────────────────────────────────
  {
    titleEn: 'Our Mountain Spring Source: Certified Pure',
    title: {
      en: 'Our Mountain Spring Source: Certified Pure',
      tm: 'Dag Çeşmämiz: Arasyýalyk Şahadatnamasy Aldy',
      ru: 'Наш горный родник: сертифицированная чистота',
    },
    categorySlug: 'company-news',
    date: '2025-09-12',
    featured: false,
    images: [
      { file: 'scenery-majestic-snow-mountain_49071-3032.avif', dir: 'media', mimeType: 'image/avif' },
    ],
    body: [
      {
        en: 'Following a rigorous independent assessment, Rahatlyk\'s primary mountain spring source has received international certification for water purity. The audit, conducted by an accredited European laboratory, confirmed that our source water exceeds all WHO guidelines for drinking water quality.',
        tm: 'Berk garaşsyz baha beriş geçirilenden soň, Rahatlyknyň esasy dag çeşmesi suw arasyýalygy boýunça halkara sertifikatyny aldy. Akkreditirlenen Ýewropa barlaghanasy tarapyndan geçirilen audit, çeşme suwumyzyň içimlik suwunyň hili boýunça ähli BSG görkezmelerinden geçýändigini tassyklady.',
        ru: 'После тщательной независимой оценки основной горный родниковый источник Rahatlyk получил международную сертификацию чистоты воды. Аудит, проведённый аккредитованной европейской лабораторией, подтвердил, что наша родниковая вода соответствует всем руководящим принципам ВОЗ по качеству питьевой воды.',
      },
      {
        en: 'This certification reinforces our promise: every drop of Rahatlyk is sourced from a pristine, protected aquifer that has never been touched by industrial activity. We share this news as a testament to our commitment to transparency and excellence.',
        tm: 'Bu sertifikat biziň wadamyzy güýçlendirýär: her damja Rahatlyk senagat işjeňligi bilen hiç haçan deglmedik arassa, goralýan suw howdanyndan alynýar. Bu habary aýanlyk we kämillige bolan ygrarlylygynyň subuty hökmünde paýlaşýarys.',
        ru: 'Эта сертификация подкрепляет наше обещание: каждая капля Rahatlyk поступает из нетронутого, защищённого водоносного горизонта, никогда не подвергавшегося воздействию промышленной деятельности. Делимся этой новостью как свидетельством нашей приверженности прозрачности и совершенству.',
      },
    ],
  },

  // ── 4 ──────────────────────────────────────────────────────────────────────
  {
    titleEn: 'Zero-Waste Packaging by 2026',
    title: {
      en: 'Zero-Waste Packaging by 2026',
      tm: '2026-njy ýyla çenli Galyndysyz Gaplama',
      ru: 'Безотходная упаковка к 2026 году',
    },
    categorySlug: 'sustainability',
    date: '2025-08-05',
    featured: false,
    images: [
      { file: 'Sustainability/ChatGPT Image Jun 18, 2026, 08_01_43 PM (7).png', dir: 'news-photos', mimeType: 'image/png' },
    ],
    body: [
      {
        en: 'Rahatlyk is committed to achieving zero-waste packaging across its entire product range by the end of 2026. As part of this initiative, we have partnered with two Turkmenistan-based recycling organisations and are transitioning all bottle labels to plant-based, compostable materials.',
        tm: 'Rahatlyk 2026-njy ýylyň ahyryna çenli önüm toplumynyň ähli görnüşlerinde galyndysyz gaplamagy gazanmaga ygrarlydyr. Bu başlangyç çäklerinde Türkmenistanda ýerleşýän iki sany gaýtadan işleýän gurama bilen hyzmatdaşlyk etdik we ähli çüýşe belliklerini ösümlik esasly, kompost edilýän materiallara geçirýäris.',
        ru: 'Rahatlyk намерен достичь безотходной упаковки для всей линейки продукции к концу 2026 года. В рамках этой инициативы мы заключили партнёрство с двумя туркменскими перерабатывающими организациями и переводим все этикетки бутылок на растительные, компостируемые материалы.',
      },
      {
        en: 'We believe that pure water should come from a clean planet. By reducing our environmental footprint, we protect the natural water sources that make Rahatlyk what it is — and preserve them for future generations.',
        tm: 'Biz arassa suwuň arassa planetadan gelmelidigine ynanýarys. Daşky gurşawa ýetirýän täsirimizi azaltmak bilen, Rahatlyk bolmagynyň sebäbi bolan tebigy suw çeşmelerini goraýarys we olary geljek nesiller üçin saklaýarys.',
        ru: 'Мы убеждены, что чистая вода должна поступать с чистой планеты. Сокращая наш экологический след, мы защищаем природные водные источники, которые делают Rahatlyk тем, чем он является, — и сохраняем их для будущих поколений.',
      },
    ],
  },

  // ── 5 ──────────────────────────────────────────────────────────────────────
  {
    titleEn: 'New 19-Litre Home & Office Delivery Service',
    title: {
      en: 'New 19-Litre Home & Office Delivery Service',
      tm: 'Täze 19 Litrlik Öý we Ofis Eltip Beriş Hyzmaty',
      ru: 'Новая служба доставки 19-литровых бутылей на дом и в офис',
    },
    categorySlug: 'product-updates',
    date: '2025-07-18',
    featured: false,
    images: [
      { file: 'Product Updates/ChatGPT Image Jun 18, 2026, 08_01_43 PM (5).png', dir: 'news-photos', mimeType: 'image/png' },
    ],
    body: [
      {
        en: 'Starting this season, Rahatlyk is launching a dedicated home and office delivery service for its 19-litre water dispensers. Orders can be placed via our website or by phone, with same-day delivery available across Ashgabat and next-day delivery to major regional centres.',
        tm: 'Bu möwsümden başlap, Rahatlyk 19 litrlik suw dispenserleri üçin aýratyn öý we ofis eltip beriş hyzmatyny başladýar. Sargytlar web sahypamyz arkaly ýa-da telefon arkaly berlip bilner, Aşgabatda şol gün eltip beriş, esasy sebitdäki merkezlere bolsa ertesi gün eltip beriş elýeterlidir.',
        ru: 'Начиная с этого сезона Rahatlyk запускает специальную службу доставки на дом и в офис для 19-литровых кулеров. Заказы можно оформить через наш сайт или по телефону: доставка в тот же день по Ашхабаду и доставка на следующий день в крупные региональные центры.',
      },
      {
        en: 'Subscribing customers benefit from priority scheduling and a complimentary dispenser cleaning service every six months. The 19-litre format is ideal for families and workplaces that value convenience and consistent quality.',
        tm: 'Abonent müşderiler ileri tutulýan meýilnama tertibinden we her alty aýda bir gezek mugt dispenser arassalaýyş hyzmatyndan peýdalanarlar. 19 litrlik format amatlylygyny we yzygiderli hilini baha berýän maşgalalar we iş ýerleri üçin amatlydyr.',
        ru: 'Клиенты-подписчики получают приоритетное планирование доставок и бесплатную чистку кулера каждые шесть месяцев. Формат 19 литров идеально подходит для семей и рабочих мест, ценящих удобство и стабильное качество.',
      },
    ],
  },

  // ── 6 ──────────────────────────────────────────────────────────────────────
  {
    titleEn: 'Expanding Distribution Across Turkmenistan',
    title: {
      en: 'Expanding Distribution Across Turkmenistan',
      tm: 'Türkmenistan Boýunça Paýlaýyş Ulgamyny Giňeltmek',
      ru: 'Расширение дистрибьюции по всему Туркменистану',
    },
    categorySlug: 'company-news',
    date: '2025-06-22',
    featured: false,
    images: [
      { file: '1 (5).png', dir: 'media', mimeType: 'image/png' },
    ],
    body: [
      {
        en: 'Rahatlyk is proud to announce the expansion of its distribution network to every major city and district centre in Turkmenistan. New refrigerated distribution hubs have been established in Mary, Turkmenabat, Daşoguz, and Balkanabat.',
        tm: 'Rahatlyk paýlaýyş ulgamyny Türkmenistanyň ähli iri şäherlerine we etrap merkezlerine giňeltmekden buýsanç duýýar. Marida, Türkmenabatda, Daşoguzda we Balkanabatda täze sowadyjy paýlaýyş merkezleri döredildi.',
        ru: 'Rahatlyk с гордостью объявляет о расширении дистрибьюторской сети в каждый крупный город и районный центр Туркменистана. Новые холодильные распределительные центры созданы в Мары, Туркменабате, Дашогузе и Балканабате.',
      },
      {
        en: 'This expansion means that millions more Turkmenistan residents now have access to fresh Rahatlyk water within 24 hours of production. We thank our logistics partners and retail network for making this milestone possible.',
        tm: 'Bu giňelme Türkmenistanyň millionlarça ýaşaýjylarynyň indi önümçilikden 24 sagadyň dowamynda ter Rahatlyk suwuna elýeter boljakdygyny aňladýar. Bu möhüm ösüşi mümkin edinen logistika hyzmatdaşlarymyza we bölek satyw ulgamymyza minnetdarlyk bildirýäris.',
        ru: 'Это расширение означает, что миллионы жителей Туркменистана теперь имеют доступ к свежей воде Rahatlyk в течение 24 часов с момента производства. Благодарим наших логистических партнёров и розничную сеть за то, что сделали этот важный рубеж возможным.',
      },
    ],
  },

  // ── 7 ──────────────────────────────────────────────────────────────────────
  {
    titleEn: 'Official Hydration Partner of the National Sports Federation',
    title: {
      en: 'Official Hydration Partner of the National Sports Federation',
      tm: 'Milli Sport Federasiýasynyň Resmi Gidratasiýa Hyzmatdaşy',
      ru: 'Официальный партнёр по гидратации Национальной спортивной федерации',
    },
    categorySlug: 'company-news',
    date: '2025-05-10',
    featured: false,
    images: [
      { file: 'pexels-aeppli-1929561.jpg', dir: 'media', mimeType: 'image/jpeg' },
    ],
    body: [
      {
        en: 'Rahatlyk has signed a multi-year official hydration partnership with the Turkmenistan National Sports Federation. As the official water of Turkmen national sports teams, Rahatlyk will be present at all major domestic competitions and international events.',
        tm: 'Rahatlyk Türkmenistanyň Milli Sport Federasiýasy bilen köp ýyllyk resmi gidratasiýa hyzmatdaşlygyna gol çekdi. Türkmen milli sport toparlarының resmi suwy hökmünde Rahatlyk ähli iri içerki ýaryşlarda we halkara çärelerde hödür ediler.',
        ru: 'Rahatlyk подписал многолетнее официальное партнёрство по гидратации с Национальной спортивной федерацией Туркменистана. Как официальная вода туркменских национальных сборных, Rahatlyk будет присутствовать на всех крупных внутренних соревнованиях и международных мероприятиях.',
      },
      {
        en: 'Sports performance depends on optimal hydration, and we are honoured to support the health and excellence of Turkmenistan\'s athletes. This partnership reflects our belief that clean, natural water is fundamental to an active and healthy lifestyle.',
        tm: 'Sport netijeliligi optimiki gidratasiýa baglydyr we biz Türkmenistanyň türgenleriniň saglygyny we kämilligini goldamaga hormat duýýarys. Bu hyzmatdaşlyk arassa, tebigy suwunyň işjeň we sagdyn ýaşaýyş düýbi bolandygyna bolan ynanjymyzy görkezýär.',
        ru: 'Спортивные результаты зависят от оптимальной гидратации, и мы рады поддержать здоровье и мастерство спортсменов Туркменистана. Это партнёрство отражает наше убеждение в том, что чистая, натуральная вода является основой активного и здорового образа жизни.',
      },
    ],
  },

  // ── 8 ──────────────────────────────────────────────────────────────────────
  {
    titleEn: 'Our Annual Water Stewardship Report',
    title: {
      en: 'Our Annual Water Stewardship Report',
      tm: 'Ýyllyk Suw Goraýjylyk Hasabatymyz',
      ru: 'Наш ежегодный отчёт по управлению водными ресурсами',
    },
    categorySlug: 'sustainability',
    date: '2025-04-03',
    featured: false,
    images: [
      { file: 'Sustainability/ChatGPT Image Jun 18, 2026, 08_01_43 PM (8).png', dir: 'news-photos', mimeType: 'image/png' },
    ],
    body: [
      {
        en: 'Rahatlyk has released its first annual water stewardship report, detailing the measures taken to protect and preserve our mountain spring sources. The report covers groundwater monitoring, reforestation initiatives around the spring basin, and strict limits on extraction volumes.',
        tm: 'Rahatlyk dag çeşme çeşmelerini goramak we saklamak üçin görlen çäreleri jikme-jik beýan edýän ilkinji ýyllyk suw goraýjylyk hasabatyny çap etdi. Hasabat ýerasty suwlary gözegçilik etmegi, çeşme basseýniniň töwereginde tokaý ösürmek başlangyçlaryny we çykarylyş mukdarlaryna berk çäklendirmeleri öz içine alýar.',
        ru: 'Rahatlyk опубликовал свой первый ежегодный отчёт по управлению водными ресурсами, в котором подробно описаны меры по защите и сохранению наших горных родниковых источников. Отчёт охватывает мониторинг подземных вод, инициативы по лесовосстановлению вокруг бассейна родника и строгие ограничения на объёмы добычи.',
      },
      {
        en: 'Water is a finite and precious resource. Our stewardship programme ensures that the springs we depend on today will continue to flow for centuries to come. We invite stakeholders and the public to read the full report on our website.',
        tm: 'Suw çäkli we gymmatly serişdedir. Goraýjylyk maksatnamymyz häzir bil baglaýan çeşmelerimiziniň geljek asyrlarda hem akyp dowam etjekdigini üpjün edýär. Hyzmatdaşlary we jemgyýeti doly hasabaty web sahypamyzda okamaga çagyrýarys.',
        ru: 'Вода — конечный и драгоценный ресурс. Наша программа управления водными ресурсами гарантирует, что родники, на которые мы опираемся сегодня, продолжат течь ещё много столетий. Приглашаем заинтересованные стороны и общественность прочитать полный отчёт на нашем сайте.',
      },
    ],
  },
]
