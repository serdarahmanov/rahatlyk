import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "products_nutrition_locales" (
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "product_detail_labels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "product_detail_labels_locales" (
  	"size_label" varchar,
  	"nutrition_label" varchar,
  	"about_label" varchar,
  	"mineral_label" varchar,
  	"per_litre_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "about_our_story_locales" ADD COLUMN "section_label" varchar;
  ALTER TABLE "home_hero" ADD COLUMN "poster_id" integer;
  ALTER TABLE "products_nutrition_locales" ADD CONSTRAINT "products_nutrition_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_nutrition"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_detail_labels_locales" ADD CONSTRAINT "product_detail_labels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_detail_labels"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "products_nutrition_locales_locale_parent_id_unique" ON "products_nutrition_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "product_detail_labels_locales_locale_parent_id_unique" ON "product_detail_labels_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "home_hero" ADD CONSTRAINT "home_hero_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_hero_poster_idx" ON "home_hero" USING btree ("poster_id");
  ALTER TABLE "products_nutrition" DROP COLUMN "label";
  ALTER TABLE "products_nutrition" DROP COLUMN "value";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products_nutrition_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "product_detail_labels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "product_detail_labels_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "products_nutrition_locales" CASCADE;
  DROP TABLE "product_detail_labels" CASCADE;
  DROP TABLE "product_detail_labels_locales" CASCADE;
  ALTER TABLE "home_hero" DROP CONSTRAINT "home_hero_poster_id_media_id_fk";
  
  DROP INDEX "home_hero_poster_idx";
  ALTER TABLE "products_nutrition" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "products_nutrition" ADD COLUMN "value" varchar NOT NULL;
  ALTER TABLE "about_our_story_locales" DROP COLUMN "section_label";
  ALTER TABLE "home_hero" DROP COLUMN "poster_id";`)
}
