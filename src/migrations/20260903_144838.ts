import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_metadata_website_json_ld_alternate_names" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "email_templates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "email_templates_locales" (
  	"contact_email_confirmation_subject" varchar,
  	"contact_email_confirmation_preheader" varchar,
  	"contact_email_confirmation_title" varchar,
  	"contact_email_confirmation_subtitle" varchar,
  	"contact_email_confirmation_greeting" varchar,
  	"contact_email_confirmation_intro" varchar,
  	"contact_email_confirmation_summary_heading" varchar,
  	"contact_email_confirmation_subject_label" varchar,
  	"contact_email_confirmation_message_label" varchar,
  	"contact_email_confirmation_what_next_heading" varchar,
  	"contact_email_confirmation_step1" varchar,
  	"contact_email_confirmation_step2" varchar,
  	"contact_email_confirmation_step3" varchar,
  	"contact_email_confirmation_cta_btn" varchar,
  	"contact_email_notification_subject" varchar,
  	"contact_email_notification_title" varchar,
  	"contact_email_notification_subtitle" varchar,
  	"contact_email_notification_first_name_label" varchar,
  	"contact_email_notification_last_name_label" varchar,
  	"contact_email_notification_email_label" varchar,
  	"contact_email_notification_phone_label" varchar,
  	"contact_email_notification_subject_label" varchar,
  	"contact_email_notification_message_heading" varchar,
  	"contact_email_notification_reply_btn" varchar,
  	"vacancy_email_confirmation_subject" varchar,
  	"vacancy_email_confirmation_preheader" varchar,
  	"vacancy_email_confirmation_title" varchar,
  	"vacancy_email_confirmation_subtitle" varchar,
  	"vacancy_email_confirmation_greeting" varchar,
  	"vacancy_email_confirmation_intro" varchar,
  	"vacancy_email_confirmation_applied_position_heading" varchar,
  	"vacancy_email_confirmation_position_label" varchar,
  	"vacancy_email_confirmation_company_label" varchar,
  	"vacancy_email_confirmation_location_label" varchar,
  	"vacancy_email_confirmation_company_value" varchar,
  	"vacancy_email_confirmation_location_value" varchar,
  	"vacancy_email_confirmation_what_next_heading" varchar,
  	"vacancy_email_confirmation_step1" varchar,
  	"vacancy_email_confirmation_step2" varchar,
  	"vacancy_email_confirmation_step3" varchar,
  	"vacancy_email_confirmation_cta_btn" varchar,
  	"vacancy_email_notification_subject" varchar,
  	"vacancy_email_notification_title" varchar,
  	"vacancy_email_notification_subtitle" varchar,
  	"vacancy_email_notification_first_name_label" varchar,
  	"vacancy_email_notification_last_name_label" varchar,
  	"vacancy_email_notification_dob_label" varchar,
  	"vacancy_email_notification_email_label" varchar,
  	"vacancy_email_notification_phone_label" varchar,
  	"vacancy_email_notification_position_label" varchar,
  	"vacancy_email_notification_cv_label" varchar,
  	"vacancy_email_notification_cv_note" varchar,
  	"vacancy_email_notification_cover_heading" varchar,
  	"vacancy_email_notification_reply_btn" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "navigation_labels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_labels_locales" (
  	"home" varchar,
  	"products" varchar,
  	"about" varchar,
  	"news" varchar,
  	"vacancies" varchar,
  	"contact" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_locales" (
  	"tagline" varchar,
  	"quick_links_label" varchar,
  	"company_label" varchar,
  	"rights" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "not_found_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "not_found_page_locales" (
  	"title" varchar,
  	"message" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "error_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "error_page_locales" (
  	"label" varchar,
  	"title" varchar,
  	"message" varchar,
  	"retry_label" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "home_hero_parallax_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_name" varchar NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "our_collection_locales" (
  	"section_tag" varchar,
  	"explore_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "home_brand_statement" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_brand_statement_locales" (
  	"heading" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "about_certificates_certificates" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_certificates_certificates_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_certificates" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_certificates_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "about_certificates_certificates" CASCADE;
  DROP TABLE "about_certificates_certificates_locales" CASCADE;
  DROP TABLE "about_certificates" CASCADE;
  DROP TABLE "about_certificates_locales" CASCADE;
  ALTER TABLE "home_hero" DROP CONSTRAINT "home_hero_video_id_media_id_fk";
  
  DROP INDEX "home_hero_video_idx";
  ALTER TABLE "products" ADD COLUMN "brand_name" varchar;
  ALTER TABLE "products_locales" ADD COLUMN "slug" varchar NOT NULL;
  ALTER TABLE "articles_locales" ADD COLUMN "slug" varchar NOT NULL;
  ALTER TABLE "site_metadata" ADD COLUMN "organization_json_ld_legal_name" varchar;
  ALTER TABLE "site_metadata" ADD COLUMN "organization_json_ld_description" varchar;
  ALTER TABLE "site_metadata" ADD COLUMN "organization_json_ld_street_address" varchar;
  ALTER TABLE "site_metadata" ADD COLUMN "organization_json_ld_address_locality" varchar;
  ALTER TABLE "site_metadata" ADD COLUMN "organization_json_ld_address_country" varchar;
  ALTER TABLE "site_metadata_locales" ADD COLUMN "website_json_ld_description" varchar;
  ALTER TABLE "contact_info" ADD COLUMN "social_links_whatsapp_url" varchar;
  ALTER TABLE "contact_info" ADD COLUMN "social_links_linkedin_url" varchar;
  ALTER TABLE "about_hero" ADD COLUMN "hero_video_id" integer;
  ALTER TABLE "about_hero" ADD COLUMN "mobile_hero_video_id" integer;
  ALTER TABLE "about_our_story" ADD COLUMN "center_image_id" integer;
  ALTER TABLE "home_hero" ADD COLUMN "bottle_image_id" integer;
  ALTER TABLE "home_hero" ADD COLUMN "mobile_bottle_image_id" integer;
  ALTER TABLE "home_hero" ADD COLUMN "cta_href" varchar;
  ALTER TABLE "home_hero_locales" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "horizontal_scroll" ADD COLUMN "box4_image_id" integer;
  ALTER TABLE "article_labels_locales" ADD COLUMN "pagination_item_label" varchar;
  ALTER TABLE "article_labels_locales" ADD COLUMN "pagination_summary" varchar;
  ALTER TABLE "product_detail_labels_locales" ADD COLUMN "pagination_summary" varchar;
  ALTER TABLE "vacancy_labels_locales" ADD COLUMN "pagination_summary" varchar;
  ALTER TABLE "site_metadata_website_json_ld_alternate_names" ADD CONSTRAINT "site_metadata_website_json_ld_alternate_names_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_metadata"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "email_templates_locales" ADD CONSTRAINT "email_templates_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."email_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_labels_locales" ADD CONSTRAINT "navigation_labels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_labels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "not_found_page_locales" ADD CONSTRAINT "not_found_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."not_found_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "error_page_locales" ADD CONSTRAINT "error_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."error_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_hero_parallax_images" ADD CONSTRAINT "home_hero_parallax_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_hero_parallax_images" ADD CONSTRAINT "home_hero_parallax_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "our_collection_locales" ADD CONSTRAINT "our_collection_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."our_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_brand_statement_locales" ADD CONSTRAINT "home_brand_statement_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_brand_statement"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_metadata_website_json_ld_alternate_names_order_idx" ON "site_metadata_website_json_ld_alternate_names" USING btree ("_order");
  CREATE INDEX "site_metadata_website_json_ld_alternate_names_parent_id_idx" ON "site_metadata_website_json_ld_alternate_names" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "email_templates_locales_locale_parent_id_unique" ON "email_templates_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "navigation_labels_locales_locale_parent_id_unique" ON "navigation_labels_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "not_found_page_locales_locale_parent_id_unique" ON "not_found_page_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "error_page_locales_locale_parent_id_unique" ON "error_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_hero_parallax_images_order_idx" ON "home_hero_parallax_images" USING btree ("_order");
  CREATE INDEX "home_hero_parallax_images_parent_id_idx" ON "home_hero_parallax_images" USING btree ("_parent_id");
  CREATE INDEX "home_hero_parallax_images_image_idx" ON "home_hero_parallax_images" USING btree ("image_id");
  CREATE UNIQUE INDEX "our_collection_locales_locale_parent_id_unique" ON "our_collection_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_brand_statement_locales_locale_parent_id_unique" ON "home_brand_statement_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "about_hero" ADD CONSTRAINT "about_hero_hero_video_id_media_id_fk" FOREIGN KEY ("hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_hero" ADD CONSTRAINT "about_hero_mobile_hero_video_id_media_id_fk" FOREIGN KEY ("mobile_hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_our_story" ADD CONSTRAINT "about_our_story_center_image_id_media_id_fk" FOREIGN KEY ("center_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_hero" ADD CONSTRAINT "home_hero_bottle_image_id_media_id_fk" FOREIGN KEY ("bottle_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_hero" ADD CONSTRAINT "home_hero_mobile_bottle_image_id_media_id_fk" FOREIGN KEY ("mobile_bottle_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "horizontal_scroll" ADD CONSTRAINT "horizontal_scroll_box4_image_id_media_id_fk" FOREIGN KEY ("box4_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "products_slug_idx" ON "products_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles_locales" USING btree ("slug","_locale");
  CREATE INDEX "about_hero_hero_video_idx" ON "about_hero" USING btree ("hero_video_id");
  CREATE INDEX "about_hero_mobile_hero_video_idx" ON "about_hero" USING btree ("mobile_hero_video_id");
  CREATE INDEX "about_our_story_center_image_idx" ON "about_our_story" USING btree ("center_image_id");
  CREATE INDEX "home_hero_bottle_image_idx" ON "home_hero" USING btree ("bottle_image_id");
  CREATE INDEX "home_hero_mobile_bottle_image_idx" ON "home_hero" USING btree ("mobile_bottle_image_id");
  CREATE INDEX "horizontal_scroll_box4_box4_image_idx" ON "horizontal_scroll" USING btree ("box4_image_id");
  ALTER TABLE "home_hero" DROP COLUMN "video_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
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
  
  ALTER TABLE "site_metadata_website_json_ld_alternate_names" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "email_templates" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "email_templates_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_labels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_labels_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "not_found_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "not_found_page_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "error_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "error_page_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_hero_parallax_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "our_collection_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_brand_statement" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_brand_statement_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_metadata_website_json_ld_alternate_names" CASCADE;
  DROP TABLE "email_templates" CASCADE;
  DROP TABLE "email_templates_locales" CASCADE;
  DROP TABLE "navigation_labels" CASCADE;
  DROP TABLE "navigation_labels_locales" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  DROP TABLE "not_found_page" CASCADE;
  DROP TABLE "not_found_page_locales" CASCADE;
  DROP TABLE "error_page" CASCADE;
  DROP TABLE "error_page_locales" CASCADE;
  DROP TABLE "home_hero_parallax_images" CASCADE;
  DROP TABLE "our_collection_locales" CASCADE;
  DROP TABLE "home_brand_statement" CASCADE;
  DROP TABLE "home_brand_statement_locales" CASCADE;
  ALTER TABLE "about_hero" DROP CONSTRAINT "about_hero_hero_video_id_media_id_fk";
  
  ALTER TABLE "about_hero" DROP CONSTRAINT "about_hero_mobile_hero_video_id_media_id_fk";
  
  ALTER TABLE "about_our_story" DROP CONSTRAINT "about_our_story_center_image_id_media_id_fk";
  
  ALTER TABLE "home_hero" DROP CONSTRAINT "home_hero_bottle_image_id_media_id_fk";
  
  ALTER TABLE "home_hero" DROP CONSTRAINT "home_hero_mobile_bottle_image_id_media_id_fk";
  
  ALTER TABLE "horizontal_scroll" DROP CONSTRAINT "horizontal_scroll_box4_image_id_media_id_fk";
  
  DROP INDEX "products_slug_idx";
  DROP INDEX "articles_slug_idx";
  DROP INDEX "about_hero_hero_video_idx";
  DROP INDEX "about_hero_mobile_hero_video_idx";
  DROP INDEX "about_our_story_center_image_idx";
  DROP INDEX "home_hero_bottle_image_idx";
  DROP INDEX "home_hero_mobile_bottle_image_idx";
  DROP INDEX "horizontal_scroll_box4_box4_image_idx";
  ALTER TABLE "home_hero" ADD COLUMN "video_id" integer;
  ALTER TABLE "about_certificates_certificates" ADD CONSTRAINT "about_certificates_certificates_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_certificates_certificates" ADD CONSTRAINT "about_certificates_certificates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_certificates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_certificates_certificates_locales" ADD CONSTRAINT "about_certificates_certificates_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_certificates_certificates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_certificates_locales" ADD CONSTRAINT "about_certificates_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_certificates"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "about_certificates_certificates_order_idx" ON "about_certificates_certificates" USING btree ("_order");
  CREATE INDEX "about_certificates_certificates_parent_id_idx" ON "about_certificates_certificates" USING btree ("_parent_id");
  CREATE INDEX "about_certificates_certificates_photo_idx" ON "about_certificates_certificates" USING btree ("photo_id");
  CREATE UNIQUE INDEX "about_certificates_certificates_locales_locale_parent_id_uni" ON "about_certificates_certificates_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_certificates_locales_locale_parent_id_unique" ON "about_certificates_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "home_hero" ADD CONSTRAINT "home_hero_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_hero_video_idx" ON "home_hero" USING btree ("video_id");
  ALTER TABLE "products" DROP COLUMN "brand_name";
  ALTER TABLE "products_locales" DROP COLUMN "slug";
  ALTER TABLE "articles_locales" DROP COLUMN "slug";
  ALTER TABLE "site_metadata" DROP COLUMN "organization_json_ld_legal_name";
  ALTER TABLE "site_metadata" DROP COLUMN "organization_json_ld_description";
  ALTER TABLE "site_metadata" DROP COLUMN "organization_json_ld_street_address";
  ALTER TABLE "site_metadata" DROP COLUMN "organization_json_ld_address_locality";
  ALTER TABLE "site_metadata" DROP COLUMN "organization_json_ld_address_country";
  ALTER TABLE "site_metadata_locales" DROP COLUMN "website_json_ld_description";
  ALTER TABLE "contact_info" DROP COLUMN "social_links_whatsapp_url";
  ALTER TABLE "contact_info" DROP COLUMN "social_links_linkedin_url";
  ALTER TABLE "about_hero" DROP COLUMN "hero_video_id";
  ALTER TABLE "about_hero" DROP COLUMN "mobile_hero_video_id";
  ALTER TABLE "about_our_story" DROP COLUMN "center_image_id";
  ALTER TABLE "home_hero" DROP COLUMN "bottle_image_id";
  ALTER TABLE "home_hero" DROP COLUMN "mobile_bottle_image_id";
  ALTER TABLE "home_hero" DROP COLUMN "cta_href";
  ALTER TABLE "home_hero_locales" DROP COLUMN "cta_label";
  ALTER TABLE "horizontal_scroll" DROP COLUMN "box4_image_id";
  ALTER TABLE "article_labels_locales" DROP COLUMN "pagination_item_label";
  ALTER TABLE "article_labels_locales" DROP COLUMN "pagination_summary";
  ALTER TABLE "product_detail_labels_locales" DROP COLUMN "pagination_summary";
  ALTER TABLE "vacancy_labels_locales" DROP COLUMN "pagination_summary";`)
}
