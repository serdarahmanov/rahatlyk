'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

/* ── Contact info items ─────────────────────────────────────── */
const INFO_ITEMS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2C7.24 2 5 4.24 5 7c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="10" cy="7" r="1.75" stroke="currentColor" strokeWidth="1.4"/>
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
        <path d="M4.5 3.5h3l1.5 3.5-1.75 1.25a9 9 0 0 0 4.5 4.5L13 11l3.5 1.5v3a1 1 0 0 1-1 1A14 14 0 0 1 3.5 4.5a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
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

/* ── Shared input class ─────────────────────────────────────── */
const fieldCls =
  'w-full px-4 py-4 rounded-md bg-[#f3f4f6] border-0 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all';

/* ── Page ───────────────────────────────────────────────────── */
export default function ContactPage() {
  const { t, locale } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName:  '',
    email:     '',
    phone:     '',
    subject:   '',
    message:   '',
  });

  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let st: any;
    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      st = ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.1 }
        );
      }
      if (formRef.current) {
        gsap.fromTo(formRef.current, { x: -30, opacity: 0 }, {
          x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: formRef.current, start: 'top 85%' },
        });
      }
      if (infoRef.current) {
        gsap.fromTo(infoRef.current.children, { x: 30, opacity: 0 }, {
          x: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: infoRef.current, start: 'top 85%' },
        });
      }
    };
    init();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return () => st?.getAll().forEach((s: any) => s.kill());
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const info = t.contact.info;

  return (
    <div className="min-h-screen bg-white">

      {/* ── Title — no background image ── */}
      <div className="pt-32 pb-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10" ref={heroRef}>
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-light text-brand-950 leading-tight mb-6"
          style={{ fontFamily: 'var(--font-heading), sans-serif' }}
        >
          {t.contact.title}
        </h1>
        <p className="text-black text-base sm:text-lg leading-relaxed max-w-2xl">
          We are as passionate about your experience as we are about the purity of each and every RAHATLYK bottle. To maintain our high standards of excellence, we rely on our connection with you. We invite you to get in touch; whatever you need, we&apos;ll be only too happy to help.
        </p>
      </div>

      {/* ── Content ── */}
      <section className="pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid lg:grid-cols-[1fr_400px] gap-10 lg:gap-16 items-start">

            {/* ── Form ── */}
            <div ref={formRef}>
              {submitted ? (
                <div className="py-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-brand-700">
                        <path d="M22 2 11 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 2 15 22 11 13 2 9l20-7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-light text-brand-950" style={{ fontFamily: 'var(--font-heading), sans-serif' }}>
                        Message Sent
                      </h3>
                      <p className="text-brand-500 text-sm mt-0.5">
                        Thanks <span className="font-light text-brand-800">{form.firstName} {form.lastName}</span> — we&apos;ll be in touch at <span className="font-light text-brand-800">{form.email}</span>.
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-brand-100 pt-6 space-y-4">
                    <p className="text-[10px] font-light text-brand-300 uppercase tracking-[0.2em]">What happens next</p>
                    {[
                      { n: '01', text: <>Our team reviews your message within <strong className="text-brand-800 font-light">1 business day</strong>.</> },
                      { n: '02', text: <>We&apos;ll reply directly to <strong className="text-brand-800 font-light">{form.email}</strong>.</> },
                      { n: '03', text: <>For urgent enquiries call <strong className="text-brand-800 font-light">+993 12 000 000</strong>.</> },
                    ].map(({ n, text }) => (
                      <div key={n} className="flex items-start gap-3">
                        <span className="text-[10px] font-light text-brand-300 tracking-widest mt-0.5 w-5 flex-shrink-0">{n}</span>
                        <p className="text-sm text-brand-600 leading-relaxed">{text}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    className="mt-8 w-full py-4 rounded-md bg-[#1a1a1a] hover:bg-black text-white text-base font-normal tracking-wide transition-colors duration-200 flex items-center justify-center"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' });
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">

                  {/* First Name + Last Name */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      placeholder="First name*"
                      className={fieldCls}
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                      placeholder="Last name*"
                      className={fieldCls}
                    />
                  </div>

                  {/* Email + Phone */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="Email*"
                      className={fieldCls}
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone"
                      className={fieldCls}
                    />
                  </div>

                  {/* Subject */}
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    placeholder="Subject*"
                    className={fieldCls}
                  />

                  {/* Message */}
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Message*"
                    className={`${fieldCls} resize-none`}
                  />


                  {/* Error */}
                  {error && (
                    <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                      {error}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-md bg-[#1a1a1a] hover:bg-black text-white text-base font-normal tracking-wide transition-colors duration-200 flex items-center justify-center gap-2 mt-1"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
                        </svg>
                        Sending…
                      </>
                    ) : 'Submit inquiry'}
                  </button>

                </form>
              )}
            </div>

            {/* ── Contact Info ── */}
            <div ref={infoRef} className="pt-2">
              <p className="text-[10px] font-light tracking-[0.2em] uppercase text-gray-400 mb-8">
                {info.title}
              </p>

              <div className="space-y-0">
                {INFO_ITEMS.map((item) => (
                  <div key={item.labelKey} className="py-5 border-t border-gray-100 flex items-start gap-4">
                    {/* Thin mono icon */}
                    <div className="mt-0.5 flex-shrink-0 text-gray-400">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-light uppercase tracking-[0.18em] text-gray-400 mb-1">
                        {info[item.labelKey as keyof typeof info]}
                      </p>
                      <p className="text-sm text-gray-800 leading-relaxed">
                        {info[item.valueKey as keyof typeof info]}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="border-t border-gray-100" />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
