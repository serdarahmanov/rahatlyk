import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "horizontal_scroll" DROP CONSTRAINT "horizontal_scroll_box5_image_id_media_id_fk";
  
  DROP INDEX "horizontal_scroll_box5_box5_image_idx";
  ALTER TABLE "horizontal_scroll" ADD COLUMN "box5_video_id" integer;
  ALTER TABLE "horizontal_scroll" ADD COLUMN "box5_cover_image_id" integer;
  ALTER TABLE "horizontal_scroll" ADD CONSTRAINT "horizontal_scroll_box5_video_id_media_id_fk" FOREIGN KEY ("box5_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "horizontal_scroll" ADD CONSTRAINT "horizontal_scroll_box5_cover_image_id_media_id_fk" FOREIGN KEY ("box5_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "horizontal_scroll_box5_box5_video_idx" ON "horizontal_scroll" USING btree ("box5_video_id");
  CREATE INDEX "horizontal_scroll_box5_box5_cover_image_idx" ON "horizontal_scroll" USING btree ("box5_cover_image_id");
  ALTER TABLE "horizontal_scroll" DROP COLUMN "box5_image_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "horizontal_scroll" DROP CONSTRAINT "horizontal_scroll_box5_video_id_media_id_fk";
  
  ALTER TABLE "horizontal_scroll" DROP CONSTRAINT "horizontal_scroll_box5_cover_image_id_media_id_fk";
  
  DROP INDEX "horizontal_scroll_box5_box5_video_idx";
  DROP INDEX "horizontal_scroll_box5_box5_cover_image_idx";
  ALTER TABLE "horizontal_scroll" ADD COLUMN "box5_image_id" integer;
  ALTER TABLE "horizontal_scroll" ADD CONSTRAINT "horizontal_scroll_box5_image_id_media_id_fk" FOREIGN KEY ("box5_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "horizontal_scroll_box5_box5_image_idx" ON "horizontal_scroll" USING btree ("box5_image_id");
  ALTER TABLE "horizontal_scroll" DROP COLUMN "box5_video_id";
  ALTER TABLE "horizontal_scroll" DROP COLUMN "box5_cover_image_id";`)
}
