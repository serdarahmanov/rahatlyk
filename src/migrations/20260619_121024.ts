import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "about_hero" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cover_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_hero_locales" (
  	"title" varchar,
  	"accent_word_index" numeric DEFAULT 0,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "about_who_we_are" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_viewport_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_who_we_are_locales" (
  	"statement_text" varchar,
  	"statement_accent_word_index" numeric DEFAULT 0,
  	"who_we_are_section_title" varchar,
  	"who_we_are_paragraph1" varchar,
  	"who_we_are_paragraph2" varchar,
  	"who_we_are_paragraph3" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "about_our_story_milestones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"is_current" boolean DEFAULT false
  );
  
  CREATE TABLE "about_our_story_milestones_locales" (
  	"title" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_our_story" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_our_story_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "about_numbers_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"suffix" varchar
  );
  
  CREATE TABLE "about_numbers_stats_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_numbers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_numbers_locales" (
  	"tagline_text" varchar,
  	"tagline_accent_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "about_certificates_certificates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"expiry_date" varchar,
  	"photo_id" integer
  );
  
  CREATE TABLE "about_certificates_certificates_locales" (
  	"tag" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_certificates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"seal_text" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_certificates_locales" (
  	"intro_heading_text" varchar,
  	"intro_heading_accent" varchar,
  	"intro_subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "about_page_locales" ADD COLUMN "form_labels_first_name" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "form_labels_last_name" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "form_labels_email" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "form_labels_phone" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "form_labels_subject" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "form_labels_message" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "form_labels_submit_button" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "form_messages_success" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "form_messages_error" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "form_messages_sending" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "form_messages_thank_you" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "form_messages_what_happens_next" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "form_messages_step1" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "form_messages_step2" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "form_messages_step3" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "form_messages_send_another" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "form_placeholders_first_name" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "form_placeholders_last_name" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "form_placeholders_email" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "form_placeholders_phone" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "form_placeholders_subject" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "form_placeholders_message" varchar;
  ALTER TABLE "contact_info_locales" ADD COLUMN "section_label" varchar;
  ALTER TABLE "about_hero" ADD CONSTRAINT "about_hero_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_hero_locales" ADD CONSTRAINT "about_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_who_we_are" ADD CONSTRAINT "about_who_we_are_full_viewport_image_id_media_id_fk" FOREIGN KEY ("full_viewport_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_who_we_are_locales" ADD CONSTRAINT "about_who_we_are_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_who_we_are"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_our_story_milestones" ADD CONSTRAINT "about_our_story_milestones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_our_story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_our_story_milestones_locales" ADD CONSTRAINT "about_our_story_milestones_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_our_story_milestones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_our_story_locales" ADD CONSTRAINT "about_our_story_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_our_story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_numbers_stats" ADD CONSTRAINT "about_numbers_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_numbers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_numbers_stats_locales" ADD CONSTRAINT "about_numbers_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_numbers_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_numbers_locales" ADD CONSTRAINT "about_numbers_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_numbers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_certificates_certificates" ADD CONSTRAINT "about_certificates_certificates_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_certificates_certificates" ADD CONSTRAINT "about_certificates_certificates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_certificates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_certificates_certificates_locales" ADD CONSTRAINT "about_certificates_certificates_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_certificates_certificates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_certificates_locales" ADD CONSTRAINT "about_certificates_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_certificates"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "about_hero_cover_image_idx" ON "about_hero" USING btree ("cover_image_id");
  CREATE UNIQUE INDEX "about_hero_locales_locale_parent_id_unique" ON "about_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_who_we_are_full_viewport_image_idx" ON "about_who_we_are" USING btree ("full_viewport_image_id");
  CREATE UNIQUE INDEX "about_who_we_are_locales_locale_parent_id_unique" ON "about_who_we_are_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_our_story_milestones_order_idx" ON "about_our_story_milestones" USING btree ("_order");
  CREATE INDEX "about_our_story_milestones_parent_id_idx" ON "about_our_story_milestones" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_our_story_milestones_locales_locale_parent_id_unique" ON "about_our_story_milestones_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_our_story_locales_locale_parent_id_unique" ON "about_our_story_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_numbers_stats_order_idx" ON "about_numbers_stats" USING btree ("_order");
  CREATE INDEX "about_numbers_stats_parent_id_idx" ON "about_numbers_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_numbers_stats_locales_locale_parent_id_unique" ON "about_numbers_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_numbers_locales_locale_parent_id_unique" ON "about_numbers_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_certificates_certificates_order_idx" ON "about_certificates_certificates" USING btree ("_order");
  CREATE INDEX "about_certificates_certificates_parent_id_idx" ON "about_certificates_certificates" USING btree ("_parent_id");
  CREATE INDEX "about_certificates_certificates_photo_idx" ON "about_certificates_certificates" USING btree ("photo_id");
  CREATE UNIQUE INDEX "about_certificates_certificates_locales_locale_parent_id_uni" ON "about_certificates_certificates_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_certificates_locales_locale_parent_id_unique" ON "about_certificates_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "about_page_locales" DROP COLUMN "contact_form_title";
  ALTER TABLE "about_page_locales" DROP COLUMN "contact_form_description";
  ALTER TABLE "about_page_locales" DROP COLUMN "contact_form_first_name_label";
  ALTER TABLE "about_page_locales" DROP COLUMN "contact_form_last_name_label";
  ALTER TABLE "about_page_locales" DROP COLUMN "contact_form_email_label";
  ALTER TABLE "about_page_locales" DROP COLUMN "contact_form_phone_label";
  ALTER TABLE "about_page_locales" DROP COLUMN "contact_form_subject_label";
  ALTER TABLE "about_page_locales" DROP COLUMN "contact_form_message_label";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "about_hero" CASCADE;
  DROP TABLE "about_hero_locales" CASCADE;
  DROP TABLE "about_who_we_are" CASCADE;
  DROP TABLE "about_who_we_are_locales" CASCADE;
  DROP TABLE "about_our_story_milestones" CASCADE;
  DROP TABLE "about_our_story_milestones_locales" CASCADE;
  DROP TABLE "about_our_story" CASCADE;
  DROP TABLE "about_our_story_locales" CASCADE;
  DROP TABLE "about_numbers_stats" CASCADE;
  DROP TABLE "about_numbers_stats_locales" CASCADE;
  DROP TABLE "about_numbers" CASCADE;
  DROP TABLE "about_numbers_locales" CASCADE;
  DROP TABLE "about_certificates_certificates" CASCADE;
  DROP TABLE "about_certificates_certificates_locales" CASCADE;
  DROP TABLE "about_certificates" CASCADE;
  DROP TABLE "about_certificates_locales" CASCADE;
  ALTER TABLE "about_page_locales" ADD COLUMN "contact_form_title" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "contact_form_description" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "contact_form_first_name_label" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "contact_form_last_name_label" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "contact_form_email_label" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "contact_form_phone_label" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "contact_form_subject_label" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "contact_form_message_label" varchar;
  ALTER TABLE "about_page_locales" DROP COLUMN "form_labels_first_name";
  ALTER TABLE "about_page_locales" DROP COLUMN "form_labels_last_name";
  ALTER TABLE "about_page_locales" DROP COLUMN "form_labels_email";
  ALTER TABLE "about_page_locales" DROP COLUMN "form_labels_phone";
  ALTER TABLE "about_page_locales" DROP COLUMN "form_labels_subject";
  ALTER TABLE "about_page_locales" DROP COLUMN "form_labels_message";
  ALTER TABLE "about_page_locales" DROP COLUMN "form_labels_submit_button";
  ALTER TABLE "about_page_locales" DROP COLUMN "form_messages_success";
  ALTER TABLE "about_page_locales" DROP COLUMN "form_messages_error";
  ALTER TABLE "about_page_locales" DROP COLUMN "form_messages_sending";
  ALTER TABLE "about_page_locales" DROP COLUMN "form_messages_thank_you";
  ALTER TABLE "about_page_locales" DROP COLUMN "form_messages_what_happens_next";
  ALTER TABLE "about_page_locales" DROP COLUMN "form_messages_step1";
  ALTER TABLE "about_page_locales" DROP COLUMN "form_messages_step2";
  ALTER TABLE "about_page_locales" DROP COLUMN "form_messages_step3";
  ALTER TABLE "about_page_locales" DROP COLUMN "form_messages_send_another";
  ALTER TABLE "about_page_locales" DROP COLUMN "form_placeholders_first_name";
  ALTER TABLE "about_page_locales" DROP COLUMN "form_placeholders_last_name";
  ALTER TABLE "about_page_locales" DROP COLUMN "form_placeholders_email";
  ALTER TABLE "about_page_locales" DROP COLUMN "form_placeholders_phone";
  ALTER TABLE "about_page_locales" DROP COLUMN "form_placeholders_subject";
  ALTER TABLE "about_page_locales" DROP COLUMN "form_placeholders_message";
  ALTER TABLE "contact_info_locales" DROP COLUMN "section_label";`)
}
