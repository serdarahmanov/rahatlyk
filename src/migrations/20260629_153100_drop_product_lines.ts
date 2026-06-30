import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_product_lines_fk";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_product_lines_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "product_lines_id";
  DROP TABLE IF EXISTS "product_lines_locales" CASCADE;
  DROP TABLE IF EXISTS "product_lines" CASCADE;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "product_lines" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"image_id" integer,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "product_lines_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "product_lines_id" integer;
  ALTER TABLE "product_lines" DROP CONSTRAINT IF EXISTS "product_lines_image_id_media_id_fk";
  ALTER TABLE "product_lines" ADD CONSTRAINT "product_lines_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_lines_locales" DROP CONSTRAINT IF EXISTS "product_lines_locales_parent_id_fk";
  ALTER TABLE "product_lines_locales" ADD CONSTRAINT "product_lines_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_lines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_product_lines_fk";
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_lines_fk" FOREIGN KEY ("product_lines_id") REFERENCES "public"."product_lines"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX IF NOT EXISTS "product_lines_key_idx" ON "product_lines" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "product_lines_image_idx" ON "product_lines" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "product_lines_updated_at_idx" ON "product_lines" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "product_lines_created_at_idx" ON "product_lines" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "product_lines_locales_locale_parent_id_unique" ON "product_lines_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_product_lines_id_idx" ON "payload_locked_documents_rels" USING btree ("product_lines_id");`)
}
