# Rahatlyk Website - Deployment Guide

This is the deployment procedure for the Rahatlyk VPS setup. The normal release preserves the currently deployed PostgreSQL database: it synchronizes the new standalone application, restarts the service, and lets Payload `prodMigrations` apply only new migrations.

The normal release path is: sync the approved Windows source into the WSL build workspace, build the standalone application, copy the standalone output and assets to the VPS, and restart the systemd service. Payload `prodMigrations` runs pending migrations during `server.js` startup. Content snapshots are separate from schema migrations and are used only for fresh local/disposable databases or an explicitly approved content restore.

For a normal code-only release, use the build and application-file steps but do not overwrite the production database, media/, or cv/ unless explicitly intended.

## Prerequisites

- SSH access to ubuntu@216.250.12.102.
- Access to the active source repository and WSL build environment.
- Production environment file at /opt/rahatlyk/.env on the VPS.
- A recent backup of the database, media/, cv/, and .env.
- An approved deployment window and rollback point.

The systemd unit definition is installed on the VPS at /etc/systemd/system/rahatlyk.service. The deployment copies the standalone application files into /opt/rahatlyk; it does not store or replace the unit file in the repository.

The current verified backup is stored at /opt/backups/rahatlyk-live-20260916_074721.

The supplied deployment PDF references WSL path ~/projects/sarwan and Windows path C:\Users\90549\Desktop\wavy music\sarwan. The current repository path is C:\Users\90549\Desktop\Projects\sarwan. Confirm which copy is authoritative before starting.

## Environment files

There are two different environment contexts:

| File | Used for | Important detail |
| --- | --- | --- |
| WSL .env.local | Build time | NEXT_PUBLIC_* values are compiled into the client bundle |
| VPS /opt/rahatlyk/.env | Runtime | Server secrets and runtime configuration |

Required production values include:

    DATABASE_URI=postgresql://rahatlyk:<password>@localhost:5432/rahatlyk-website-db
    PAYLOAD_SECRET=<long-random-secret>
    NEXT_PUBLIC_SITE_URL=https://rahatlyk.com
    NEXT_APP_URL=https://rahatlyk.com
    REVALIDATION_SECRET=<long-random-secret>
    GMAIL_USER=<production-mailbox>
    GMAIL_APP_PASSWORD=<gmail-app-password>
    NOREPLY_EMAIL=<no-reply-address>
    WEBSITE_EMAIL=<website-address>

Never copy the production .env into the repository or a public deployment artifact.

## Critical build-time check

Immediately before npm run build, verify:

    grep NEXT_PUBLIC_SITE_URL ~/projects/sarwan/.env.local

The output must contain:

    NEXT_PUBLIC_SITE_URL=https://rahatlyk.com

Run this check again after any Windows-to-WSL sync. Changing the VPS runtime environment cannot repair a wrong NEXT_PUBLIC_SITE_URL already compiled into browser JavaScript.

## Schema migration workflow

The repository must contain `package.json`, `payload.config.ts`, `src/migrations/`, and the source files imported by the Payload config when migrations are created or checked locally. Production uses Payload `prodMigrations`, so the migration registry is bundled into the standalone server at build time and does not need to be copied separately to `/opt/rahatlyk`.

When a collection, global, field, relationship, or field type changes:

1. Make the configuration change locally.
2. Generate a migration with `npm run db:migrate:create -- change-name`.
3. Review the generated migration and `src/migrations/index.ts`.
4. Run `npm run db:migrate:status` against a disposable database.
5. Commit the migration and configuration changes together.
6. Build and deploy the matching application revision.
7. Restart `rahatlyk.service`; Payload runs pending production migrations while `server.js` starts.

Payload records completed migrations, so startup applies only migrations missing from the deployment database. Back up the database first. Never use `migrate:fresh`, `migrate:reset`, or `migrate:refresh` on production.

The committed `20260916_091702_baseline` migration is intended for a new empty database. The existing production database was historically created with Payload push mode and may contain the schema while lacking this migration-history entry. Verify `npm run db:migrate:status` before the first migration-based release; if the baseline shows `No` on an already-populated matching database, do not run it blindly. Complete a one-time approved migration-history baseline procedure, then use normal pending-migration runs for all later releases.

The current VPS database has completed that one-time reconciliation: `payload_migrations` contains `20260916_091702_baseline` with batch `1`. Future standalone deployments should therefore skip the baseline and apply only newer registered migrations at startup.

## Standard deployment using the current VPS database

Use this path for all normal releases:

1. Sync the approved Windows source into the WSL build workspace.
2. Re-check `NEXT_PUBLIC_SITE_URL` in the synced `.env.local`.
3. Run `npm ci` when dependencies changed, then run `npm run build`.
4. Copy `.next/standalone/` and `.next/static/` to `/opt/rahatlyk`. The VPS `public/` folder is preserved when its contents have not changed; synchronize `public/` only when the release changes public assets, and do not use `--delete` for routine deployments.
5. Preserve `/opt/rahatlyk/.env`, `/opt/rahatlyk/media/`, `/opt/rahatlyk/cv/`, and the production database.
6. Restart `rahatlyk.service`.
7. Payload runs bundled `prodMigrations` while `server.js` starts. Only migrations not recorded in `payload_migrations` are applied.
8. Check `journalctl -u rahatlyk` for migration and startup errors, then perform the browser checks.

## Routine code-only deployment

1. Confirm rollback availability.
2. Sync the approved Windows source into the WSL build workspace.
3. Build from the same approved source with the correct NEXT_PUBLIC_SITE_URL.
4. Copy `.next/standalone/` and `.next/static/`. Copy `public/` only when public assets changed; otherwise preserve the existing VPS folder.
5. Do not overwrite /opt/rahatlyk/.env, media/, cv/, or the database.
6. Restart rahatlyk.service; startup runs pending `prodMigrations`.
7. Confirm migration/startup output in `journalctl`, then run the browser and log checks above.

## Rollback

- Code only: restore the previous standalone build and restart the service.
- Database: restore the matching database backup after resetting the schema.
- Uploaded files: restore the matching media/ and cv/ backup folders.
- Environment: restore the backed-up .env only after reviewing changes.

Never combine a database from one release with unrelated media/ or cv/ folders unless file references have been verified.
