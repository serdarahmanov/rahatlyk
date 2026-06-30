import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "about_our_story" ADD COLUMN IF NOT EXISTS "left_image_id" integer;
  ALTER TABLE "about_our_story" ADD COLUMN IF NOT EXISTS "right_image_id" integer;

  DO $$
  BEGIN
    IF to_regclass('public.about_mosaic') IS NOT NULL THEN
      UPDATE "about_our_story"
      SET
        "left_image_id" = COALESCE("about_our_story"."left_image_id", "about_mosaic"."left_image_id"),
        "right_image_id" = COALESCE("about_our_story"."right_image_id", "about_mosaic"."right_image_id")
      FROM "about_mosaic";
    END IF;
  END $$;

  ALTER TABLE "about_our_story" DROP CONSTRAINT IF EXISTS "about_our_story_left_image_id_media_id_fk";
  ALTER TABLE "about_our_story" ADD CONSTRAINT "about_our_story_left_image_id_media_id_fk" FOREIGN KEY ("left_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_our_story" DROP CONSTRAINT IF EXISTS "about_our_story_right_image_id_media_id_fk";
  ALTER TABLE "about_our_story" ADD CONSTRAINT "about_our_story_right_image_id_media_id_fk" FOREIGN KEY ("right_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX IF NOT EXISTS "about_our_story_left_image_idx" ON "about_our_story" USING btree ("left_image_id");
  CREATE INDEX IF NOT EXISTS "about_our_story_right_image_idx" ON "about_our_story" USING btree ("right_image_id");

  DROP TABLE IF EXISTS "about_mosaic" CASCADE;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "about_mosaic" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"left_image_id" integer,
  	"right_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  INSERT INTO "about_mosaic" ("left_image_id", "right_image_id", "updated_at", "created_at")
  SELECT "left_image_id", "right_image_id", now(), now()
  FROM "about_our_story"
  WHERE EXISTS (SELECT 1 FROM "about_our_story")
  ON CONFLICT DO NOTHING;

  ALTER TABLE "about_mosaic" DROP CONSTRAINT IF EXISTS "about_mosaic_left_image_id_media_id_fk";
  ALTER TABLE "about_mosaic" ADD CONSTRAINT "about_mosaic_left_image_id_media_id_fk" FOREIGN KEY ("left_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_mosaic" DROP CONSTRAINT IF EXISTS "about_mosaic_right_image_id_media_id_fk";
  ALTER TABLE "about_mosaic" ADD CONSTRAINT "about_mosaic_right_image_id_media_id_fk" FOREIGN KEY ("right_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX IF NOT EXISTS "about_mosaic_left_image_idx" ON "about_mosaic" USING btree ("left_image_id");
  CREATE INDEX IF NOT EXISTS "about_mosaic_right_image_idx" ON "about_mosaic" USING btree ("right_image_id");

  ALTER TABLE "about_our_story" DROP CONSTRAINT IF EXISTS "about_our_story_left_image_id_media_id_fk";
  ALTER TABLE "about_our_story" DROP CONSTRAINT IF EXISTS "about_our_story_right_image_id_media_id_fk";
  DROP INDEX IF EXISTS "about_our_story_left_image_idx";
  DROP INDEX IF EXISTS "about_our_story_right_image_idx";
  ALTER TABLE "about_our_story" DROP COLUMN IF EXISTS "left_image_id";
  ALTER TABLE "about_our_story" DROP COLUMN IF EXISTS "right_image_id";`)
}
