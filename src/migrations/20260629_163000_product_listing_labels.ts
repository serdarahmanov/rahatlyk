import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE IF EXISTS "product_detail_labels_locales" ADD COLUMN IF NOT EXISTS "listing_title" varchar;
  ALTER TABLE IF EXISTS "product_detail_labels_locales" ADD COLUMN IF NOT EXISTS "filter_all_label" varchar;
  ALTER TABLE IF EXISTS "product_detail_labels_locales" ADD COLUMN IF NOT EXISTS "no_products_message" varchar;
  ALTER TABLE IF EXISTS "product_detail_labels_locales" ADD COLUMN IF NOT EXISTS "pagination_item_label" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE IF EXISTS "product_detail_labels_locales" DROP COLUMN IF EXISTS "listing_title";
  ALTER TABLE IF EXISTS "product_detail_labels_locales" DROP COLUMN IF EXISTS "filter_all_label";
  ALTER TABLE IF EXISTS "product_detail_labels_locales" DROP COLUMN IF EXISTS "no_products_message";
  ALTER TABLE IF EXISTS "product_detail_labels_locales" DROP COLUMN IF EXISTS "pagination_item_label";`)
}
