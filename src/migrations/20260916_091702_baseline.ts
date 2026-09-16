import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'tm', 'ru');
  CREATE TYPE "public"."enum_vacancies_type" AS ENUM('fullTime', 'partTime');
  CREATE TYPE "public"."enum_contact_submissions_locale" AS ENUM('en', 'ru', 'tm');
  CREATE TYPE "public"."enum_exports_format" AS ENUM('csv', 'json');
  CREATE TYPE "public"."enum_exports_sort_order" AS ENUM('asc', 'desc');
  CREATE TYPE "public"."enum_exports_locale" AS ENUM('all', 'en', 'tm', 'ru');
  CREATE TYPE "public"."enum_exports_drafts" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_imports_import_mode" AS ENUM('create', 'update', 'upsert');
  CREATE TYPE "public"."enum_imports_status" AS ENUM('pending', 'completed', 'partial', 'failed');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'createCollectionExport', 'createCollectionImport');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'createCollectionExport', 'createCollectionImport');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "product_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "product_categories_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "products_nutrition" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products_nutrition_locales" (
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_volumes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "products_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_name" varchar,
  	"date" timestamp(3) with time zone,
  	"category_id" integer NOT NULL,
  	"video_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_locales" (
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"tagline" varchar,
  	"description" varchar,
  	"long_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "article_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "article_categories_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "articles_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE "articles_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "articles_body_locales" (
  	"text" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"category_id" integer NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"featured" boolean DEFAULT false,
  	"emoji" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "articles_locales" (
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "vacancy_departments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "vacancy_departments_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "vacancies_responsibilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "vacancies_responsibilities_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "vacancies_requirements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "vacancies_requirements_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "vacancies_nice_to_have" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "vacancies_nice_to_have_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "vacancies_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "vacancies_benefits_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "vacancies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"department_id" integer NOT NULL,
  	"type" "enum_vacancies_type",
  	"image_id" integer,
  	"salary" varchar,
  	"posted_date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "vacancies_locales" (
  	"title" varchar NOT NULL,
  	"location" varchar,
  	"overview" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cv_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"applicant_name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "contact_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"subject" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"locale" "enum_contact_submissions_locale",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "vacancy_applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"date_of_birth" varchar NOT NULL,
  	"cover" varchar,
  	"vacancy_id" integer NOT NULL,
  	"cv_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "exports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"format" "enum_exports_format" DEFAULT 'csv' NOT NULL,
  	"limit" numeric,
  	"page" numeric DEFAULT 1,
  	"sort" varchar,
  	"sort_order" "enum_exports_sort_order",
  	"locale" "enum_exports_locale" DEFAULT 'all',
  	"drafts" "enum_exports_drafts" DEFAULT 'yes',
  	"collection_slug" varchar DEFAULT 'product-categories' NOT NULL,
  	"where" jsonb DEFAULT '{}'::jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "exports_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "imports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"collection_slug" varchar DEFAULT 'product-categories' NOT NULL,
  	"import_mode" "enum_imports_import_mode",
  	"match_field" varchar DEFAULT 'id',
  	"status" "enum_imports_status" DEFAULT 'pending',
  	"summary_imported" numeric,
  	"summary_updated" numeric,
  	"summary_total" numeric,
  	"summary_issues" numeric,
  	"summary_issue_details" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"product_categories_id" integer,
  	"products_id" integer,
  	"article_categories_id" integer,
  	"articles_id" integer,
  	"vacancy_departments_id" integer,
  	"vacancies_id" integer,
  	"cv_documents_id" integer,
  	"contact_submissions_id" integer,
  	"vacancy_applications_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_metadata_website_json_ld_alternate_names" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "site_metadata" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"home_og_image_id" integer,
  	"about_og_image_id" integer,
  	"products_og_image_id" integer,
  	"news_og_image_id" integer,
  	"vacancies_og_image_id" integer,
  	"contact_og_image_id" integer,
  	"organization_json_ld_name" varchar,
  	"organization_json_ld_legal_name" varchar,
  	"organization_json_ld_description" varchar,
  	"organization_json_ld_street_address" varchar,
  	"organization_json_ld_address_locality" varchar,
  	"organization_json_ld_address_country" varchar,
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
  	"website_json_ld_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "contact_info_phones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"number" varchar NOT NULL
  );
  
  CREATE TABLE "contact_info" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_icon_id" integer,
  	"email" varchar,
  	"social_links_instagram_url" varchar,
  	"social_links_youtube_url" varchar,
  	"social_links_facebook_url" varchar,
  	"social_links_whatsapp_url" varchar,
  	"social_links_linkedin_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_info_locales" (
  	"section_label" varchar,
  	"address" varchar,
  	"working_hours" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
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
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_page_locales" (
  	"hero_title" varchar,
  	"hero_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "forms_locales" (
  	"common_fields_labels_first_name" varchar,
  	"common_fields_labels_last_name" varchar,
  	"common_fields_labels_email" varchar,
  	"common_fields_labels_phone" varchar,
  	"common_fields_placeholders_first_name" varchar,
  	"common_fields_placeholders_last_name" varchar,
  	"common_fields_placeholders_email" varchar,
  	"common_fields_placeholders_phone" varchar,
  	"contact_form_labels_subject" varchar,
  	"contact_form_labels_message" varchar,
  	"contact_form_labels_submit_button" varchar,
  	"contact_form_placeholders_subject" varchar,
  	"contact_form_placeholders_message" varchar,
  	"contact_form_messages_success" varchar,
  	"contact_form_messages_error" varchar,
  	"contact_form_messages_sending" varchar,
  	"contact_form_messages_thank_you" varchar,
  	"contact_form_messages_what_happens_next" varchar,
  	"contact_form_messages_step1" varchar,
  	"contact_form_messages_step2" varchar,
  	"contact_form_messages_step3" varchar,
  	"contact_form_messages_send_another" varchar,
  	"contact_form_errors_required_fields" varchar,
  	"contact_form_errors_email_invalid" varchar,
  	"contact_form_errors_name_too_long" varchar,
  	"contact_form_errors_email_too_long" varchar,
  	"contact_form_errors_phone_too_long" varchar,
  	"contact_form_errors_subject_too_long" varchar,
  	"contact_form_errors_message_too_long" varchar,
  	"contact_form_errors_server_error" varchar,
  	"vacancy_form_labels_form_title" varchar,
  	"vacancy_form_labels_apply_button" varchar,
  	"vacancy_form_labels_date_of_birth" varchar,
  	"vacancy_form_labels_cv" varchar,
  	"vacancy_form_labels_cover_letter" varchar,
  	"vacancy_form_labels_submit_button" varchar,
  	"vacancy_form_placeholders_cover_letter" varchar,
  	"vacancy_form_upload_click_to_upload" varchar,
  	"vacancy_form_upload_drag_and_drop" varchar,
  	"vacancy_form_upload_hint" varchar,
  	"vacancy_form_messages_success_heading" varchar,
  	"vacancy_form_messages_success_thank_you" varchar,
  	"vacancy_form_messages_what_happens_next" varchar,
  	"vacancy_form_messages_step1" varchar,
  	"vacancy_form_messages_step2" varchar,
  	"vacancy_form_messages_step3" varchar,
  	"vacancy_form_messages_submitting" varchar,
  	"vacancy_form_messages_submit_another" varchar,
  	"vacancy_form_messages_error" varchar,
  	"vacancy_form_errors_required_fields" varchar,
  	"vacancy_form_errors_email_invalid" varchar,
  	"vacancy_form_errors_vacancy_invalid" varchar,
  	"vacancy_form_errors_name_too_long" varchar,
  	"vacancy_form_errors_email_too_long" varchar,
  	"vacancy_form_errors_phone_too_long" varchar,
  	"vacancy_form_errors_dob_invalid" varchar,
  	"vacancy_form_errors_cover_too_long" varchar,
  	"vacancy_form_errors_cv_required" varchar,
  	"vacancy_form_errors_cv_type_invalid" varchar,
  	"vacancy_form_errors_cv_too_large" varchar,
  	"vacancy_form_errors_cv_content_mismatch" varchar,
  	"vacancy_form_errors_server_error" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "about_hero" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cover_image_id" integer,
  	"mobile_cover_image_id" integer,
  	"hero_video_id" integer,
  	"mobile_hero_video_id" integer,
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
  	"background_video_id" integer,
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
  	"left_image_id" integer NOT NULL,
  	"right_image_id" integer NOT NULL,
  	"center_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_our_story_locales" (
  	"section_label" varchar,
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
  
  CREATE TABLE "about_final_section" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"mobile_image_id" integer,
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
  
  CREATE TABLE "home_hero_parallax_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_name" varchar NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "home_hero" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"poster_id" integer,
  	"mobile_poster_id" integer,
  	"bottle_image_id" integer,
  	"mobile_bottle_image_id" integer,
  	"cta_href" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_hero_locales" (
  	"title" varchar,
  	"title_accent" varchar,
  	"subtitle" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "horizontal_scroll" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"box1_image_id" integer,
  	"box2_image_id" integer,
  	"box3_image_id" integer,
  	"box4_image_id" integer,
  	"box4_button_href" varchar,
  	"box5_video_id" integer,
  	"box5_cover_image_id" integer,
  	"box6_image_id" integer,
  	"box6_button_href" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "horizontal_scroll_locales" (
  	"box2_tag" varchar,
  	"box2_headline" varchar,
  	"box4_text" varchar,
  	"box4_button_label" varchar,
  	"box5_tag" varchar,
  	"box5_headline" varchar,
  	"box6_tag" varchar,
  	"box6_headline" varchar,
  	"box6_button_label" varchar,
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
  	"image_alt" varchar,
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
  
  CREATE TABLE "our_collection_locales" (
  	"section_tag" varchar,
  	"explore_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "home_story" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_story_locales" (
  	"tag" varchar,
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "home_cta_banner" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"mobile_image_id" integer,
  	"cta_href" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_cta_banner_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"cta_label" varchar,
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
  	"pagination_item_label" varchar,
  	"pagination_summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "product_detail_labels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "product_detail_labels_locales" (
  	"listing_title" varchar,
  	"filter_all_label" varchar,
  	"no_products_message" varchar,
  	"pagination_item_label" varchar,
  	"pagination_summary" varchar,
  	"size_label" varchar,
  	"nutrition_label" varchar,
  	"about_label" varchar,
  	"related_heading" varchar,
  	"mineral_label" varchar,
  	"per_litre_label" varchar,
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
  	"pagination_summary" varchar,
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
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_categories_locales" ADD CONSTRAINT "product_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_nutrition" ADD CONSTRAINT "products_nutrition_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_nutrition_locales" ADD CONSTRAINT "products_nutrition_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_nutrition"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_volumes" ADD CONSTRAINT "products_volumes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_photos" ADD CONSTRAINT "products_photos_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_photos" ADD CONSTRAINT "products_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "article_categories_locales" ADD CONSTRAINT "article_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."article_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_images" ADD CONSTRAINT "articles_images_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_images" ADD CONSTRAINT "articles_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_body" ADD CONSTRAINT "articles_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_body_locales" ADD CONSTRAINT "articles_body_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles_body"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_category_id_article_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."article_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_locales" ADD CONSTRAINT "articles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vacancy_departments_locales" ADD CONSTRAINT "vacancy_departments_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vacancy_departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vacancies_responsibilities" ADD CONSTRAINT "vacancies_responsibilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vacancies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vacancies_responsibilities_locales" ADD CONSTRAINT "vacancies_responsibilities_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vacancies_responsibilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vacancies_requirements" ADD CONSTRAINT "vacancies_requirements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vacancies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vacancies_requirements_locales" ADD CONSTRAINT "vacancies_requirements_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vacancies_requirements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vacancies_nice_to_have" ADD CONSTRAINT "vacancies_nice_to_have_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vacancies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vacancies_nice_to_have_locales" ADD CONSTRAINT "vacancies_nice_to_have_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vacancies_nice_to_have"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vacancies_benefits" ADD CONSTRAINT "vacancies_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vacancies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vacancies_benefits_locales" ADD CONSTRAINT "vacancies_benefits_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vacancies_benefits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vacancies" ADD CONSTRAINT "vacancies_department_id_vacancy_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."vacancy_departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vacancies" ADD CONSTRAINT "vacancies_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vacancies_locales" ADD CONSTRAINT "vacancies_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vacancies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vacancy_applications" ADD CONSTRAINT "vacancy_applications_vacancy_id_vacancies_id_fk" FOREIGN KEY ("vacancy_id") REFERENCES "public"."vacancies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vacancy_applications" ADD CONSTRAINT "vacancy_applications_cv_id_cv_documents_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."cv_documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "exports_texts" ADD CONSTRAINT "exports_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."exports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_article_categories_fk" FOREIGN KEY ("article_categories_id") REFERENCES "public"."article_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vacancy_departments_fk" FOREIGN KEY ("vacancy_departments_id") REFERENCES "public"."vacancy_departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vacancies_fk" FOREIGN KEY ("vacancies_id") REFERENCES "public"."vacancies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cv_documents_fk" FOREIGN KEY ("cv_documents_id") REFERENCES "public"."cv_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk" FOREIGN KEY ("contact_submissions_id") REFERENCES "public"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vacancy_applications_fk" FOREIGN KEY ("vacancy_applications_id") REFERENCES "public"."vacancy_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_metadata_website_json_ld_alternate_names" ADD CONSTRAINT "site_metadata_website_json_ld_alternate_names_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_metadata"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_metadata" ADD CONSTRAINT "site_metadata_home_og_image_id_media_id_fk" FOREIGN KEY ("home_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_metadata" ADD CONSTRAINT "site_metadata_about_og_image_id_media_id_fk" FOREIGN KEY ("about_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_metadata" ADD CONSTRAINT "site_metadata_products_og_image_id_media_id_fk" FOREIGN KEY ("products_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_metadata" ADD CONSTRAINT "site_metadata_news_og_image_id_media_id_fk" FOREIGN KEY ("news_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_metadata" ADD CONSTRAINT "site_metadata_vacancies_og_image_id_media_id_fk" FOREIGN KEY ("vacancies_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_metadata" ADD CONSTRAINT "site_metadata_contact_og_image_id_media_id_fk" FOREIGN KEY ("contact_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_metadata_locales" ADD CONSTRAINT "site_metadata_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_metadata"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_info_phones" ADD CONSTRAINT "contact_info_phones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_info"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_info" ADD CONSTRAINT "contact_info_site_icon_id_media_id_fk" FOREIGN KEY ("site_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_info_locales" ADD CONSTRAINT "contact_info_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_info"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "email_templates_locales" ADD CONSTRAINT "email_templates_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."email_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_labels_locales" ADD CONSTRAINT "navigation_labels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_labels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "not_found_page_locales" ADD CONSTRAINT "not_found_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."not_found_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "error_page_locales" ADD CONSTRAINT "error_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."error_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_locales" ADD CONSTRAINT "about_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_locales" ADD CONSTRAINT "forms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_hero" ADD CONSTRAINT "about_hero_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_hero" ADD CONSTRAINT "about_hero_mobile_cover_image_id_media_id_fk" FOREIGN KEY ("mobile_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_hero" ADD CONSTRAINT "about_hero_hero_video_id_media_id_fk" FOREIGN KEY ("hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_hero" ADD CONSTRAINT "about_hero_mobile_hero_video_id_media_id_fk" FOREIGN KEY ("mobile_hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_hero_locales" ADD CONSTRAINT "about_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_who_we_are" ADD CONSTRAINT "about_who_we_are_full_viewport_image_id_media_id_fk" FOREIGN KEY ("full_viewport_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_who_we_are" ADD CONSTRAINT "about_who_we_are_background_video_id_media_id_fk" FOREIGN KEY ("background_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_who_we_are_locales" ADD CONSTRAINT "about_who_we_are_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_who_we_are"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_our_story_milestones" ADD CONSTRAINT "about_our_story_milestones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_our_story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_our_story_milestones_locales" ADD CONSTRAINT "about_our_story_milestones_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_our_story_milestones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_our_story" ADD CONSTRAINT "about_our_story_left_image_id_media_id_fk" FOREIGN KEY ("left_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_our_story" ADD CONSTRAINT "about_our_story_right_image_id_media_id_fk" FOREIGN KEY ("right_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_our_story" ADD CONSTRAINT "about_our_story_center_image_id_media_id_fk" FOREIGN KEY ("center_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_our_story_locales" ADD CONSTRAINT "about_our_story_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_our_story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_numbers_stats" ADD CONSTRAINT "about_numbers_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_numbers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_numbers_stats_locales" ADD CONSTRAINT "about_numbers_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_numbers_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_numbers_locales" ADD CONSTRAINT "about_numbers_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_numbers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_final_section" ADD CONSTRAINT "about_final_section_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_final_section" ADD CONSTRAINT "about_final_section_mobile_image_id_media_id_fk" FOREIGN KEY ("mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_final_section_locales" ADD CONSTRAINT "about_final_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_final_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_hero_parallax_images" ADD CONSTRAINT "home_hero_parallax_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_hero_parallax_images" ADD CONSTRAINT "home_hero_parallax_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_hero" ADD CONSTRAINT "home_hero_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_hero" ADD CONSTRAINT "home_hero_mobile_poster_id_media_id_fk" FOREIGN KEY ("mobile_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_hero" ADD CONSTRAINT "home_hero_bottle_image_id_media_id_fk" FOREIGN KEY ("bottle_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_hero" ADD CONSTRAINT "home_hero_mobile_bottle_image_id_media_id_fk" FOREIGN KEY ("mobile_bottle_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_hero_locales" ADD CONSTRAINT "home_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "horizontal_scroll" ADD CONSTRAINT "horizontal_scroll_box1_image_id_media_id_fk" FOREIGN KEY ("box1_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "horizontal_scroll" ADD CONSTRAINT "horizontal_scroll_box2_image_id_media_id_fk" FOREIGN KEY ("box2_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "horizontal_scroll" ADD CONSTRAINT "horizontal_scroll_box3_image_id_media_id_fk" FOREIGN KEY ("box3_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "horizontal_scroll" ADD CONSTRAINT "horizontal_scroll_box4_image_id_media_id_fk" FOREIGN KEY ("box4_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "horizontal_scroll" ADD CONSTRAINT "horizontal_scroll_box5_video_id_media_id_fk" FOREIGN KEY ("box5_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "horizontal_scroll" ADD CONSTRAINT "horizontal_scroll_box5_cover_image_id_media_id_fk" FOREIGN KEY ("box5_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "horizontal_scroll" ADD CONSTRAINT "horizontal_scroll_box6_image_id_media_id_fk" FOREIGN KEY ("box6_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "horizontal_scroll_locales" ADD CONSTRAINT "horizontal_scroll_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."horizontal_scroll"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "our_collection_items" ADD CONSTRAINT "our_collection_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "our_collection_items" ADD CONSTRAINT "our_collection_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."our_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "our_collection_items_locales" ADD CONSTRAINT "our_collection_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."our_collection_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "our_collection_locales" ADD CONSTRAINT "our_collection_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."our_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_story" ADD CONSTRAINT "home_story_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_story_locales" ADD CONSTRAINT "home_story_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_cta_banner" ADD CONSTRAINT "home_cta_banner_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_cta_banner" ADD CONSTRAINT "home_cta_banner_mobile_image_id_media_id_fk" FOREIGN KEY ("mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_cta_banner_locales" ADD CONSTRAINT "home_cta_banner_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_cta_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_brand_statement_locales" ADD CONSTRAINT "home_brand_statement_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_brand_statement"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "article_labels_locales" ADD CONSTRAINT "article_labels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."article_labels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_detail_labels_locales" ADD CONSTRAINT "product_detail_labels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_detail_labels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vacancy_labels_locales" ADD CONSTRAINT "vacancy_labels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vacancy_labels"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "product_categories_slug_idx" ON "product_categories" USING btree ("slug");
  CREATE INDEX "product_categories_updated_at_idx" ON "product_categories" USING btree ("updated_at");
  CREATE INDEX "product_categories_created_at_idx" ON "product_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "product_categories_locales_locale_parent_id_unique" ON "product_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_nutrition_order_idx" ON "products_nutrition" USING btree ("_order");
  CREATE INDEX "products_nutrition_parent_id_idx" ON "products_nutrition" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_nutrition_locales_locale_parent_id_unique" ON "products_nutrition_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_volumes_order_idx" ON "products_volumes" USING btree ("_order");
  CREATE INDEX "products_volumes_parent_id_idx" ON "products_volumes" USING btree ("_parent_id");
  CREATE INDEX "products_photos_order_idx" ON "products_photos" USING btree ("_order");
  CREATE INDEX "products_photos_parent_id_idx" ON "products_photos" USING btree ("_parent_id");
  CREATE INDEX "products_photos_media_idx" ON "products_photos" USING btree ("media_id");
  CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");
  CREATE INDEX "products_video_idx" ON "products" USING btree ("video_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "article_categories_slug_idx" ON "article_categories" USING btree ("slug");
  CREATE INDEX "article_categories_updated_at_idx" ON "article_categories" USING btree ("updated_at");
  CREATE INDEX "article_categories_created_at_idx" ON "article_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "article_categories_locales_locale_parent_id_unique" ON "article_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "articles_images_order_idx" ON "articles_images" USING btree ("_order");
  CREATE INDEX "articles_images_parent_id_idx" ON "articles_images" USING btree ("_parent_id");
  CREATE INDEX "articles_images_media_idx" ON "articles_images" USING btree ("media_id");
  CREATE INDEX "articles_body_order_idx" ON "articles_body" USING btree ("_order");
  CREATE INDEX "articles_body_parent_id_idx" ON "articles_body" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "articles_body_locales_locale_parent_id_unique" ON "articles_body_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "articles_category_idx" ON "articles" USING btree ("category_id");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "articles_locales_locale_parent_id_unique" ON "articles_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "vacancy_departments_slug_idx" ON "vacancy_departments" USING btree ("slug");
  CREATE INDEX "vacancy_departments_updated_at_idx" ON "vacancy_departments" USING btree ("updated_at");
  CREATE INDEX "vacancy_departments_created_at_idx" ON "vacancy_departments" USING btree ("created_at");
  CREATE UNIQUE INDEX "vacancy_departments_locales_locale_parent_id_unique" ON "vacancy_departments_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "vacancies_responsibilities_order_idx" ON "vacancies_responsibilities" USING btree ("_order");
  CREATE INDEX "vacancies_responsibilities_parent_id_idx" ON "vacancies_responsibilities" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "vacancies_responsibilities_locales_locale_parent_id_unique" ON "vacancies_responsibilities_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "vacancies_requirements_order_idx" ON "vacancies_requirements" USING btree ("_order");
  CREATE INDEX "vacancies_requirements_parent_id_idx" ON "vacancies_requirements" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "vacancies_requirements_locales_locale_parent_id_unique" ON "vacancies_requirements_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "vacancies_nice_to_have_order_idx" ON "vacancies_nice_to_have" USING btree ("_order");
  CREATE INDEX "vacancies_nice_to_have_parent_id_idx" ON "vacancies_nice_to_have" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "vacancies_nice_to_have_locales_locale_parent_id_unique" ON "vacancies_nice_to_have_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "vacancies_benefits_order_idx" ON "vacancies_benefits" USING btree ("_order");
  CREATE INDEX "vacancies_benefits_parent_id_idx" ON "vacancies_benefits" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "vacancies_benefits_locales_locale_parent_id_unique" ON "vacancies_benefits_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "vacancies_department_idx" ON "vacancies" USING btree ("department_id");
  CREATE INDEX "vacancies_image_idx" ON "vacancies" USING btree ("image_id");
  CREATE INDEX "vacancies_updated_at_idx" ON "vacancies" USING btree ("updated_at");
  CREATE INDEX "vacancies_created_at_idx" ON "vacancies" USING btree ("created_at");
  CREATE UNIQUE INDEX "vacancies_locales_locale_parent_id_unique" ON "vacancies_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "cv_documents_updated_at_idx" ON "cv_documents" USING btree ("updated_at");
  CREATE INDEX "cv_documents_created_at_idx" ON "cv_documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "cv_documents_filename_idx" ON "cv_documents" USING btree ("filename");
  CREATE INDEX "contact_submissions_updated_at_idx" ON "contact_submissions" USING btree ("updated_at");
  CREATE INDEX "contact_submissions_created_at_idx" ON "contact_submissions" USING btree ("created_at");
  CREATE INDEX "vacancy_applications_vacancy_idx" ON "vacancy_applications" USING btree ("vacancy_id");
  CREATE INDEX "vacancy_applications_cv_idx" ON "vacancy_applications" USING btree ("cv_id");
  CREATE INDEX "vacancy_applications_updated_at_idx" ON "vacancy_applications" USING btree ("updated_at");
  CREATE INDEX "vacancy_applications_created_at_idx" ON "vacancy_applications" USING btree ("created_at");
  CREATE INDEX "exports_updated_at_idx" ON "exports" USING btree ("updated_at");
  CREATE INDEX "exports_created_at_idx" ON "exports" USING btree ("created_at");
  CREATE UNIQUE INDEX "exports_filename_idx" ON "exports" USING btree ("filename");
  CREATE INDEX "exports_texts_order_parent" ON "exports_texts" USING btree ("order","parent_id");
  CREATE INDEX "imports_updated_at_idx" ON "imports" USING btree ("updated_at");
  CREATE INDEX "imports_created_at_idx" ON "imports" USING btree ("created_at");
  CREATE UNIQUE INDEX "imports_filename_idx" ON "imports" USING btree ("filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_product_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("product_categories_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_article_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("article_categories_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_vacancy_departments_id_idx" ON "payload_locked_documents_rels" USING btree ("vacancy_departments_id");
  CREATE INDEX "payload_locked_documents_rels_vacancies_id_idx" ON "payload_locked_documents_rels" USING btree ("vacancies_id");
  CREATE INDEX "payload_locked_documents_rels_cv_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("cv_documents_id");
  CREATE INDEX "payload_locked_documents_rels_contact_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_vacancy_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("vacancy_applications_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_metadata_website_json_ld_alternate_names_order_idx" ON "site_metadata_website_json_ld_alternate_names" USING btree ("_order");
  CREATE INDEX "site_metadata_website_json_ld_alternate_names_parent_id_idx" ON "site_metadata_website_json_ld_alternate_names" USING btree ("_parent_id");
  CREATE INDEX "site_metadata_home_home_og_image_idx" ON "site_metadata" USING btree ("home_og_image_id");
  CREATE INDEX "site_metadata_about_about_og_image_idx" ON "site_metadata" USING btree ("about_og_image_id");
  CREATE INDEX "site_metadata_products_products_og_image_idx" ON "site_metadata" USING btree ("products_og_image_id");
  CREATE INDEX "site_metadata_news_news_og_image_idx" ON "site_metadata" USING btree ("news_og_image_id");
  CREATE INDEX "site_metadata_vacancies_vacancies_og_image_idx" ON "site_metadata" USING btree ("vacancies_og_image_id");
  CREATE INDEX "site_metadata_contact_contact_og_image_idx" ON "site_metadata" USING btree ("contact_og_image_id");
  CREATE UNIQUE INDEX "site_metadata_locales_locale_parent_id_unique" ON "site_metadata_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "contact_info_phones_order_idx" ON "contact_info_phones" USING btree ("_order");
  CREATE INDEX "contact_info_phones_parent_id_idx" ON "contact_info_phones" USING btree ("_parent_id");
  CREATE INDEX "contact_info_site_icon_idx" ON "contact_info" USING btree ("site_icon_id");
  CREATE UNIQUE INDEX "contact_info_locales_locale_parent_id_unique" ON "contact_info_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "email_templates_locales_locale_parent_id_unique" ON "email_templates_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "navigation_labels_locales_locale_parent_id_unique" ON "navigation_labels_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "not_found_page_locales_locale_parent_id_unique" ON "not_found_page_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "error_page_locales_locale_parent_id_unique" ON "error_page_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_page_locales_locale_parent_id_unique" ON "about_page_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_locales_locale_parent_id_unique" ON "forms_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_hero_cover_image_idx" ON "about_hero" USING btree ("cover_image_id");
  CREATE INDEX "about_hero_mobile_cover_image_idx" ON "about_hero" USING btree ("mobile_cover_image_id");
  CREATE INDEX "about_hero_hero_video_idx" ON "about_hero" USING btree ("hero_video_id");
  CREATE INDEX "about_hero_mobile_hero_video_idx" ON "about_hero" USING btree ("mobile_hero_video_id");
  CREATE UNIQUE INDEX "about_hero_locales_locale_parent_id_unique" ON "about_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_who_we_are_full_viewport_image_idx" ON "about_who_we_are" USING btree ("full_viewport_image_id");
  CREATE INDEX "about_who_we_are_background_video_idx" ON "about_who_we_are" USING btree ("background_video_id");
  CREATE UNIQUE INDEX "about_who_we_are_locales_locale_parent_id_unique" ON "about_who_we_are_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_our_story_milestones_order_idx" ON "about_our_story_milestones" USING btree ("_order");
  CREATE INDEX "about_our_story_milestones_parent_id_idx" ON "about_our_story_milestones" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_our_story_milestones_locales_locale_parent_id_unique" ON "about_our_story_milestones_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_our_story_left_image_idx" ON "about_our_story" USING btree ("left_image_id");
  CREATE INDEX "about_our_story_right_image_idx" ON "about_our_story" USING btree ("right_image_id");
  CREATE INDEX "about_our_story_center_image_idx" ON "about_our_story" USING btree ("center_image_id");
  CREATE UNIQUE INDEX "about_our_story_locales_locale_parent_id_unique" ON "about_our_story_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_numbers_stats_order_idx" ON "about_numbers_stats" USING btree ("_order");
  CREATE INDEX "about_numbers_stats_parent_id_idx" ON "about_numbers_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_numbers_stats_locales_locale_parent_id_unique" ON "about_numbers_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_numbers_locales_locale_parent_id_unique" ON "about_numbers_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_final_section_image_idx" ON "about_final_section" USING btree ("image_id");
  CREATE INDEX "about_final_section_mobile_image_idx" ON "about_final_section" USING btree ("mobile_image_id");
  CREATE UNIQUE INDEX "about_final_section_locales_locale_parent_id_unique" ON "about_final_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_hero_parallax_images_order_idx" ON "home_hero_parallax_images" USING btree ("_order");
  CREATE INDEX "home_hero_parallax_images_parent_id_idx" ON "home_hero_parallax_images" USING btree ("_parent_id");
  CREATE INDEX "home_hero_parallax_images_image_idx" ON "home_hero_parallax_images" USING btree ("image_id");
  CREATE INDEX "home_hero_poster_idx" ON "home_hero" USING btree ("poster_id");
  CREATE INDEX "home_hero_mobile_poster_idx" ON "home_hero" USING btree ("mobile_poster_id");
  CREATE INDEX "home_hero_bottle_image_idx" ON "home_hero" USING btree ("bottle_image_id");
  CREATE INDEX "home_hero_mobile_bottle_image_idx" ON "home_hero" USING btree ("mobile_bottle_image_id");
  CREATE UNIQUE INDEX "home_hero_locales_locale_parent_id_unique" ON "home_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "horizontal_scroll_box1_box1_image_idx" ON "horizontal_scroll" USING btree ("box1_image_id");
  CREATE INDEX "horizontal_scroll_box2_box2_image_idx" ON "horizontal_scroll" USING btree ("box2_image_id");
  CREATE INDEX "horizontal_scroll_box3_box3_image_idx" ON "horizontal_scroll" USING btree ("box3_image_id");
  CREATE INDEX "horizontal_scroll_box4_box4_image_idx" ON "horizontal_scroll" USING btree ("box4_image_id");
  CREATE INDEX "horizontal_scroll_box5_box5_video_idx" ON "horizontal_scroll" USING btree ("box5_video_id");
  CREATE INDEX "horizontal_scroll_box5_box5_cover_image_idx" ON "horizontal_scroll" USING btree ("box5_cover_image_id");
  CREATE INDEX "horizontal_scroll_box6_box6_image_idx" ON "horizontal_scroll" USING btree ("box6_image_id");
  CREATE UNIQUE INDEX "horizontal_scroll_locales_locale_parent_id_unique" ON "horizontal_scroll_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "our_collection_items_order_idx" ON "our_collection_items" USING btree ("_order");
  CREATE INDEX "our_collection_items_parent_id_idx" ON "our_collection_items" USING btree ("_parent_id");
  CREATE INDEX "our_collection_items_image_idx" ON "our_collection_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "our_collection_items_locales_locale_parent_id_unique" ON "our_collection_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "our_collection_locales_locale_parent_id_unique" ON "our_collection_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_story_image_idx" ON "home_story" USING btree ("image_id");
  CREATE UNIQUE INDEX "home_story_locales_locale_parent_id_unique" ON "home_story_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_cta_banner_image_idx" ON "home_cta_banner" USING btree ("image_id");
  CREATE INDEX "home_cta_banner_mobile_image_idx" ON "home_cta_banner" USING btree ("mobile_image_id");
  CREATE UNIQUE INDEX "home_cta_banner_locales_locale_parent_id_unique" ON "home_cta_banner_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_brand_statement_locales_locale_parent_id_unique" ON "home_brand_statement_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "article_labels_locales_locale_parent_id_unique" ON "article_labels_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "product_detail_labels_locales_locale_parent_id_unique" ON "product_detail_labels_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "vacancy_labels_locales_locale_parent_id_unique" ON "vacancy_labels_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "product_categories" CASCADE;
  DROP TABLE "product_categories_locales" CASCADE;
  DROP TABLE "products_nutrition" CASCADE;
  DROP TABLE "products_nutrition_locales" CASCADE;
  DROP TABLE "products_volumes" CASCADE;
  DROP TABLE "products_photos" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "article_categories" CASCADE;
  DROP TABLE "article_categories_locales" CASCADE;
  DROP TABLE "articles_images" CASCADE;
  DROP TABLE "articles_body" CASCADE;
  DROP TABLE "articles_body_locales" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "articles_locales" CASCADE;
  DROP TABLE "vacancy_departments" CASCADE;
  DROP TABLE "vacancy_departments_locales" CASCADE;
  DROP TABLE "vacancies_responsibilities" CASCADE;
  DROP TABLE "vacancies_responsibilities_locales" CASCADE;
  DROP TABLE "vacancies_requirements" CASCADE;
  DROP TABLE "vacancies_requirements_locales" CASCADE;
  DROP TABLE "vacancies_nice_to_have" CASCADE;
  DROP TABLE "vacancies_nice_to_have_locales" CASCADE;
  DROP TABLE "vacancies_benefits" CASCADE;
  DROP TABLE "vacancies_benefits_locales" CASCADE;
  DROP TABLE "vacancies" CASCADE;
  DROP TABLE "vacancies_locales" CASCADE;
  DROP TABLE "cv_documents" CASCADE;
  DROP TABLE "contact_submissions" CASCADE;
  DROP TABLE "vacancy_applications" CASCADE;
  DROP TABLE "exports" CASCADE;
  DROP TABLE "exports_texts" CASCADE;
  DROP TABLE "imports" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_metadata_website_json_ld_alternate_names" CASCADE;
  DROP TABLE "site_metadata" CASCADE;
  DROP TABLE "site_metadata_locales" CASCADE;
  DROP TABLE "contact_info_phones" CASCADE;
  DROP TABLE "contact_info" CASCADE;
  DROP TABLE "contact_info_locales" CASCADE;
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
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "about_page_locales" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "forms_locales" CASCADE;
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
  DROP TABLE "about_final_section" CASCADE;
  DROP TABLE "about_final_section_locales" CASCADE;
  DROP TABLE "home_hero_parallax_images" CASCADE;
  DROP TABLE "home_hero" CASCADE;
  DROP TABLE "home_hero_locales" CASCADE;
  DROP TABLE "horizontal_scroll" CASCADE;
  DROP TABLE "horizontal_scroll_locales" CASCADE;
  DROP TABLE "our_collection_items" CASCADE;
  DROP TABLE "our_collection_items_locales" CASCADE;
  DROP TABLE "our_collection" CASCADE;
  DROP TABLE "our_collection_locales" CASCADE;
  DROP TABLE "home_story" CASCADE;
  DROP TABLE "home_story_locales" CASCADE;
  DROP TABLE "home_cta_banner" CASCADE;
  DROP TABLE "home_cta_banner_locales" CASCADE;
  DROP TABLE "home_brand_statement" CASCADE;
  DROP TABLE "home_brand_statement_locales" CASCADE;
  DROP TABLE "article_labels" CASCADE;
  DROP TABLE "article_labels_locales" CASCADE;
  DROP TABLE "product_detail_labels" CASCADE;
  DROP TABLE "product_detail_labels_locales" CASCADE;
  DROP TABLE "vacancy_labels" CASCADE;
  DROP TABLE "vacancy_labels_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_vacancies_type";
  DROP TYPE "public"."enum_contact_submissions_locale";
  DROP TYPE "public"."enum_exports_format";
  DROP TYPE "public"."enum_exports_sort_order";
  DROP TYPE "public"."enum_exports_locale";
  DROP TYPE "public"."enum_exports_drafts";
  DROP TYPE "public"."enum_imports_import_mode";
  DROP TYPE "public"."enum_imports_status";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
