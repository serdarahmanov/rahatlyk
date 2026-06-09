'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';

/* ── Contact info items ─────────────────────────────────────── */
const INFO_ITEMS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 1.5C7.24 1.5 5 3.74 5 6.5c0 3.55 5 12 5 12s5-8.45 5-12c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="currentColor" />
      </svg>
    ),
    labelKey: 'address',
    valueKey: 'addressValue',
    bg: 'bg-brand-50',
    text: 'text-brand-700',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 4a1 1 0 0 1 1-1h2.586l1.414 3.586L6.586 8A11.048 11.048 0 0 0 11.414 12.829l1.414-1.414 3.586 1.414V15a1 1 0 0 1-1 1A13 13 0 0 1 2 3.829V4z" fill="currentColor" />
      </svg>
    ),
    labelKey: 'phone',
    valueKey: 'phoneValue',
    bg: 'bg-brand-100',
    text: 'text-brand-700',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M2.5 5.5A1.5 1.5 0 0 1 4 4h12a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 16 16H4a1.5 1.5 0 0 1-1.5-1.5v-9zM4 5.5l6 4.5 6-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    labelKey: 'email',
    valueKey: 'emailValue',
    bg: 'bg-brand-200',
    text: 'text-brand-800',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M10 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    labelKey: 'hours',
    valueKey: 'hoursValue',
    bg: 'bg-brand-100',
    text: 'text-brand-600',
  },
] as const;

/* ── Page ───────────────────────────────────────────────────── */
export default function ContactPage() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.children,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
        );
      }

      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { x: -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: formRef.current, start: 'top 82%' },
          }
        );
      }

      if (infoRef.current) {
        gsap.fromTo(
          infoRef.current.children,
          { x: 40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: infoRef.current, start: 'top 82%' },
          }
        );
      }
    };
    init();
    return () => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      });
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const f = t.contact.form;
  const info = t.contact.info;

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <Image
          src="/story/photo-1.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />
        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 text-center" ref={heroRef}>
          <span className="text-black text-xs font-bold tracking-[0.2em] uppercase">{t.contact.heroTag}</span>
          <h1
            className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight mb-4"
            style={{ fontFamily: 'var(--font-heading), sans-serif' }}
          >
            {t.contact.title}
          </h1>
          <p className="text-black text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            {t.contact.subtitle}
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid lg:grid-cols-[1fr_420px] gap-10 lg:gap-14 items-start">

            {/* ── Form ── */}
            <div ref={formRef}>
              {submitted ? (
                <div className="bg-brand-100 border border-brand-200 rounded-md p-10 text-center">
                  <div className="text-5xl mb-4">✅</div>
                  <h3
                    className="text-2xl font-bold text-brand-900 mb-2"
                    style={{ fontFamily: 'var(--font-heading), sans-serif' }}
                  >
                    Message Sent!
                  </h3>
                  <p className="text-brand-700 text-base">{f.success}</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                    className="mt-6 btn-primary"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name + Email */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-brand-900 mb-2 uppercase tracking-wide">
                        {f.name} <span className="text-brand-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder={f.namePlaceholder}
                        className="w-full px-4 py-3 rounded border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent text-sm text-brand-800 placeholder-brand-300 transition-all bg-white hover:border-brand-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brand-900 mb-2 uppercase tracking-wide">
                        {f.email} <span className="text-brand-600">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder={f.emailPlaceholder}
                        className="w-full px-4 py-3 rounded border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent text-sm text-brand-800 placeholder-brand-300 transition-all bg-white hover:border-brand-300"
                      />
                    </div>
                  </div>

                  {/* Phone + Subject */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-brand-900 mb-2 uppercase tracking-wide">
                        {f.phone}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder={f.phonePlaceholder}
                        className="w-full px-4 py-3 rounded border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent text-sm text-brand-800 placeholder-brand-300 transition-all bg-white hover:border-brand-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brand-900 mb-2 uppercase tracking-wide">
                        {f.subject} <span className="text-brand-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        required
                        placeholder={f.subjectPlaceholder}
                        className="w-full px-4 py-3 rounded border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent text-sm text-brand-800 placeholder-brand-300 transition-all bg-white hover:border-brand-300"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-brand-900 mb-2 uppercase tracking-wide">
                      {f.message} <span className="text-brand-600">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder={f.messagePlaceholder}
                      className="w-full px-4 py-3 rounded border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent text-sm text-brand-800 placeholder-brand-300 transition-all bg-white hover:border-brand-300 resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary gap-2 w-full sm:w-auto"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <>
                        {f.send}
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                          <path d="M2 14L14 2M14 2H6M14 2V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* ── Contact Info ── */}
            <div ref={infoRef} className="space-y-4">
              {/* Info card */}
              <div className="bg-brand-50 border border-brand-200 rounded-md p-8 mb-2">
                <h3
                  className="text-base font-bold text-brand-950 mb-6"
                  style={{ fontFamily: 'var(--font-heading), sans-serif' }}
                >
                  {info.title}
                </h3>
                <div className="space-y-5">
                  {INFO_ITEMS.map((item) => (
                    <div key={item.labelKey} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-md ${item.bg} ${item.text} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <span className="scale-75">{item.icon}</span>
                      </div>
                      <div>
                        <p className="text-brand-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">
                          {info[item.labelKey as keyof typeof info]}
                        </p>
                        <p className="text-brand-800 text-sm leading-relaxed">
                          {info[item.valueKey as keyof typeof info]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="rounded-md overflow-hidden bg-brand-50 border border-brand-100 aspect-[4/3] flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-100/80 to-brand-200/50" />
                <div className="relative text-center">
                  <div className="text-4xl mb-2">🗺️</div>
                  <p className="text-brand-700 text-sm font-semibold">Ashgabat, Turkmenistan</p>
                  <p className="text-brand-400 text-xs mt-1">Bitarap Turkmenistan Ave, 15</p>
                </div>
                {/* Decorative dots */}
                <div className="absolute top-4 left-4 w-2 h-2 bg-brand-300 rounded-full" />
                <div className="absolute top-8 right-8 w-1.5 h-1.5 bg-brand-400 rounded-full" />
                <div className="absolute bottom-6 right-6 w-2 h-2 bg-brand-200 rounded-full" />
                <div className="absolute bottom-10 left-10 w-1.5 h-1.5 bg-brand-300 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
