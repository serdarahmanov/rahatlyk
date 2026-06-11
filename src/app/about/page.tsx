'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type MoodKey = 'fresh' | 'energy' | 'play' | 'calm';

type Mood = {
  key: MoodKey;
  label: string;
  word: string;
  tint: string;
  product: string;
  desc: string;
};

const headingStyle = { fontFamily: 'var(--font-heading), sans-serif' };
const accentStyle = { fontFamily: 'var(--font-accent), Georgia, "Times New Roman", serif' };

const PILLARS = [
  { title: 'Purity,', accent: 'first', image: '/story/photo-2.jpg', alt: 'Clear water texture' },
  { title: 'Flavour with', accent: 'character', image: '/reference/KarunaJuice_Photo_RainbowlFoods.jpg', alt: 'Fresh fruit drink' },
  { title: 'Comfort,', accent: 'bottled', image: '/story/photo-4.jpg', alt: 'Warm natural scene' },
];

const CASES = [
  {
    title: 'The Waters',
    accent: 'Waters',
    desc: 'Drinking water and naturally balanced mineral water - purified, tested batch by batch, and bottled at our own facility. The foundation of everything we make.',
    images: ['/news/1.5liter-bottles.jpg', '/story/photo-2.jpg', '/story/photo-8.jpg'],
  },
  {
    title: 'Juices & Soft Drinks',
    accent: '&',
    desc: 'Sun-ripened fruit pressed to taste like the season, plus sparkling soft drinks made for good company. Recipes developed entirely in-house.',
    images: ['/reference/New-250ml-Juice-Banner-Website.jpg', '/reference/KarunaJuice_Photo_RainbowlFoods.jpg', '/reference/Smoothie-Drink-Product-Photography-Studio-in-London-Innocent-Smoothies-Neve-Studios-1.webp'],
  },
  {
    title: 'Energy & Calm',
    accent: '&',
    desc: 'A clean charge for people who keep moving, and herbal teas that slow the evening down. Two ends of the day, one collection.',
    images: ['/story/photo-6.jpg', '/story/photo-3.jpg', '/story/photo-5.jpg'],
  },
];

const MILESTONES = [
  {
    title: 'The first drop',
    lead: '2003.',
    body: 'Rahatlyk begins with one product and one goal: drinking water every family can rely on, bottled to a standard people can trust.',
  },
  {
    title: 'Minerals',
    lead: '2008.',
    body: 'Naturally balanced mineral water extends the line into everyday wellness and gives the brand a clearer production identity.',
  },
  {
    title: 'Colour',
    lead: '2013.',
    body: 'Juices and soft drinks launch, bringing fruit, sparkle and seasonal flavour into the same in-house production culture.',
  },
  {
    title: 'Energy & calm',
    lead: '2018.',
    body: 'Energy drinks for active days and herbal teas for slower evenings turn the collection into a full rhythm of daily refreshment.',
  },
  {
    title: 'Today',
    lead: 'Now.',
    body: 'A modern production family with six beverage collections, tighter quality control and a platform that brings Rahatlyk directly to customers.',
    current: true,
  },
];

const STATS = [
  { value: 6, suffix: '', label: 'product collections, from water to herbal teas' },
  { value: 100, suffix: '%', label: 'produced and bottled inside Turkmenistan' },
  { value: 20, suffix: '+', label: 'flavours and formats across all collections' },
  { value: 5, suffix: '', label: 'quality-control stages from source to bottle' },
];

