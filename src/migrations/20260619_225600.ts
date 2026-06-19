import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_hero" ADD COLUMN "poster_id" integer;
    CREATE INDEX "home_hero_poster_idx" ON "home_hero" USING btree ("poster_id");
    ALTER TABLE "home_hero"
      ADD CONSTRAINT "home_hero_poster_id_media_id_fk"
      FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_hero" DROP CONSTRAINT "home_hero_poster_id_media_id_fk";
    DROP INDEX "home_hero_poster_idx";
    ALTER TABLE "home_hero" DROP COLUMN "poster_id";
  `)
}
