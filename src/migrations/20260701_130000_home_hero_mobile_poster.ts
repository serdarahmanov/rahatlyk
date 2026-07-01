import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_hero" ADD COLUMN IF NOT EXISTS "mobile_poster_id" integer;
    ALTER TABLE "home_hero" DROP CONSTRAINT IF EXISTS "home_hero_mobile_poster_id_media_id_fk";
    ALTER TABLE "home_hero" ADD CONSTRAINT "home_hero_mobile_poster_id_media_id_fk" FOREIGN KEY ("mobile_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "home_hero_mobile_poster_idx" ON "home_hero" USING btree ("mobile_poster_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "home_hero_mobile_poster_idx";
    ALTER TABLE "home_hero" DROP CONSTRAINT IF EXISTS "home_hero_mobile_poster_id_media_id_fk";
    ALTER TABLE "home_hero" DROP COLUMN IF EXISTS "mobile_poster_id";
  `)
}
