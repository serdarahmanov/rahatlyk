'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useContactInfo } from '@/lib/contact-info/ContactInfoContext';


const fieldCls = (err?: boolean) =>
  `w-full px-4 py-4 rounded-md border-0 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
    err ? 'bg-red-50 ring-2 ring-red-400' : 'bg-[#f3f4f6] focus:ring-gray-600'
  }`;

export default function ContactPage() {
  const { t, locale } = useLanguage();
  const contactInfo = useContactInfo();
  const [submitted,  setSubmitted]  = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
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
  const bgRef   = useRef<HTMLDivElement>(null);
  const submitInFlightRef = useRef(false);

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
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.15 }
        );
      }
      if (formRef.current) {
        gsap.fromTo(formRef.current, { y: 20, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: formRef.current, start: 'top 88%' },
        });
      }
      if (infoRef.current) {
        gsap.fromTo(infoRef.current.children, { y: 24, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: infoRef.current, start: 'top 85%' },
        });
      }
      /* Parallax on the gradient background */
      if (bgRef.current) {
        gsap.fromTo(bgRef.current,
          { y: '-10%' },
          {
            y: '10%',
            ease: 'none',
            scrollTrigger: {
              trigger: document.documentElement,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
            },
          }
        );
      }
    };
    init();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return () => st?.getAll().forEach((s: any) => s.kill());
  }, []);

  useEffect(() => {
    if (Object.keys(formErrors).length === 0) return;
    const id = setTimeout(() => setFormErrors({}), 5000);
    return () => clearTimeout(id);
  }, [formErrors]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.firstName.trim()) errors.firstName = 'First name is required';
    if (!form.lastName.trim())  errors.lastName  = 'Last name is required';
    if (!form.email.trim())     errors.email     = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Please enter a valid email';
    if (!form.subject.trim())   errors.subject   = 'Subject is required';
    if (!form.message.trim())   errors.message   = 'Message is required';
    return errors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    if (formErrors[name]) {
      setFormErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitInFlightRef.current) return;
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    submitInFlightRef.current = true;
    setFormErrors({});
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
      submitInFlightRef.current = false;
      setLoading(false);
    }
  };

  const info = t.contact.info;

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full lg:grid lg:grid-cols-[65fr_35fr] lg:min-h-screen">

        {/* ── Left — heading + form ── */}
        <div className="px-5 sm:px-10 lg:px-16 xl:px-24 pt-32 pb-24">

          {/* Heading */}
          <div className="mb-10" ref={heroRef}>
            <h1
              className="text-4xl sm:text-5xl font-light text-brand-950 leading-tight mb-5"
              style={{ fontFamily: 'var(--font-heading), sans-serif' }}
            >
              We&apos;d Love to Hear From You
            </h1>
            <p className="text-gray-500 text-base leading-relaxed">
              We are as passionate about your experience as we are about the purity of each and every RAHATLYK bottle. We rely on our connection with you — whatever you need, we&apos;ll be only too happy to help.
            </p>
          </div>

          {/* Form */}
          <div ref={formRef}>
            {submitted ? (
              <div className="py-6">
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
                    ...(contactInfo.phones[0] ? [{ n: '03', text: <>For urgent enquiries call <strong className="text-brand-800 font-light">{contactInfo.phones[0].number}</strong>.</> }] : []),
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
              <form onSubmit={handleSubmit} noValidate className="space-y-3">

                {/* First Name + Last Name */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-900 mb-1.5 px-1">First name <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      placeholder="John"
                      className={fieldCls(!!formErrors.firstName)}
                    />
                    {formErrors.firstName && <p className="text-red-500 text-xs mt-1 px-1">{formErrors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-900 mb-1.5 px-1">Last name <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      placeholder="Smith"
                      className={fieldCls(!!formErrors.lastName)}
                    />
                    {formErrors.lastName && <p className="text-red-500 text-xs mt-1 px-1">{formErrors.lastName}</p>}
                  </div>
                </div>

                {/* Email + Phone */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-900 mb-1.5 px-1">Email <span className="text-red-400">*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      placeholder="you@example.com"
                      className={fieldCls(!!formErrors.email)}
                    />
                    {formErrors.email && <p className="text-red-500 text-xs mt-1 px-1">{formErrors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-900 mb-1.5 px-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+993 ..."
                      className={fieldCls()}
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm text-gray-900 mb-1.5 px-1">Subject <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    placeholder="What is this about?"
                    className={fieldCls(!!formErrors.subject)}
                  />
                  {formErrors.subject && <p className="text-red-500 text-xs mt-1 px-1">{formErrors.subject}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm text-gray-900 mb-1.5 px-1">Message <span className="text-red-400">*</span></label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    rows={6}
                    placeholder="Your message…"
                    className={`${fieldCls(!!formErrors.message)} resize-none`}
                  />
                  {formErrors.message && <p className="text-red-500 text-xs mt-1 px-1">{formErrors.message}</p>}
                </div>

                {error && (
                  <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    {error}
                  </p>
                )}

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
        </div>

        {/* ── Right — sticky gradient info panel ── */}
        <div className="relative lg:sticky lg:top-0 lg:h-screen overflow-hidden">

          {/* Parallax blob gradient — same as about page mosaic */}
          <div ref={bgRef} className="about-mosaic-bg">
            <div className="about-mosaic-base" />
            <div className="about-mosaic-blob about-mosaic-blob-1" />
            <div className="about-mosaic-blob about-mosaic-blob-2" />
            <div className="about-mosaic-blob about-mosaic-blob-3" />
            <div className="about-mosaic-blob about-mosaic-blob-4" />
            <div className="about-mosaic-blob about-mosaic-blob-5" />
            <div className="about-mosaic-grain" />
          </div>

          {/* Info content */}
          <div className="relative z-10 flex flex-col justify-center h-full px-10 lg:px-12 py-20 lg:py-24">

            <p className="text-[10px] tracking-[0.25em] uppercase text-white font-normal mb-10">
              Contact Information
            </p>

            <div ref={infoRef} className="space-y-0">
              {contactInfo.address && (
                <div className="py-6 border-t border-white/20 flex items-start gap-5">
                  <div className="mt-0.5 flex-shrink-0 text-white/70">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 2C7.24 2 5 4.24 5 7c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="10" cy="7" r="1.75" stroke="currentColor" strokeWidth="1.4"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-normal uppercase tracking-[0.18em] text-white mb-1.5">{info.address}</p>
                    <p className="text-[15px] text-white leading-relaxed font-normal">{contactInfo.address}</p>
                  </div>
                </div>
              )}
              {contactInfo.phones.map((p) => (
                <div key={p.number} className="py-6 border-t border-white/20 flex items-start gap-5">
                  <div className="mt-0.5 flex-shrink-0 text-white/70">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4.5 3.5h3l1.5 3.5-1.75 1.25a9 9 0 0 0 4.5 4.5L13 11l3.5 1.5v3a1 1 0 0 1-1 1A14 14 0 0 1 3.5 4.5a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-normal uppercase tracking-[0.18em] text-white mb-1.5">{p.label || info.phone}</p>
                    <p className="text-[15px] text-white leading-relaxed font-normal">{p.number}</p>
                  </div>
                </div>
              ))}
              {contactInfo.email && (
                <div className="py-6 border-t border-white/20 flex items-start gap-5">
                  <div className="mt-0.5 flex-shrink-0 text-white/70">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M2.5 5.5A1.5 1.5 0 0 1 4 4h12a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 16 16H4a1.5 1.5 0 0 1-1.5-1.5v-9zM4 5.5l6 4.5 6-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-normal uppercase tracking-[0.18em] text-white mb-1.5">{info.email}</p>
                    <p className="text-[15px] text-white leading-relaxed font-normal">{contactInfo.email}</p>
                  </div>
                </div>
              )}
              {contactInfo.workingHours && (
                <div className="py-6 border-t border-white/20 flex items-start gap-5">
                  <div className="mt-0.5 flex-shrink-0 text-white/70">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.4" />
                      <path d="M10 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-normal uppercase tracking-[0.18em] text-white mb-1.5">{info.hours}</p>
                    <p className="text-[15px] text-white leading-relaxed font-normal">{contactInfo.workingHours}</p>
                  </div>
                </div>
              )}
              <div className="border-t border-white/10" />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
