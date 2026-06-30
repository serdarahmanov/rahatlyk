/**
 * RAHATLYK Email Templates
 * Minimal, on-brand design matching the website's warm black / beige / white palette.
 * Table-based, inline-style HTML for maximum email-client compatibility.
 */

import { emailI18n, type EmailLocale } from './i18n';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rahatlyk.com';

export interface EmailContactInfo {
  address: string
  email:   string
  phone:   string
}

const FALLBACK_CONTACT: EmailContactInfo = {
  address: 'Bitarap Turkmenistan Ave 15, Ashgabat, Turkmenistan',
  email:   'info@rahatlyk.com',
  phone:   '+993 12 000 000',
}

/** Extract EmailContactInfo from the Payload `contact-info` global (locale:'all' response). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractEmailContact(raw: any, locale?: string): EmailContactInfo {
  if (!raw) return FALLBACK_CONTACT
  const addr = raw.address
  const address =
    (typeof addr === 'object' ? addr[locale ?? 'en'] ?? addr['en'] ?? addr['ru'] ?? addr['tm'] : addr) ||
    FALLBACK_CONTACT.address
  const email   = raw.email   || FALLBACK_CONTACT.email
  const phone   = raw.phones?.[0]?.number || FALLBACK_CONTACT.phone
  return { address, email, phone }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/* ─────────────────────────────────────────────────────────────────
   Design tokens  (mirrors globals.css)
───────────────────────────────────────────────────────────────── */
// bg:       #eef4f7  light water-tinted outer
// card:     #ffffff
// text:     #0f0b07  near-black
// muted:    #5a8fa0  water blue muted
// border:   #ddeef3  water-tinted border
// footer:   linear-gradient(160deg,#4a9ab0,#1e6f8a,#072a43) water gradient
// btn:      same water gradient / text: #fff / radius: 2px / uppercase

/* ─────────────────────────────────────────────────────────────────
   Building blocks
───────────────────────────────────────────────────────────────── */

// Water gradient — mirrors the hero gradient in globals.css
const WATER_GRADIENT = 'background-color:#15536e;background:linear-gradient(160deg,#4a9ab0 0%,#1e6f8a 40%,#072a43 100%)';
const ACCENT_BAR     = `<tr><td style="${WATER_GRADIENT};height:4px;font-size:0;line-height:0">&nbsp;</td></tr>`;

