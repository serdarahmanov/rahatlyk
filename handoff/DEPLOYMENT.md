# Rahatlyk Website - Deployment Guide

This is the standard fresh-deployment procedure for the Rahatlyk VPS setup. A fresh deployment can replace application files, restore the database, and synchronize uploaded files. It is a controlled change, not a routine code-only update.

For a normal code-only release, use the build and application-file steps but do not overwrite the production database, media/, or cv/ unless explicitly intended.

## Prerequisites

- SSH access to ubuntu@216.250.12.102.
- Access to the active source repository and WSL build environment.
- Docker running locally if a local PostgreSQL dump is required.
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

## Fresh deployment procedure

### 1. Confirm source and back up production

Confirm the active source path, database source, and target. On the VPS, create a dated backup directory and ensure it is writable by the deployment user:

    ssh ubuntu@216.250.12.102
    sudo mkdir -p /opt/backups/rahatlyk-fresh-before-YYYYMMDD_HHMM
    sudo chown -R ubuntu:ubuntu /opt/backups/rahatlyk-fresh-before-YYYYMMDD_HHMM

Back up:

- /opt/rahatlyk/.env
- /opt/rahatlyk/media/
- /opt/rahatlyk/cv/
- a PostgreSQL dump of rahatlyk-website-db

Record and verify the backup directory before clearing or restoring anything.

The currently verified backup set is /opt/backups/rahatlyk-live-20260916_074721. New backups should use a new timestamped folder and should not overwrite this verified restore point until the replacement has been checked.

### 2. Build from the approved source

After confirming the source folder:

    cd ~/projects/sarwan
    grep NEXT_PUBLIC_SITE_URL .env.local
    rm -rf node_modules .next
    npm ci
    npm run lint
    npm run build

Expect successful compilation and generated standalone output. If the build needs database access, confirm PostgreSQL is reachable before treating a failure as an application issue.

### 3. Create and verify the database dump

For the local Docker PostgreSQL setup:

    cd "C:\Users\90549\Desktop\Projects\sarwan"
    docker exec rahatlyk-postgres pg_dump -U rahatlyk -d rahatlyk-website-db -Fc --no-owner -f /tmp/rahatlyk.dump
    docker cp rahatlyk-postgres:/tmp/rahatlyk.dump .\rahatlyk.dump

In WSL:

    file rahatlyk.dump

It should identify a PostgreSQL custom database dump. Do not use PowerShell output redirection directly on pg_dump for this workflow.

### 4. Upload the dump and prepare the VPS

    scp ~/projects/sarwan/rahatlyk.dump ubuntu@216.250.12.102:/tmp/rahatlyk.dump
    ssh ubuntu@216.250.12.102
    sudo systemctl stop rahatlyk

Before clearing anything, verify that the backup from step 1 exists. Preserve /opt/rahatlyk/.env.

### 5. Restore the database

If DATABASE_URI is quoted in the production .env, extract it without quotes:

    DB_URL=$(grep '^DATABASE_URI=' /opt/rahatlyk/.env | cut -d= -f2- | tr -d "'\"")

For a full fresh restore:

    sudo -u postgres psql -d "rahatlyk-website-db" -c "DROP SCHEMA public CASCADE;"
    sudo -u postgres psql -d "rahatlyk-website-db" -c "CREATE SCHEMA public AUTHORIZATION rahatlyk;"
    sudo -u postgres psql -d "rahatlyk-website-db" -c "GRANT ALL ON SCHEMA public TO rahatlyk;"
    sudo -u postgres psql -d "rahatlyk-website-db" -c "GRANT ALL ON SCHEMA public TO public;"
    pg_restore --no-owner --no-acl --dbname="$DB_URL" /tmp/rahatlyk.dump

Do not use pg_restore --clean against a schema with different ownership history; it can produce must-be-owner errors.

### 6. Copy the standalone build and assets

From WSL:

    cd ~/projects/sarwan
    rsync -avz --progress .next/standalone/ ubuntu@216.250.12.102:/opt/rahatlyk/
    rsync -avz --delete --progress .next/static/ ubuntu@216.250.12.102:/opt/rahatlyk/.next/static/
    rsync -avz --delete --progress public/ ubuntu@216.250.12.102:/opt/rahatlyk/public/

Only synchronize media/ and cv/ when the local copies are intentionally the source of truth:

    rsync -avz --delete --progress media/ ubuntu@216.250.12.102:/opt/rahatlyk/media/
    rsync -avz --delete --progress cv/ ubuntu@216.250.12.102:/opt/rahatlyk/cv/

The --delete option removes destination files not present in the source. Do not use it for routine code-only deployments if the VPS may contain newer uploads.

### 7. Restart and verify

    ssh ubuntu@216.250.12.102
    sudo chown -R ubuntu:ubuntu /opt/rahatlyk
    sudo systemctl restart rahatlyk
    sudo systemctl status rahatlyk -l --no-pager
    sudo ss -ltnp | grep 3000
    curl -I http://localhost:3000
    curl -I https://rahatlyk.com

To confirm which unit file systemd is using:

    sudo systemctl show rahatlyk.service -p FragmentPath
    sudo systemctl cat rahatlyk.service

Browser checks must cover all three locales, admin login, forms, images, videos, and the site icon. Check for localhost URLs, mixed-content errors, chunk errors, and media 404s.

If the service fails:

    sudo journalctl -u rahatlyk -n 100 --no-pager
    sudo journalctl -u rahatlyk -f

## Routine code-only deployment

1. Confirm rollback availability.
2. Build from the approved source with the correct NEXT_PUBLIC_SITE_URL.
3. Copy .next/standalone, .next/static, and public/.
4. Do not overwrite /opt/rahatlyk/.env, media/, cv/, or the database.
5. Restart rahatlyk.service.
6. Run the browser and log checks above.

## Rollback

- Code only: restore the previous standalone build and restart the service.
- Database: restore the matching database backup after resetting the schema.
- Uploaded files: restore the matching media/ and cv/ backup folders.
- Environment: restore the backed-up .env only after reviewing changes.

Never combine a database from one release with unrelated media/ or cv/ folders unless file references have been verified.
