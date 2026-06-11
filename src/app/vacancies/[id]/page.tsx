'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { VACANCIES, Dept } from '@/lib/data/vacancies';

type Dept_ = Dept;

const DEPT_CONFIG: Record<Dept_, {
  gradient: string;
  light: string;
  text: string;
  badge: string;
  icon: string;
}> = {
  Production:        { gradient: 'from-brand-700 to-brand-600',     light: 'bg-brand-50',     text: 'text-brand-800',     badge: 'bg-brand-100 text-brand-800',     icon: '🏭' },
  Sales:             { gradient: 'from-emerald-600 to-teal-500', light: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', icon: '📈' },
  Marketing:         { gradient: 'from-violet-600 to-purple-500',light: 'bg-violet-50',  text: 'text-violet-700',  badge: 'bg-violet-100 text-violet-700',  icon: '📣' },
  Logistics:         { gradient: 'from-amber-500 to-orange-500', light: 'bg-amber-50',   text: 'text-amber-700',   badge: 'bg-amber-100 text-amber-700',    icon: '🚚' },
  Finance:           { gradient: 'from-blue-600 to-indigo-500',  light: 'bg-blue-50',    text: 'text-blue-700',    badge: 'bg-blue-100 text-blue-700',      icon: '💼' },
  'Customer Service':{ gradient: 'from-pink-500 to-rose-500',    light: 'bg-pink-50',    text: 'text-pink-700',    badge: 'bg-pink-100 text-pink-700',      icon: '🤝' },
  Quality:           { gradient: 'from-teal-600 to-emerald-500', light: 'bg-teal-50',    text: 'text-teal-700',    badge: 'bg-teal-100 text-teal-700',      icon: '✅' },
};

type Tab = 'overview' | 'responsibilities' | 'requirements';

export default function VacancyDetailPage() {
  const { locale } = useLanguage();
  const params = useParams();
  const id = params?.id as string;

  const vacancy = VACANCIES.find((v) => v.id === Number(id));

  const [tab, setTab] = useState<Tab>('overview');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [applyForm, setApplyForm] = useState({ firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', cover: '' });

  const heroRef   = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

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
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.1 }
        );
      }
      if (detailRef.current) {
        gsap.fromTo(
          detailRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: detailRef.current, start: 'top 85%' },
          }
        );
      }
    };
    init();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return () => st?.getAll().forEach((s: any) => s.kill());
  }, []);

  if (!vacancy) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center px-8">
          <p className="text-7xl mb-6">🔍</p>
          <h1
            className="text-3xl font-light text-brand-950 mb-3"
            style={{ fontFamily: 'var(--font-heading), sans-serif' }}
          >
            Position Not Found
          </h1>
          <p className="text-slate-500 mb-8">This vacancy may have been filled or removed.</p>
          <Link href="/vacancies" className="btn-primary">
            View All Vacancies
          </Link>
        </div>
      </div>
    );
  }

  const cfg = DEPT_CONFIG[vacancy.department];
  const others = VACANCIES.filter((v) => v.id !== vacancy.id).slice(0, 3);

  const handleApplyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setApplyForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);
    try {
      const data = new FormData();
      data.append('firstName',    applyForm.firstName);
      data.append('lastName',     applyForm.lastName);
      data.append('email',        applyForm.email);
      data.append('phone',        applyForm.phone);
      data.append('dateOfBirth',  applyForm.dateOfBirth);
      data.append('cover',        applyForm.cover);
      data.append('vacancyTitle', vacancy.title);
      data.append('vacancyId',    String(vacancy.id));
      data.append('locale',       locale);
      if (cvFile) data.append('cv', cvFile);

      const res = await fetch('/api/vacancy', { method: 'POST', body: data });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Something went wrong.');
      setFormSubmitted(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const tabContent: Record<Tab, React.ReactNode> = {
    overview: (
      <div className="prose prose-slate max-w-none">
        <p className="text-slate-600 text-base leading-relaxed mb-6">{vacancy.overview}</p>
        {vacancy.benefits && vacancy.benefits.length > 0 && (
          <>
            <h3
              className="text-lg font-light text-brand-950 mb-4"
              style={{ fontFamily: 'var(--font-heading), sans-serif' }}
            >
              Benefits & Perks
            </h3>
            <ul className="grid sm:grid-cols-2 gap-3">
              {vacancy.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${cfg.badge}`}>✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    ),
    responsibilities: (
      <ul className="space-y-3">
        {vacancy.responsibilities.map((r, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
            <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-light ${cfg.badge}`}>
              {i + 1}
            </span>
            {r}
          </li>
        ))}
      </ul>
    ),
    requirements: (
      <div className="space-y-8">
        <div>
          <h3
            className="text-base font-light text-brand-950 mb-4"
            style={{ fontFamily: 'var(--font-heading), sans-serif' }}
          >
            Required
          </h3>
          <ul className="space-y-3">
            {vacancy.requirements.map((r, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${cfg.badge}`}>✓</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
        {vacancy.niceToHave && vacancy.niceToHave.length > 0 && (
          <div>
            <h3
              className="text-base font-light text-brand-950 mb-4"
              style={{ fontFamily: 'var(--font-heading), sans-serif' }}
            >
              Nice to Have
            </h3>
            <ul className="space-y-3">
              {vacancy.niceToHave.map((n, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-500 leading-relaxed">
                  <span className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs bg-slate-100 text-slate-500">+</span>
                  {n}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ),
  };

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="bg-white pt-32 pb-12 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10" ref={heroRef}>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-slate-400 text-xs mb-8">
            <Link href="/" className="hover:text-brand-700 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/vacancies" className="hover:text-brand-700 transition-colors">Vacancies</Link>
            <span>/</span>
            <Link href={`/vacancies?department=${encodeURIComponent(vacancy.department)}`} className="hover:text-brand-700 transition-colors">{vacancy.department}</Link>
            <span>/</span>
            <span className="text-slate-600">{vacancy.title}</span>
          </nav>

          {/* Dept badge */}
          <div className="mb-4">
            <span className={`inline-block text-[11px] font-light px-3 py-1 rounded-full uppercase tracking-wider ${cfg.badge}`}>
              {vacancy.department}
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-light text-brand-950 leading-tight mb-5"
            style={{ fontFamily: 'var(--font-heading), sans-serif' }}
          >
            {vacancy.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-slate-500 text-sm mb-8">
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7,1 C4.8,1 3,2.8 3,5 C3,7.8 7,13 7,13 C7,13 11,7.8 11,5 C11,2.8 9.2,1 7,1 Z M7,6.5 A1.5,1.5 0 1,1 7,3.5 A1.5,1.5 0 0,1 7,6.5 Z" fill="currentColor"/>
              </svg>
              {vacancy.location}
            </span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M7 4v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              Posted {vacancy.postedDate}
            </span>
            {vacancy.salary && (
              <>
                <span className="text-slate-300">·</span>
                <span className="font-light text-brand-900">{vacancy.salary}</span>
              </>
            )}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <a href="#apply" className="btn-primary">
              Apply for This Role
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </section>


      {/* ── Tabs + Content ── */}
      <section className="py-14 bg-white" ref={detailRef}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          {/* Tab bar */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-md mb-10 w-fit">
            {(['overview', 'responsibilities', 'requirements'] as Tab[]).map((key) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-5 py-2 rounded text-sm font-light capitalize transition-all duration-200 ${
                  tab === key
                    ? 'bg-white text-brand-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>

          <div className="max-w-3xl">{tabContent[tab]}</div>
        </div>
      </section>

      {/* ── Apply Form ── */}
      <section id="apply" className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-10">

          <h2
            className="text-3xl font-light text-brand-950 mb-8"
            style={{ fontFamily: 'var(--font-heading), sans-serif' }}
          >
            Apply for this Position
          </h2>

          {formSubmitted ? (
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
                    Application Submitted
                  </h3>
                  <p className="text-brand-500 text-sm mt-0.5">
                    Thanks <span className="font-light text-brand-800">{applyForm.firstName} {applyForm.lastName}</span> — a confirmation has been sent to <span className="font-light text-brand-800">{applyForm.email}</span>.
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-6 space-y-4">
                <p className="text-[10px] font-light text-gray-300 uppercase tracking-[0.2em]">What happens next</p>
                {[
                  { n: '01', text: <>Our HR team reviews your CV within <strong className="text-gray-800 font-light">3–5 business days</strong>.</> },
                  { n: '02', text: <>If shortlisted, we&apos;ll reach out to schedule an interview.</> },
                  { n: '03', text: <>Check <strong className="text-gray-800 font-light">{applyForm.email}</strong> — that&apos;s where we&apos;ll contact you.</> },
                ].map(({ n, text }) => (
                  <div key={n} className="flex items-start gap-3">
                    <span className="text-[10px] font-light text-gray-300 tracking-widest mt-0.5 w-5 flex-shrink-0">{n}</span>
                    <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setFormSubmitted(false); setApplyForm({ firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', cover: '' }); setCvFile(null); }}
                className="mt-8 w-full py-4 rounded-md bg-[#1a1a1a] hover:bg-black text-white text-base font-normal tracking-wide transition-colors duration-200"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplySubmit} className="space-y-3">

              {/* First Name + Last Name */}
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  name="firstName"
                  value={applyForm.firstName}
                  onChange={handleApplyChange}
                  required
                  placeholder="First name*"
                  className="w-full px-4 py-4 rounded-md bg-[#f3f4f6] border-0 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all"
                />
                <input
                  type="text"
                  name="lastName"
                  value={applyForm.lastName}
                  onChange={handleApplyChange}
                  required
                  placeholder="Last name*"
                  className="w-full px-4 py-4 rounded-md bg-[#f3f4f6] border-0 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all"
                />
              </div>

              {/* Email + Phone */}
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  type="email"
                  name="email"
                  value={applyForm.email}
                  onChange={handleApplyChange}
                  required
                  placeholder="Email*"
                  className="w-full px-4 py-4 rounded-md bg-[#f3f4f6] border-0 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all"
                />
                <input
                  type="tel"
                  name="phone"
                  value={applyForm.phone}
                  onChange={handleApplyChange}
                  placeholder="Phone"
                  className="w-full px-4 py-4 rounded-md bg-[#f3f4f6] border-0 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all"
                />
              </div>

              {/* Date of Birth */}
              <input
                type="date"
                name="dateOfBirth"
                value={applyForm.dateOfBirth}
                onChange={handleApplyChange}
                required
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 16)).toISOString().split('T')[0]}
                className="w-full px-4 py-4 rounded-md bg-[#f3f4f6] border-0 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all"
              />

              {/* CV Upload */}
              <div
                className={`rounded-md px-4 py-6 text-center cursor-pointer transition-all duration-200 ${
                  dragOver ? 'bg-gray-200' : 'bg-[#f3f4f6] hover:bg-gray-200'
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const file = e.dataTransfer.files[0];
                  if (file) setCvFile(file);
                }}
                onClick={() => document.getElementById('cv-input')?.click()}
              >
                {cvFile ? (
                  <div className="flex items-center justify-center gap-3 text-gray-700">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <span className="text-sm font-normal">{cvFile.name}</span>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setCvFile(null); }} className="text-gray-400 hover:text-red-400 transition-colors">✕</button>
                  </div>
                ) : (
                  <>
                    <svg className="mx-auto mb-2 text-gray-400" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <p className="text-sm text-gray-500"><span className="font-light text-gray-700">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX — up to 5 MB</p>
                  </>
                )}
                <input id="cv-input" type="file" accept=".pdf,.doc,.docx" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) setCvFile(f); }} />
              </div>

              {/* Cover Letter */}
              <textarea
                name="cover"
                value={applyForm.cover}
                onChange={handleApplyChange}
                rows={5}
                placeholder="Cover letter — tell us why you're a great fit…"
                className="w-full px-4 py-4 rounded-md bg-[#f3f4f6] border-0 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all resize-none"
              />

              {/* Error */}
              {formError && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-4 py-3">
                  {formError}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={formSubmitting || !cvFile}
                className="w-full py-4 rounded-md bg-[#1a1a1a] hover:bg-black text-white text-base font-normal tracking-wide transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              >
                {formSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
                    </svg>
                    Submitting…
                  </>
                ) : 'Submit Application'}
              </button>

            </form>
          )}
        </div>
      </section>

      {/* ── Other Openings ── */}
      {others.length > 0 && (
        <section className="py-14 bg-brand-50 border-t border-brand-100">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
            <h2
              className="text-xl font-light text-brand-950 mb-8"
              style={{ fontFamily: 'var(--font-heading), sans-serif' }}
            >
              Other Openings
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {others.map((v) => (
                <Link
                  key={v.id}
                  href={`/vacancies/${v.id}`}
                  className="group bg-white hover:shadow-xl hover:-translate-y-1.5 rounded-2xl p-5 transition-[box-shadow,transform] duration-300"
                >
                  <span className={`inline-block text-[10px] font-light px-2.5 py-1 rounded-full uppercase tracking-wider mb-3 ${DEPT_CONFIG[v.department].badge}`}>
                    {v.department}
                  </span>
                  <h3 className="text-brand-950 text-sm font-light mb-1 group-hover:text-brand-700 transition-colors">
                    {v.title}
                  </h3>
                  <p className="text-brand-400 text-xs">{v.location}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
