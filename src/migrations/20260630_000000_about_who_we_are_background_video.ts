import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "about_who_we_are" ADD COLUMN IF NOT EXISTS "background_video_id" integer;
    ALTER TABLE "about_who_we_are" DROP CONSTRAINT IF EXISTS "about_who_we_are_background_video_id_media_id_fk";
    ALTER TABLE "about_who_we_are" ADD CONSTRAINT "about_who_we_are_background_video_id_media_id_fk" FOREIGN KEY ("background_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "about_who_we_are_background_video_idx" ON "about_who_we_are" USING btree ("background_video_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "about_who_we_are_background_video_idx";
    ALTER TABLE "about_who_we_are" DROP CONSTRAINT IF EXISTS "about_who_we_are_background_video_id_media_id_fk";
    ALTER TABLE "about_who_we_are" DROP COLUMN IF EXISTS "background_video_id";
  `)
}
