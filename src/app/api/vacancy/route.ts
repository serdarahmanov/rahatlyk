import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { fileTypeFromBuffer } from 'file-type';
import { SITE, vacancyConfirmation, vacancyNotification, extractEmailContact } from '@/lib/email/templates';
import type { EmailLocale } from '@/lib/email/i18n';
import { getPayloadClient } from '@/lib/payload';
import { getCachedContactInfo } from '@/lib/payload/cachedQueries';
import { isSpam, sanitizeCsv } from '@/lib/spam-check';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_SIZE_BYTES = 2 * 1024 * 1024;

const VALID_LOCALES: EmailLocale[] = ['en', 'ru', 'tm'];

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  tls: { rejectUnauthorized: false },
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const firstName    = (formData.get('firstName')    as string)?.trim();
    const lastName     = (formData.get('lastName')     as string)?.trim();
    const email        = (formData.get('email')        as string)?.trim();
    const phone        = (formData.get('phone')        as string)?.trim();
    const dateOfBirth  = (formData.get('dateOfBirth')  as string)?.trim();
    const cover        = (formData.get('cover')        as string)?.trim();
    const vacancyTitle = (formData.get('vacancyTitle') as string)?.trim();
    const vacancyId    = (formData.get('vacancyId')    as string)?.trim();
    const rawLocale    = (formData.get('locale')       as string)?.trim();
    const honeypot     = (formData.get('website')      as string) ?? '';
    const loadedAt     = Number(formData.get('loadedAt')) || 0;
    const cvFile       = formData.get('cv') as File | null;

    if (isSpam(honeypot, loadedAt)) {
      return NextResponse.json({ success: true });
    }

    const locale: EmailLocale = VALID_LOCALES.includes(rawLocale as EmailLocale)
      ? (rawLocale as EmailLocale)
      : 'en';

    if (!firstName || !lastName || !email || !dateOfBirth || !vacancyTitle) {
      return NextResponse.json({ error: 'requiredFields' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'emailInvalid' }, { status: 400 });
    }

    const vacancyIdNum = parseInt(vacancyId ?? '', 10);
    if (!vacancyId || isNaN(vacancyIdNum) || vacancyIdNum <= 0) {
      return NextResponse.json({ error: 'vacancyInvalid' }, { status: 400 });
    }

    if (firstName.length > 100 || lastName.length > 100) {
      return NextResponse.json({ error: 'nameTooLong' }, { status: 400 });
    }
    if (email.length > 254) {
      return NextResponse.json({ error: 'emailTooLong' }, { status: 400 });
    }
    if (phone && phone.length > 30) {
      return NextResponse.json({ error: 'phoneTooLong' }, { status: 400 });
    }
    if (dateOfBirth.length > 20) {
      return NextResponse.json({ error: 'dobInvalid' }, { status: 400 });
    }
    if (cover && cover.length > 5000) {
      return NextResponse.json({ error: 'coverTooLong' }, { status: 400 });
    }
    if (!cvFile || cvFile.size === 0) {
      return NextResponse.json({ error: 'cvRequired' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(cvFile.type)) {
      return NextResponse.json({ error: 'cvTypeInvalid' }, { status: 400 });
    }
    if (cvFile.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'cvTooLarge' }, { status: 400 });
    }

    const cvBuffer = Buffer.from(await cvFile.arrayBuffer());

    // fileTypeFromBuffer inspects actual file content (magic bytes + ZIP internals for DOCX)
    // and returns the real MIME type — independent of the browser-supplied Content-Type.
    const detected = await fileTypeFromBuffer(cvBuffer);
    if (!detected || detected.mime !== cvFile.type) {
      return NextResponse.json({ error: 'cvContentMismatch' }, { status: 400 });
    }

    const cvAttachment = { filename: cvFile.name, content: cvBuffer };
    const vacancyUrl   = `${SITE}/vacancies/${vacancyIdNum}`;
    const fromNoreply  = `"No-Reply Rahatlyk" <${process.env.NOREPLY_EMAIL}>`;
    const fromWebsite  = `"Website" <${process.env.WEBSITE_EMAIL}>`;

    const rawContact   = await getCachedContactInfo().catch(() => null)
    const contact      = extractEmailContact(rawContact, locale)
    const confirmation = vacancyConfirmation({ firstName, lastName, vacancyTitle, vacancyUrl, locale, contact });
    const notification = vacancyNotification({ firstName, lastName, email, phone, dateOfBirth, vacancyTitle, vacancyUrl, cvFileName: cvFile.name, cover, locale: 'ru', contact });

    await Promise.all([
      // 1. Confirmation → applicant (in their language)
      transporter.sendMail({
        from:    fromNoreply,
        to:      email,
        subject: confirmation.subject,
        html:    confirmation.html,
      }),
      // 2. Notification + CV → sarwan (always Russian)
      transporter.sendMail({
        from:        fromWebsite,
        to:          process.env.GMAIL_USER,
        replyTo:     email,
        subject:     notification.subject,
        html:        notification.html,
        attachments: [cvAttachment],
      }),
    ]);

    // Store submission in Payload — non-blocking, failure does not affect the response
    try {
      const payload = await getPayloadClient();

      // Upload CV to the cv-documents collection with an unpredictable filename
      const ext = cvFile.name.split('.').pop() ?? 'pdf';
      const cvDoc = await payload.create({
        collection: 'cv-documents',
        data: { applicantName: `${sanitizeCsv(firstName)} ${sanitizeCsv(lastName)}` },
        file: {
          data:     cvBuffer,
          mimetype: cvFile.type,
          name:     `${randomUUID()}.${ext}`,
          size:     cvFile.size,
        },
      });

      // Create the application record linking to the vacancy and the uploaded CV
      await payload.create({
        collection: 'vacancy-applications',
        data: {
          firstName:   sanitizeCsv(firstName),
          lastName:    sanitizeCsv(lastName),
          email:       sanitizeCsv(email),
          phone:       phone ? sanitizeCsv(phone) : undefined,
          dateOfBirth: sanitizeCsv(dateOfBirth),
          cover:       cover ? sanitizeCsv(cover) : undefined,
          vacancy:     vacancyIdNum,
          cv:          cvDoc.id,
        },
      });
    } catch (dbErr) {
      console.error('[vacancy route] Failed to store application in Payload:', dbErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[vacancy route] Failed to send application:', err);
    return NextResponse.json({ error: 'serverError' }, { status: 500 });
  }
}
