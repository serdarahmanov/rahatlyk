type LocalizedText = { en: string; tm: string; ru: string }

export type VacancyDepartmentSeed = {
  slug: string
  label: LocalizedText
}

export type VacancySeed = {
  titleEn: string
  title: LocalizedText
  department: string
  location: LocalizedText
  type: 'fullTime' | 'partTime'
  overview: LocalizedText
  responsibilities: LocalizedText[]
  requirements: LocalizedText[]
  niceToHave: LocalizedText[]
  benefits: LocalizedText[]
  salary?: string
  postedDate: string
}

// ── Departments ──────────────────────────────────────────────────────────────

export const VACANCY_DEPARTMENTS: VacancyDepartmentSeed[] = [
  {
    slug: 'marketing',
    label: { en: 'Marketing', tm: 'Marketing', ru: 'Маркетинг' },
  },
  {
    slug: 'finance',
    label: { en: 'Finance & Accounting', tm: 'Maliýe we Buhgalteriýa', ru: 'Финансы и бухгалтерия' },
  },
  {
    slug: 'sales',
    label: { en: 'Sales', tm: 'Satuw', ru: 'Продажи' },
  },
  {
    slug: 'logistics',
    label: { en: 'Logistics', tm: 'Logistika', ru: 'Логистика' },
  },
]

// ── Vacancies ─────────────────────────────────────────────────────────────────

