import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE IF EXISTS "product_detail_labels_locales" ADD COLUMN IF NOT EXISTS "related_heading" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE IF EXISTS "product_detail_labels_locales" DROP COLUMN IF EXISTS "related_heading";`)
}
