import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { contactConfirmation, contactNotification } from '@/lib/email/templates';
import type { EmailLocale } from '@/lib/email/i18n';

const VALID_LOCALES: EmailLocale[] = ['en', 'ru', 'tm'];

interface ContactPayload {
  firstName: string;
  lastName:  string;
  email:     string;
  phone?:    string;
  subject:   string;
  message:   string;
  locale?:   string;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  tls: { rejectUnauthorized: false },
});

export async function POST(req: NextRequest) {
  try {
    const body: ContactPayload = await req.json();
    const { firstName, lastName, email, phone, subject, message } = body;
    const locale: EmailLocale = VALID_LOCALES.includes(body.locale as EmailLocale)
      ? (body.locale as EmailLocale)
      : 'en';

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Name, email, subject and message are required.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const confirmation    = contactConfirmation({ firstName, lastName, email, subject, message, locale });
    const notification    = contactNotification({ firstName, lastName, email, phone, subject, message, locale: 'ru' });
    const fromNoreply     = `"No-Reply Rahatlyk" <${process.env.NOREPLY_EMAIL}>`;
    const fromWebsite     = `"Website" <${process.env.WEBSITE_EMAIL}>`;

    await Promise.all([
      // 1. Confirmation → user (in their language)
      transporter.sendMail({
        from:    fromNoreply,
        to:      email,
        subject: confirmation.subject,
        html:    confirmation.html,
      }),
      // 2. Notification → sarwan (always Russian)
      transporter.sendMail({
        from:    fromWebsite,
        to:      process.env.GMAIL_USER,
        replyTo: email,
        subject: notification.subject,
        html:    notification.html,
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact route] Failed to send email:', err);
    return NextResponse.json({ error: 'Failed to send message. Please try again later.' }, { status: 500 });
  }
}
