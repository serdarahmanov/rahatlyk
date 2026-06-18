import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "contact_info_phones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"number" varchar NOT NULL
  );
  
  CREATE TABLE "contact_info" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_info_locales" (
  	"address" varchar,
  	"working_hours" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "horizontal_scroll" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"box1_image_id" integer,
  	"box3_image_id" integer,
  	"box4_button_href" varchar,
  	"box5_image_id" integer,
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
  
  ALTER TABLE "contact_info_phones" ADD CONSTRAINT "contact_info_phones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_info"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_info_locales" ADD CONSTRAINT "contact_info_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_info"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "horizontal_scroll" ADD CONSTRAINT "horizontal_scroll_box1_image_id_media_id_fk" FOREIGN KEY ("box1_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "horizontal_scroll" ADD CONSTRAINT "horizontal_scroll_box3_image_id_media_id_fk" FOREIGN KEY ("box3_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "horizontal_scroll" ADD CONSTRAINT "horizontal_scroll_box5_image_id_media_id_fk" FOREIGN KEY ("box5_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "horizontal_scroll_locales" ADD CONSTRAINT "horizontal_scroll_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."horizontal_scroll"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_story" ADD CONSTRAINT "home_story_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_story_locales" ADD CONSTRAINT "home_story_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_cta_banner_locales" ADD CONSTRAINT "home_cta_banner_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_cta_banner"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "contact_info_phones_order_idx" ON "contact_info_phones" USING btree ("_order");
  CREATE INDEX "contact_info_phones_parent_id_idx" ON "contact_info_phones" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "contact_info_locales_locale_parent_id_unique" ON "contact_info_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "horizontal_scroll_box1_box1_image_idx" ON "horizontal_scroll" USING btree ("box1_image_id");
  CREATE INDEX "horizontal_scroll_box3_box3_image_idx" ON "horizontal_scroll" USING btree ("box3_image_id");
  CREATE INDEX "horizontal_scroll_box5_box5_image_idx" ON "horizontal_scroll" USING btree ("box5_image_id");
  CREATE UNIQUE INDEX "horizontal_scroll_locales_locale_parent_id_unique" ON "horizontal_scroll_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_story_image_idx" ON "home_story" USING btree ("image_id");
  CREATE UNIQUE INDEX "home_story_locales_locale_parent_id_unique" ON "home_story_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_cta_banner_locales_locale_parent_id_unique" ON "home_cta_banner_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "contact_info_phones" CASCADE;
  DROP TABLE "contact_info" CASCADE;
  DROP TABLE "contact_info_locales" CASCADE;
  DROP TABLE "horizontal_scroll" CASCADE;
  DROP TABLE "horizontal_scroll_locales" CASCADE;
  DROP TABLE "home_story" CASCADE;
  DROP TABLE "home_story_locales" CASCADE;
  DROP TABLE "home_cta_banner" CASCADE;
  DROP TABLE "home_cta_banner_locales" CASCADE;`)
}
