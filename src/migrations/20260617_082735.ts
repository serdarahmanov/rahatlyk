import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "horizontal_scroll" ADD COLUMN "box2_image_id" integer;
  ALTER TABLE "horizontal_scroll" ADD COLUMN "box6_image_id" integer;
  ALTER TABLE "horizontal_scroll" ADD CONSTRAINT "horizontal_scroll_box2_image_id_media_id_fk" FOREIGN KEY ("box2_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "horizontal_scroll" ADD CONSTRAINT "horizontal_scroll_box6_image_id_media_id_fk" FOREIGN KEY ("box6_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "horizontal_scroll_box2_box2_image_idx" ON "horizontal_scroll" USING btree ("box2_image_id");
  CREATE INDEX "horizontal_scroll_box6_box6_image_idx" ON "horizontal_scroll" USING btree ("box6_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "horizontal_scroll" DROP CONSTRAINT "horizontal_scroll_box2_image_id_media_id_fk";
  
  ALTER TABLE "horizontal_scroll" DROP CONSTRAINT "horizontal_scroll_box6_image_id_media_id_fk";
  
  DROP INDEX "horizontal_scroll_box2_box2_image_idx";
  DROP INDEX "horizontal_scroll_box6_box6_image_idx";
  ALTER TABLE "horizontal_scroll" DROP COLUMN "box2_image_id";
  ALTER TABLE "horizontal_scroll" DROP COLUMN "box6_image_id";`)
}
