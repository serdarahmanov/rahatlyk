# Rahatlyk Website - Operations Runbook

This runbook covers normal operation, monitoring, content administration, and first-response troubleshooting after handoff.

## Service operations

The application runs as rahatlyk.service under systemd from /opt/rahatlyk.

The service definition is stored on the VPS at /etc/systemd/system/rahatlyk.service, outside the application repository. Inspect the effective unit with:

    sudo systemctl show rahatlyk.service -p FragmentPath
    sudo systemctl cat rahatlyk.service

    sudo systemctl status rahatlyk -l --no-pager
    sudo systemctl restart rahatlyk
    sudo systemctl stop rahatlyk
    sudo journalctl -u rahatlyk -n 100 --no-pager
    sudo journalctl -u rahatlyk -f
    sudo ss -ltnp | grep 3000
    curl -I http://localhost:3000

Use restart after a successful deployment or approved configuration change. Use stop only during maintenance or a controlled deployment.

## Nginx and public health checks

Nginx terminates HTTPS and proxies requests to the local Next.js process:

    curl -I http://localhost:3000
    curl -I https://rahatlyk.com
    curl -I https://www.rahatlyk.com

If localhost works but the public domain fails, inspect Nginx, DNS, TLS certificates, and firewall rules. If both fail, inspect systemd logs and the application environment first.

## Payload CMS operations

Payload admin is available at:

    https://rahatlyk.com/admin

Content editors can manage localized page content, navigation, footer, labels, products, articles, vacancies, contact information, and media through Payload. After saving content, check the public page in each affected locale.

If an admin save succeeds but the public page is stale:

1. Check that the service is running.
2. Check NEXT_APP_URL and REVALIDATION_SECRET in /opt/rahatlyk/.env.
3. Inspect journalctl -u rahatlyk for revalidation errors.
4. Revalidate or restart using the approved operational procedure.
5. Do not immediately reseed content; stale cache is not evidence that the database write failed.

## Database and file backups

Back up these items together:

    /opt/rahatlyk/.env
    /opt/rahatlyk/media/
    /opt/rahatlyk/cv/
    PostgreSQL database rahatlyk-website-db

Store backups outside the live application folder and retain multiple dated restore points. Test restoration periodically on a non-production database or isolated environment.

The database contains references to filenames, not the complete uploaded files. A database-only backup is incomplete for this application.

The current verified production backup is:

    /opt/backups/rahatlyk-live-20260916_074721

It contains the database dump, deployed application build, media/, cv/, .env, and the systemd service definition.

## Common incidents

### Site is down after restart

Check:

    sudo systemctl status rahatlyk -l --no-pager
    sudo journalctl -u rahatlyk -n 100 --no-pager
    sudo ss -ltnp | grep 3000

Common causes include missing runtime .env, an unreachable PostgreSQL database, a bad standalone copy, incorrect file ownership, or a port conflict.

### Images or videos request localhost:3000

Cause: NEXT_PUBLIC_SITE_URL was wrong when the client bundle was built. The VPS runtime .env cannot fix a value already compiled into browser JavaScript.

Fix:

1. Set NEXT_PUBLIC_SITE_URL=https://rahatlyk.com in the build environment.
2. Remove .next and rebuild.
3. Copy the new standalone and static output to the VPS.
4. Restart rahatlyk.service.
5. Hard-refresh the browser and check the Network tab.

Also correct the source .env.local so the wrong value is not reintroduced by the next source sync.

### A media file returns 404

Check the exact filename in PostgreSQL and on disk:

    psql "$DB_URL" -c "SELECT id, filename, url FROM media LIMIT 5;" | cat
    find /opt/rahatlyk/media -iname "*keyword*"

Payload metadata and filesystem files must agree in filename and location. Verify case carefully because Linux filesystems are case-sensitive.

### curl -I reports a media 404 but the browser loads it

Some media handlers do not implement HEAD exactly like GET. A HEAD-only 404 is not conclusive. Test the real browser URL or use a GET request before diagnosing a missing file.

### PostgreSQL restore reports ownership errors

Do not use pg_restore --clean against a schema with a different owner history. Drop and recreate the public schema, then restore with --no-owner --no-acl as described in DEPLOYMENT.md.

### Database URL appears malformed or connects as the wrong user

The production DATABASE_URI may be wrapped in quotes. Strip them before use:

    DB_URL=$(grep '^DATABASE_URI=' /opt/rahatlyk/.env | cut -d= -f2- | tr -d "'\"")
    echo "$DB_URL"

Do not paste the resulting password into tickets, chat, or logs.

### Contact or vacancy email fails

Check:

- GMAIL_USER and GMAIL_APP_PASSWORD are present in the runtime environment;
- Gmail app-password access is still valid;
- NOREPLY_EMAIL and WEBSITE_EMAIL are valid addresses;
- systemd logs show the actual Nodemailer error; and
- the form request is reaching the application.

Do not disable TLS verification as a permanent fix. If the issue occurs only on a local machine and not production, record it separately from a production incident.

## Security rules

- Keep /opt/rahatlyk/.env readable only by the service owner and authorized administrators.
- Keep the VPS, systemd, Nginx, PostgreSQL, Node, and OS packages patched.
- Do not expose PostgreSQL publicly; the application connects through localhost.
- Do not expose /opt/rahatlyk/cv as a static public directory.
- Keep Payload admin accounts individual; do not share one administrator login.
- Rotate credentials through the approved secret-management process, not by editing tracked files.
- Treat database dumps as confidential because they can contain customer submissions and other personal data.

## Responsibility matrix

| Activity | Recommended owner |
| --- | --- |
| Page text, labels, products, articles, vacancies | Content editor / marketing |
| Payload users and access | Client IT administrator |
| VPS, Nginx, systemd, PostgreSQL, backups | Client IT administrator |
| Code changes and releases | Development team / approved maintainer |
| Domain and TLS renewal | Domain/VPS administrator |
| Gmail mailbox and app password | Email administrator |

## Incident handoff checklist

When opening an incident, include:

- UTC timestamp and affected URL;
- whether all locales or one locale are affected;
- whether /admin and http://localhost:3000 respond;
- recent systemctl status output without secrets;
- relevant journalctl lines without secrets or personal data;
- browser console/network error text;
- the last deployment or content change; and
- whether the issue concerns code, database data, or uploaded files.

## Handoff acceptance checklist

- [ ] Client IT can SSH to the VPS.
- [ ] Client IT can inspect and restart rahatlyk.service.
- [ ] Client IT can inspect Nginx and PostgreSQL health.
- [ ] Production .env is stored in the client's approved secret manager.
- [ ] A tested backup exists for database, media, CV files, and environment.
- [ ] Payload admin ownership and individual accounts are assigned.
- [ ] A code repository owner and deployment approver are assigned.
- [ ] The client has received the current source path and knows the older PDF path may be stale.
- [ ] The client has completed one supervised rollback or restore drill.
