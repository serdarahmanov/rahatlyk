'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';

/* ── Static data ─────────────────────────────────────────────── */
const TEAM = [
  { name: 'Atamurat Sarwanov',  role: 'Chief Executive Officer',  initials: 'AS', color: '#0284C7', bg: '#E0F2FE' },
  { name: 'Mahym Rejepowa',     role: 'Chief Operations Officer', initials: 'MR', color: '#0369A1', bg: '#BFDBFE' },
  { name: 'Oraz Bayramow',      role: 'Head of Production',       initials: 'OB', color: '#0891B2', bg: '#A5F3FC' },
  { name: 'Aynur Mämedowa',     role: 'Head of Marketing',        initials: 'AM', color: '#0EA5E9', bg: '#BAE6FD' },
  { name: 'Begmyrat Orazow',    role: 'Head of Sales',            initials: 'BO', color: '#2563EB', bg: '#DBEAFE' },
  { name: 'Leyla Aşyrowa',      role: 'Head of Finance',          initials: 'LA', color: '#7C3AED', bg: '#EDE9FE' },
];

const TIMELINE = [
  { year: '2003', event: 'RAHATLYK founded in Ashgabat with our first spring water plant' },
  { year: '2008', event: 'Expanded production capacity and launched mineral water line' },
  { year: '2013', event: 'Introduced fresh juice portfolio; reached 1M+ customers' },
  { year: '2018', event: 'Opened second facility; launched herbal tea and energy drinks' },
  { year: '2023', event: 'Celebrating 20 years: 50+ products, 5M+ customers served' },
  { year: '2025', event: 'Awarded Best Beverage Brand by Central Asian Beverage Association' },
];