/** Outer wrapper for user-facing confirmation emails. */
function wrap(preheader: string, rows: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>RAHATLYK</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
</head>
<body style="margin:0;padding:0;background-color:#eef4f7;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;color:#eef4f7">${preheader}&nbsp;&zwnj;&nbsp;</div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#eef4f7">
    <tr>
      <td align="center" style="padding:48px 16px 40px">
        <table role="presentation" cellpadding="0" cellspacing="0" width="560" style="max-width:560px;width:100%;background:#ffffff">
          ${rows}
        </table>
        <table role="presentation" cellpadding="0" cellspacing="0" width="560" style="max-width:560px;width:100%">
          <tr>
            <td align="center" style="padding:20px 0 0">
              <p style="margin:0;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:10px;color:#5a8fa0;letter-spacing:1px">
                <a href="${SITE}" style="color:#5a8fa0;text-decoration:none">rahatlyk.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Outer wrapper for internal notification emails — no footer. */
function wrapNotify(preheader: string, rows: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>RAHATLYK</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
</head>
<body style="margin:0;padding:0;background-color:#eef4f7;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;color:#eef4f7">${preheader}&nbsp;&zwnj;&nbsp;</div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#eef4f7">
    <tr>
      <td align="center" style="padding:48px 16px 40px">
        <table role="presentation" cellpadding="0" cellspacing="0" width="560" style="max-width:560px;width:100%;background:#ffffff">
          ${rows}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Header for confirmation emails — accent bar + wordmark + title. */
function hdr(title: string, subtitle: string): string {
  return `
  ${ACCENT_BAR}
  <tr>
    <td style="padding:40px 44px 32px">
      <p style="margin:0 0 20px;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;color:#0f0b07;letter-spacing:6px;text-transform:uppercase;line-height:1">RAHATLYK</p>
      <div style="width:32px;height:1px;background:#1e6f8a;margin-bottom:28px"></div>
      <h1 style="margin:0 0 8px;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:28px;font-weight:400;color:#0f0b07;line-height:1.25;letter-spacing:-0.3px">${title}</h1>
      <p style="margin:0;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;color:#5a8fa0;line-height:1.5;letter-spacing:0.2px">${subtitle}</p>
    </td>
  </tr>`;
}

/** Slim header for internal notification emails. */
function hdrNotify(title: string, subtitle: string): string {
  return `
  ${ACCENT_BAR}
  <tr>
    <td style="padding:32px 44px 24px;border-bottom:1px solid #ddeef3">
      <p style="margin:0 0 16px;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:10px;font-weight:700;color:#0f0b07;letter-spacing:5px;text-transform:uppercase">RAHATLYK</p>
      <h1 style="margin:0 0 4px;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:18px;font-weight:600;color:#0f0b07;line-height:1.3">${title}</h1>
      <p style="margin:0;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;color:#5a8fa0">${subtitle}</p>
    </td>
  </tr>`;
}

/** Confirmation email footer — deep water gradient + white text. */
function ftr(contact: EmailContactInfo = FALLBACK_CONTACT): string {
  return `
  <tr>
    <td style="${WATER_GRADIENT};padding:32px 44px 36px">
      <p style="margin:0 0 4px;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;color:#ffffff;letter-spacing:5px;text-transform:uppercase">RAHATLYK</p>
      <p style="margin:0 0 2px;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.6)">${escapeHtml(contact.address)}</p>
      <p style="margin:0 0 18px;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.6)">
        <a href="mailto:${escapeHtml(contact.email)}" style="color:rgba(255,255,255,0.8);text-decoration:none">${escapeHtml(contact.email)}</a>
        &nbsp;&middot;&nbsp;${escapeHtml(contact.phone)}
      </p>
      <p style="margin:0;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:10px;color:rgba(255,255,255,0.35);letter-spacing:0.5px">© 2025 RAHATLYK. All rights reserved.</p>
    </td>
  </tr>`;
}

/** Minimal key-value row for data tables. */
function row(label: string, value: string, last = false): string {
  const border = last ? '' : 'border-bottom:1px solid #eef4f7';
  return `
  <tr>
    <td style="padding:12px 0;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:9px;font-weight:700;color:#5a8fa0;text-transform:uppercase;letter-spacing:1.5px;vertical-align:top;width:100px;${border}">${label}</td>
    <td style="padding:12px 0 12px 20px;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:#0f0b07;line-height:1.6;${border}">${value}</td>
  </tr>`;
}

/** CTA button — deep water blue, matches website's water brand. */
function btn(href: string, text: string): string {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0">
    <tr>
      <td style="${WATER_GRADIENT};border-radius:2px">
        <a href="${href}" style="display:inline-block;padding:13px 28px;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:2px;text-transform:uppercase">${text}</a>
      </td>
    </tr>
  </table>`;
}

/** Thin section divider. */
function divider(): string {
  return `<tr><td style="padding:0 44px"><div style="border-top:1px solid #ddeef3"></div></td></tr>`;
}

/* ─────────────────────────────────────────────────────────────────
   1. Contact Confirmation  →  sent to the person who wrote to us
───────────────────────────────────────────────────────────────── */

export interface ContactConfirmationData {
  firstName: string;
  lastName:  string;
  email:     string;
  subject:   string;
  message:   string;
  locale:    EmailLocale;
  contact?:  EmailContactInfo;
}

export function contactConfirmation({ firstName, lastName, subject, message, locale, contact }: ContactConfirmationData): { subject: string; html: string } {
  const s = emailI18n[locale].contactConfirm;
  const safeFN      = escapeHtml(firstName);
  const safeLN      = escapeHtml(lastName);
  const safeSub     = escapeHtml(subject);
  const safeMsg     = escapeHtml(message);
  const preview     = safeMsg.length > 140 ? safeMsg.slice(0, 140) + '…' : safeMsg;

  return {
    subject: s.subject(subject),
    html: wrap(s.preheader, `
      ${hdr(s.title, s.subtitle)}
      <tr>
        <td style="padding:0 44px 40px">

          <p style="margin:0 0 10px;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;color:#0f0b07;line-height:1.6">${s.greeting(safeFN, safeLN)}</p>
          <p style="margin:0 0 36px;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:#2d7a91;line-height:1.8">${s.intro}</p>

          <!-- Section label -->
          <p style="margin:0 0 12px;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:9px;font-weight:700;color:#c8ad88;text-transform:uppercase;letter-spacing:2px">${s.summaryHeading}</p>
          <!-- Data rows -->
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:36px;border-top:1px solid #f0e8d8">
            ${row(s.subjectLabel, safeSub)}
            ${row(s.messageLabel, `<span style="color:#2d7a91;font-style:italic">${preview}</span>`, true)}
          </table>

          <!-- CTA -->
          ${btn(SITE, s.ctaBtn)}

        </td>
      </tr>
      ${divider()}
      ${ftr(contact)}
    `),
  };
}

/* ─────────────────────────────────────────────────────────────────
   2. Contact Notification  →  sent to info@ and sarwan
───────────────────────────────────────────────────────────────── */

export interface ContactNotificationData {
  firstName: string;
  lastName:  string;
  email:     string;
  phone?:    string;
  subject:   string;
  message:   string;
  locale:    EmailLocale;
  contact?:  EmailContactInfo;
}

export function contactNotification({ firstName, lastName, email, phone, subject, message, locale }: ContactNotificationData): { subject: string; html: string } {
  const s = emailI18n[locale].contactNotify;
  const safeFN       = escapeHtml(firstName);
  const safeLN       = escapeHtml(lastName);
  const safeEmail    = escapeHtml(email);
  const safePhone    = phone ? escapeHtml(phone) : undefined;
  const safeSub      = escapeHtml(subject);
  const safeMsg      = escapeHtml(message);
  const fullName     = `${safeFN} ${safeLN}`;

  return {
    subject: s.subject(fullName, safeSub),
    html: wrapNotify(`${fullName} — ${safeSub}`, `
      ${hdrNotify(s.title, s.subtitle(fullName, safeEmail))}
      <tr>
        <td style="padding:28px 44px 0">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-top:1px solid #f0e8d8">
            ${row(s.firstNameLabel, safeFN)}
            ${row(s.lastNameLabel, safeLN)}
            ${row(s.emailLabel, `<a href="mailto:${safeEmail}" style="color:#2d7a91;text-decoration:none">${safeEmail}</a>`)}
            ${safePhone ? row(s.phoneLabel, safePhone) : ''}
            ${row(s.subjectLabel, safeSub, true)}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 44px 40px">
          <p style="margin:0 0 10px;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:9px;font-weight:700;color:#c8ad88;text-transform:uppercase;letter-spacing:2px">${s.messageHeading}</p>
          <p style="margin:0;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:#0f0b07;line-height:1.8;border-left:2px solid #75bac9;padding-left:16px;white-space:pre-wrap">${safeMsg}</p>
        </td>
      </tr>
    `),
  };
}

/* ─────────────────────────────────────────────────────────────────
   3. Vacancy Confirmation  →  sent to the applicant
───────────────────────────────────────────────────────────────── */

export interface VacancyConfirmationData {
  firstName:    string;
  lastName:     string;
  vacancyTitle: string;
  vacancyUrl:   string;
  locale:       EmailLocale;
  contact?:     EmailContactInfo;
}

export function vacancyConfirmation({ firstName, lastName, vacancyTitle, vacancyUrl, locale, contact }: VacancyConfirmationData): { subject: string; html: string } {
  const s = emailI18n[locale].vacancyConfirm;
  const safeFN    = escapeHtml(firstName);
  const safeLN    = escapeHtml(lastName);
  const safeTitle = escapeHtml(vacancyTitle);

  return {
    subject: s.subject(safeTitle),
    html: wrap(s.preheader(safeTitle), `
      ${hdr(s.title, s.subtitle(safeTitle))}
      <tr>
        <td style="padding:0 44px 40px">

          <p style="margin:0 0 10px;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;color:#0f0b07;line-height:1.6">${s.greeting(safeFN, safeLN)}</p>
          <p style="margin:0 0 36px;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:#2d7a91;line-height:1.8">${s.intro(safeTitle)}</p>

          <!-- Position summary -->
          <p style="margin:0 0 12px;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:9px;font-weight:700;color:#c8ad88;text-transform:uppercase;letter-spacing:2px">${s.appliedPositionHeading}</p>
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:36px;border-top:1px solid #f0e8d8">
            ${row(s.positionLabel, `<a href="${vacancyUrl}" style="color:#0f0b07;text-decoration:underline;text-decoration-color:#dfd0b8">${safeTitle}</a>`)}
            ${row(s.companyLabel, s.companyValue)}
            ${row(s.locationLabel, s.locationValue, true)}
          </table>

          <!-- CTA -->
          ${btn(`${SITE}/vacancies`, s.ctaBtn)}

        </td>
      </tr>
      ${divider()}
      ${ftr(contact)}
    `),
  };
}

/* ─────────────────────────────────────────────────────────────────
   4. Vacancy Notification  →  sent to info@ and sarwan (no CV)
───────────────────────────────────────────────────────────────── */

export interface VacancyNotificationData {
  firstName:    string;
  lastName:     string;
  email:        string;
  phone?:       string;
  dateOfBirth:  string;
  vacancyTitle: string;
  vacancyUrl:   string;
  cvFileName:   string;
  cover?:       string;
  locale:       EmailLocale;
  contact?:     EmailContactInfo;
}

export function vacancyNotification({ firstName, lastName, email, phone, dateOfBirth, vacancyTitle, vacancyUrl, cvFileName, cover, locale }: VacancyNotificationData): { subject: string; html: string } {
  const s = emailI18n[locale].vacancyNotify;
  const safeFN         = escapeHtml(firstName);
  const safeLN         = escapeHtml(lastName);
  const safeEmail      = escapeHtml(email);
  const safePhone      = phone ? escapeHtml(phone) : undefined;
  const safeDOB        = escapeHtml(dateOfBirth);
  const safeTitle      = escapeHtml(vacancyTitle);
  const safeCvFileName = escapeHtml(cvFileName);
  const safeCover      = cover ? escapeHtml(cover) : undefined;
  const fullName       = `${safeFN} ${safeLN}`;

  return {
    subject: s.subject(safeTitle, fullName),
    html: wrapNotify(`${fullName} — ${safeTitle}`, `
      ${hdrNotify(s.title, s.subtitle(safeTitle))}
      <tr>
        <td style="padding:28px 44px 0">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-top:1px solid #f0e8d8">
            ${row(s.firstNameLabel, safeFN)}
            ${row(s.lastNameLabel, safeLN)}
            ${row(s.dobLabel, safeDOB)}
            ${row(s.emailLabel, `<a href="mailto:${safeEmail}" style="color:#2d7a91;text-decoration:none">${safeEmail}</a>`)}
            ${safePhone ? row(s.phoneLabel, safePhone) : ''}
            ${row(s.positionLabel, `<a href="${vacancyUrl}" style="color:#2d7a91;text-decoration:none">${safeTitle}</a>`)}
            ${row(s.cvLabel, `${safeCvFileName} <span style="color:#c8ad88;font-size:12px">${s.cvNote}</span>`, !safeCover)}
          </table>
        </td>
      </tr>
      ${safeCover ? `
      <tr>
        <td style="padding:28px 44px 40px">
          <p style="margin:0 0 10px;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:9px;font-weight:700;color:#c8ad88;text-transform:uppercase;letter-spacing:2px">${s.coverHeading}</p>
          <p style="margin:0;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:#0f0b07;line-height:1.8;border-left:2px solid #75bac9;padding-left:16px;white-space:pre-wrap">${safeCover}</p>
        </td>
      </tr>` : `<tr><td style="padding:0 0 12px"></td></tr>`}
    `),
  };
}
