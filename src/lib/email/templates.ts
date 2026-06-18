/**
 * RAHATLYK Email Templates
 * Minimal, on-brand design matching the website's warm black / beige / white palette.
 * Table-based, inline-style HTML for maximum email-client compatibility.
 */

import { emailI18n, type EmailLocale } from './i18n';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rahatlyk.com';

/* ─────────────────────────────────────────────────────────────────
   Design tokens  (mirrors globals.css)
───────────────────────────────────────────────────────────────── */
// bg:      #f5f2ee  warm off-white outer
// card:    #ffffff
// text:    #0f0b07  near-black
// muted:   #6e5a44  warm dark
// label:   #a88e6a  warm tan
// subtle:  #faf8f4  brand-50
// border:  #f0e8d8  brand-100
// btn bg:  #0f0b07 / text: #fff / radius: 2px / uppercase / letter-spacing

/* ─────────────────────────────────────────────────────────────────
   Building blocks
───────────────────────────────────────────────────────────────── */

/** Outer wrapper for user-facing confirmation emails. */
function wrap(preheader: string, rows: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>RAHATLYK</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f2ee;font-family:Georgia,'Times New Roman',serif;-webkit-font-smoothing:antialiased">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;color:#f5f2ee">${preheader}&nbsp;&zwnj;&nbsp;</div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f5f2ee">
    <tr>
      <td align="center" style="padding:48px 16px 40px">
        <table role="presentation" cellpadding="0" cellspacing="0" width="560" style="max-width:560px;width:100%;background:#ffffff">
          ${rows}
        </table>
        <table role="presentation" cellpadding="0" cellspacing="0" width="560" style="max-width:560px;width:100%">
          <tr>
            <td align="center" style="padding:20px 0 0">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:10px;color:#c8ad88;letter-spacing:1px">
                <a href="${SITE}" style="color:#c8ad88;text-decoration:none">rahatlyk.com</a>
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
</head>
<body style="margin:0;padding:0;background-color:#f5f2ee;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;color:#f5f2ee">${preheader}&nbsp;&zwnj;&nbsp;</div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f5f2ee">
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

/** Header for confirmation emails — wordmark + divider + title. */
function hdr(title: string, subtitle: string): string {
  return `
  <tr>
    <td style="padding:44px 44px 36px">
      <p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;color:#0f0b07;letter-spacing:6px;text-transform:uppercase;line-height:1">RAHATLYK</p>
      <div style="width:32px;height:1px;background:#0f0b07;margin-bottom:28px"></div>
      <h1 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:400;color:#0f0b07;line-height:1.25;letter-spacing:-0.3px">${title}</h1>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#a88e6a;line-height:1.5;letter-spacing:0.2px">${subtitle}</p>
    </td>
  </tr>`;
}

/** Slim header for internal notification emails. */
function hdrNotify(title: string, subtitle: string): string {
  return `
  <tr>
    <td style="padding:36px 44px 28px;border-bottom:1px solid #f0e8d8">
      <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;color:#0f0b07;letter-spacing:5px;text-transform:uppercase">RAHATLYK</p>
      <h1 style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:600;color:#0f0b07;line-height:1.3">${title}</h1>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#a88e6a">${subtitle}</p>
    </td>
  </tr>`;
}

/** Confirmation email footer — address + copyright. */
function ftr(): string {
  return `
  <tr>
    <td style="padding:28px 44px 36px;border-top:1px solid #f0e8d8">
      <p style="margin:0 0 3px;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;color:#0f0b07;letter-spacing:4px;text-transform:uppercase">RAHATLYK</p>
      <p style="margin:0 0 2px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#c8ad88">Bitarap Turkmenistan Ave 15, Ashgabat, Turkmenistan</p>
      <p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#c8ad88">
        <a href="mailto:info@rahatlyk.com" style="color:#a88e6a;text-decoration:none">info@rahatlyk.com</a>
        &nbsp;&middot;&nbsp;+993 12 000 000
      </p>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:10px;color:#dfd0b8;letter-spacing:0.5px">© 2025 RAHATLYK. All rights reserved.</p>
    </td>
  </tr>`;
}

/** Minimal key-value row for data tables. */
function row(label: string, value: string, last = false): string {
  const border = last ? '' : 'border-bottom:1px solid #faf8f4';
  return `
  <tr>
    <td style="padding:12px 0;font-family:Arial,Helvetica,sans-serif;font-size:9px;font-weight:700;color:#c8ad88;text-transform:uppercase;letter-spacing:1.5px;vertical-align:top;width:100px;${border}">${label}</td>
    <td style="padding:12px 0 12px 20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#0f0b07;line-height:1.6;${border}">${value}</td>
  </tr>`;
}

/** CTA button — matches website's btn-primary style. */
function btn(href: string, text: string): string {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0">
    <tr>
      <td style="background:#0f0b07;border-radius:2px">
        <a href="${href}" style="display:inline-block;padding:13px 28px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:2px;text-transform:uppercase">${text}</a>
      </td>
    </tr>
  </table>`;
}

/** Thin section divider. */
function divider(): string {
  return `<tr><td style="padding:0 44px"><div style="border-top:1px solid #f0e8d8"></div></td></tr>`;
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
}

export function contactConfirmation({ firstName, lastName, subject, message, locale }: ContactConfirmationData): { subject: string; html: string } {
  const s = emailI18n[locale].contactConfirm;
  const preview = message.length > 140 ? message.slice(0, 140) + '…' : message;

  return {
    subject: s.subject(subject),
    html: wrap(s.preheader, `
      ${hdr(s.title, s.subtitle)}
      <tr>
        <td style="padding:0 44px 40px">

          <p style="margin:0 0 10px;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#0f0b07;line-height:1.6">${s.greeting(firstName, lastName)}</p>
          <p style="margin:0 0 36px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#6e5a44;line-height:1.8">${s.intro}</p>

          <!-- Section label -->
          <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:9px;font-weight:700;color:#c8ad88;text-transform:uppercase;letter-spacing:2px">${s.summaryHeading}</p>
          <!-- Data rows -->
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:36px;border-top:1px solid #f0e8d8">
            ${row(s.subjectLabel, subject)}
            ${row(s.messageLabel, `<span style="color:#6e5a44;font-style:italic">${preview}</span>`, true)}
          </table>

          <!-- CTA -->
          ${btn(SITE, s.ctaBtn)}

        </td>
      </tr>
      ${divider()}
      ${ftr()}
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
}

export function contactNotification({ firstName, lastName, email, phone, subject, message, locale }: ContactNotificationData): { subject: string; html: string } {
  const s = emailI18n[locale].contactNotify;
  const fullName = `${firstName} ${lastName}`;

  return {
    subject: s.subject(fullName, subject),
    html: wrapNotify(`${firstName} ${lastName} — ${subject}`, `
      ${hdrNotify(s.title, s.subtitle(fullName, email))}
      <tr>
        <td style="padding:28px 44px 0">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-top:1px solid #f0e8d8">
            ${row(s.firstNameLabel, firstName)}
            ${row(s.lastNameLabel, lastName)}
            ${row(s.emailLabel, `<a href="mailto:${email}" style="color:#6e5a44;text-decoration:none">${email}</a>`)}
            ${phone ? row(s.phoneLabel, phone) : ''}
            ${row(s.subjectLabel, subject, true)}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 44px 40px">
          <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:9px;font-weight:700;color:#c8ad88;text-transform:uppercase;letter-spacing:2px">${s.messageHeading}</p>
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#0f0b07;line-height:1.8;border-left:2px solid #dfd0b8;padding-left:16px;white-space:pre-wrap">${message}</p>
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
}

export function vacancyConfirmation({ firstName, lastName, vacancyTitle, vacancyUrl, locale }: VacancyConfirmationData): { subject: string; html: string } {
  const s = emailI18n[locale].vacancyConfirm;

  return {
    subject: s.subject(vacancyTitle),
    html: wrap(s.preheader(vacancyTitle), `
      ${hdr(s.title, s.subtitle(vacancyTitle))}
      <tr>
        <td style="padding:0 44px 40px">

          <p style="margin:0 0 10px;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#0f0b07;line-height:1.6">${s.greeting(firstName, lastName)}</p>
          <p style="margin:0 0 36px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#6e5a44;line-height:1.8">${s.intro(vacancyTitle)}</p>

          <!-- Position summary -->
          <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:9px;font-weight:700;color:#c8ad88;text-transform:uppercase;letter-spacing:2px">${s.appliedPositionHeading}</p>
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:36px;border-top:1px solid #f0e8d8">
            ${row(s.positionLabel, `<a href="${vacancyUrl}" style="color:#0f0b07;text-decoration:underline;text-decoration-color:#dfd0b8">${vacancyTitle}</a>`)}
            ${row(s.companyLabel, s.companyValue)}
            ${row(s.locationLabel, s.locationValue, true)}
          </table>

          <!-- CTA -->
          ${btn(`${SITE}/vacancies`, s.ctaBtn)}

        </td>
      </tr>
      ${divider()}
      ${ftr()}
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
}

export function vacancyNotification({ firstName, lastName, email, phone, dateOfBirth, vacancyTitle, vacancyUrl, cvFileName, cover, locale }: VacancyNotificationData): { subject: string; html: string } {
  const s = emailI18n[locale].vacancyNotify;
  const fullName = `${firstName} ${lastName}`;

  return {
    subject: s.subject(vacancyTitle, fullName),
    html: wrapNotify(`${firstName} ${lastName} — ${vacancyTitle}`, `
      ${hdrNotify(s.title, s.subtitle(vacancyTitle))}
      <tr>
        <td style="padding:28px 44px 0">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-top:1px solid #f0e8d8">
            ${row(s.firstNameLabel, firstName)}
            ${row(s.lastNameLabel, lastName)}
            ${row(s.dobLabel, dateOfBirth)}
            ${row(s.emailLabel, `<a href="mailto:${email}" style="color:#6e5a44;text-decoration:none">${email}</a>`)}
            ${phone ? row(s.phoneLabel, phone) : ''}
            ${row(s.positionLabel, `<a href="${vacancyUrl}" style="color:#6e5a44;text-decoration:none">${vacancyTitle}</a>`)}
            ${row(s.cvLabel, `${cvFileName} <span style="color:#c8ad88;font-size:12px">${s.cvNote}</span>`, !cover)}
          </table>
        </td>
      </tr>
      ${cover ? `
      <tr>
        <td style="padding:28px 44px 40px">
          <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:9px;font-weight:700;color:#c8ad88;text-transform:uppercase;letter-spacing:2px">${s.coverHeading}</p>
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#0f0b07;line-height:1.8;border-left:2px solid #dfd0b8;padding-left:16px;white-space:pre-wrap">${cover}</p>
        </td>
      </tr>` : `<tr><td style="padding:0 0 12px"></td></tr>`}
    `),
  };
}
