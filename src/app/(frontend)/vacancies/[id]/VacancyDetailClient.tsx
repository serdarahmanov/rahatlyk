'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { formatDate } from '@/lib/formatDate'
import type { PayloadVacancy } from '@/types/payload'

const DEPT_CONFIG: Record<string, {
  gradient: string
  light: string
  text: string
  badge: string
  icon: string
}> = {
  Production:         { gradient: 'from-brand-700 to-brand-600',     light: 'bg-brand-50',     text: 'text-brand-800',     badge: 'bg-brand-100 text-brand-800',     icon: '🏭' },
  Sales:              { gradient: 'from-emerald-600 to-teal-500',    light: 'bg-emerald-50',   text: 'text-emerald-700',   badge: 'bg-emerald-100 text-emerald-700', icon: '📈' },
  Marketing:          { gradient: 'from-violet-600 to-purple-500',   light: 'bg-violet-50',    text: 'text-violet-700',    badge: 'bg-violet-100 text-violet-700',   icon: '📣' },
  Logistics:          { gradient: 'from-amber-500 to-orange-500',    light: 'bg-amber-50',     text: 'text-amber-700',     badge: 'bg-amber-100 text-amber-700',     icon: '🚚' },
  Finance:            { gradient: 'from-blue-600 to-indigo-500',     light: 'bg-blue-50',      text: 'text-blue-700',      badge: 'bg-blue-100 text-blue-700',       icon: '💼' },
  'Customer Service': { gradient: 'from-pink-500 to-rose-500',       light: 'bg-pink-50',      text: 'text-pink-700',      badge: 'bg-pink-100 text-pink-700',       icon: '🤝' },
  Quality:            { gradient: 'from-teal-600 to-emerald-500',    light: 'bg-teal-50',      text: 'text-teal-700',      badge: 'bg-teal-100 text-teal-700',       icon: '✅' },
}

const DEPT_ACCENT: Record<string, { dot: string; bg1: string; bg2: string }> = {
  Production:         { dot: '#5e6b7a', bg1: 'rgba(94,107,122,0.18)',  bg2: 'rgba(94,107,122,0.05)' },
  Sales:              { dot: '#2c8a4a', bg1: 'rgba(44,138,74,0.18)',   bg2: 'rgba(44,138,74,0.05)' },
  Marketing:          { dot: '#7d5bbe', bg1: 'rgba(125,91,190,0.18)',  bg2: 'rgba(125,91,190,0.05)' },
  Logistics:          { dot: '#c47c28', bg1: 'rgba(196,124,40,0.18)',  bg2: 'rgba(196,124,40,0.05)' },
  Finance:            { dot: '#2767d6', bg1: 'rgba(39,103,214,0.18)',  bg2: 'rgba(39,103,214,0.05)' },
  'Customer Service': { dot: '#c0392b', bg1: 'rgba(192,57,43,0.18)',   bg2: 'rgba(192,57,43,0.05)' },
  Quality:            { dot: '#1d8a8a', bg1: 'rgba(29,138,138,0.18)',  bg2: 'rgba(29,138,138,0.05)' },
}

type Tab = 'overview' | 'responsibilities' | 'requirements'

interface Props {
  vacancy: PayloadVacancy
  others: PayloadVacancy[]
}

