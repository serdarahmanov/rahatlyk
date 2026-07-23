import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "home_hero_locales" ADD COLUMN IF NOT EXISTS "cta_label" varchar;
    ALTER TABLE IF EXISTS "home_hero" ADD COLUMN IF NOT EXISTS "cta_href" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "home_hero_locales" DROP COLUMN IF EXISTS "cta_label";
    ALTER TABLE IF EXISTS "home_hero" DROP COLUMN IF EXISTS "cta_href";
  `)
}
