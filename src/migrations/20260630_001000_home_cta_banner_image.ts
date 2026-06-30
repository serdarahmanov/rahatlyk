import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_cta_banner" ADD COLUMN IF NOT EXISTS "image_id" integer;
    ALTER TABLE "home_cta_banner" DROP CONSTRAINT IF EXISTS "home_cta_banner_image_id_media_id_fk";
    ALTER TABLE "home_cta_banner" ADD CONSTRAINT "home_cta_banner_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "home_cta_banner_image_idx" ON "home_cta_banner" USING btree ("image_id");

    DROP INDEX IF EXISTS "home_cta_banner_video_idx";
    ALTER TABLE "home_cta_banner" DROP CONSTRAINT IF EXISTS "home_cta_banner_video_id_media_id_fk";
    ALTER TABLE "home_cta_banner" DROP COLUMN IF EXISTS "video_id";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_cta_banner" ADD COLUMN IF NOT EXISTS "video_id" integer;
    ALTER TABLE "home_cta_banner" DROP CONSTRAINT IF EXISTS "home_cta_banner_video_id_media_id_fk";
    ALTER TABLE "home_cta_banner" ADD CONSTRAINT "home_cta_banner_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "home_cta_banner_video_idx" ON "home_cta_banner" USING btree ("video_id");

    DROP INDEX IF EXISTS "home_cta_banner_image_idx";
    ALTER TABLE "home_cta_banner" DROP CONSTRAINT IF EXISTS "home_cta_banner_image_id_media_id_fk";
    ALTER TABLE "home_cta_banner" DROP COLUMN IF EXISTS "image_id";
  `)
}