export const VACANCIES_SEED: VacancySeed[] = [

  // ── 1 · Marketing Manager ────────────────────────────────────────────────
  {
    titleEn: 'Marketing Manager',
    title: {
      en: 'Marketing Manager',
      tm: 'Marketing Müdiri',
      ru: 'Менеджер по маркетингу',
    },
    department: 'marketing',
    location: {
      en: 'Ashgabat, Turkmenistan',
      tm: 'Aşgabat, Türkmenistan',
      ru: 'Ашхабад, Туркменистан',
    },
    type: 'fullTime',
    overview: {
      en: 'We are looking for a creative and data-driven Marketing Manager to lead brand growth initiatives for RAHATLYK. You will develop and execute marketing strategies across digital and traditional channels, manage campaigns from concept to delivery, and work closely with the sales and design teams to strengthen our market presence.',
      tm: 'Biz RAHATLYK marka ösüş başlangyçlaryna ýolbaşçylyk etmek üçin döredijilikli we maglumata esaslanýan Marketing Müdirini gözleýäris. Siz sanly we adaty kanallarda marketing strategiýalaryny işläp taýýarlar we amala aşyrar, düşünjeden eltip bermä çenli kampaniýalary dolandyrar, bazardaky ornumyzy güýçlendirmek üçin satuw we dizaýn toparlary bilen ýakyndan işlärsiňiz.',
      ru: 'Мы ищем креативного и ориентированного на данные менеджера по маркетингу для руководства инициативами роста бренда RAHATLYK. Вы будете разрабатывать и реализовывать маркетинговые стратегии по цифровым и традиционным каналам, управлять кампаниями от концепции до реализации и тесно сотрудничать с командами по продажам и дизайну.',
    },
    responsibilities: [
      {
        en: 'Develop and implement annual marketing plans aligned with business goals',
        tm: 'Işewürlik maksatlaryna laýyk ýyllyk marketing meýilnamalaryny işläp taýýarlamak we durmuşa geçirmek',
        ru: 'Разрабатывать и реализовывать годовые маркетинговые планы в соответствии с бизнес-целями',
      },
      {
        en: 'Manage social media presence and digital advertising campaigns',
        tm: 'Sosial media gatnaşygyny we sanly reklama kampaniýalaryny dolandyrmak',
        ru: 'Управлять присутствием в социальных сетях и цифровыми рекламными кампаниями',
      },
      {
        en: 'Coordinate with agencies, photographers and content creators',
        tm: 'Agentlikler, fotosuratçylar we mazmun döredijiler bilen utgaşdyrmak',
        ru: 'Координировать работу с агентствами, фотографами и создателями контента',
      },
      {
        en: 'Track campaign performance and report on key metrics',
        tm: 'Kampaniýa öndürijiligini yzarlamak we esasy görkezijiler boýunça hasabat bermek',
        ru: 'Отслеживать эффективность кампаний и отчитываться по ключевым показателям',
      },
      {
        en: 'Monitor market trends and competitor activity',
        tm: 'Bazar tendenciýalaryny we bäsdeşleriň işjeňligini yzarlamak',
        ru: 'Отслеживать рыночные тенденции и активность конкурентов',
      },
    ],
    requirements: [
      {
        en: 'Bachelor\'s degree in Marketing, Business or a related field',
        tm: 'Marketing, Işewürlik ýa-da degişli ugurda bakalawr derejesi',
        ru: 'Степень бакалавра в области маркетинга, бизнеса или смежной специальности',
      },
      {
        en: 'Minimum 3 years of experience in a marketing role',
        tm: 'Marketing wezipesinde iň az 3 ýyl tejribe',
        ru: 'Минимум 3 года опыта работы в маркетинге',
      },
      {
        en: 'Proficiency in digital marketing tools and analytics platforms',
        tm: 'Sanly marketing gurallary we analitika platformalarynda ökde',
        ru: 'Уверенное владение инструментами цифрового маркетинга и аналитическими платформами',
      },
      {
        en: 'Strong written and verbal communication skills in Turkmen and Russian',
        tm: 'Türkmen we rus dillerinde güýçli ýazmaça we sözleýiş endikleri',
        ru: 'Сильные письменные и устные коммуникативные навыки на туркменском и русском языках',
      },
    ],
    niceToHave: [
      {
        en: 'Experience in the FMCG or beverage industry',
        tm: 'FMCG ýa-da içgi pudagynda tejribe',
        ru: 'Опыт работы в FMCG или индустрии напитков',
      },
      {
        en: 'Working knowledge of Adobe Creative Suite or Canva',
        tm: 'Adobe Creative Suite ýa-da Canva boýunça iş bilimleri',
        ru: 'Рабочее знание Adobe Creative Suite или Canva',
      },
    ],
    benefits: [
      {
        en: 'Competitive salary and performance bonuses',
        tm: 'Bäsdeşlik ukyply aýlyk we öndürijilik bonuslary',
        ru: 'Конкурентная заработная плата и бонусы за результаты',
      },
      {
        en: 'Health insurance coverage',
        tm: 'Saglyk ätiýaçlandyrmasy',
        ru: 'Медицинское страхование',
      },
      {
        en: 'Professional development and training budget',
        tm: 'Hünär ösüşi we okuw býujeti',
        ru: 'Профессиональное развитие и бюджет на обучение',
      },
      {
        en: 'Monthly RAHATLYK product allowance',
        tm: 'Aýlyk RAHATLYK önüm ödegligi',
        ru: 'Ежемесячное пособие на продукцию RAHATLYK',
      },
    ],
    salary: '4000–6000 TMT',
    postedDate: '2026-06-01',
  },

  // ── 2 · Brand & Content Designer ────────────────────────────────────────
  {
    titleEn: 'Brand & Content Designer',
    title: {
      en: 'Brand & Content Designer',
      tm: 'Marka we Mazmun Dizaýneri',
      ru: 'Дизайнер бренда и контента',
    },
    department: 'marketing',
    location: {
      en: 'Ashgabat, Turkmenistan',
      tm: 'Aşgabat, Türkmenistan',
      ru: 'Ашхабад, Туркменистан',
    },
    type: 'fullTime',
    overview: {
      en: 'RAHATLYK is seeking a talented Brand & Content Designer to craft compelling visual assets across packaging, digital, and print. You will be responsible for maintaining brand consistency and bringing creative concepts to life that resonate with our audience.',
      tm: 'RAHATLYK gaplama, sanly we çap ulgamlarynda özüne çekiji wizual serişdeleri döretmek üçin zehinli Marka we Mazmun Dizaýnerini gözleýär. Siz marka yzygiderliligi saklamak we tomaşaçylarymyz bilen sesdeş döredijilik düşünjelerini durmuşa geçirmek üçin jogapkär bolarsyňyz.',
      ru: 'RAHATLYK ищет талантливого дизайнера бренда и контента для создания привлекательных визуальных материалов в области упаковки, цифрового и печатного дизайна. Вы будете отвечать за поддержание целостности бренда и воплощение творческих концепций в жизнь.',
    },
    responsibilities: [
      {
        en: 'Design marketing materials including social media graphics, banners and brochures',
        tm: 'Sosial media grafikalaryny, bannerleri we broşýuralary goşmak bilen marketing materiallaryny dizaýn etmek',
        ru: 'Разрабатывать маркетинговые материалы, включая графику для социальных сетей, баннеры и брошюры',
      },
      {
        en: 'Maintain and evolve the RAHATLYK visual identity system',
        tm: 'RAHATLYK wizual şahsyýet ulgamyny saklamak we ösdürmek',
        ru: 'Поддерживать и развивать систему визуальной идентичности RAHATLYK',
      },
      {
        en: 'Create product packaging mock-ups and artwork for print production',
        tm: 'Çap önümçiligi üçin önüm gaplama nusgalaryny we çeper eserlerini döretmek',
        ru: 'Создавать макеты упаковки продуктов и artwork для печатного производства',
      },
      {
        en: 'Support video editing and motion graphics for digital campaigns',
        tm: 'Sanly kampaniýalar üçin wideo redaktirleme we hereketi grafika goldamak',
        ru: 'Поддерживать видеомонтаж и моушн-графику для цифровых кампаний',
      },
    ],
    requirements: [
      {
        en: 'Degree or diploma in Graphic Design, Visual Arts or equivalent',
        tm: 'Grafiki Dizaýn, Görnüş Sungaty ýa-da deňwertli ugurda dereje ýa-da diplom',
        ru: 'Степень или диплом в области графического дизайна, визуальных искусств или эквивалент',
      },
      {
        en: 'Proficiency in Adobe Illustrator, Photoshop and InDesign',
        tm: 'Adobe Illustrator, Photoshop we InDesign-da ökdelik',
        ru: 'Уверенное владение Adobe Illustrator, Photoshop и InDesign',
      },
      {
        en: 'Strong portfolio demonstrating brand and digital design work',
        tm: 'Marka we sanly dizaýn işini görkezýän güýçli portfolio',
        ru: 'Сильное портфолио, демонстрирующее работу в области брендинга и цифрового дизайна',
      },
    ],
    niceToHave: [
      {
        en: 'Experience with motion graphics tools such as After Effects',
        tm: 'After Effects ýaly hereketi grafika gurallary bilen tejribe',
        ru: 'Опыт работы с инструментами для создания моушн-графики, такими как After Effects',
      },
      {
        en: 'Photography or video production skills',
        tm: 'Fotosurat ýa-da wideo önümçilik başarnyklary',
        ru: 'Навыки фотографии или видеопроизводства',
      },
    ],
    benefits: [
      {
        en: 'Competitive salary and performance bonuses',
        tm: 'Bäsdeşlik ukyply aýlyk we öndürijilik bonuslary',
        ru: 'Конкурентная заработная плата и бонусы за результаты',
      },
      {
        en: 'Creative and collaborative work environment',
        tm: 'Döredijilikli we hyzmatdaşlykly iş gurşawy',
        ru: 'Творческая и совместная рабочая среда',
      },
      {
        en: 'Access to premium design software licenses',
        tm: 'Premium dizaýn programma üpjünçiligine giriş',
        ru: 'Доступ к лицензиям на профессиональное дизайнерское ПО',
      },
      {
        en: 'Monthly RAHATLYK product allowance',
        tm: 'Aýlyk RAHATLYK önüm ödegligi',
        ru: 'Ежемесячное пособие на продукцию RAHATLYK',
      },
    ],
    salary: '3500–5000 TMT',
    postedDate: '2026-06-03',
  },

  // ── 3 · Senior Accountant ────────────────────────────────────────────────
  {
    titleEn: 'Senior Accountant',
    title: {
      en: 'Senior Accountant',
      tm: 'Uly Buhgalter',
      ru: 'Старший бухгалтер',
    },
    department: 'finance',
    location: {
      en: 'Ashgabat, Turkmenistan',
      tm: 'Aşgabat, Türkmenistan',
      ru: 'Ашхабад, Туркменистан',
    },
    type: 'fullTime',
    overview: {
      en: 'We are seeking a detail-oriented Senior Accountant to oversee financial reporting, tax compliance, and day-to-day accounting operations at RAHATLYK. You will work closely with the Finance Manager to ensure accuracy, regulatory compliance, and timely financial reporting.',
      tm: 'Biz RAHATLYK-da maliýe hasabatlylygyna, salgyt laýyklygyna we gündelik buhgalteriýa amallaryna gözegçilik etmek üçin jikme-jikliklere üns berýän Uly Buhgalteri gözleýäris. Siz takyklygy, düzgünleýji laýyklygy we öz wagtynda maliýe hasabatlylygyny üpjün etmek üçin Maliýe Müdiri bilen ýakyndan işlärsiňiz.',
      ru: 'Мы ищем ориентированного на детали старшего бухгалтера для надзора за финансовой отчётностью, налоговым соответствием и повседневными бухгалтерскими операциями в RAHATLYK. Вы будете тесно сотрудничать с финансовым менеджером для обеспечения точности и своевременной отчётности.',
    },
    responsibilities: [
      {
        en: 'Prepare monthly, quarterly and annual financial statements',
        tm: 'Aýlyk, çärýeklik we ýyllyk maliýe hasabatlaryny taýýarlamak',
        ru: 'Подготавливать ежемесячные, квартальные и годовые финансовые отчёты',
      },
      {
        en: 'Manage accounts payable and receivable processes',
        tm: 'Tölenýän we alynýan hasaplar proseslerini dolandyrmak',
        ru: 'Управлять процессами кредиторской и дебиторской задолженности',
      },
      {
        en: 'Ensure compliance with local tax regulations and filing deadlines',
        tm: 'Ýerli salgyt düzgünnamalary we tabşyryş möhletleri bilen laýyklygy üpjün etmek',
        ru: 'Обеспечивать соблюдение местного налогового законодательства и сроков подачи отчётности',
      },
      {
        en: 'Reconcile bank statements and general ledger accounts',
        tm: 'Bank çeklerini we umumy ledger hasaplaryny deňeşdirmek',
        ru: 'Выполнять сверку банковских выписок и счетов главной книги',
      },
      {
        en: 'Support internal and external audits',
        tm: 'Içerki we daşarky auditleri goldamak',
        ru: 'Поддерживать внутренние и внешние аудиты',
      },
    ],
    requirements: [
      {
        en: 'Bachelor\'s degree in Accounting, Finance or Economics',
        tm: 'Buhgalteriýa, Maliýe ýa-da Ykdysadyýet ugurda bakalawr derejesi',
        ru: 'Степень бакалавра в области бухгалтерского учёта, финансов или экономики',
      },
      {
        en: 'Minimum 4 years of accounting experience',
        tm: 'Iň az 4 ýyl buhgalteriýa tejribesi',
        ru: 'Минимум 4 года опыта бухгалтерской работы',
      },
      {
        en: 'Strong knowledge of Turkmenistan tax laws and accounting standards',
        tm: 'Türkmenistanyň salgyt kanunlary we buhgalteriýa standartlary barada güýçli bilim',
        ru: 'Глубокое знание налогового законодательства Туркменистана и стандартов бухгалтерского учёта',
      },
      {
        en: 'Proficiency in accounting software (1C or equivalent)',
        tm: 'Buhgalteriýa programma üpjünçiliginde ökdelik (1C ýa-da deňwertli)',
        ru: 'Уверенное владение бухгалтерским программным обеспечением (1С или аналог)',
      },
    ],
    niceToHave: [
      {
        en: 'CPA or equivalent professional certification',
        tm: 'CPA ýa-da deňwertli hünär şahadatnamasy',
        ru: 'CPA или эквивалентная профессиональная сертификация',
      },
      {
        en: 'Experience in the manufacturing or FMCG sector',
        tm: 'Önümçilik ýa-da FMCG pudagynda tejribe',
        ru: 'Опыт работы в производственном или FMCG секторе',
      },
    ],
    benefits: [
      {
        en: 'Competitive salary with annual review',
        tm: 'Ýyllyk gözden geçiriş bilen bäsdeşlik ukyply aýlyk',
        ru: 'Конкурентная заработная плата с ежегодным пересмотром',
      },
      {
        en: 'Health insurance coverage',
        tm: 'Saglyk ätiýaçlandyrmasy',
        ru: 'Медицинское страхование',
      },
      {
        en: 'Paid annual and sick leave',
        tm: 'Tölenýän ýyllyk we kessellik rugsady',
        ru: 'Оплачиваемый ежегодный отпуск и больничный',
      },
      {
        en: 'Stable work environment in a growing company',
        tm: 'Ösýän kompaniýada durnukly iş gurşawy',
        ru: 'Стабильная рабочая среда в растущей компании',
      },
    ],
    salary: '4500–7000 TMT',
    postedDate: '2026-06-02',
  },

  // ── 4 · Financial Analyst ────────────────────────────────────────────────
  {
    titleEn: 'Financial Analyst',
    title: {
      en: 'Financial Analyst',
      tm: 'Maliýe Analitigi',
      ru: 'Финансовый аналитик',
    },
    department: 'finance',
    location: {
      en: 'Ashgabat, Turkmenistan',
      tm: 'Aşgabat, Türkmenistan',
      ru: 'Ашхабад, Туркменистан',
    },
    type: 'fullTime',
    overview: {
      en: 'Join the RAHATLYK finance team as a Financial Analyst and help drive smart business decisions through insightful data analysis, forecasting, and financial modelling. You will support budgeting processes and provide actionable insights to leadership.',
      tm: 'RAHATLYK maliýe toparyna Maliýe Analitigi hökmünde goşulyň we düşünjeli maglumat derňewi, çaklama we maliýe modellemesi arkaly akylly işewürlik kararlaryny bermäge kömek ediň. Siz býujetleşdiriş proseslerini goldaýarsyňyz we ýolbaşçylyga iş ýüzünde başlangyçlary hödürleýärsiňiz.',
      ru: 'Присоединяйтесь к финансовой команде RAHATLYK в качестве финансового аналитика и помогайте принимать взвешенные бизнес-решения посредством глубокого анализа данных, прогнозирования и финансового моделирования.',
    },
    responsibilities: [
      {
        en: 'Build and maintain financial models for budgeting and forecasting',
        tm: 'Býujetleşdiriş we çaklama üçin maliýe modellerini gurmak we saklamak',
        ru: 'Создавать и поддерживать финансовые модели для бюджетирования и прогнозирования',
      },
      {
        en: 'Analyse sales data and cost structures to identify improvement opportunities',
        tm: 'Gowulaşma mümkinçiliklerini kesgitlemek üçin satuw maglumatlaryny we çykdajy gurluşlaryny derňemek',
        ru: 'Анализировать данные о продажах и структуру затрат для выявления возможностей улучшения',
      },
      {
        en: 'Prepare management reports and executive dashboards',
        tm: 'Dolandyryş hasabatlaryny we ýolbaşçy panellerini taýýarlamak',
        ru: 'Подготавливать управленческие отчёты и дашборды для руководства',
      },
      {
        en: 'Monitor KPIs and variance against budget',
        tm: 'KPI-leri we býujetden tapawudy gözegçilik etmek',
        ru: 'Отслеживать KPI и отклонения от бюджета',
      },
    ],
    requirements: [
      {
        en: 'Bachelor\'s degree in Finance, Economics or Statistics',
        tm: 'Maliýe, Ykdysadyýet ýa-da Statistika ugurda bakalawr derejesi',
        ru: 'Степень бакалавра в области финансов, экономики или статистики',
      },
      {
        en: 'Minimum 2 years of financial analysis experience',
        tm: 'Iň az 2 ýyl maliýe derňewi tejribesi',
        ru: 'Минимум 2 года опыта финансового анализа',
      },
      {
        en: 'Advanced Excel skills including pivot tables and financial modelling',
        tm: 'Pivot tablolary we maliýe modellemesini goşmak bilen ösen Excel başarnyklary',
        ru: 'Продвинутые навыки Excel, включая сводные таблицы и финансовое моделирование',
      },
    ],
    niceToHave: [
      {
        en: 'Experience with Power BI or similar data visualisation tools',
        tm: 'Power BI ýa-da şuňa meňzeş maglumat wizuallaşdyryş gurallary bilen tejribe',
        ru: 'Опыт работы с Power BI или аналогичными инструментами визуализации данных',
      },
      {
        en: 'Knowledge of ERP systems',
        tm: 'ERP ulgamlary barada bilim',
        ru: 'Знание ERP-систем',
      },
    ],
    benefits: [
      {
        en: 'Competitive salary and annual performance bonus',
        tm: 'Bäsdeşlik ukyply aýlyk we ýyllyk öndürijilik bonusy',
        ru: 'Конкурентная заработная плата и годовой бонус за результаты',
      },
      {
        en: 'Health insurance coverage',
        tm: 'Saglyk ätiýaçlandyrmasy',
        ru: 'Медицинское страхование',
      },
      {
        en: 'Opportunities for career progression',
        tm: 'Karýera ösüşi üçin mümkinçilikler',
        ru: 'Возможности для карьерного роста',
      },
      {
        en: 'Monthly RAHATLYK product allowance',
        tm: 'Aýlyk RAHATLYK önüm ödegligi',
        ru: 'Ежемесячное пособие на продукцию RAHATLYK',
      },
    ],
    salary: '3500–5500 TMT',
    postedDate: '2026-06-05',
  },

  // ── 5 · Regional Sales Representative ───────────────────────────────────
  {
    titleEn: 'Regional Sales Representative',
    title: {
      en: 'Regional Sales Representative',
      tm: 'Sebit Satuw Wekili',
      ru: 'Региональный торговый представитель',
    },
    department: 'sales',
    location: {
      en: 'Ashgabat, Turkmenistan',
      tm: 'Aşgabat, Türkmenistan',
      ru: 'Ашхабад, Туркменистан',
    },
    type: 'fullTime',
    overview: {
      en: 'RAHATLYK is expanding its distribution network and looking for driven Regional Sales Representatives to grow our presence across assigned territories. You will build strong retailer relationships, achieve sales targets, and represent the RAHATLYK brand with professionalism.',
      tm: 'RAHATLYK öz paýlaýyş ulgamyny giňeldýär we bellenen ýerlerde ornumuzy ösdürmek üçin işjeň Sebit Satuw Wekillerini gözleýär. Siz güýçli bazar gatnaşyklaryny gurarsyňyz, satuw maksatlaryna ýetersiňiz we RAHATLYK markasyny hünärmençilik bilen wekilçilik edersiňiz.',
      ru: 'RAHATLYK расширяет свою дистрибуторскую сеть и ищет целеустремлённых региональных торговых представителей для развития присутствия на закреплённых территориях. Вы будете строить прочные отношения с розничными точками и достигать плановых показателей продаж.',
    },
    responsibilities: [
      {
        en: 'Visit retail outlets, supermarkets and HoReCa clients within assigned territory',
        tm: 'Bellenen ýerde bölek satuw nokatlaryna, supermarketlere we HoReCa müşderilerine baryp görmek',
        ru: 'Посещать розничные точки, супермаркеты и HoReCa-клиентов в закреплённой территории',
      },
      {
        en: 'Achieve monthly and quarterly sales targets',
        tm: 'Aýlyk we çärýeklik satuw maksatlaryna ýetmek',
        ru: 'Выполнять ежемесячные и квартальные планы продаж',
      },
      {
        en: 'Conduct product presentations and in-store promotions',
        tm: 'Önüm tanyşdyrylyşlaryny we dükandaky mahabatlary geçirmek',
        ru: 'Проводить презентации продуктов и внутримагазинные акции',
      },
      {
        en: 'Collect and report market intelligence and competitor data',
        tm: 'Bazar maglumatlaryny we bäsdeş maglumatlaryny ýygnamak we hasabat bermek',
        ru: 'Собирать и передавать данные о рынке и конкурентах',
      },
      {
        en: 'Process orders and ensure timely delivery coordination',
        tm: 'Sargytlary gaýtadan işlemek we öz wagtynda eltip bermegi üpjün etmek',
        ru: 'Обрабатывать заказы и обеспечивать своевременную координацию доставки',
      },
    ],
    requirements: [
      {
        en: 'At least 1 year of field sales experience',
        tm: 'Iň az 1 ýyl meýdan satuw tejribesi',
        ru: 'Не менее 1 года опыта полевых продаж',
      },
      {
        en: 'Valid driving licence and willingness to travel within the region',
        tm: 'Güýçli sürüjilik şahadatnamasy we sebitde syýahat etmäge taýýarlyk',
        ru: 'Действующие водительские права и готовность к разъездам по региону',
      },
      {
        en: 'Strong interpersonal and negotiation skills',
        tm: 'Güýçli adamara we gepleşik endikleri',
        ru: 'Сильные межличностные и переговорные навыки',
      },
    ],
    niceToHave: [
      {
        en: 'Prior experience in beverage, food or FMCG sales',
        tm: 'Içgi, azyk ýa-da FMCG satuwynda öňki tejribe',
        ru: 'Предыдущий опыт в продажах напитков, продуктов питания или FMCG',
      },
    ],
    benefits: [
      {
        en: 'Base salary plus commission on achieved sales',
        tm: 'Esasy aýlyk artı gazanylan satuwdan komissiýa',
        ru: 'Базовая зарплата плюс комиссия с достигнутых продаж',
      },
      {
        en: 'Company vehicle or fuel allowance',
        tm: 'Kompaniýa ulagy ýa-da ýangyç ödegligi',
        ru: 'Служебный автомобиль или компенсация топлива',
      },
      {
        en: 'Mobile phone allowance',
        tm: 'Jübi telefony ödegligi',
        ru: 'Компенсация мобильной связи',
      },
      {
        en: 'Monthly RAHATLYK product allowance',
        tm: 'Aýlyk RAHATLYK önüm ödegligi',
        ru: 'Ежемесячное пособие на продукцию RAHATLYK',
      },
    ],
    salary: '2500–4000 TMT + commission',
    postedDate: '2026-06-04',
  },

  // ── 6 · Key Account Manager ──────────────────────────────────────────────
  {
    titleEn: 'Key Account Manager',
    title: {
      en: 'Key Account Manager',
      tm: 'Esasy Hasap Müdiri',
      ru: 'Менеджер по ключевым клиентам',
    },
    department: 'sales',
    location: {
      en: 'Ashgabat, Turkmenistan',
      tm: 'Aşgabat, Türkmenistan',
      ru: 'Ашхабад, Туркменистан',
    },
    type: 'fullTime',
    overview: {
      en: 'As Key Account Manager at RAHATLYK, you will manage and develop strategic relationships with our most important retail and distribution partners. You will negotiate commercial agreements, drive joint business plans, and ensure long-term growth with key accounts.',
      tm: 'RAHATLYK-da Esasy Hasap Müdiri hökmünde iň möhüm bölek satuw we paýlaýyş hyzmatdaşlarymyz bilen strategik gatnaşyklary dolandyrar we ösdürers. Siz täjirçilik şertnamalaryny gepleşdirer, bilelikdäki işewürlik meýilnamalaryny hereketlendirer we esasy hasaplar bilen uzak möhletli ösüşi üpjün edersiňiz.',
      ru: 'В роли менеджера по ключевым клиентам RAHATLYK вы будете управлять и развивать стратегические отношения с нашими важнейшими розничными и дистрибуторскими партнёрами. Вы будете вести переговоры, разрабатывать совместные бизнес-планы и обеспечивать долгосрочный рост с ключевыми клиентами.',
    },
    responsibilities: [
      {
        en: 'Manage a portfolio of key retail and distribution accounts',
        tm: 'Esasy bölek satuw we paýlaýyş hasaplar portfelini dolandyrmak',
        ru: 'Управлять портфелем ключевых розничных и дистрибуторских аккаунтов',
      },
      {
        en: 'Develop and execute joint business plans with strategic partners',
        tm: 'Strategik hyzmatdaşlar bilen bilelikdäki işewürlik meýilnamalaryny işläp taýýarlamak we durmuşa geçirmek',
        ru: 'Разрабатывать и реализовывать совместные бизнес-планы со стратегическими партнёрами',
      },
      {
        en: 'Negotiate contracts, pricing and promotional terms',
        tm: 'Şertnamalary, bahalandyrmany we mahabat şertlerini gepleşdirmek',
        ru: 'Вести переговоры по контрактам, ценообразованию и условиям акций',
      },
      {
        en: 'Track account performance and proactively resolve issues',
        tm: 'Hasap öndürijiligini yzarlamak we meselelerini öňüni alyp çözmek',
        ru: 'Отслеживать эффективность работы клиентов и проактивно решать проблемы',
      },
    ],
    requirements: [
      {
        en: 'Minimum 3 years of key account or B2B sales experience',
        tm: 'Iň az 3 ýyl esasy hasap ýa-da B2B satuw tejribesi',
        ru: 'Минимум 3 года опыта работы с ключевыми клиентами или в B2B-продажах',
      },
      {
        en: 'Proven track record of achieving and exceeding sales targets',
        tm: 'Satuw maksatlaryna ýetmegiň we geçmegiň subut edilen yzarlamasy',
        ru: 'Подтверждённый опыт достижения и превышения плановых показателей продаж',
      },
      {
        en: 'Excellent communication and presentation skills',
        tm: 'Ajaýyp aragatnaşyk we tanyşdyrylyş başarnyklary',
        ru: 'Отличные коммуникативные и презентационные навыки',
      },
    ],
    niceToHave: [
      {
        en: 'Experience managing national retail chains',
        tm: 'Milli bölek satuw zynjyrlaryny dolandyrmak tejribesi',
        ru: 'Опыт управления национальными розничными сетями',
      },
    ],
    benefits: [
      {
        en: 'Competitive base salary and quarterly bonuses',
        tm: 'Bäsdeşlik ukyply esasy aýlyk we çärýeklik bonuslar',
        ru: 'Конкурентная базовая зарплата и квартальные бонусы',
      },
      {
        en: 'Company car and travel expenses covered',
        tm: 'Kompaniýa awtoulagy we syýahat çykdajylary tölenilýär',
        ru: 'Служебный автомобиль и покрытие командировочных расходов',
      },
      {
        en: 'Health insurance and wellness benefits',
        tm: 'Saglyk ätiýaçlandyrmasy we saglygy goraýyş artykmaçlyklary',
        ru: 'Медицинская страховка и оздоровительные льготы',
      },
      {
        en: 'Monthly RAHATLYK product allowance',
        tm: 'Aýlyk RAHATLYK önüm ödegligi',
        ru: 'Ежемесячное пособие на продукцию RAHATLYK',
      },
    ],
    salary: '5000–8000 TMT',
    postedDate: '2026-06-01',
  },

  // ── 7 · Logistics Coordinator ────────────────────────────────────────────
  {
    titleEn: 'Logistics Coordinator',
    title: {
      en: 'Logistics Coordinator',
      tm: 'Logistika Utgaşdyryjysy',
      ru: 'Координатор логистики',
    },
    department: 'logistics',
    location: {
      en: 'Ashgabat, Turkmenistan',
      tm: 'Aşgabat, Türkmenistan',
      ru: 'Ашхабад, Туркменистан',
    },
    type: 'fullTime',
    overview: {
      en: 'RAHATLYK is looking for a Logistics Coordinator to ensure the smooth and efficient flow of products from our production facility to distribution points across the country. You will coordinate with carriers, manage delivery schedules, and maintain accurate inventory records.',
      tm: 'RAHATLYK önümlerimiziň önümçilik desgamyzdan ýurt boýunça paýlaýyş nokatlaryna çenli arassa we netijeliligini üpjün etmek üçin Logistika Utgaşdyryjysyny gözleýär. Siz daşaýjylar bilen utgaşdyrar, eltip beriş tertiplerine dolandyrar we takyk inwentar ýazgylaryny saklarsyňyz.',
      ru: 'RAHATLYK ищет координатора по логистике для обеспечения бесперебойного и эффективного движения продукции от нашего производственного предприятия до дистрибуторских точек по всей стране. Вы будете координировать работу с перевозчиками и управлять графиком доставки.',
    },
    responsibilities: [
      {
        en: 'Plan and coordinate daily delivery routes and schedules',
        tm: 'Gündelik eltip beriş ugurlaryny we tertiplerini meýilleşdirmek we utgaşdyrmak',
        ru: 'Планировать и координировать ежедневные маршруты и графики доставки',
      },
      {
        en: 'Liaise with carriers, drivers and warehouse staff',
        tm: 'Daşaýjylar, sürüjiler we ammar işgärleri bilen aragatnaşyk saklamak',
        ru: 'Поддерживать связь с перевозчиками, водителями и складским персоналом',
      },
      {
        en: 'Track shipments and resolve delivery exceptions promptly',
        tm: 'Ýüklemeleri yzarlamak we eltip beriş kadadan çykmalary çalt çözmek',
        ru: 'Отслеживать отгрузки и оперативно устранять исключения при доставке',
      },
      {
        en: 'Maintain accurate shipping documentation and records',
        tm: 'Takyk ýük resminamalaryny we ýazgylaryny saklamak',
        ru: 'Вести точную транспортную документацию и записи',
      },
      {
        en: 'Optimise delivery costs while maintaining service levels',
        tm: 'Hyzmat derejesini saklap, eltip beriş çykdajylaryny optimizirlemek',
        ru: 'Оптимизировать расходы на доставку при сохранении уровня обслуживания',
      },
    ],
    requirements: [
      {
        en: 'Minimum 2 years of experience in logistics or supply chain',
        tm: 'Logistika ýa-da üpjünçilik zynjyrynda iň az 2 ýyl tejribe',
        ru: 'Минимум 2 года опыта работы в логистике или управлении цепочками поставок',
      },
      {
        en: 'Good knowledge of local transport regulations and routes',
        tm: 'Ýerli ulag düzgünnamalary we ugurlary barada gowy bilim',
        ru: 'Хорошее знание местных транспортных правил и маршрутов',
      },
      {
        en: 'Strong organisational and problem-solving skills',
        tm: 'Güýçli guramajylyk we mesele çözme başarnyklary',
        ru: 'Сильные организационные навыки и навыки решения проблем',
      },
    ],
    niceToHave: [
      {
        en: 'Experience with transport management software',
        tm: 'Ulag dolandyryş programma üpjünçiligi bilen tejribe',
        ru: 'Опыт работы с программным обеспечением для управления транспортом',
      },
      {
        en: 'Knowledge of cold chain logistics',
        tm: 'Sowuk zynjyr logistikasy barada bilim',
        ru: 'Знание логистики холодовой цепи',
      },
    ],
    benefits: [
      {
        en: 'Competitive salary and shift allowances',
        tm: 'Bäsdeşlik ukyply aýlyk we nobatçylyk ödeglikleri',
        ru: 'Конкурентная заработная плата и надбавки за смены',
      },
      {
        en: 'Health insurance coverage',
        tm: 'Saglyk ätiýaçlandyrmasy',
        ru: 'Медицинское страхование',
      },
      {
        en: 'Paid annual leave and public holidays',
        tm: 'Tölenýän ýyllyk rugsat we döwlet baýramlary',
        ru: 'Оплачиваемый ежегодный отпуск и государственные праздники',
      },
      {
        en: 'Monthly RAHATLYK product allowance',
        tm: 'Aýlyk RAHATLYK önüm ödegligi',
        ru: 'Ежемесячное пособие на продукцию RAHATLYK',
      },
    ],
    salary: '3000–4500 TMT',
    postedDate: '2026-06-06',
  },

  // ── 8 · Warehouse & Distribution Supervisor ──────────────────────────────
  {
    titleEn: 'Warehouse & Distribution Supervisor',
    title: {
      en: 'Warehouse & Distribution Supervisor',
      tm: 'Ammar we Paýlaýyş Gözegçisi',
      ru: 'Супервайзер склада и дистрибуции',
    },
    department: 'logistics',
    location: {
      en: 'Ashgabat, Turkmenistan',
      tm: 'Aşgabat, Türkmenistan',
      ru: 'Ашхабад, Туркменистан',
    },
    type: 'fullTime',
    overview: {
      en: 'We are looking for an experienced Warehouse & Distribution Supervisor to oversee all warehouse operations and outbound distribution for RAHATLYK. You will lead a team of warehouse staff, ensure product integrity, and manage inventory levels to support uninterrupted supply.',
      tm: 'Biz RAHATLYK üçin ähli ammar amallaryna we çykýan paýlaýşa gözegçilik etmek üçin tejribeli Ammar we Paýlaýyş Gözegçisini gözleýäris. Siz ammar işgärlerinden ybarat toparyna ýolbaşçylyk edersiňiz, önüm bütinligini üpjün edersiňiz we üznüksiz üpjünçiligi goldamak üçin inwentar derejesini dolandyrarsyňyz.',
      ru: 'Мы ищем опытного супервайзера склада и дистрибуции для надзора за всеми складскими операциями и исходящей дистрибуцией RAHATLYK. Вы будете руководить командой складских сотрудников, обеспечивать сохранность продукции и управлять запасами.',
    },
    responsibilities: [
      {
        en: 'Supervise daily warehouse operations including receiving, storage and dispatch',
        tm: 'Kabul etmegi, saklamagy we ugratmagy goşmak bilen gündelik ammar amallaryna gözegçilik etmek',
        ru: 'Контролировать ежедневные складские операции, включая приёмку, хранение и отгрузку',
      },
      {
        en: 'Lead and motivate a team of warehouse operatives',
        tm: 'Ammar işgärlerinden ybarat topara ýolbaşçylyk etmek we höweslendirmek',
        ru: 'Руководить и мотивировать команду складских операторов',
      },
      {
        en: 'Conduct regular stock counts and inventory reconciliations',
        tm: 'Yzygiderli inwentar sanawlaryny we utgaşdyrmalaryny geçirmek',
        ru: 'Проводить регулярные инвентаризации и сверки запасов',
      },
      {
        en: 'Ensure compliance with health, safety and food storage standards',
        tm: 'Saglyk, howpsuzlyk we azyk saklaýyş standartlary bilen laýyklygy üpjün etmek',
        ru: 'Обеспечивать соблюдение норм охраны труда и стандартов хранения пищевой продукции',
      },
      {
        en: 'Coordinate with logistics and production teams for demand planning',
        tm: 'Isleg meýilnamasyny düzmek üçin logistika we önümçilik toparlary bilen utgaşdyrmak',
        ru: 'Координировать с командами логистики и производства для планирования спроса',
      },
    ],
    requirements: [
      {
        en: 'Minimum 3 years of warehouse supervisory experience',
        tm: 'Iň az 3 ýyl ammar gözegçilik tejribesi',
        ru: 'Минимум 3 года опыта супервайзера склада',
      },
      {
        en: 'Strong knowledge of warehouse management principles and inventory control',
        tm: 'Ammar dolandyryş prinsipleri we inwentar gözegçiligi barada güýçli bilim',
        ru: 'Глубокое знание принципов управления складом и контроля запасов',
      },
      {
        en: 'Ability to lead and develop a team',
        tm: 'Topar döretmek we ösdürmek başarnygy',
        ru: 'Способность руководить командой и развивать её',
      },
    ],
    niceToHave: [
      {
        en: 'Forklift licence or experience operating warehouse equipment',
        tm: 'Wилочный погрузчик şahadatnamasy ýa-da ammar enjamlaryny dolandyrmak tejribesi',
        ru: 'Права на управление погрузчиком или опыт работы со складским оборудованием',
      },
      {
        en: 'Experience with WMS (Warehouse Management System)',
        tm: 'WMS (Ammar Dolandyryş Ulgamy) bilen tejribe',
        ru: 'Опыт работы с WMS (системой управления складом)',
      },
    ],
    benefits: [
      {
        en: 'Competitive salary with shift and weekend allowances',
        tm: 'Nobatçylyk we dynç günleri ödeglikleri bolan bäsdeşlik ukyply aýlyk',
        ru: 'Конкурентная заработная плата с надбавками за смены и выходные дни',
      },
      {
        en: 'Health insurance coverage',
        tm: 'Saglyk ätiýaçlandyrmasy',
        ru: 'Медицинское страхование',
      },
      {
        en: 'Uniform and personal protective equipment provided',
        tm: 'Forma geýim we şahsy gorag enjamlary berilýär',
        ru: 'Предоставляется форменная одежда и средства индивидуальной защиты',
      },
      {
        en: 'Monthly RAHATLYK product allowance',
        tm: 'Aýlyk RAHATLYK önüm ödegligi',
        ru: 'Ежемесячное пособие на продукцию RAHATLYK',
      },
    ],
    salary: '3500–5000 TMT',
    postedDate: '2026-06-07',
  },
]