/* ── Page ────────────────────────────────────────────────────── */
export default function AboutPage() {
  const { t } = useLanguage();

  const heroSectionRef    = useRef<HTMLElement>(null);
  const heroImageRef      = useRef<HTMLDivElement>(null);
  const heroRef           = useRef<HTMLDivElement>(null);
  const statsRef          = useRef<HTMLDivElement>(null);
  const storyRef          = useRef<HTMLDivElement>(null);
  const valuesRef         = useRef<HTMLDivElement>(null);
  const teamRef           = useRef<HTMLDivElement>(null);
  const missionRef        = useRef<HTMLElement>(null);
  const missionImageRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let st: any;
    const init = async () => {
      const { gsap }          = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      st = ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      /* ── Hero text entrance ── */
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.children,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1, stagger: 0.14, ease: 'power3.out', delay: 0.2 }
        );
      }

      /* ── Parallax: image moves up slower than scroll ── */
      if (heroImageRef.current && heroSectionRef.current) {
        gsap.to(heroImageRef.current, {
          yPercent: 28,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      /* ── Mission parallax ── */
      if (missionImageRef.current && missionRef.current) {
        gsap.to(missionImageRef.current, {
          yPercent: 22,
          ease: 'none',
          scrollTrigger: {
            trigger: missionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      /* ── Hero text fades out as user scrolls away ── */
      if (heroRef.current && heroSectionRef.current) {
        gsap.to(heroRef.current, {
          opacity: 0,
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: 'center top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      /* ── Stats counter reveal ── */
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.children,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.14, ease: 'power3.out',
            scrollTrigger: { trigger: statsRef.current, start: 'top 80%' },
          }
        );
      }

      /* ── Scroll-triggered reveals for all other sections ── */
      [storyRef, valuesRef, teamRef].forEach((ref) => {
        if (ref.current) {
          gsap.fromTo(
            ref.current.querySelectorAll('.reveal'),
            { y: 36, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.8, stagger: 0.09, ease: 'power3.out',
              scrollTrigger: { trigger: ref.current, start: 'top 80%' },
            }
          );
        }
      });
      if (missionRef.current) {
        gsap.fromTo(
          missionRef.current.querySelectorAll('.reveal'),
          { y: 36, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.09, ease: 'power3.out',
            scrollTrigger: { trigger: missionRef.current, start: 'top 80%' },
          }
        );
      }
    };
    init();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return () => st?.getAll().forEach((s: any) => s.kill());
  }, []);

  const { story, values, team, mission } = t.about;
  const homeStory = t.home.story;

  return (
    <div className="min-h-screen">

      {/* ── Hero — full-screen parallax ── */}
      <section ref={heroSectionRef} className="relative h-screen overflow-hidden">

        {/* Background image — scaled up so parallax has room to travel */}
        <div ref={heroImageRef} className="absolute inset-0 scale-[1.15] origin-center">
          <Image
            src="/story/photo-8.jpg"
            alt="RAHATLYK — born from nature"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
        </div>

        {/* Gradient overlay — heavier at bottom for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/70" />

        {/* Centered text */}
        <div
          ref={heroRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 sm:px-8"
        >
          {/* Tiny label — like VOSS "About Voss" */}
          <span className="text-white/45 text-[10px] font-light tracking-[0.4em] uppercase mb-8">
            RAHATLYK · Est. 2003
          </span>

          {/* Big poetic tagline — the hero moment */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.08] mb-8 max-w-3xl"
            style={{ fontFamily: 'var(--font-heading), sans-serif' }}
          >
            {story.title}
          </h1>

          {/* One evocative paragraph */}
          <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-light">
            {story.text1}
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[9px] text-white/40 tracking-[0.25em] uppercase">Scroll</span>
          <div className="w-px h-10 overflow-hidden bg-white/20">
            <div className="w-full h-1/2 bg-white/60 animate-bounce" />
          </div>
        </div>

      </section>

      {/* ── Stats band — live water gradient ── */}
      <section className="relative overflow-hidden py-20" style={{ background: '#0b2e4a' }}>
        {/* Blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d3d60] via-[#0b2e4a] to-[#04192e]" />
          <div className="water-blob-1 absolute -top-[20%] -left-[10%] w-[65%] h-[75%] rounded-full bg-[#38c8f5] blur-[90px]" />
          <div className="water-blob-2 absolute -top-[10%] left-[25%] w-[40%] h-[55%] rounded-full bg-[#d4f2ff] blur-[70px]" />
          <div className="water-blob-3 absolute top-[20%] right-[-5%] w-[45%] h-[60%] rounded-full bg-[#2a9fd8] blur-[80px]" />
          <div className="water-blob-4 absolute bottom-[-15%] left-[10%] w-[50%] h-[50%] rounded-full bg-[#1a6ab8] blur-[70px]" />
          <div className="water-blob-5 absolute top-[35%] left-[40%] w-[30%] h-[35%] rounded-full bg-[#a0e4fc] blur-[60px]" />
          <div
            className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '300px 300px',
            }}
          />
        </div>
        {/* Content */}
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8">
          <div ref={statsRef} className="grid grid-cols-3 gap-6 sm:gap-12 text-center">
            {[
              { val: homeStory.stat1, lbl: homeStory.stat1Label },
              { val: homeStory.stat2, lbl: homeStory.stat2Label },
              { val: homeStory.stat3, lbl: homeStory.stat3Label },
            ].map((s, i) => (
              <div key={i}>
                <div
                  className="text-3xl sm:text-5xl lg:text-6xl font-light text-white mb-2"
                  style={{ fontFamily: 'var(--font-heading), sans-serif' }}
                >
                  {s.val}
                </div>
                <div className="text-sky-200/80 text-xs sm:text-sm tracking-wide">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────── */}
      {/* ── GAP ──────────────────────────────── */}
      {/* ─────────────────────────────────────── */}
      <div className="h-20 bg-white" />

      {/* ── Story — photo left, text right ── */}
      <section className="bg-white overflow-hidden" ref={storyRef}>
        <div className="grid lg:grid-cols-2 min-h-[700px]">

          {/* Photo — fills entire left half, no radius */}
          <div className="relative min-h-[480px] lg:min-h-0">
            <Image
              src="/story/photo-9.jpg"
              alt="RAHATLYK — born from nature"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <p className="text-[10px] font-light tracking-widest uppercase opacity-55">{story.established}</p>
              <p className="text-base font-light mt-0.5">{story.location}</p>
            </div>
          </div>

          {/* Text — internal padding only */}
          <div className="px-8 sm:px-12 lg:px-16 xl:px-24 py-20 lg:py-28 flex flex-col justify-center">
            <span className="reveal text-brand-700 text-xs font-light tracking-[0.2em] uppercase">{story.tag}</span>
            <h2
              className="reveal mt-3 text-3xl sm:text-4xl font-light text-brand-950 leading-tight mb-6"
              style={{ fontFamily: 'var(--font-heading), sans-serif' }}
            >
              {story.title}
            </h2>
            <p className="reveal text-slate-600 text-base leading-relaxed mb-4">{story.text1}</p>
            <p className="reveal text-slate-500 text-base leading-relaxed mb-10">{story.text2}</p>

            {/* Timeline */}
            <div className="reveal border-t border-slate-100">
              {TIMELINE.map((item, i) => (
                <div key={i} className="flex gap-5 py-4 border-b border-slate-100 group">
                  <span className="flex-shrink-0 w-12 text-sm font-light text-brand-600 pt-0.5">{item.year}</span>
                  <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-700 transition-colors duration-200">
                    {item.event}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── GAP ── */}
      <div className="h-20 bg-white" />

      {/* ── Mission — full-width photo quote ── */}
      <section className="relative h-[520px] overflow-hidden" ref={missionRef}>

        {/* Image wrapper — scaled up for parallax travel room */}
        <div ref={missionImageRef} className="absolute inset-0 scale-[1.15] origin-center">
          <Image
            src="/story/photo-4.jpg"
            alt="Our Mission"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-5 sm:px-8 text-center">
          <span className="reveal block text-brand-950/60 text-xs font-light tracking-[0.2em] uppercase mb-5">
            {mission.title}
          </span>
          <p
            className="reveal text-xl sm:text-2xl lg:text-3xl font-light text-brand-950 leading-relaxed max-w-2xl"
            style={{ fontFamily: 'var(--font-heading), sans-serif' }}
          >
            &ldquo;{mission.text}&rdquo;
          </p>
        </div>

      </section>

      {/* ── GAP ── */}
      <div className="h-20 bg-white" />

      {/* ── Values — text left, photo right ── */}
      <section className="bg-white overflow-hidden" ref={valuesRef}>
        <div className="grid lg:grid-cols-2 min-h-[700px]">

          {/* Text — internal padding, mobile first */}
          <div className="px-8 sm:px-12 lg:px-16 xl:px-24 py-20 lg:py-28 flex flex-col justify-center order-2 lg:order-1">
            <span className="reveal text-brand-700 text-xs font-light tracking-[0.2em] uppercase">{values.title}</span>
            <h2
              className="reveal mt-3 text-3xl sm:text-4xl font-light text-brand-950 mb-10"
              style={{ fontFamily: 'var(--font-heading), sans-serif' }}
            >
              {values.subtitle}
            </h2>
            <div className="border-t border-slate-100">
              {([
                { num: '01', title: values.purity,        text: values.purityText        },
                { num: '02', title: values.sustainability, text: values.sustainabilityText },
                { num: '03', title: values.innovation,     text: values.innovationText    },
                { num: '04', title: values.community,      text: values.communityText     },
              ] as { num: string; title: string; text: string }[]).map((v) => (
                <div key={v.num} className="reveal flex gap-6 py-7 border-b border-slate-100 group">
                  <span className="flex-shrink-0 text-xs font-light text-slate-300 w-6 pt-1 group-hover:text-brand-400 transition-colors duration-200">
                    {v.num}
                  </span>
                  <div>
                    <h3 className="font-light text-brand-950 text-base mb-1.5 group-hover:text-brand-700 transition-colors duration-200">
                      {v.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{v.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Photo — fills entire right half, no radius */}
          <div className="relative min-h-[480px] lg:min-h-0 order-1 lg:order-2">
            <Image
              src="/story/photo-1.jpg"
              alt="Our Values"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

        </div>
      </section>

      {/* ── GAP ── */}
      <div className="h-20 bg-white" />

      {/* ── Team ── */}
      <section className="py-24 bg-slate-50" ref={teamRef}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="mb-14">
            <span className="reveal text-brand-700 text-xs font-light tracking-[0.2em] uppercase">{team.title}</span>
            <h2
              className="reveal mt-3 text-3xl sm:text-4xl font-light text-brand-950"
              style={{ fontFamily: 'var(--font-heading), sans-serif' }}
            >
              {team.subtitle}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
            {TEAM.map((member, i) => (
              <div key={i} className="reveal group text-center">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-lg font-light shadow-sm group-hover:shadow-md transition-shadow duration-300"
                  style={{ background: member.bg, color: member.color }}
                >
                  {member.initials}
                </div>
                <h3 className="font-light text-brand-950 text-sm leading-tight">{member.name}</h3>
                <p className="text-slate-400 text-xs mt-1 leading-tight">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GAP ── */}
      <div className="h-20 bg-white" />

      {/* ── CTA — full-width photo strip ── */}
      <section className="relative h-80 sm:h-96 overflow-hidden">
        <Image
          src="/news/1.5liter-bottles.jpg"
          alt="Join the RAHATLYK family"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-brand-950/70" />
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-5 sm:px-8 text-center">
          <h2
            className="text-2xl sm:text-3xl font-light text-white mb-7"
            style={{ fontFamily: 'var(--font-heading), sans-serif' }}
          >
            Ready to join the RAHATLYK family?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary gap-2">
              {t.nav.contact}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/vacancies"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-light text-white border border-white/40 hover:bg-white/10 transition-colors duration-200"
            >
              {t.nav.vacancies}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
