import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { vacancyConfirmation, vacancyNotification } from '@/lib/email/templates';
import type { EmailLocale } from '@/lib/email/i18n';
import { getPayloadClient } from '@/lib/payload';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
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
    const cvFile       = formData.get('cv') as File | null;

    const locale: EmailLocale = VALID_LOCALES.includes(rawLocale as EmailLocale)
      ? (rawLocale as EmailLocale)
      : 'en';

    if (!firstName || !lastName || !email || !dateOfBirth || !vacancyTitle) {
      return NextResponse.json({ error: 'Name, email, date of birth and vacancy are required.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }
    if (!cvFile || cvFile.size === 0) {
      return NextResponse.json({ error: 'CV file is required.' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(cvFile.type)) {
      return NextResponse.json({ error: 'CV must be a PDF, DOC or DOCX file.' }, { status: 400 });
    }
    if (cvFile.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'CV file must be under 5 MB.' }, { status: 400 });
    }

    const cvBuffer     = Buffer.from(await cvFile.arrayBuffer());
    const cvAttachment = { filename: cvFile.name, content: cvBuffer };
    const vacancyUrl   = `${process.env.NEXT_PUBLIC_SITE_URL}/vacancies/${vacancyId}`;
    const fromNoreply  = `"No-Reply Rahatlyk" <${process.env.NOREPLY_EMAIL}>`;
    const fromWebsite  = `"Website" <${process.env.WEBSITE_EMAIL}>`;

    const confirmation = vacancyConfirmation({ firstName, lastName, vacancyTitle, vacancyUrl, locale });
    const notification = vacancyNotification({ firstName, lastName, email, phone, dateOfBirth, vacancyTitle, vacancyUrl, cvFileName: cvFile.name, cover, locale: 'ru' });

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
        data: { applicantName: `${firstName} ${lastName}` },
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
          firstName,
          lastName,
          email,
          phone:       phone || undefined,
          dateOfBirth,
          cover:       cover || undefined,
          vacancy:     Number(vacancyId),
          cv:          cvDoc.id,
        },
      });
    } catch (dbErr) {
      console.error('[vacancy route] Failed to store application in Payload:', dbErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[vacancy route] Failed to send application:', err);
    return NextResponse.json({ error: 'Failed to submit application. Please try again later.' }, { status: 500 });
  }
}
