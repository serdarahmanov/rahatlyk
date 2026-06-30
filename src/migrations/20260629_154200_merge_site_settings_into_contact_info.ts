import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_info" ADD COLUMN IF NOT EXISTS "social_links_instagram_url" varchar;
  ALTER TABLE "contact_info" ADD COLUMN IF NOT EXISTS "social_links_youtube_url" varchar;
  ALTER TABLE "contact_info" ADD COLUMN IF NOT EXISTS "social_links_facebook_url" varchar;

  DO $$
  BEGIN
    IF to_regclass('public.site_settings') IS NOT NULL THEN
      UPDATE "contact_info"
      SET
        "social_links_instagram_url" = COALESCE("contact_info"."social_links_instagram_url", "site_settings"."instagram_url"),
        "social_links_youtube_url" = COALESCE("contact_info"."social_links_youtube_url", "site_settings"."youtube_url"),
        "social_links_facebook_url" = COALESCE("contact_info"."social_links_facebook_url", "site_settings"."facebook_url")
      FROM "site_settings";
    END IF;
  END $$;

  DROP TABLE IF EXISTS "site_settings" CASCADE;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"instagram_url" varchar,
  	"youtube_url" varchar,
  	"facebook_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  INSERT INTO "site_settings" ("instagram_url", "youtube_url", "facebook_url", "updated_at", "created_at")
  SELECT "social_links_instagram_url", "social_links_youtube_url", "social_links_facebook_url", now(), now()
  FROM "contact_info"
  WHERE EXISTS (SELECT 1 FROM "contact_info")
  ON CONFLICT DO NOTHING;

  ALTER TABLE "contact_info" DROP COLUMN IF EXISTS "social_links_instagram_url";
  ALTER TABLE "contact_info" DROP COLUMN IF EXISTS "social_links_youtube_url";
  ALTER TABLE "contact_info" DROP COLUMN IF EXISTS "social_links_facebook_url";`)
}
