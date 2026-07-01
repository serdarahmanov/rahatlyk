import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_cta_banner" ADD COLUMN IF NOT EXISTS "mobile_image_id" integer;
    ALTER TABLE "home_cta_banner" DROP CONSTRAINT IF EXISTS "home_cta_banner_mobile_image_id_media_id_fk";
    ALTER TABLE "home_cta_banner" ADD CONSTRAINT "home_cta_banner_mobile_image_id_media_id_fk" FOREIGN KEY ("mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "home_cta_banner_mobile_image_idx" ON "home_cta_banner" USING btree ("mobile_image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "home_cta_banner_mobile_image_idx";
    ALTER TABLE "home_cta_banner" DROP CONSTRAINT IF EXISTS "home_cta_banner_mobile_image_id_media_id_fk";
    ALTER TABLE "home_cta_banner" DROP COLUMN IF EXISTS "mobile_image_id";
  `)
}
