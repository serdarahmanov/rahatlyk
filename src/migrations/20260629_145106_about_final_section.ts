import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "about_final_section" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE "about_final_section_locales" (
  	"heading" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );

  ALTER TABLE "about_final_section" ADD CONSTRAINT "about_final_section_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_final_section_locales" ADD CONSTRAINT "about_final_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_final_section"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "about_final_section_image_idx" ON "about_final_section" USING btree ("image_id");
  CREATE UNIQUE INDEX "about_final_section_locales_locale_parent_id_unique" ON "about_final_section_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "about_final_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_final_section_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "about_final_section" CASCADE;
  DROP TABLE "about_final_section_locales" CASCADE;`)
}
