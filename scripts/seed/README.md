# Seed and Content Snapshot Tools

These scripts are for local development, staging, and controlled recovery only. They are not part of the production standalone runtime and must not be run against the live VPS database.

## Canonical current-content workflow

The current production public text is stored in:

    scripts/seed/data/current-public-content.json

To refresh the snapshot from an authorized local database:

    npm run seed:export-current-content

To import the snapshot into a local or disposable database:

    SEED_TARGET=local npm run seed:current-content

PowerShell equivalent:

    $env:SEED_TARGET = 'local'
    npm.cmd run seed:current-content

The snapshot contains public collections and globals with all three locales. It intentionally excludes media, media IDs/URLs, users, contact submissions, vacancy applications, CV documents, and secrets. Upload media separately in the target environment.

The importer uses slugs for product, article, and vacancy relationships rather than database-specific numeric IDs. It refuses to run unless SEED_TARGET=local is set.
