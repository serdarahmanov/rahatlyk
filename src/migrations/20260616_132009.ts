import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "products_features_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_nutrition_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_locales" (
  	"name" varchar NOT NULL,
  	"tagline" varchar,
  	"description" varchar,
  	"long_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "articles_body_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "articles_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "vacancies_responsibilities_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "vacancies_requirements_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "vacancies_nice_to_have_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "vacancies_benefits_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "vacancies_locales" (
  	"title" varchar NOT NULL,
  	"location" varchar,
  	"overview" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "products_features_locales" ADD CONSTRAINT "products_features_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_nutrition_locales" ADD CONSTRAINT "products_nutrition_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_nutrition"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_body_locales" ADD CONSTRAINT "articles_body_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles_body"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_locales" ADD CONSTRAINT "articles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vacancies_responsibilities_locales" ADD CONSTRAINT "vacancies_responsibilities_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vacancies_responsibilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vacancies_requirements_locales" ADD CONSTRAINT "vacancies_requirements_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vacancies_requirements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vacancies_nice_to_have_locales" ADD CONSTRAINT "vacancies_nice_to_have_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vacancies_nice_to_have"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vacancies_benefits_locales" ADD CONSTRAINT "vacancies_benefits_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vacancies_benefits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vacancies_locales" ADD CONSTRAINT "vacancies_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vacancies"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "products_features_locales_locale_parent_id_unique" ON "products_features_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "products_nutrition_locales_locale_parent_id_unique" ON "products_nutrition_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "articles_body_locales_locale_parent_id_unique" ON "articles_body_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "articles_locales_locale_parent_id_unique" ON "articles_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "vacancies_responsibilities_locales_locale_parent_id_unique" ON "vacancies_responsibilities_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "vacancies_requirements_locales_locale_parent_id_unique" ON "vacancies_requirements_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "vacancies_nice_to_have_locales_locale_parent_id_unique" ON "vacancies_nice_to_have_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "vacancies_benefits_locales_locale_parent_id_unique" ON "vacancies_benefits_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "vacancies_locales_locale_parent_id_unique" ON "vacancies_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "products_features" DROP COLUMN "text";
  ALTER TABLE "products_nutrition" DROP COLUMN "label";
  ALTER TABLE "products" DROP COLUMN "name";
  ALTER TABLE "products" DROP COLUMN "tagline";
  ALTER TABLE "products" DROP COLUMN "description";
  ALTER TABLE "products" DROP COLUMN "long_description";
  ALTER TABLE "articles_body" DROP COLUMN "text";
  ALTER TABLE "articles" DROP COLUMN "title";
  ALTER TABLE "vacancies_responsibilities" DROP COLUMN "text";
  ALTER TABLE "vacancies_requirements" DROP COLUMN "text";
  ALTER TABLE "vacancies_nice_to_have" DROP COLUMN "text";
  ALTER TABLE "vacancies_benefits" DROP COLUMN "text";
  ALTER TABLE "vacancies" DROP COLUMN "title";
  ALTER TABLE "vacancies" DROP COLUMN "location";
  ALTER TABLE "vacancies" DROP COLUMN "overview";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "products_features_locales" CASCADE;
  DROP TABLE "products_nutrition_locales" CASCADE;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "articles_body_locales" CASCADE;
  DROP TABLE "articles_locales" CASCADE;
  DROP TABLE "vacancies_responsibilities_locales" CASCADE;
  DROP TABLE "vacancies_requirements_locales" CASCADE;
  DROP TABLE "vacancies_nice_to_have_locales" CASCADE;
  DROP TABLE "vacancies_benefits_locales" CASCADE;
  DROP TABLE "vacancies_locales" CASCADE;
  ALTER TABLE "products_features" ADD COLUMN "text" varchar NOT NULL;
  ALTER TABLE "products_nutrition" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "products" ADD COLUMN "name" varchar NOT NULL;
  ALTER TABLE "products" ADD COLUMN "tagline" varchar;
  ALTER TABLE "products" ADD COLUMN "description" varchar;
  ALTER TABLE "products" ADD COLUMN "long_description" varchar;
  ALTER TABLE "articles_body" ADD COLUMN "text" varchar NOT NULL;
  ALTER TABLE "articles" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "vacancies_responsibilities" ADD COLUMN "text" varchar NOT NULL;
  ALTER TABLE "vacancies_requirements" ADD COLUMN "text" varchar NOT NULL;
  ALTER TABLE "vacancies_nice_to_have" ADD COLUMN "text" varchar NOT NULL;
  ALTER TABLE "vacancies_benefits" ADD COLUMN "text" varchar NOT NULL;
  ALTER TABLE "vacancies" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "vacancies" ADD COLUMN "location" varchar;
  ALTER TABLE "vacancies" ADD COLUMN "overview" varchar;`)
}
