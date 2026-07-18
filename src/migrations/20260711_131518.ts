import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_metadata" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"home_og_image_id" integer,
  	"about_og_image_id" integer,
  	"products_og_image_id" integer,
  	"news_og_image_id" integer,
  	"vacancies_og_image_id" integer,
  	"contact_og_image_id" integer,
  	"organization_json_ld_name" varchar,
  	"website_json_ld_name" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_metadata_locales" (
  	"home_title" varchar,
  	"home_description" varchar,
  	"about_title" varchar,
  	"about_description" varchar,
  	"products_title" varchar,
  	"products_description" varchar,
  	"news_title" varchar,
  	"news_description" varchar,
  	"vacancies_title" varchar,
  	"vacancies_description" varchar,
  	"contact_title" varchar,
  	"contact_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "our_collection_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"image_id" integer,
  	"order" numeric DEFAULT 0
  );
  
  CREATE TABLE "our_collection_items_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "our_collection" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "article_labels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "article_labels_locales" (
  	"home_section_tag" varchar,
  	"page_title" varchar,
  	"filter_all_label" varchar,
  	"featured_label" varchar,
  	"read_article_label" varchar,
  	"back_to_news_label" varchar,
  	"more_articles_heading" varchar,
  	"no_articles_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "vacancy_labels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "vacancy_labels_locales" (
  	"page_title" varchar,
  	"filter_all_label" varchar,
  	"open_position" varchar,
  	"open_positions" varchar,
  	"no_openings_message" varchar,
  	"pagination_item_label" varchar,
  	"perks_title" varchar,
  	"perks_growth_title" varchar,
  	"perks_growth_desc" varchar,
  	"perks_health_title" varchar,
  	"perks_health_desc" varchar,
  	"perks_culture_title" varchar,
  	"perks_culture_desc" varchar,
  	"perks_impact_title" varchar,
  	"perks_impact_desc" varchar,
  	"posted_label" varchar,
  	"tab_overview" varchar,
  	"tab_responsibilities" varchar,
  	"tab_requirements" varchar,
  	"benefits_perks" varchar,
  	"required" varchar,
  	"nice_to_have" varchar,
  	"other_openings" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "product_lines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "product_lines_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_mosaic" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "product_lines" CASCADE;
  DROP TABLE "product_lines_locales" CASCADE;
  DROP TABLE "about_mosaic" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_product_lines_fk";
  
  ALTER TABLE "home_cta_banner" DROP CONSTRAINT "home_cta_banner_video_id_media_id_fk";
  
  DROP INDEX "payload_locked_documents_rels_product_lines_id_idx";
  DROP INDEX "home_cta_banner_video_idx";
  ALTER TABLE "about_hero" ADD COLUMN "mobile_cover_image_id" integer;
  ALTER TABLE "about_who_we_are" ADD COLUMN "background_video_id" integer;
  ALTER TABLE "about_our_story" ADD COLUMN "left_image_id" integer NOT NULL;
  ALTER TABLE "about_our_story" ADD COLUMN "right_image_id" integer NOT NULL;
  ALTER TABLE "about_final_section" ADD COLUMN "mobile_image_id" integer;
  ALTER TABLE "contact_info" ADD COLUMN "site_icon_id" integer;
  ALTER TABLE "contact_info" ADD COLUMN "social_links_instagram_url" varchar;
  ALTER TABLE "contact_info" ADD COLUMN "social_links_youtube_url" varchar;
  ALTER TABLE "contact_info" ADD COLUMN "social_links_facebook_url" varchar;
  ALTER TABLE "home_hero" ADD COLUMN "mobile_poster_id" integer;
  ALTER TABLE "home_cta_banner" ADD COLUMN "image_id" integer;
  ALTER TABLE "home_cta_banner" ADD COLUMN "mobile_image_id" integer;
  ALTER TABLE "product_detail_labels_locales" ADD COLUMN "listing_title" varchar;
  ALTER TABLE "product_detail_labels_locales" ADD COLUMN "filter_all_label" varchar;
  ALTER TABLE "product_detail_labels_locales" ADD COLUMN "no_products_message" varchar;
  ALTER TABLE "product_detail_labels_locales" ADD COLUMN "pagination_item_label" varchar;
  ALTER TABLE "product_detail_labels_locales" ADD COLUMN "related_heading" varchar;
  ALTER TABLE "site_metadata" ADD CONSTRAINT "site_metadata_home_og_image_id_media_id_fk" FOREIGN KEY ("home_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_metadata" ADD CONSTRAINT "site_metadata_about_og_image_id_media_id_fk" FOREIGN KEY ("about_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_metadata" ADD CONSTRAINT "site_metadata_products_og_image_id_media_id_fk" FOREIGN KEY ("products_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_metadata" ADD CONSTRAINT "site_metadata_news_og_image_id_media_id_fk" FOREIGN KEY ("news_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_metadata" ADD CONSTRAINT "site_metadata_vacancies_og_image_id_media_id_fk" FOREIGN KEY ("vacancies_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_metadata" ADD CONSTRAINT "site_metadata_contact_og_image_id_media_id_fk" FOREIGN KEY ("contact_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_metadata_locales" ADD CONSTRAINT "site_metadata_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_metadata"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "our_collection_items" ADD CONSTRAINT "our_collection_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "our_collection_items" ADD CONSTRAINT "our_collection_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."our_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "our_collection_items_locales" ADD CONSTRAINT "our_collection_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."our_collection_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "article_labels_locales" ADD CONSTRAINT "article_labels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."article_labels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vacancy_labels_locales" ADD CONSTRAINT "vacancy_labels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vacancy_labels"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_metadata_home_home_og_image_idx" ON "site_metadata" USING btree ("home_og_image_id");
  CREATE INDEX "site_metadata_about_about_og_image_idx" ON "site_metadata" USING btree ("about_og_image_id");
  CREATE INDEX "site_metadata_products_products_og_image_idx" ON "site_metadata" USING btree ("products_og_image_id");
  CREATE INDEX "site_metadata_news_news_og_image_idx" ON "site_metadata" USING btree ("news_og_image_id");
  CREATE INDEX "site_metadata_vacancies_vacancies_og_image_idx" ON "site_metadata" USING btree ("vacancies_og_image_id");
  CREATE INDEX "site_metadata_contact_contact_og_image_idx" ON "site_metadata" USING btree ("contact_og_image_id");
  CREATE UNIQUE INDEX "site_metadata_locales_locale_parent_id_unique" ON "site_metadata_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "our_collection_items_order_idx" ON "our_collection_items" USING btree ("_order");
  CREATE INDEX "our_collection_items_parent_id_idx" ON "our_collection_items" USING btree ("_parent_id");
  CREATE INDEX "our_collection_items_image_idx" ON "our_collection_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "our_collection_items_locales_locale_parent_id_unique" ON "our_collection_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "article_labels_locales_locale_parent_id_unique" ON "article_labels_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "vacancy_labels_locales_locale_parent_id_unique" ON "vacancy_labels_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "about_hero" ADD CONSTRAINT "about_hero_mobile_cover_image_id_media_id_fk" FOREIGN KEY ("mobile_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_who_we_are" ADD CONSTRAINT "about_who_we_are_background_video_id_media_id_fk" FOREIGN KEY ("background_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_our_story" ADD CONSTRAINT "about_our_story_left_image_id_media_id_fk" FOREIGN KEY ("left_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_our_story" ADD CONSTRAINT "about_our_story_right_image_id_media_id_fk" FOREIGN KEY ("right_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_final_section" ADD CONSTRAINT "about_final_section_mobile_image_id_media_id_fk" FOREIGN KEY ("mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_info" ADD CONSTRAINT "contact_info_site_icon_id_media_id_fk" FOREIGN KEY ("site_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_hero" ADD CONSTRAINT "home_hero_mobile_poster_id_media_id_fk" FOREIGN KEY ("mobile_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_cta_banner" ADD CONSTRAINT "home_cta_banner_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_cta_banner" ADD CONSTRAINT "home_cta_banner_mobile_image_id_media_id_fk" FOREIGN KEY ("mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "about_hero_mobile_cover_image_idx" ON "about_hero" USING btree ("mobile_cover_image_id");
  CREATE INDEX "about_who_we_are_background_video_idx" ON "about_who_we_are" USING btree ("background_video_id");
  CREATE INDEX "about_our_story_left_image_idx" ON "about_our_story" USING btree ("left_image_id");
  CREATE INDEX "about_our_story_right_image_idx" ON "about_our_story" USING btree ("right_image_id");
  CREATE INDEX "about_final_section_mobile_image_idx" ON "about_final_section" USING btree ("mobile_image_id");
  CREATE INDEX "contact_info_site_icon_idx" ON "contact_info" USING btree ("site_icon_id");
  CREATE INDEX "home_hero_mobile_poster_idx" ON "home_hero" USING btree ("mobile_poster_id");
  CREATE INDEX "home_cta_banner_image_idx" ON "home_cta_banner" USING btree ("image_id");
  CREATE INDEX "home_cta_banner_mobile_image_idx" ON "home_cta_banner" USING btree ("mobile_image_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "product_lines_id";
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
  ALTER TABLE "home_cta_banner" DROP COLUMN "video_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "product_lines" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"image_id" integer,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "product_lines_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "about_mosaic" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"left_image_id" integer NOT NULL,
  	"right_image_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"instagram_url" varchar,
  	"youtube_url" varchar,
  	"facebook_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "site_metadata" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_metadata_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "our_collection_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "our_collection_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "our_collection" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "article_labels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "article_labels_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "vacancy_labels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "vacancy_labels_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_metadata" CASCADE;
  DROP TABLE "site_metadata_locales" CASCADE;
  DROP TABLE "our_collection_items" CASCADE;
  DROP TABLE "our_collection_items_locales" CASCADE;
  DROP TABLE "our_collection" CASCADE;
  DROP TABLE "article_labels" CASCADE;
  DROP TABLE "article_labels_locales" CASCADE;
  DROP TABLE "vacancy_labels" CASCADE;
  DROP TABLE "vacancy_labels_locales" CASCADE;
  ALTER TABLE "contact_info" DROP CONSTRAINT "contact_info_site_icon_id_media_id_fk";
  
  ALTER TABLE "about_hero" DROP CONSTRAINT "about_hero_mobile_cover_image_id_media_id_fk";
  
  ALTER TABLE "about_who_we_are" DROP CONSTRAINT "about_who_we_are_background_video_id_media_id_fk";
  
  ALTER TABLE "about_our_story" DROP CONSTRAINT "about_our_story_left_image_id_media_id_fk";
  
  ALTER TABLE "about_our_story" DROP CONSTRAINT "about_our_story_right_image_id_media_id_fk";
  
  ALTER TABLE "about_final_section" DROP CONSTRAINT "about_final_section_mobile_image_id_media_id_fk";
  
  ALTER TABLE "home_hero" DROP CONSTRAINT "home_hero_mobile_poster_id_media_id_fk";
  
  ALTER TABLE "home_cta_banner" DROP CONSTRAINT "home_cta_banner_image_id_media_id_fk";
  
  ALTER TABLE "home_cta_banner" DROP CONSTRAINT "home_cta_banner_mobile_image_id_media_id_fk";
  
  DROP INDEX "contact_info_site_icon_idx";
  DROP INDEX "about_hero_mobile_cover_image_idx";
  DROP INDEX "about_who_we_are_background_video_idx";
  DROP INDEX "about_our_story_left_image_idx";
  DROP INDEX "about_our_story_right_image_idx";
  DROP INDEX "about_final_section_mobile_image_idx";
  DROP INDEX "home_hero_mobile_poster_idx";
  DROP INDEX "home_cta_banner_image_idx";
  DROP INDEX "home_cta_banner_mobile_image_idx";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "product_lines_id" integer;
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
  ALTER TABLE "home_cta_banner" ADD COLUMN "video_id" integer;
  ALTER TABLE "product_lines" ADD CONSTRAINT "product_lines_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_lines_locales" ADD CONSTRAINT "product_lines_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_lines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_mosaic" ADD CONSTRAINT "about_mosaic_left_image_id_media_id_fk" FOREIGN KEY ("left_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_mosaic" ADD CONSTRAINT "about_mosaic_right_image_id_media_id_fk" FOREIGN KEY ("right_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "product_lines_key_idx" ON "product_lines" USING btree ("key");
  CREATE INDEX "product_lines_image_idx" ON "product_lines" USING btree ("image_id");
  CREATE INDEX "product_lines_updated_at_idx" ON "product_lines" USING btree ("updated_at");
  CREATE INDEX "product_lines_created_at_idx" ON "product_lines" USING btree ("created_at");
  CREATE UNIQUE INDEX "product_lines_locales_locale_parent_id_unique" ON "product_lines_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_mosaic_left_image_idx" ON "about_mosaic" USING btree ("left_image_id");
  CREATE INDEX "about_mosaic_right_image_idx" ON "about_mosaic" USING btree ("right_image_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_lines_fk" FOREIGN KEY ("product_lines_id") REFERENCES "public"."product_lines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_cta_banner" ADD CONSTRAINT "home_cta_banner_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_product_lines_id_idx" ON "payload_locked_documents_rels" USING btree ("product_lines_id");
  CREATE INDEX "home_cta_banner_video_idx" ON "home_cta_banner" USING btree ("video_id");
  ALTER TABLE "contact_info" DROP COLUMN "site_icon_id";
  ALTER TABLE "contact_info" DROP COLUMN "social_links_instagram_url";
  ALTER TABLE "contact_info" DROP COLUMN "social_links_youtube_url";
  ALTER TABLE "contact_info" DROP COLUMN "social_links_facebook_url";
  ALTER TABLE "about_hero" DROP COLUMN "mobile_cover_image_id";
  ALTER TABLE "about_who_we_are" DROP COLUMN "background_video_id";
  ALTER TABLE "about_our_story" DROP COLUMN "left_image_id";
  ALTER TABLE "about_our_story" DROP COLUMN "right_image_id";
  ALTER TABLE "about_final_section" DROP COLUMN "mobile_image_id";
  ALTER TABLE "home_hero" DROP COLUMN "mobile_poster_id";
  ALTER TABLE "home_cta_banner" DROP COLUMN "image_id";
  ALTER TABLE "home_cta_banner" DROP COLUMN "mobile_image_id";
  ALTER TABLE "product_detail_labels_locales" DROP COLUMN "listing_title";
  ALTER TABLE "product_detail_labels_locales" DROP COLUMN "filter_all_label";
  ALTER TABLE "product_detail_labels_locales" DROP COLUMN "no_products_message";
  ALTER TABLE "product_detail_labels_locales" DROP COLUMN "pagination_item_label";
  ALTER TABLE "product_detail_labels_locales" DROP COLUMN "related_heading";`)
}
