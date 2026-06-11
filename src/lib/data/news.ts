export type NewsCategory = 'company' | 'health' | 'products' | 'sustainability';

export interface Article {
  id: number;
  category: NewsCategory;
  title: string;
  excerpt: string;
  body: string[]; // Each string is one paragraph
  date: string;
  readTime: number;
  featured: boolean;
  gradient: string;
  emoji: string;
  image: string;   // primary image (also used as images[0] fallback)
  images?: string[]; // slideshow images — overrides `image` when provided
}

export const ARTICLES: Article[] = [
  {
    id: 1,
    category: 'company',
    title: 'RAHATLYK Launches Eco-Friendly Packaging Line',
    excerpt:
      'As part of our ongoing commitment to sustainability, we are proud to announce the rollout of our new 100% recycled PET bottles across our full water range.',
    body: [
      'Today marks a major milestone in RAHATLYK\'s journey toward a more sustainable future. Starting this month, every bottle of RAHATLYK Drinking Water and Mineral Water will be produced using 100% recycled PET (rPET) plastic — a material with a carbon footprint up to 70% lower than virgin PET.',
      'The transition to recycled packaging is the result of three years of research, supplier development, and investment in new production equipment at our Ashgabat facility. We worked closely with packaging engineers across Europe and Central Asia to ensure that our rPET bottles meet the same rigorous food-safety and product-integrity standards as the bottles they replace. Every batch is independently certified before it reaches our filling lines.',
      'Consumers will notice the new eco-label on shelves from February 2026. The bottles are visually identical to the current range but carry a small recycled-loop symbol and the tagline "Made with 100% recycled plastic" — a reminder that choosing RAHATLYK is a small but meaningful step for the environment.',
      'This initiative is the first phase of our 2030 Sustainability Roadmap, which commits RAHATLYK to eliminating all virgin plastic from our packaging by 2028, achieving carbon neutrality in production by 2029, and launching a closed-loop collection and recycling programme across Turkmenistan by 2030. We believe that a company built on the purity of nature has a special obligation to protect it — and we intend to lead by example.',
      '"We are immensely proud of what our team has achieved," said Atamurat Sarwanov, CEO of RAHATLYK. "This is not a marketing exercise. It is a fundamental shift in how we operate, and it is just the beginning."',
    ],
    date: 'January 15, 2026',
    readTime: 3,
    featured: true,
    gradient: 'from-brand-400 via-blue-500 to-brand-800',
    emoji: '🌿',
    image: '/story/photo-1.jpg',
    images: ['/story/photo-1.jpg', '/news/1.5liter-bottles.jpg', '/news/unnamed.jpg'],
  },
  {
    id: 2,
    category: 'health',
    title: 'The Science of Proper Hydration',
    excerpt:
      'New research confirms what we have always known: drinking the right amount of quality water each day significantly improves cognitive function, energy, and overall wellbeing.',
    body: [
      'For decades, the advice to "drink eight glasses of water a day" has circulated as common wisdom. But what does the latest science actually say about hydration — and does the quality of the water you drink matter as much as the quantity?',
      'A landmark study published in the Journal of Nutritional Biochemistry in late 2025 followed 1,200 adults across six countries over 18 months, measuring hydration status against a battery of cognitive and physical performance markers. The findings were striking: participants who maintained consistent, adequate hydration throughout the day performed 14% better on concentration tests, reported 22% less fatigue, and showed measurably lower levels of inflammatory markers compared to those who were even mildly dehydrated.',
      'Critically, the study also examined water source. Participants drinking mineral-rich natural waters — those with measurable calcium, magnesium, and bicarbonate content — showed stronger cardiovascular benefits than those drinking heavily filtered or distilled water. The mineral content, it turns out, is not incidental. Magnesium, for instance, plays a direct role in over 300 enzymatic reactions in the body, and most people do not get enough of it from food alone.',
      'At RAHATLYK, this is something we have always understood. Our mineral water range is not simply "water with bubbles." It is drawn from deep geological formations that have spent thousands of years absorbing the specific mineral profile that our bodies are evolutionarily adapted to benefit from. The natural bicarbonate aids digestion. The calcium supports bones. The silica in our spring water has been linked in multiple studies to improved skin elasticity and joint lubrication.',
      'So how much should you drink? The current consensus from the World Health Organisation and leading sports medicine bodies is 2–3 litres per day for adults, adjusted upward in hot climates or during physical activity. In Turkmenistan\'s summer months, with temperatures regularly exceeding 40°C, that figure should be closer to 3.5 litres. The key is to drink consistently throughout the day — not in large amounts all at once — and to not wait until you feel thirsty, which is already a sign of mild dehydration.',
    ],
    date: 'January 8, 2026',
    readTime: 5,
    featured: false,
    gradient: 'from-emerald-400 to-teal-600',
    emoji: '🧬',
    image: '/story/photo-2.jpg',
    images: ['/story/photo-2.jpg', '/story/photo-8.jpg'],
  },
  {
    id: 3,
    category: 'products',
    title: 'Introducing Our New Premium Juice Collection',
    excerpt:
      'Cold-pressed from hand-selected fruits at peak ripeness, our new juice line delivers unmatched freshness. Available in Apple, Orange, Grape and Peach varieties.',
    body: [
      'RAHATLYK is proud to introduce its most ambitious product launch to date: a four-variety premium juice collection crafted using cold-press technology and fruit sourced exclusively from select orchards across Central Asia and the broader region.',
      'Cold pressing is a fundamentally different process from the conventional heat-pasteurisation methods used by most juice producers. Rather than applying heat — which destroys heat-sensitive vitamins, enzymes, and delicate flavour compounds — cold pressing uses hydraulic pressure to extract juice from the fruit. The result is a juice that retains up to 40% more Vitamin C, preserves natural enzymes, and tastes unmistakably like the fresh fruit itself.',
      'Our Apple variety is made from a single-origin Turkmen apple varietal known for its high sugar-to-acid ratio and aromatic depth. The Orange juice uses hand-selected Navel oranges at their peak Brix level, delivering 41 mg of Vitamin C per 100 ml — more than most pharmaceutical supplements. Our Grape juice blends three varietals — Kishmish, Cabernet Sauvignon, and Concord — to achieve a complex, deep flavour profile rich in resveratrol and natural anthocyanins. And our Peach nectar, blended from white and yellow peaches, is the most indulgent of the four: velvety, aromatic, and naturally sweet.',
      'Every batch is pressed and bottled within four hours of fruit harvest. No concentrates are used at any stage. No added sugars, artificial flavours, or colours. The bottles are designed for single-serve and family consumption, with a tamper-evident seal that visually confirms the product has never been opened.',
      'The new juice collection is available now in leading supermarkets, pharmacies, and RAHATLYK direct channels across Ashgabat, with nationwide distribution planned for March 2026. We recommend serving chilled and consuming within 72 hours of opening for the best flavour experience.',
    ],
    date: 'December 28, 2025',
    readTime: 4,
    featured: false,
    gradient: 'from-amber-400 to-orange-600',
    emoji: '🍊',
    image: '/story/photo-3.jpg',
    images: ['/story/photo-3.jpg', '/news/5302e53eaeab4a3ca53e88bc3aceec7e.webp'],
  },
  {
    id: 4,
    category: 'sustainability',
    title: "RAHATLYK's Journey to Zero Plastic Waste by 2030",
    excerpt:
      'Our five-year roadmap outlines concrete steps toward eliminating single-use plastics: plant-based packaging, glass refill stations, and a closed-loop recycling scheme.',
    body: [
      'Today, we are publishing RAHATLYK\'s full 2030 Sustainability Roadmap — a binding, publicly accountable commitment to achieving zero plastic waste in our operations and supply chain within five years.',
      'The roadmap is built on three pillars. The first is packaging transformation. By the end of 2026, all RAHATLYK water products will use 100% recycled PET (already underway). By 2027, we will launch our first plant-based bottle made from sugarcane-derived bio-PET, available initially in our premium spring water line. By 2028, we aim to have eliminated all virgin plastic from our portfolio entirely.',
      'The second pillar is infrastructure. In partnership with the Ashgabat Municipality and three private retail chains, we will install 50 RAHATLYK Refill Stations across the city by mid-2027. These stations allow consumers to refill approved glass or stainless-steel containers with chilled, filtered RAHATLYK water at a subsidised price — removing the need for single-use bottles entirely for regular consumers. A deposit scheme for glass bottles will launch alongside this, modelled on successful programmes in Germany and Austria.',
      'The third pillar is collection and recovery. We are partnering with a Turkmenistan-based recycling cooperative to establish the country\'s first beverage-specific closed-loop collection system. QR codes on our packaging will allow consumers to track exactly where their bottle ends up — and earn reward points redeemable for RAHATLYK products when they use designated drop-off points.',
      'We recognise that none of this is easy, and that some of it will cost more in the short term. But we believe that the cost of inaction is greater — for our planet, for our communities, and ultimately for our business. Clean water depends on a clean environment. That connection is not abstract for us. It is the foundation of everything we do.',
    ],
    date: 'December 20, 2025',
    readTime: 6,
    featured: false,
    gradient: 'from-lime-400 to-green-600',
    emoji: '♻️',
    image: '/story/photo-4.jpg',
    images: ['/story/photo-4.jpg', '/story/photo-9.jpg'],
  },
  {
    id: 5,
    category: 'health',
    title: 'Mineral Water: Benefits Beyond Hydration',
    excerpt:
      'The unique mineral profile of our spring water — calcium, magnesium, silica — provides measurable benefits for bone density, cardiovascular health, and skin clarity.',
    body: [
      'Most people think of mineral water as simply water with a more interesting taste. The reality, supported by a growing body of clinical research, is considerably more compelling.',
      'Calcium is the most abundant mineral in the human body, and while we typically think of dairy as the primary dietary source, mineral water can contribute meaningfully to daily intake — particularly for people who are lactose intolerant or follow plant-based diets. RAHATLYK Mineral Water contains 68 mg of calcium per litre. At two litres per day, that delivers 14% of the EU recommended daily intake — comparable to a small serving of yoghurt.',
      'Magnesium is perhaps even more important. It participates in over 300 enzymatic reactions, including those governing muscle contraction, nerve transmission, blood sugar regulation, and blood pressure. The majority of the population in developed countries is estimated to be sub-optimally supplied with magnesium. Our mineral water provides 24 mg per litre — a meaningful contribution to closing that gap.',
      'Silica — or silicon dioxide — is less well known but increasingly studied. It is a critical cofactor for collagen synthesis, meaning it plays a direct role in skin elasticity, joint cartilage health, and bone density. Our highland spring water naturally contains 22 mg of silica per litre, a notably high concentration. Several observational studies have linked high silica intake from drinking water to reduced rates of Alzheimer\'s disease, though the mechanism is still being investigated.',
      'The bicarbonate content in our sparkling mineral water (210 mg/L) has also been shown in controlled trials to improve digestive comfort, reduce acid reflux symptoms, and modestly lower LDL cholesterol when consumed regularly with meals. For those with a tendency toward acid-related digestive discomfort, switching from still water to a naturally carbonated mineral water at mealtimes can make a noticeable difference.',
      'Of course, mineral water is not medicine. But when you choose what to drink every day, choosing water that actively contributes to your health rather than simply hydrating you is a decision worth making.',
    ],
    date: 'December 15, 2025',
    readTime: 4,
    featured: false,
    gradient: 'from-brand-400 to-blue-500',
    emoji: '💎',
    image: '/story/photo-5.jpg',
    images: ['/story/photo-5.jpg', '/news/1.5liter-bottles.jpg'],
  },
  {
    id: 6,
    category: 'company',
    title: 'RAHATLYK Awarded Best Beverage Brand 2025',
    excerpt:
      "We're honoured to receive the Central Asian Beverage Association's highest distinction for the third consecutive year.",
    body: [
      'For the third consecutive year, RAHATLYK has been awarded the Best Beverage Brand distinction by the Central Asian Beverage Association (CABA) at its annual industry gala held in Tashkent, Uzbekistan on December 8, 2025.',
      'The CABA award is the most rigorous recognition in the regional industry. Candidates are evaluated across seven criteria: product quality and safety, innovation, sustainability, consumer trust, brand equity, operational excellence, and community impact. RAHATLYK scored highest in product quality, sustainability, and consumer trust — the three areas our leadership team has invested in most heavily over the past three years.',
      '"Winning this award once is gratifying," said Atamurat Sarwanov, CEO. "Winning it three times in a row tells us that our strategy is working and that consumers genuinely value what we stand for. But it also raises the bar. We cannot afford to stand still."',
      'The ceremony was attended by representatives from over 40 beverage companies across Kazakhstan, Uzbekistan, Kyrgyzstan, Tajikistan, and Turkmenistan. RAHATLYK was the only Turkmen company to receive an individual brand award, with two other Turkmen producers receiving commendations in the manufacturing excellence category.',
      'The award comes during a transformative year for RAHATLYK. The company launched its new juice collection, announced its 2030 sustainability roadmap, broke ground on an expanded bottling facility, and began the rollout of its recycled PET packaging initiative. The next twelve months are expected to be equally active, with a new energy drink variant, international distribution trials, and the opening of the first RAHATLYK brand experience store planned for the first half of 2026.',
    ],
    date: 'December 10, 2025',
    readTime: 2,
    featured: false,
    gradient: 'from-violet-400 to-purple-600',
    emoji: '🏆',
    image: '/story/photo-6.jpg',
    images: ['/story/photo-6.jpg', '/story/photo-1.jpg'],
  },
  {
    id: 7,
    category: 'products',
    title: 'New Herbal Tea Line: Calm in Every Sip',
    excerpt:
      'Our Chamomile, Green, and Mint blends are now available in stores nationwide. Made with sustainably sourced herbs and zero added sugar.',
    body: [
      'RAHATLYK is expanding beyond water and juices with the launch of its first ready-to-drink herbal tea collection: three varieties crafted to deliver genuine functional benefits alongside a taste that is clean, natural, and satisfying.',
      'The collection launches with three products. RAHATLYK Green Tea is brewed from whole-leaf green tea sourced from high-altitude gardens in Georgia, steeped at 70°C — the precise temperature required to maximise catechin extraction while avoiding the bitter tannins that result from over-heating. Each 500ml bottle contains 225 mg of catechins, including 68 mg of EGCG, one of the most potent natural antioxidants identified by nutritional science.',
      'RAHATLYK Chamomile is made from whole chamomile flowers rather than the extract or powder used by most commercial producers. The difference in flavour is immediately apparent — fuller, more floral, with a lingering warmth that dried extract products cannot replicate. A touch of natural wildflower honey completes the profile. The apigenin content in whole-flower chamomile is meaningfully higher than in extract-based products, which is significant given apigenin\'s well-documented role in reducing anxiety and improving sleep quality.',
      'The third variety — Mint Infusion — is a crisp, clean peppermint tea with no added sweeteners, designed as a post-meal digestive aid and a refreshing alternative to carbonated soft drinks. The peppermint oil content naturally elevates the menthol sensation on the palate, making it one of the most refreshing cold beverages we have ever produced.',
      'All three varieties are completely free of added sugar, artificial flavours, colours, and preservatives. They are available chilled in 500ml bottles and in 250ml single-serve packs. Look for them in the chilled beverages section of your nearest supermarket or pharmacy.',
    ],
    date: 'November 28, 2025',
    readTime: 3,
    featured: false,
    gradient: 'from-teal-400 to-green-500',
    emoji: '🌱',
    image: '/story/photo-7.jpg',
    images: ['/story/photo-7.jpg', '/story/photo-3.jpg'],
  },
  {
    id: 8,
    category: 'sustainability',
    title: "Protecting Turkmenistan's Natural Springs",
    excerpt:
      'RAHATLYK partners with the Ministry of Environment on a multi-year programme to monitor and protect the groundwater sources we rely on.',
    body: [
      'The water in every RAHATLYK bottle begins its journey centuries ago, filtering through layers of rock deep beneath the Kopet Dag mountains and the Karakum desert. Protecting those aquifers and spring systems is not just good environmental practice for us — it is an existential business requirement. That is why we have entered a formal multi-year partnership with Turkmenistan\'s Ministry of Nature Protection to co-fund and co-manage a groundwater monitoring and conservation programme covering our primary source areas.',
      'The programme, which launches in Q1 2026 with an initial five-year commitment, will deploy 24 monitoring stations across three aquifer zones. These stations will measure water table depth, flow rates, mineral composition, and microbial quality on a continuous basis, transmitting data in real time to both RAHATLYK\'s quality team and the Ministry\'s environmental database. Any anomaly — a drop in flow rate, a change in mineral profile, the presence of agricultural runoff — will trigger an immediate joint response protocol.',
      'Beyond monitoring, the programme includes a reforestation component. The root systems of native trees play a critical role in groundwater recharge by slowing surface runoff and allowing precipitation to percolate slowly into the soil rather than washing away. In coordination with the Forestry Department, we will plant 200,000 native trees across the catchment areas of our monitored springs over the programme\'s first three years.',
      'We are also working with local farming communities in the vicinity of our spring sources to introduce water-efficient irrigation practices. Agriculture accounts for the majority of freshwater consumption in Turkmenistan, and inefficient irrigation is the single largest threat to groundwater levels in the region. By offering subsidised drip-irrigation equipment and training, we hope to reduce agricultural water draw from the aquifers our products depend on by an estimated 15–20% within five years.',
      '"This is the most important initiative RAHATLYK has ever undertaken," said Mahym Rejepova, Chief Operations Officer. "Producing clean water starts with protecting clean water. We cannot separate those two things, and we will not pretend otherwise."',
    ],
    date: 'November 15, 2025',
    readTime: 5,
    featured: false,
    gradient: 'from-brand-600 to-indigo-600',
    emoji: '🌍',
    image: '/story/photo-9.jpg',
    images: ['/story/photo-9.jpg', '/story/photo-4.jpg', '/news/unnamed.jpg'],
  },
];
