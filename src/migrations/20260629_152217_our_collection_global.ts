import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "our_collection" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
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

  ALTER TABLE "our_collection_items" ADD CONSTRAINT "our_collection_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "our_collection_items" ADD CONSTRAINT "our_collection_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."our_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "our_collection_items_locales" ADD CONSTRAINT "our_collection_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."our_collection_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "our_collection_items_order_idx" ON "our_collection_items" USING btree ("_order");
  CREATE INDEX "our_collection_items_parent_id_idx" ON "our_collection_items" USING btree ("_parent_id");
  CREATE INDEX "our_collection_items_image_idx" ON "our_collection_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "our_collection_items_locales_locale_parent_id_unique" ON "our_collection_items_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "our_collection" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "our_collection_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "our_collection_items_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "our_collection_items_locales" CASCADE;
  DROP TABLE "our_collection_items" CASCADE;
  DROP TABLE "our_collection" CASCADE;`)
}
