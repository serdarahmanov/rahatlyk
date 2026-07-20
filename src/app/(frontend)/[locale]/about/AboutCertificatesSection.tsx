'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export type AboutCertificateData = {
  heading: {
    text: string;
    accentText: string;
  };
  subtitle: string;
  sealText: string;
  certificates: Array<{
    name: string;
    tag: string;
    description: string;
    expiryDate: string;
    photo: string | null;
  }>;
};

export const ABOUT_CERTIFICATES_FALLBACK: AboutCertificateData = {
  heading: {
    text: 'Our standards,',
    accentText: 'on the record.',
  },
  subtitle: 'Independently audited standards - issued, renewed and verified behind every bottle.',
  sealText: 'RAHATLYK  *  CERTIFIED QUALITY  *  EST. 2003  *',
  certificates: [
    {
      name: 'ISO 9001',
      tag: 'Quality management',
      description: 'Quality management systems - audited across every production line, from filtration to the final cap.',
      expiryDate: 'Issued 2019 * Valid',
      photo: null,
    },
    {
      name: 'ISO 22000',
      tag: 'Food safety',
      description: 'Food safety management - covering sourcing, preparation, bottling and storage of all six collections.',
      expiryDate: 'Issued 2020 * Valid',
      photo: null,
    },
    {
      name: 'HACCP',
      tag: 'Hazard control',
      description: 'Hazard analysis & critical control points - applied at five quality stages from source to bottle.',
      expiryDate: 'Issued 2021 * Valid',
      photo: null,
    },
    {
      name: 'State Standard',
      tag: 'Turkmenistan',
      description: 'National conformity certification for beverages produced and distributed within Turkmenistan.',
      expiryDate: 'Issued 2022 * Valid',
      photo: null,
    },
  ],
};

