import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_contact_submissions_locale" AS ENUM('en', 'ru', 'tm');
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
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "product_lines_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "cv_documents_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "contact_submissions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "vacancy_applications_id" integer;
  ALTER TABLE "product_lines" ADD CONSTRAINT "product_lines_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_lines_locales" ADD CONSTRAINT "product_lines_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_lines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vacancy_applications" ADD CONSTRAINT "vacancy_applications_vacancy_id_vacancies_id_fk" FOREIGN KEY ("vacancy_id") REFERENCES "public"."vacancies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vacancy_applications" ADD CONSTRAINT "vacancy_applications_cv_id_cv_documents_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."cv_documents"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "product_lines_key_idx" ON "product_lines" USING btree ("key");
  CREATE INDEX "product_lines_image_idx" ON "product_lines" USING btree ("image_id");
  CREATE INDEX "product_lines_updated_at_idx" ON "product_lines" USING btree ("updated_at");
  CREATE INDEX "product_lines_created_at_idx" ON "product_lines" USING btree ("created_at");
  CREATE UNIQUE INDEX "product_lines_locales_locale_parent_id_unique" ON "product_lines_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "cv_documents_updated_at_idx" ON "cv_documents" USING btree ("updated_at");
  CREATE INDEX "cv_documents_created_at_idx" ON "cv_documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "cv_documents_filename_idx" ON "cv_documents" USING btree ("filename");
  CREATE INDEX "contact_submissions_updated_at_idx" ON "contact_submissions" USING btree ("updated_at");
  CREATE INDEX "contact_submissions_created_at_idx" ON "contact_submissions" USING btree ("created_at");
  CREATE INDEX "vacancy_applications_vacancy_idx" ON "vacancy_applications" USING btree ("vacancy_id");
  CREATE INDEX "vacancy_applications_cv_idx" ON "vacancy_applications" USING btree ("cv_id");
  CREATE INDEX "vacancy_applications_updated_at_idx" ON "vacancy_applications" USING btree ("updated_at");
  CREATE INDEX "vacancy_applications_created_at_idx" ON "vacancy_applications" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_lines_fk" FOREIGN KEY ("product_lines_id") REFERENCES "public"."product_lines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cv_documents_fk" FOREIGN KEY ("cv_documents_id") REFERENCES "public"."cv_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk" FOREIGN KEY ("contact_submissions_id") REFERENCES "public"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vacancy_applications_fk" FOREIGN KEY ("vacancy_applications_id") REFERENCES "public"."vacancy_applications"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_product_lines_id_idx" ON "payload_locked_documents_rels" USING btree ("product_lines_id");
  CREATE INDEX "payload_locked_documents_rels_cv_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("cv_documents_id");
  CREATE INDEX "payload_locked_documents_rels_contact_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_vacancy_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("vacancy_applications_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "product_lines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "product_lines_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cv_documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_submissions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "vacancy_applications" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "product_lines" CASCADE;
  DROP TABLE "product_lines_locales" CASCADE;
  DROP TABLE "cv_documents" CASCADE;
  DROP TABLE "contact_submissions" CASCADE;
  DROP TABLE "vacancy_applications" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_product_lines_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_cv_documents_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_vacancy_applications_fk";
  
  DROP INDEX "payload_locked_documents_rels_product_lines_id_idx";
  DROP INDEX "payload_locked_documents_rels_cv_documents_id_idx";
  DROP INDEX "payload_locked_documents_rels_contact_submissions_id_idx";
  DROP INDEX "payload_locked_documents_rels_vacancy_applications_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "product_lines_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "cv_documents_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "contact_submissions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "vacancy_applications_id";
  DROP TYPE "public"."enum_contact_submissions_locale";`)
}
