import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_hero" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"video_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_hero_locales" (
  	"title" varchar,
  	"title_accent" varchar,
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "home_hero" ADD CONSTRAINT "home_hero_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_hero_locales" ADD CONSTRAINT "home_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_hero"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_hero_video_idx" ON "home_hero" USING btree ("video_id");
  CREATE UNIQUE INDEX "home_hero_locales_locale_parent_id_unique" ON "home_hero_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_hero" CASCADE;
  DROP TABLE "home_hero_locales" CASCADE;`)
}