export default function AboutCertificatesSection({
  data = ABOUT_CERTIFICATES_FALLBACK,
}: {
  data?: AboutCertificateData;
}) {
  const certSectionRef = useRef<HTMLElement>(null);
  const certFloatRef = useRef<HTMLDivElement>(null);
  const certModalRef = useRef<HTMLDivElement>(null);
  const [activeCertificate, setActiveCertificate] = useState<number | null>(null);
  const { locale } = useLanguage();

  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;

    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      gsap.utils.toArray<HTMLElement>('[data-cert-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%' },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-cert-rule]').forEach((rule, index) => {
        gsap.fromTo(
          rule,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.05,
            delay: index * 0.08,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: rule.parentElement, start: 'top 92%' },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-cert-row]').forEach((row) => {
        gsap.fromTo(
          row.querySelectorAll('.cert-name, .cert-issuer, .cert-thumb'),
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.05,
            ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 92%' },
          },
        );
      });

      if (certSectionRef.current && certFloatRef.current && window.matchMedia('(min-width: 821px)').matches) {
        const certSection = certSectionRef.current;
        const floatEl = certFloatRef.current;
        const xTo = gsap.quickTo(floatEl, 'x', { duration: 0.45, ease: 'power3.out' });
        const yTo = gsap.quickTo(floatEl, 'y', { duration: 0.45, ease: 'power3.out' });
        const opacityTo = gsap.quickTo(floatEl, 'opacity', { duration: 0.35, ease: 'power3.out' });
        const rows = gsap.utils.toArray<HTMLElement>('.cert-row');
        let isHoveringCertificate = false;
        let lastPointer = { x: 0, y: 0 };

        const hideFloat = () => {
          isHoveringCertificate = false;
          opacityTo(0);
          gsap.to(floatEl, { scale: 0.92, rotation: -1.5, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
        };

        const onPointerMove = (event: PointerEvent) => {
          lastPointer = { x: event.clientX, y: event.clientY };
          if (isHoveringCertificate) {
            xTo(event.clientX);
            yTo(event.clientY);
          }
        };

        const hideIfPointerOutsideSection = () => {
          if (!isHoveringCertificate) return;

          const rect = certSection.getBoundingClientRect();
          const isInsideSection =
            lastPointer.x >= rect.left &&
            lastPointer.x <= rect.right &&
            lastPointer.y >= rect.top &&
            lastPointer.y <= rect.bottom;

          if (!isInsideSection) hideFloat();
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('scroll', hideIfPointerOutsideSection, { passive: true });
        certSection.addEventListener('pointerleave', hideFloat);
        certSection.addEventListener('pointercancel', hideFloat);

        const st = ScrollTrigger.create({
          trigger: certSection,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: hideIfPointerOutsideSection,
          onLeave: hideFloat,
          onLeaveBack: hideFloat,
        });

        const rowCleanups = rows.map((row) => {
          const onPointerEnter = (event: PointerEvent) => {
            isHoveringCertificate = true;
            lastPointer = { x: event.clientX, y: event.clientY };
            xTo(event.clientX);
            yTo(event.clientY);
            const index = row.dataset.cert;
            floatEl.querySelectorAll<HTMLElement>('[data-cert-float]').forEach((panel) => {
              panel.classList.toggle('is-active', panel.dataset.certFloat === index);
            });
            opacityTo(1);
            gsap.to(floatEl, { scale: 1, rotation: 0, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
          };

          row.addEventListener('pointerenter', onPointerEnter);
          row.addEventListener('pointerleave', hideFloat);
          return () => {
            row.removeEventListener('pointerenter', onPointerEnter);
            row.removeEventListener('pointerleave', hideFloat);
          };
        });

        cleanup = () => {
          st.kill();
          rowCleanups.forEach((fn) => fn());
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('scroll', hideIfPointerOutsideSection);
          certSection.removeEventListener('pointerleave', hideFloat);
          certSection.removeEventListener('pointercancel', hideFloat);
        };
      }
    };

    init();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  const openCertificateModal = async (index: number) => {
    setActiveCertificate(index);

    const { gsap } = await import('gsap');
    requestAnimationFrame(() => {
      if (!certModalRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.fromTo(
        certModalRef.current.querySelector('.cert-modal-panel'),
        { opacity: 0, y: 30, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' },
      );
    });
  };

  const closeCertificateModal = () => {
    setActiveCertificate(null);
  };

  useEffect(() => {
    if (activeCertificate === null) return;

    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCertificateModal();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeCertificate]);

  const activeCert = activeCertificate !== null ? data.certificates[activeCertificate] : null;

  return (
    <>
      <section ref={certSectionRef} className="certs" id="certs">
        <div className="certs-inner">
          <div className="certs-seal-wrap" data-cert-reveal aria-hidden="true">
            <svg className="certs-seal" viewBox="0 0 150 150">
              <defs>
                <path id="certSealPath" d="M 75,75 m -58,0 a 58,58 0 1,1 116,0 a 58,58 0 1,1 -116,0" />
              </defs>
              <text>
                <textPath href="#certSealPath">
                  {data.sealText}
                </textPath>
              </text>
            </svg>
          </div>
          <div className="certs-head">
            <div>
              <h2 className="certs-title" data-cert-reveal>
                {data.heading.text} <em>{data.heading.accentText}</em>
              </h2>
            </div>
            <p className="certs-intro" data-cert-reveal>
              {data.subtitle}
            </p>
          </div>

          <div className="certs-ledger">
            <span className="ledger-top-rule" data-cert-rule />

            {data.certificates.map((certificate, index) => (
              <button
                key={certificate.name}
                className="cert-row"
                type="button"
                data-cert={index}
                data-cert-row
                onClick={() => openCertificateModal(index)}
              >
                <span className="cert-name">
                  {certificate.name} <em>{certificate.tag}</em>
                </span>
                <span className="cert-issuer">{certificate.description}</span>
                <span className="cert-thumb">
                  {certificate.photo ? (
                    <Image src={certificate.photo} alt={certificate.name} width={1448} height={1086} style={{ width: '100%', height: 'auto' }} />
                  ) : (
                    <CertificateArtwork title={certificate.name} />
                  )}
                </span>
                <span className="rule-bottom" data-cert-rule />
              </button>
            ))}
          </div>
        </div>
      </section>

      <div ref={certFloatRef} className="cert-float" aria-hidden="true">
        <div className="cert-float-inner">
          {data.certificates.map((certificate, index) => (
            <div key={certificate.name} data-cert-float={index}>
              {certificate.photo ? (
                <Image src={certificate.photo} alt={certificate.name} width={1448} height={1086} style={{ width: '100%', height: 'auto' }} />
              ) : (
                <CertificateArtwork title={certificate.name} />
              )}
            </div>
          ))}
        </div>
      </div>

      {activeCertificate !== null && activeCert && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={certModalRef}
              className="cert-modal is-open"
              role="dialog"
              aria-modal="true"
              aria-label="Certificate preview"
              style={{
                backdropFilter: 'blur(10px) saturate(1.1)',
                WebkitBackdropFilter: 'blur(10px) saturate(1.1)',
                background: 'rgba(255,255,255,0.65)',
              }}
            >
              <button className="cert-modal-backdrop" type="button" data-close aria-label="Close certificate preview" onClick={closeCertificateModal} />
              <div className="cert-modal-panel">
                <button className="cert-modal-close" type="button" data-close onClick={closeCertificateModal}>
                  {{ en: 'Close', tm: 'Yap', ru: 'Zakryt' }[locale]}
                </button>
                <div style={{ display: 'inline-block', maxWidth: '80vw' }}>
                  <div className="cert-modal-doc">
                    {activeCert.photo ? (
                      <Image
                        src={activeCert.photo}
                        alt={activeCert.name}
                        width={1448}
                        height={1086}
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                      />
                    ) : (
                      <CertificateArtwork title={activeCert.name} />
                    )}
                  </div>
                  <div className="cert-modal-caption">
                    <h3>{activeCert.name} - {activeCert.tag}</h3>
                    <span>{activeCert.expiryDate}</span>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function CertificateArtwork({ title }: { title: string }) {
  return (
    <span className="ph-doc">
      <span className="ph-sub">Certificate</span>
      <span className="ph-title">{title}</span>
      <span className="ph-rule" />
      <span className="ph-seal">R</span>
    </span>
  );
}
