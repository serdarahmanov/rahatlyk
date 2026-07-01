import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "about_hero" ADD COLUMN IF NOT EXISTS "mobile_cover_image_id" integer;
    ALTER TABLE "about_hero" DROP CONSTRAINT IF EXISTS "about_hero_mobile_cover_image_id_media_id_fk";
    ALTER TABLE "about_hero" ADD CONSTRAINT "about_hero_mobile_cover_image_id_media_id_fk" FOREIGN KEY ("mobile_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "about_hero_mobile_cover_image_idx" ON "about_hero" USING btree ("mobile_cover_image_id");

    ALTER TABLE "about_final_section" ADD COLUMN IF NOT EXISTS "mobile_image_id" integer;
    ALTER TABLE "about_final_section" DROP CONSTRAINT IF EXISTS "about_final_section_mobile_image_id_media_id_fk";
    ALTER TABLE "about_final_section" ADD CONSTRAINT "about_final_section_mobile_image_id_media_id_fk" FOREIGN KEY ("mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "about_final_section_mobile_image_idx" ON "about_final_section" USING btree ("mobile_image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "about_final_section_mobile_image_idx";
    ALTER TABLE "about_final_section" DROP CONSTRAINT IF EXISTS "about_final_section_mobile_image_id_media_id_fk";
    ALTER TABLE "about_final_section" DROP COLUMN IF EXISTS "mobile_image_id";

    DROP INDEX IF EXISTS "about_hero_mobile_cover_image_idx";
    ALTER TABLE "about_hero" DROP CONSTRAINT IF EXISTS "about_hero_mobile_cover_image_id_media_id_fk";
    ALTER TABLE "about_hero" DROP COLUMN IF EXISTS "mobile_cover_image_id";
  `)
}