export default function VacancyDetailClient({ vacancy, others }: Props) {
  const { locale } = useLanguage()

  const [tab, setTab] = useState<Tab>('overview')
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [applyForm, setApplyForm] = useState({ firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', cover: '' })

  const heroRef   = useRef<HTMLDivElement>(null)
  const detailRef = useRef<HTMLDivElement>(null)
  const submitInFlightRef = useRef(false)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let st: any
    const init = async () => {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      st = ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)

      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.children,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.1 }
        )
      }
      if (detailRef.current) {
        gsap.fromTo(
          detailRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: detailRef.current, start: 'top 85%' },
          }
        )
      }
    }
    init()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return () => st?.getAll().forEach((s: any) => s.kill())
  }, [])

  useEffect(() => {
    if (Object.keys(formErrors).length === 0) return
    const id = setTimeout(() => setFormErrors({}), 5000)
    return () => clearTimeout(id)
  }, [formErrors])

  const cfg = DEPT_CONFIG[vacancy.department.slug] ?? DEPT_CONFIG['Production']

  const validateApplyForm = () => {
    const errors: Record<string, string> = {}
    if (!applyForm.firstName.trim()) errors.firstName = 'First name is required'
    if (!applyForm.lastName.trim()) errors.lastName = 'Last name is required'
    if (!applyForm.email.trim()) errors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(applyForm.email)) errors.email = 'Please enter a valid email'
    if (!applyForm.dateOfBirth) errors.dateOfBirth = 'Date of birth is required'
    if (!cvFile) errors.cv = 'Please upload your CV'
    return errors
  }

  const handleApplyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setApplyForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleApplyFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target
    if (formErrors[name]) {
      setFormErrors((prev) => { const n = { ...prev }; delete n[name]; return n })
    }
  }

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitInFlightRef.current) return
    const errors = validateApplyForm()
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return }
    submitInFlightRef.current = true
    setFormErrors({})
    setFormSubmitting(true)
    setFormError(null)
    try {
      const data = new FormData()
      data.append('firstName',    applyForm.firstName)
      data.append('lastName',     applyForm.lastName)
      data.append('email',        applyForm.email)
      data.append('phone',        applyForm.phone)
      data.append('dateOfBirth',  applyForm.dateOfBirth)
      data.append('cover',        applyForm.cover)
      data.append('vacancyTitle', vacancy.title)
      data.append('vacancyId',    String(vacancy.id))
      data.append('locale',       locale)
      if (cvFile) data.append('cv', cvFile)

      const res  = await fetch('/api/vacancy', { method: 'POST', body: data })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Something went wrong.')
      setFormSubmitted(true)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      submitInFlightRef.current = false
      setFormSubmitting(false)
    }
  }

  const tabContent: Record<Tab, React.ReactNode> = {
    overview: (
      <div className="prose prose-slate max-w-none">
        <p className="text-slate-600 text-base leading-relaxed mb-6">{vacancy.overview}</p>
        {vacancy.benefits && vacancy.benefits.length > 0 && (
          <>
            <h3 className="text-lg font-semibold text-brand-950 mb-4" style={{ fontFamily: 'var(--font-heading), sans-serif' }}>
              Benefits &amp; Perks
            </h3>
            <ul className="grid sm:grid-cols-2 gap-3">
              {vacancy.benefits.map((b) => (
                <li key={b.id} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${cfg.badge}`}>&#10003;</span>
                  {b.text}
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
          <li key={r.id} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
            <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-light ${cfg.badge}`}>
              {i + 1}
            </span>
            {r.text}
          </li>
        ))}
      </ul>
    ),
    requirements: (
      <div className="space-y-8">
        <div>
          <h3 className="text-base font-semibold text-brand-950 mb-4" style={{ fontFamily: 'var(--font-heading), sans-serif' }}>
            Required
          </h3>
          <ul className="space-y-3">
            {vacancy.requirements.map((r) => (
              <li key={r.id} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${cfg.badge}`}>&#10003;</span>
                {r.text}
              </li>
            ))}
          </ul>
        </div>
        {vacancy.niceToHave && vacancy.niceToHave.length > 0 && (
          <div>
            <h3 className="text-base font-semibold text-brand-950 mb-4" style={{ fontFamily: 'var(--font-heading), sans-serif' }}>
              Nice to Have
            </h3>
            <ul className="space-y-3">
              {vacancy.niceToHave.map((n) => (
                <li key={n.id} className="flex items-start gap-3 text-sm text-slate-500 leading-relaxed">
                  <span className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs bg-slate-100 text-slate-500">+</span>
                  {n.text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ),
  }

  return (
    <div className="min-h-screen">
      <section className="bg-white pt-32 pb-12 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10" ref={heroRef}>
          <nav className="flex items-center gap-2 text-slate-400 text-xs mb-8">
            <Link href="/" className="hover:text-brand-700 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/vacancies" className="hover:text-brand-700 transition-colors">Vacancies</Link>
            <span>/</span>
            <Link href={`/vacancies?department=${encodeURIComponent(vacancy.department.slug)}`} className="hover:text-brand-700 transition-colors">{vacancy.department.label}</Link>
            <span>/</span>
            <span className="text-slate-600">{vacancy.title}</span>
          </nav>

          <div className="mb-4">
            <span className={`inline-block text-[11px] font-light px-3 py-1 rounded-full uppercase tracking-wider ${cfg.badge}`}>
              {vacancy.department.label}
            </span>
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-light text-brand-950 leading-tight mb-5"
            style={{ fontFamily: 'var(--font-heading), sans-serif' }}
          >
            {vacancy.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-slate-500 text-sm mb-8">
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7,1 C4.8,1 3,2.8 3,5 C3,7.8 7,13 7,13 C7,13 11,7.8 11,5 C11,2.8 9.2,1 7,1 Z M7,6.5 A1.5,1.5 0 1,1 7,3.5 A1.5,1.5 0 0,1 7,6.5 Z" fill="currentColor"/>
              </svg>
              {vacancy.location}
            </span>
            {vacancy.postedDate && (
              <>
                <span className="text-slate-300">&#183;</span>
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M7 4v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  Posted {formatDate(vacancy.postedDate, locale)}
                </span>
              </>
            )}
            {vacancy.salary && (
              <>
                <span className="text-slate-300">&#183;</span>
                <span className="flex items-center gap-1.5 font-light text-brand-900">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 text-slate-500">
                    <rect x="1.5" y="3.5" width="13" height="9" rx="2" stroke="currentColor" strokeWidth="1.3" />
                    <circle cx="8" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                  {vacancy.salary}
                </span>
              </>
            )}
          </div>

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

      <section className="py-14 bg-white" ref={detailRef}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex gap-1 bg-slate-100 p-1 rounded-md mb-10 w-fit">
            {(['overview', 'responsibilities', 'requirements'] as Tab[]).map((key) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-5 py-2 rounded text-sm font-light capitalize transition-all duration-200 ${
                  tab === key ? 'bg-white text-brand-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
          <div className="max-w-3xl">{tabContent[tab]}</div>
        </div>
      </section>

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
                    Thanks <span className="font-light text-brand-800">{applyForm.firstName} {applyForm.lastName}</span> &mdash; a confirmation has been sent to <span className="font-light text-brand-800">{applyForm.email}</span>.
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-6 space-y-4">
                <p className="text-[10px] font-light text-gray-300 uppercase tracking-[0.2em]">What happens next</p>
                {[
                  { n: '01', text: <>Our HR team reviews your CV within <strong className="text-gray-800 font-light">3&ndash;5 business days</strong>.</> },
                  { n: '02', text: <>If shortlisted, we&apos;ll reach out to schedule an interview.</> },
                  { n: '03', text: <>Check <strong className="text-gray-800 font-light">{applyForm.email}</strong> &mdash; that&apos;s where we&apos;ll contact you.</> },
                ].map(({ n, text }) => (
                  <div key={n} className="flex items-start gap-3">
                    <span className="text-[10px] font-light text-gray-300 tracking-widest mt-0.5 w-5 flex-shrink-0">{n}</span>
                    <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setFormSubmitted(false); setApplyForm({ firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', cover: '' }); setCvFile(null) }}
                className="mt-8 w-full py-4 rounded-md bg-[#1a1a1a] hover:bg-black text-white text-base font-normal tracking-wide transition-colors duration-200"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplySubmit} noValidate className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-900 mb-1.5 px-1">First name <span className="text-red-400">*</span></label>
                  <input type="text" name="firstName" value={applyForm.firstName} onChange={handleApplyChange} onFocus={handleApplyFocus} placeholder="John"
                    className={`w-full px-4 py-4 rounded-md border-0 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${formErrors.firstName ? 'ring-2 ring-red-400 bg-red-50' : 'bg-[#f3f4f6] focus:ring-gray-600'}`}
                  />
                  {formErrors.firstName && <p className="text-red-500 text-xs mt-1 px-1">{formErrors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-900 mb-1.5 px-1">Last name <span className="text-red-400">*</span></label>
                  <input type="text" name="lastName" value={applyForm.lastName} onChange={handleApplyChange} onFocus={handleApplyFocus} placeholder="Smith"
                    className={`w-full px-4 py-4 rounded-md border-0 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${formErrors.lastName ? 'ring-2 ring-red-400 bg-red-50' : 'bg-[#f3f4f6] focus:ring-gray-600'}`}
                  />
                  {formErrors.lastName && <p className="text-red-500 text-xs mt-1 px-1">{formErrors.lastName}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-900 mb-1.5 px-1">Email <span className="text-red-400">*</span></label>
                  <input type="email" name="email" value={applyForm.email} onChange={handleApplyChange} onFocus={handleApplyFocus} placeholder="you@example.com"
                    className={`w-full px-4 py-4 rounded-md border-0 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${formErrors.email ? 'ring-2 ring-red-400 bg-red-50' : 'bg-[#f3f4f6] focus:ring-gray-600'}`}
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1 px-1">{formErrors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-900 mb-1.5 px-1">Phone</label>
                  <input type="tel" name="phone" value={applyForm.phone} onChange={handleApplyChange} placeholder="+993 ..."
                    className="w-full px-4 py-4 rounded-md bg-[#f3f4f6] border-0 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-900 mb-1.5 px-1">Date of birth <span className="text-red-400">*</span></label>
                <input type="date" name="dateOfBirth" value={applyForm.dateOfBirth} onChange={handleApplyChange} onFocus={handleApplyFocus}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 16)).toISOString().split('T')[0]}
                  className={`w-full px-4 py-4 rounded-md border-0 text-sm text-gray-500 focus:outline-none focus:ring-2 transition-all ${formErrors.dateOfBirth ? 'ring-2 ring-red-400 bg-red-50' : 'bg-[#f3f4f6] focus:ring-gray-600'}`}
                />
                {formErrors.dateOfBirth && <p className="text-red-500 text-xs mt-1 px-1">{formErrors.dateOfBirth}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-900 mb-1.5 px-1">CV / Resume <span className="text-red-400">*</span></label>
                <div
                  className={`rounded-md px-4 py-6 text-center cursor-pointer transition-all duration-200 ${formErrors.cv ? 'ring-2 ring-red-400 bg-red-50' : dragOver ? 'bg-gray-200' : 'bg-[#f3f4f6] hover:bg-gray-200'}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); const file = e.dataTransfer.files[0]; if (file) setCvFile(file) }}
                  onClick={() => document.getElementById('cv-input')?.click()}
                >
                  {cvFile ? (
                    <div className="flex items-center justify-center gap-3 text-gray-700">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                      </svg>
                      <span className="text-sm font-normal">{cvFile.name}</span>
                      <button type="button" onClick={(e) => { e.stopPropagation(); setCvFile(null) }} className="text-gray-400 hover:text-red-400 transition-colors">&#215;</button>
                    </div>
                  ) : (
                    <>
                      <svg className="mx-auto mb-2 text-gray-400" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <p className="text-sm text-gray-500"><span className="font-light text-gray-700">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX &mdash; up to 5 MB</p>
                    </>
                  )}
                  <input id="cv-input" type="file" accept=".pdf,.doc,.docx" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) { setCvFile(f); setFormErrors((prev) => { const n = { ...prev }; delete n.cv; return n }) } }}
                  />
                </div>
                {formErrors.cv && <p className="text-red-500 text-xs mt-1 px-1">{formErrors.cv}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-900 mb-1.5 px-1">Cover letter</label>
                <textarea name="cover" value={applyForm.cover} onChange={handleApplyChange} rows={5} placeholder="Tell us why you're a great fit…"
                  className="w-full px-4 py-4 rounded-md bg-[#f3f4f6] border-0 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all resize-none"
                />
              </div>

              {formError && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-4 py-3">{formError}</p>
              )}

              <button type="submit" disabled={formSubmitting}
                className="w-full py-4 rounded-md bg-[#1a1a1a] hover:bg-black text-white text-base font-normal tracking-wide transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              >
                {formSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
                    </svg>
                    Submitting&hellip;
                  </>
                ) : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </section>

      {others.length > 0 && (
        <section className="py-14 bg-white border-t border-[#e8e8ed]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <h2
              className="text-xl sm:text-2xl font-medium text-brand-950 mb-8"
              style={{ fontFamily: 'var(--font-heading), sans-serif' }}
            >
              Other Openings
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {others.map((v) => {
                const acc = DEPT_ACCENT[v.department.slug] ?? DEPT_ACCENT['Production']
                return (
                  <Link
                    key={v.id}
                    href={`/vacancies/${v.id}`}
                    className="group bg-white rounded-[14px] border border-[#e8e8ed] overflow-hidden flex flex-col shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.05),0_18px_40px_rgba(0,0,0,0.10)] hover:-translate-y-[5px] hover:border-transparent transition-[transform,box-shadow,border-color] duration-300"
                  >
                    <div
                      className="h-40 flex items-center justify-center flex-shrink-0 overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${acc.bg1}, ${acc.bg2})` }}
                    >
                      <span className="text-4xl opacity-55" aria-hidden="true">
                        {(DEPT_CONFIG[v.department.slug] ?? DEPT_CONFIG['Production']).icon}
                      </span>
                    </div>
                    <div className="px-5 pt-[18px] pb-5 flex flex-col flex-1" style={{ fontFamily: 'var(--font-heading), var(--font-inter), system-ui, sans-serif' }}>
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: acc.dot }} />
                        <span className="text-[11px] font-semibold tracking-[0.05em] uppercase" style={{ color: '#6e6e73' }}>{v.department.label}</span>
                      </div>
                      <h3 className="text-[17px] font-semibold leading-[1.25] tracking-[-0.015em] mb-2" style={{ color: '#1d1d1f' }}>{v.title}</h3>
                      <p className="text-[13.5px] leading-[1.5] line-clamp-2 flex-1 mb-4" style={{ color: '#6e6e73' }}>{v.overview}</p>
                      <div className="flex items-center gap-[7px] text-sm font-semibold mb-2.5" style={{ color: '#1d1d1f' }}>
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="flex-shrink-0" style={{ color: '#6e6e73' }}>
                          <rect x="1.5" y="3.5" width="13" height="9" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                          <circle cx="8" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.3"/>
                        </svg>
                        {v.salary}
                      </div>
                      <div className="flex items-center gap-1.5 text-[13px]" style={{ color: '#86868b' }}>
                        <svg width="13" height="13" viewBox="0 0 14 14" fill="currentColor" className="flex-shrink-0">
                          <path d="M7,1 C4.8,1 3,2.8 3,5 C3,7.8 7,13 7,13 C7,13 11,7.8 11,5 C11,2.8 9.2,1 7,1 Z M7,6.5 A1.5,1.5 0 1,1 7,3.5 A1.5,1.5 0 0,1 7,6.5 Z"/>
                        </svg>
                        {v.location}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
