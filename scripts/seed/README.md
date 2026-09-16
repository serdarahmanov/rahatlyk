# Seed and Content Snapshot Tools

These scripts are for local development, staging, and controlled recovery only. They are not part of the production standalone runtime and must not be run against the live VPS database.

They are content tools, not schema tools. Run Payload migrations first so the target database matches the checked-out Payload configuration.

## Canonical current-content workflow

The current production public text is stored in:

    scripts/seed/data/current-public-content.json

To refresh the snapshot from an authorized source database:

    npm run seed:export-current-content

To create the schema in a new database, run the committed migrations from the project root:

    npm run db:migrate

Then import the snapshot into a local or disposable database:

    SEED_TARGET=local npm run seed:current-content

PowerShell equivalent:

    $env:SEED_TARGET = 'local'
    npm.cmd run seed:current-content

The snapshot contains public collections and globals with all three locales, plus the referenced media filenames and relative paths. Array-row IDs are preserved because Payload uses them to keep localized child fields attached to the same row across locales. Top-level document IDs, timestamps, relationships, and media IDs are not portable. Copy the referenced files with the same relative paths (normally under `media/`) to the target project before importing. The importer reuses a target Media document by stable alt text, exact filename, Payload-renamed filename variant, or matching file content, so existing media is not uploaded again. On a first import into an empty database where the canonical files already exist on disk, it creates the record with `filePath` and immediately updates it with `overwriteExistingFiles: true`; this preserves names such as `1.webp` instead of creating `1-1.webp`. Existing Media documents are not otherwise updated. Users, contact submissions, vacancy applications, CV documents, and secrets are excluded.

The importer uses slugs for product, article, and vacancy relationships rather than database-specific numeric IDs. It upserts content but does not delete records absent from the snapshot. It refuses to run unless SEED_TARGET=local is set.

After importing while the Next.js app is stopped, restart the app (or run the revalidation endpoint) before checking cached pages. If the importer logs revalidation connection errors, the database writes can still succeed, but the frontend cache will not be invalidated automatically.
