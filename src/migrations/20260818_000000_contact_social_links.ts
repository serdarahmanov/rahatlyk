import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "contact_info" ADD COLUMN IF NOT EXISTS "social_links_whatsapp_url" varchar;
    ALTER TABLE IF EXISTS "contact_info" ADD COLUMN IF NOT EXISTS "social_links_linkedin_url" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "contact_info" DROP COLUMN IF EXISTS "social_links_whatsapp_url";
    ALTER TABLE IF EXISTS "contact_info" DROP COLUMN IF EXISTS "social_links_linkedin_url";
  `)
}