const MOODS: Mood[] = [
  {
    key: 'fresh',
    label: 'Refreshed',
    word: 'refreshed',
    tint: '#4FA3B5',
    product: 'Rahatlyk - Drinking Water',
    desc: 'Cold, clear and exactly what you need. Our drinking water never misses.',
  },
  {
    key: 'energy',
    label: 'Unstoppable',
    word: 'unstoppable',
    tint: '#8FA84A',
    product: 'Rahatlyk - Energy Drink',
    desc: 'A clean spark for whatever you are about to conquer. Keep moving.',
  },
  {
    key: 'play',
    label: 'Playful',
    word: 'playful',
    tint: '#D98A55',
    product: 'Rahatlyk - Juices & Soft Drinks',
    desc: 'Bright, fruity, sparkling - made for good company and better laughs.',
  },
  {
    key: 'calm',
    label: 'Cozy',
    word: 'cozy',
    tint: '#B07A4E',
    product: 'Rahatlyk - Herbal Tea',
    desc: 'Warm hands, slow breath, quiet evening. We bottled that feeling.',
  },
];

export default function AboutPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLElement>(null);
  const heroDarkRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const moodSectionRef = useRef<HTMLElement>(null);
  const moodCursorRef = useRef<HTMLDivElement>(null);
  const moodGlowRef = useRef<HTMLDivElement>(null);
  const moodWordRef = useRef<HTMLSpanElement>(null);
  const moodDescRef = useRef<HTMLParagraphElement>(null);
  const moodProductRef = useRef<HTMLParagraphElement>(null);
  const moodTintRef = useRef<HTMLDivElement>(null);
  const [activeMood, setActiveMood] = useState<MoodKey>('fresh');

  const activeMoodData = MOODS.find((mood) => mood.key === activeMood) ?? MOODS[0];

  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;
    const extraCleanup: Array<() => void> = [];

    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');

      if (cancelled || !rootRef.current) return;

      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduceMotion) {
          gsap.set('[data-about-fade]', { opacity: 1, y: 0 });
          gsap.set('.about-hero-title', { opacity: 1 });
          gsap.set('.about-hero-word-inner', { yPercent: 0 });
          gsap.set('.statement-word', { opacity: 1 });
          gsap.set('.about-clip', { clipPath: 'inset(0% 0% 0% 0%)' });
          return;
        }

        const heroWords = gsap.utils.toArray<HTMLElement>('.about-hero-word-inner');
        gsap.set(heroWords, { yPercent: 115 });
        gsap.set('.about-hero-title', { opacity: 1 });
        gsap.to(heroWords, {
          yPercent: 0,
          duration: 0.75,
          stagger: 0.06,
          ease: 'power4.out',
          delay: 0.2,
        });

        if (pageRef.current && heroDarkRef.current && heroImageRef.current) {
          gsap.timeline({
            scrollTrigger: {
              trigger: pageRef.current,
              start: 'top bottom',
              end: 'top top',
              scrub: true,
            },
          })
            .to(heroDarkRef.current, { opacity: 0.94, ease: 'none' }, 0)
            .to(heroImageRef.current, { scale: 1.18, ease: 'none' }, 0);
        }

        gsap.to('.about-statement .statement-word', {
          opacity: 1,
          stagger: 0.045,
          ease: 'none',
          scrollTrigger: {
            trigger: '.about-statement',
            start: 'top 80%',
            end: 'top 35%',
            scrub: true,
          },
        });

        gsap.utils.toArray<HTMLElement>('[data-about-fade]').forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 26 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 90%' },
            }
          );
        });

        gsap.utils.toArray<HTMLElement>('.about-clip').forEach((frame) => {
          gsap.fromTo(
            frame,
            { clipPath: 'inset(12% 6% 12% 6%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 1.15,
              ease: 'power3.out',
              scrollTrigger: { trigger: frame, start: 'top 86%' },
            }
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-about-plx]').forEach((img) => {
          gsap.fromTo(
            img,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: 'none',
              scrollTrigger: {
                trigger: img.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-count-to]').forEach((el) => {
          gsap.fromTo(
            el,
            { innerText: 0 },
            {
              innerText: Number(el.dataset.countTo),
              duration: 1.25,
              ease: 'power1.out',
              snap: { innerText: 1 },
              scrollTrigger: { trigger: el, start: 'top 90%' },
            }
          );
        });

        if (moodSectionRef.current && moodCursorRef.current) {
          const moodSection = moodSectionRef.current;
          const moodCursor = moodCursorRef.current;
          const cursorX = gsap.quickTo(moodCursor, 'x', { duration: 0.28, ease: 'power3.out' });
          const cursorY = gsap.quickTo(moodCursor, 'y', { duration: 0.28, ease: 'power3.out' });

          const onPointerMove = (event: PointerEvent) => {
            const rect = moodSection.getBoundingClientRect();
            cursorX(event.clientX - rect.left);
            cursorY(event.clientY - rect.top);
            gsap.to(moodCursor, { opacity: 1, scale: 1, duration: 0.18, ease: 'power2.out' });
          };

          const onPointerEnter = () => {
            gsap.to(moodCursor, { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' });
          };

          const onPointerLeave = () => {
            gsap.to(moodCursor, { opacity: 0, scale: 0.78, duration: 0.25, ease: 'power2.out' });
          };

          moodSection.addEventListener('pointermove', onPointerMove);
          moodSection.addEventListener('pointerenter', onPointerEnter);
          moodSection.addEventListener('pointerleave', onPointerLeave);

          extraCleanup.push(() => {
            moodSection.removeEventListener('pointermove', onPointerMove);
            moodSection.removeEventListener('pointerenter', onPointerEnter);
            moodSection.removeEventListener('pointerleave', onPointerLeave);
          });
        }

      }, rootRef);

      cleanup = () => {
        extraCleanup.forEach((fn) => fn());
        ctx.revert();
      };
    };

    init();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  const handleMoodChange = async (nextMood: MoodKey) => {
    if (nextMood === activeMood) return;

    const { gsap } = await import('gsap');
    const nextMoodData = MOODS.find((mood) => mood.key === nextMood) ?? MOODS[0];
    const textNodes = [moodWordRef.current, moodDescRef.current, moodProductRef.current].filter(Boolean);

    gsap.timeline()
      .to(moodTintRef.current, { background: nextMoodData.tint, duration: 0.75, ease: 'power1.inOut' }, 0)
      .to(moodGlowRef.current, { background: nextMoodData.tint, duration: 0.75, ease: 'power1.inOut' }, 0)
      .to(moodCursorRef.current, { color: nextMoodData.tint, duration: 0.75, ease: 'power1.inOut' }, 0)
      .to(textNodes, { y: -16, opacity: 0, duration: 0.25, ease: 'power2.in', stagger: 0.04 }, 0)
      .add(() => setActiveMood(nextMood), 0.28)
      .fromTo(textNodes, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out', stagger: 0.05 }, 0.34);
  };

  return (
    <div ref={rootRef} className="min-h-screen overflow-x-clip bg-[#FAFAF8] text-[#141618]">
      <header className="sticky top-0 z-0 h-[100svh] min-h-[520px] overflow-hidden bg-[#0E1112]">
        <div className="absolute inset-0">
          <Image
            ref={heroImageRef}
            src="/story/photo-8.jpg"
            alt="Clear water surface"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center will-change-transform"
          />
        </div>
        <div className="absolute inset-0 z-[2] bg-black/35" />
        <div className="absolute inset-0 z-[3] flex items-end justify-start px-[clamp(18px,3.6vw,52px)] pb-[clamp(64px,10vh,120px)] text-left">
          <h1
            className="about-hero-title max-w-[16ch] text-[clamp(34px,5.8vw,78px)] font-light leading-[1.04] tracking-[-0.01em] text-white opacity-0"
            style={headingStyle}
          >
            {[
              { text: 'The' },
              { text: 'taste' },
              { text: 'of' },
              { text: 'comfort,', accent: true },
              { text: 'made' },
              { text: 'in' },
              { text: 'Turkmenistan.' },
            ].map((word, index, words) => (
              <span
                key={`${word.text}-${index}`}
                className="inline-block overflow-hidden align-bottom pb-[0.18em] mb-[-0.18em]"
              >
                <span
                  className={`about-hero-word-inner inline-block ${word.accent ? 'font-light italic' : ''}`}
                  style={word.accent ? accentStyle : undefined}
                >
                  {word.text}
                  {index < words.length - 1 ? '\u00a0' : ''}
                </span>
              </span>
            ))}
          </h1>
        </div>
        <div ref={heroDarkRef} className="pointer-events-none absolute inset-0 z-[6] bg-[#0A0C0D] opacity-0" />
      </header>

      <main ref={pageRef} className="relative z-[2] bg-[#FAFAF8] shadow-[0_-30px_80px_rgba(10,12,13,0.18)]">
        <section className="about-statement px-[clamp(18px,3.6vw,52px)] py-[clamp(80px,14vh,160px)] text-center">
          <p
            className="mx-auto max-w-[24ch] text-[clamp(24px,3.3vw,44px)] font-light leading-[1.18] tracking-[-0.01em]"
            style={headingStyle}
          >
            <span className="statement-word inline-block opacity-[0.12]">In</span>{' '}
            <span className="statement-word inline-block opacity-[0.12]">Turkmen,</span>{' '}
            <em className="statement-word inline-block opacity-[0.12] italic" style={accentStyle}>rahatlyk</em>{' '}
            <span className="statement-word inline-block opacity-[0.12]">means</span>{' '}
            <span className="statement-word inline-block opacity-[0.12]">comfort</span>{' '}
            <span className="statement-word inline-block opacity-[0.12]">&mdash;</span>
            <br />
            <span className="statement-word inline-block opacity-[0.12]">our</span>{' '}
            <span className="statement-word inline-block opacity-[0.12]">name,</span>{' '}
            <span className="statement-word inline-block opacity-[0.12]">our</span>{' '}
            <span className="statement-word inline-block opacity-[0.12]">promise,</span>
            <br />
            <span className="statement-word inline-block opacity-[0.12]">and</span>{' '}
            <span className="statement-word inline-block opacity-[0.12]">the</span>{' '}
            <span className="statement-word inline-block opacity-[0.12]">measure</span>{' '}
            <span className="statement-word inline-block opacity-[0.12]">of</span>
            <br />
            <em className="statement-word inline-block opacity-[0.12] not-italic">every</em>{' '}
            <span className="statement-word inline-block opacity-[0.12]">bottle</span>{' '}
            <span className="statement-word inline-block opacity-[0.12]">we</span>{' '}
            <span className="statement-word inline-block opacity-[0.12]">make.</span>
          </p>
        </section>

        <section className="grid min-h-[720px] bg-[#FAFAF8] lg:grid-cols-2">
          <div className="about-clip relative min-h-[420px] overflow-hidden bg-[#E9ECEB] lg:min-h-full">
            <Image
              data-about-plx
              src="/story/photo-2.jpg"
              alt="Air bubbles rising through clear water"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-[118%] object-cover object-center will-change-transform"
            />
          </div>
          <div className="flex flex-col justify-center px-[clamp(24px,5vw,80px)] py-[clamp(60px,8vw,120px)]">
            <p data-about-fade className="text-[10.5px] font-semibold uppercase tracking-[0.32em] text-[#141618]">
              Who we are
            </p>
            <div className="mt-8 space-y-6 text-[15px] leading-[1.9] text-[#141618]">
              <p data-about-fade>
                Rahatlyk is a Turkmen beverage company built around a simple belief: the drinks a family keeps on its table should be made close to home, to a standard the family can see and trust. From our production facilities in Turkmenistan we purify, prepare and bottle every product ourselves &mdash; from the first filtration of water to the final cap.
              </p>
              <p data-about-fade>
                What began with drinking water has grown into six collections covering the full rhythm of a day: still and mineral waters, orchard-fruit juices, energy drinks, calming herbal teas and sparkling soft drinks. Each line is developed by our own team, tested against international quality practices, and distributed across the country.
              </p>
              <p data-about-fade>
                We are also building a direct connection with the people who drink what we make &mdash; a digital platform for our stories, our openings and your feedback. Because comfort, to us, includes being within reach.
              </p>
            </div>
          </div>
        </section>

        <section className="px-[clamp(18px,3.6vw,52px)] py-[clamp(40px,5vw,70px)]">
          <div className="border-t border-black/15">
            {PILLARS.map((pillar, index) => (
              <div
                key={pillar.title}
                data-about-fade
                className={`flex items-center justify-between gap-[clamp(16px,3vw,44px)] border-b border-black/15 py-[18px] ${index % 2 ? 'flex-row-reverse' : ''}`}
              >
                <h2
                  className={`text-[clamp(22px,2.8vw,38px)] font-light leading-none tracking-[-0.01em] ${index % 2 ? 'text-right' : ''}`}
                  style={headingStyle}
                >
                  {pillar.title} <em className="not-italic">{pillar.accent}</em>
                </h2>
                <div className="about-clip relative h-[clamp(70px,9vw,120px)] flex-[0_0_clamp(110px,14vw,190px)] overflow-hidden rounded-[3px] bg-[#E9ECEB]">
                  <Image data-about-plx src={pillar.image} alt={pillar.alt} fill sizes="190px" className="h-[118%] object-cover object-center" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {CASES.map((item) => (
          <section key={item.title} className="px-[clamp(18px,3.6vw,52px)] pb-[clamp(48px,6.5vw,100px)] pt-0">
            <div className="grid gap-[clamp(10px,1.4vw,18px)] md:grid-cols-[1.5fr_1fr] md:grid-rows-2">
              {item.images.map((image, index) => (
                <div
                  key={image}
                  className={`about-clip relative overflow-hidden rounded-[3px] bg-[#E9ECEB] ${index === 0 ? 'h-[clamp(320px,72vh,680px)] md:row-span-2' : 'h-[clamp(150px,34vh,330px)]'}`}
                >
                  <Image data-about-plx src={image} alt={item.title} fill sizes={index === 0 ? '(max-width: 768px) 100vw, 60vw' : '(max-width: 768px) 100vw, 40vw'} className="h-[118%] object-cover object-center" />
                </div>
              ))}
            </div>
            <div className="mt-[clamp(18px,2.6vw,30px)] flex flex-wrap items-baseline justify-between gap-6">
              <h2 data-about-fade className="text-[clamp(28px,4.2vw,56px)] font-light leading-none tracking-[-0.01em]" style={headingStyle}>
                {item.title.split(item.accent)[0]}
                <em className="not-italic">{item.accent}</em>
                {item.title.split(item.accent).slice(1).join(item.accent)}
              </h2>
              <Link
                data-about-fade
                href="/products"
                className="border-b border-black/15 pb-1 text-xs font-medium uppercase tracking-[0.16em] text-[#141618] transition-colors duration-300 hover:border-[#D98A55] hover:text-[#D98A55]"
              >
                Explore the line
              </Link>
            </div>
            <p data-about-fade className="mt-2.5 max-w-[54ch] text-sm leading-[1.8] text-[#737C80]">
              {item.desc}
            </p>
          </section>
        ))}

        <section className="px-[clamp(18px,3.6vw,52px)] py-[clamp(60px,8vw,120px)]">
          <div className="grid items-start gap-[clamp(28px,6vw,110px)] lg:grid-cols-[1fr_1.3fr]">
            <div className="lg:sticky lg:top-24">
              <p data-about-fade className="max-w-[24ch] text-[clamp(20px,2vw,30px)] font-light leading-[1.32] tracking-[-0.01em]" style={headingStyle}>
                From a single bottling line to six collections, every milestone brought <em className="not-italic">Rahatlyk</em> closer to the people we serve - comfort, defined by <em className="not-italic">purity, flavour</em> and trust.
              </p>
              <p data-about-fade className="mt-[clamp(28px,4vw,56px)] max-w-[40ch] text-[13.5px] leading-[1.8] text-[#737C80]">
                By producing everything ourselves - from filtration to the final cap - we keep quality in our own hands and stay independent of intermediaries.
              </p>
            </div>
            <div className="flex flex-col gap-[clamp(16px,1.8vw,26px)]">
              <p className="mb-1 text-[13px] text-[#141618]" style={headingStyle}>Our story</p>
              {MILESTONES.map((milestone) => (
                <article key={milestone.title} data-about-fade className="rounded-[3px] bg-[#F1F1EF] p-[clamp(26px,3.2vw,46px)]">
                  <h3 className="text-[clamp(34px,4.6vw,64px)] font-light leading-none tracking-[-0.015em]" style={headingStyle}>
                    {milestone.title}
                    {milestone.current ? <sup className="align-super text-[0.3em] not-italic text-[#D98A55]">o</sup> : null}
                  </h3>
                  <p className="mt-[clamp(38px,6vw,86px)] max-w-[58ch] text-sm leading-[1.75] text-[#141618]">
                    <span className="text-[#ABAFAA]">{milestone.lead}</span> {milestone.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative flex min-h-[92svh] overflow-hidden p-0 text-white">
          <div className="about-clip absolute inset-0 overflow-hidden bg-[#E9ECEB]">
            <Image data-about-plx src="/story/photo-9.jpg" alt="Natural landscape" fill sizes="100vw" className="h-[118%] object-cover object-center" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E1112]/75 via-[#0E1112]/30 to-[#0E1112]/35" />
          <div className="relative z-[2] flex w-full flex-col justify-between gap-[clamp(36px,7vh,80px)] px-[clamp(18px,3.6vw,52px)] pb-[clamp(24px,5vh,48px)] pt-[clamp(44px,9vh,84px)]">
            <div>
              <p data-about-fade className="text-[10.5px] font-semibold uppercase tracking-[0.32em] text-white/60">Rahatlyk at a glance</p>
              <p data-about-fade className="mt-4 max-w-[22ch] text-[clamp(22px,3vw,40px)] font-light leading-[1.15]" style={headingStyle}>
                Everything we bottle begins in <em className="not-italic">nature</em> - our job is simply not to get in its way.
              </p>
            </div>
            <div className="grid border-t border-white/30 md:grid-cols-4">
              {STATS.map((stat, index) => (
                <div key={stat.label} data-about-fade className={`py-5 md:px-[clamp(12px,2vw,26px)] ${index > 0 ? 'border-t border-white/20 md:border-l md:border-t-0' : ''}`}>
                  <strong className="block text-[clamp(32px,4vw,56px)] font-light leading-none" style={headingStyle}>
                    <span data-count-to={stat.value}>0</span>
                    {stat.suffix ? <i className="text-[0.5em] not-italic text-[#D98A55]">{stat.suffix}</i> : null}
                  </strong>
                  <span className="mt-1.5 block text-xs leading-[1.6] text-white/65">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section ref={moodSectionRef} className="group relative min-h-screen select-none overflow-hidden bg-[#0F1213] p-0 text-white md:cursor-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_38%),linear-gradient(135deg,#0F1213_0%,#171B1C_45%,#0A0C0D_100%)]" />
          <div ref={moodTintRef} className="absolute inset-0 opacity-15 mix-blend-color" style={{ background: activeMoodData.tint }} />
          <div
            ref={moodGlowRef}
            className="pointer-events-none absolute left-1/2 top-1/2 z-[2] h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-35 blur-[72px] transition-opacity duration-500 group-hover:opacity-50"
            style={{ background: activeMoodData.tint }}
          />
          <div
            ref={moodCursorRef}
            className="pointer-events-none absolute left-0 top-0 z-[4] hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-transparent opacity-0 shadow-[0_0_18px_rgba(255,255,255,0.12)] md:flex"
            style={{ color: activeMoodData.tint }}
          >
            <span className="h-1 w-1 rounded-full bg-current" />
          </div>
          <div className="relative z-[3] flex min-h-screen flex-col items-center justify-end px-[clamp(18px,3.6vw,52px)] pb-[clamp(80px,14vh,150px)] pt-[clamp(220px,34vh,340px)] text-center">
            <div className="mx-auto max-w-4xl">
              <div className="flex items-center justify-center gap-4">
                <span className="h-px w-12 bg-white/35" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/80">
                  Find your bottle
                </p>
                <span className="h-px w-12 bg-white/35" />
              </div>
              <h2 className="mt-3.5 inline-grid grid-cols-[auto_minmax(8ch,1fr)] items-baseline gap-x-3 text-left text-[clamp(30px,5vw,70px)] font-light leading-none" style={headingStyle}>
                <span className="whitespace-nowrap">Today I feel</span>
                <span className="whitespace-nowrap">
                  <span
                    ref={moodWordRef}
                    className="inline-block min-w-[8.5ch] border-b border-white/40 text-left italic"
                    style={accentStyle}
                  >
                    {activeMoodData.word}
                  </span>
                  <span className="opacity-50">.</span>
                </span>
              </h2>
              <p ref={moodDescRef} className="mx-auto mt-[18px] max-w-[46ch] text-sm leading-[1.8] text-white/70">
                {activeMoodData.desc}
              </p>
              <p ref={moodProductRef} className="mt-2 text-[10.5px] uppercase tracking-[0.32em] text-white/55">
                {activeMoodData.product}
              </p>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-2.5">
              {MOODS.map((mood) => (
                <button
                  key={mood.key}
                  type="button"
                  aria-pressed={mood.key === activeMood}
                  onClick={() => handleMoodChange(mood.key)}
                  className={`rounded-[3px] border px-5 py-3 text-xs font-medium tracking-[0.07em] shadow-[0_0_0_rgba(255,255,255,0)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(0,0,0,0.22)] md:cursor-none ${mood.key === activeMood ? 'border-white bg-white text-[#141618]' : 'border-white/35 bg-white/0 text-white/85 hover:border-white hover:bg-white/10 hover:text-white'}`}
                >
                  {mood.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-black/15 px-[clamp(18px,3.6vw,52px)] py-[clamp(44px,6vw,90px)]">
          <div className="grid gap-[clamp(10px,1.4vw,18px)] md:grid-cols-3">
            {[
              { label: 'Source', image: '/story/photo-2.jpg' },
              { label: 'Craft', image: '/reference/KarunaJuice_Photo_RainbowlFoods.jpg' },
              { label: 'Deliver', image: '/news/1.5liter-bottles.jpg' },
            ].map((card) => (
              <div key={card.label} data-about-fade className="relative h-[clamp(180px,30vh,300px)] overflow-hidden rounded-[3px]">
                <Image src={card.image} alt={card.label} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover object-center" />
                <span className="absolute bottom-3 left-4 text-[clamp(20px,2vw,26px)] font-light text-white shadow-black text-shadow" style={headingStyle}>
                  {card.label}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-6 py-[clamp(40px,6vw,80px)]">
            <h2 data-about-fade className="text-[clamp(30px,4.6vw,60px)] font-light leading-none tracking-[-0.01em]" style={headingStyle}>
              Ready to taste <em className="not-italic">comfort?</em>
            </h2>
            <Link data-about-fade href="/products" className="rounded-[3px] border border-[#141618] bg-[#141618] px-8 py-3.5 text-sm font-medium tracking-[0.06em] text-[#FAFAF8] transition-colors duration-300 hover:border-[#D98A55] hover:bg-[#D98A55]">
              Explore the collection
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
