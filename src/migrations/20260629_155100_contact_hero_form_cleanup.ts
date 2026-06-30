import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE IF EXISTS "about_page_locales" DROP COLUMN IF EXISTS "form_labels_first_name";
  ALTER TABLE IF EXISTS "about_page_locales" DROP COLUMN IF EXISTS "form_labels_last_name";
  ALTER TABLE IF EXISTS "about_page_locales" DROP COLUMN IF EXISTS "form_labels_email";
  ALTER TABLE IF EXISTS "about_page_locales" DROP COLUMN IF EXISTS "form_labels_phone";
  ALTER TABLE IF EXISTS "about_page_locales" DROP COLUMN IF EXISTS "form_labels_subject";
  ALTER TABLE IF EXISTS "about_page_locales" DROP COLUMN IF EXISTS "form_labels_message";
  ALTER TABLE IF EXISTS "about_page_locales" DROP COLUMN IF EXISTS "form_labels_submit_button";
  ALTER TABLE IF EXISTS "about_page_locales" DROP COLUMN IF EXISTS "form_messages_success";
  ALTER TABLE IF EXISTS "about_page_locales" DROP COLUMN IF EXISTS "form_messages_error";
  ALTER TABLE IF EXISTS "about_page_locales" DROP COLUMN IF EXISTS "form_messages_sending";
  ALTER TABLE IF EXISTS "about_page_locales" DROP COLUMN IF EXISTS "form_messages_thank_you";
  ALTER TABLE IF EXISTS "about_page_locales" DROP COLUMN IF EXISTS "form_messages_what_happens_next";
  ALTER TABLE IF EXISTS "about_page_locales" DROP COLUMN IF EXISTS "form_messages_step1";
  ALTER TABLE IF EXISTS "about_page_locales" DROP COLUMN IF EXISTS "form_messages_step2";
  ALTER TABLE IF EXISTS "about_page_locales" DROP COLUMN IF EXISTS "form_messages_step3";
  ALTER TABLE IF EXISTS "about_page_locales" DROP COLUMN IF EXISTS "form_messages_send_another";
  ALTER TABLE IF EXISTS "about_page_locales" DROP COLUMN IF EXISTS "form_placeholders_first_name";
  ALTER TABLE IF EXISTS "about_page_locales" DROP COLUMN IF EXISTS "form_placeholders_last_name";
  ALTER TABLE IF EXISTS "about_page_locales" DROP COLUMN IF EXISTS "form_placeholders_email";
  ALTER TABLE IF EXISTS "about_page_locales" DROP COLUMN IF EXISTS "form_placeholders_phone";
  ALTER TABLE IF EXISTS "about_page_locales" DROP COLUMN IF EXISTS "form_placeholders_subject";
  ALTER TABLE IF EXISTS "about_page_locales" DROP COLUMN IF EXISTS "form_placeholders_message";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE IF EXISTS "about_page_locales" ADD COLUMN IF NOT EXISTS "form_labels_first_name" varchar;
  ALTER TABLE IF EXISTS "about_page_locales" ADD COLUMN IF NOT EXISTS "form_labels_last_name" varchar;
  ALTER TABLE IF EXISTS "about_page_locales" ADD COLUMN IF NOT EXISTS "form_labels_email" varchar;
  ALTER TABLE IF EXISTS "about_page_locales" ADD COLUMN IF NOT EXISTS "form_labels_phone" varchar;
  ALTER TABLE IF EXISTS "about_page_locales" ADD COLUMN IF NOT EXISTS "form_labels_subject" varchar;
  ALTER TABLE IF EXISTS "about_page_locales" ADD COLUMN IF NOT EXISTS "form_labels_message" varchar;
  ALTER TABLE IF EXISTS "about_page_locales" ADD COLUMN IF NOT EXISTS "form_labels_submit_button" varchar;
  ALTER TABLE IF EXISTS "about_page_locales" ADD COLUMN IF NOT EXISTS "form_messages_success" varchar;
  ALTER TABLE IF EXISTS "about_page_locales" ADD COLUMN IF NOT EXISTS "form_messages_error" varchar;
  ALTER TABLE IF EXISTS "about_page_locales" ADD COLUMN IF NOT EXISTS "form_messages_sending" varchar;
  ALTER TABLE IF EXISTS "about_page_locales" ADD COLUMN IF NOT EXISTS "form_messages_thank_you" varchar;
  ALTER TABLE IF EXISTS "about_page_locales" ADD COLUMN IF NOT EXISTS "form_messages_what_happens_next" varchar;
  ALTER TABLE IF EXISTS "about_page_locales" ADD COLUMN IF NOT EXISTS "form_messages_step1" varchar;
  ALTER TABLE IF EXISTS "about_page_locales" ADD COLUMN IF NOT EXISTS "form_messages_step2" varchar;
  ALTER TABLE IF EXISTS "about_page_locales" ADD COLUMN IF NOT EXISTS "form_messages_step3" varchar;
  ALTER TABLE IF EXISTS "about_page_locales" ADD COLUMN IF NOT EXISTS "form_messages_send_another" varchar;
  ALTER TABLE IF EXISTS "about_page_locales" ADD COLUMN IF NOT EXISTS "form_placeholders_first_name" varchar;
  ALTER TABLE IF EXISTS "about_page_locales" ADD COLUMN IF NOT EXISTS "form_placeholders_last_name" varchar;
  ALTER TABLE IF EXISTS "about_page_locales" ADD COLUMN IF NOT EXISTS "form_placeholders_email" varchar;
  ALTER TABLE IF EXISTS "about_page_locales" ADD COLUMN IF NOT EXISTS "form_placeholders_phone" varchar;
  ALTER TABLE IF EXISTS "about_page_locales" ADD COLUMN IF NOT EXISTS "form_placeholders_subject" varchar;
  ALTER TABLE IF EXISTS "about_page_locales" ADD COLUMN IF NOT EXISTS "form_placeholders_message" varchar;`)
}
