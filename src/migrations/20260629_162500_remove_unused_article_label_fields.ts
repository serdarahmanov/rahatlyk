import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE IF EXISTS "article_labels_locales" DROP COLUMN IF EXISTS "home_section_title";
  ALTER TABLE IF EXISTS "article_labels_locales" DROP COLUMN IF EXISTS "home_cta_label";
  ALTER TABLE IF EXISTS "article_labels_locales" DROP COLUMN IF EXISTS "page_subtitle";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE IF EXISTS "article_labels_locales" ADD COLUMN IF NOT EXISTS "home_section_title" varchar;
  ALTER TABLE IF EXISTS "article_labels_locales" ADD COLUMN IF NOT EXISTS "home_cta_label" varchar;
  ALTER TABLE IF EXISTS "article_labels_locales" ADD COLUMN IF NOT EXISTS "page_subtitle" varchar;`)
}
