import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_page_locales" (
  	"hero_title" varchar,
  	"hero_description" varchar,
  	"contact_form_title" varchar,
  	"contact_form_description" varchar,
  	"contact_form_first_name_label" varchar,
  	"contact_form_last_name_label" varchar,
  	"contact_form_email_label" varchar,
  	"contact_form_phone_label" varchar,
  	"contact_form_subject_label" varchar,
  	"contact_form_message_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "vacancies" ADD COLUMN "image_id" integer;
  ALTER TABLE "about_page_locales" ADD CONSTRAINT "about_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "about_page_locales_locale_parent_id_unique" ON "about_page_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "vacancies" ADD CONSTRAINT "vacancies_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "vacancies_image_idx" ON "vacancies" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "about_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "about_page_locales" CASCADE;
  ALTER TABLE "vacancies" DROP CONSTRAINT "vacancies_image_id_media_id_fk";
  
  DROP INDEX "vacancies_image_idx";
  ALTER TABLE "vacancies" DROP COLUMN "image_id";`)
}
