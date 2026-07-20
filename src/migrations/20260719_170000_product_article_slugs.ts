import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "products_locales" ADD COLUMN "slug" varchar;
    ALTER TABLE "articles_locales" ADD COLUMN "slug" varchar;

    UPDATE "products_locales"
    SET "slug" = concat(
      coalesce(
        nullif(
          trim(both '-' from regexp_replace(lower("name"), '[^a-z0-9]+', '-', 'g')),
          ''
        ),
        'product'
      ),
      '-',
      "_parent_id"
    )
    WHERE "slug" IS NULL;

    UPDATE "articles_locales"
    SET "slug" = concat(
      coalesce(
        nullif(
          trim(both '-' from regexp_replace(lower("title"), '[^a-z0-9]+', '-', 'g')),
          ''
        ),
        'article'
      ),
      '-',
      "_parent_id"
    )
    WHERE "slug" IS NULL;

    ALTER TABLE "products_locales" ALTER COLUMN "slug" SET NOT NULL;
    ALTER TABLE "articles_locales" ALTER COLUMN "slug" SET NOT NULL;

    CREATE UNIQUE INDEX "products_locales_locale_slug_unique" ON "products_locales" USING btree ("_locale", "slug");
    CREATE UNIQUE INDEX "articles_locales_locale_slug_unique" ON "articles_locales" USING btree ("_locale", "slug");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX "products_locales_locale_slug_unique";
    DROP INDEX "articles_locales_locale_slug_unique";
    ALTER TABLE "products_locales" DROP COLUMN "slug";
    ALTER TABLE "articles_locales" DROP COLUMN "slug";
  `)
}
