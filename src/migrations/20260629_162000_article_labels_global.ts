import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "article_labels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE IF NOT EXISTS "article_labels_locales" (
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

  ALTER TABLE "article_labels_locales" DROP CONSTRAINT IF EXISTS "article_labels_locales_parent_id_fk";
  ALTER TABLE "article_labels_locales" ADD CONSTRAINT "article_labels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."article_labels"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX IF NOT EXISTS "article_labels_locales_locale_parent_id_unique" ON "article_labels_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE IF EXISTS "article_labels_locales" CASCADE;
  DROP TABLE IF EXISTS "article_labels" CASCADE;`)
}
