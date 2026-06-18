import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "products_nutrition_locales" CASCADE;
  ALTER TABLE "products_nutrition" ADD COLUMN "label" varchar NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "products_nutrition_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "products_nutrition_locales" ADD CONSTRAINT "products_nutrition_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_nutrition"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "products_nutrition_locales_locale_parent_id_unique" ON "products_nutrition_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "products_nutrition" DROP COLUMN "label";`)
}
