# Rahatlyk Website - Architecture and Project Reference

This document is the starting point for the technical handoff of the Rahatlyk corporate website.

The project is a localized Next.js 15 website with Payload CMS embedded in the same application. PostgreSQL stores CMS records, while uploaded media and CV files are stored on the VPS filesystem.

## System overview

    Browser
      |
      | HTTPS: rahatlyk.com / www.rahatlyk.com
      v
    Nginx on VPS
      |
      | reverse proxy to http://localhost:3000
      v
    Next.js standalone server
      |
      +-- Public website: /, /en, /ru
      +-- Payload admin: /admin
      +-- Payload REST/API routes: /api
      |
      +--> PostgreSQL database: rahatlyk-website-db
      +--> Local files: /opt/rahatlyk/media and /opt/rahatlyk/cv

## Production inventory

| Item | Value |
| --- | --- |
| Live domain | https://rahatlyk.com and https://www.rahatlyk.com |
| VPS IP | 216.250.12.102 |
| VPS user | ubuntu |
| VPS app folder | /opt/rahatlyk |
| systemd service | rahatlyk.service |
| systemd unit file | /etc/systemd/system/rahatlyk.service |
| Application port | 3000 on localhost |
| Database | PostgreSQL database rahatlyk-website-db |
| Database user | rahatlyk |
| Reverse proxy | Nginx |
| TLS | Let's Encrypt certificates managed on the VPS |
| Current verified backup | /opt/backups/rahatlyk-live-20260916_074721 |

Do not store passwords, private keys, Gmail app passwords, or the production .env file in this repository. Credentials should be transferred through the client's approved password manager or secure channel.

## Repository structure

The current project workspace is:

    C:\Users\90549\Desktop\Projects\sarwan

Important folders and files:

| Path | Purpose |
| --- | --- |
| src/app/(frontend)/[locale] | Public localized website routes |
| src/app/(payload) | Payload admin and API integration |
| src/collections | Payload repeatable data models |
| src/globals | Payload-managed page sections and shared settings |
| src/lib | Data access, localization, caching, email, and helpers |
| src/migrations | Database schema migrations |
| scripts/seed/ | Development and recovery-only current text snapshot/export/import tools |
| public/ | Static public assets |
| media/ | Payload-uploaded public media files |
| cv/ | Private CV files; served only through an authenticated route |
| payload.config.ts | Payload collections, globals, database, email, and localization configuration |
| next.config.ts | Next.js standalone output, image, headers, and media tracing configuration |
| package.json | Commands and dependency versions |
| README.md | Developer setup and project-level reference |
| rahatlyk.dump | Local PostgreSQL dump when present; handle as sensitive data |

The supplied deployment PDF references an older Windows path (C:\Users\90549\Desktop\wavy music\sarwan) and an older WSL copy (~/projects/sarwan). Confirm the active source path before every deployment; do not assume the older path is still the source of truth.

## Application structure

### Public routes

- / - default Turkmen site
- /en - English site
- /ru - Russian site
- /<locale>/about - About page
- /<locale>/products - Product listing
- /<locale>/products/<slug> - Product detail
- /<locale>/news - News listing
- /<locale>/news/<slug> - Article detail
- /<locale>/vacancies - Vacancy listing
- /<locale>/vacancies/<id> - Vacancy detail and application form
- /<locale>/contact - Contact page and contact form

The internal locale code is tm, but the default Turkmen public URL is unprefixed. /tm is intentionally rejected by middleware. English and Russian use /en and /ru.

### Payload CMS

The admin panel is available at /admin. The main collections are:

- media
- product-categories
- products
- article-categories
- articles
- vacancy-departments
- vacancies
- contact-submissions
- cv-documents
- vacancy-applications
- users

The main globals manage site metadata, contact information, navigation, footer, forms, home sections, About sections, article labels, product labels, vacancy labels, and error/not-found content.

## Data and file ownership

PostgreSQL stores Payload metadata, relationships, localized content, and filenames. The actual uploaded files are on disk:

    /opt/rahatlyk/media   # public images, videos, and other Payload media
    /opt/rahatlyk/cv      # private CV uploads

A database dump and its matching media/ and cv/ folders must be treated as one backup set. Restoring only the database or only the files can create broken image links, missing videos, or CV download failures.

The current verified production backup is stored at /opt/backups/rahatlyk-live-20260916_074721. It contains the database dump, deployed application build, media/, cv/, .env, and the rahatlyk.service definition.

## Caching and revalidation

Public data is cached by locale and content type. Payload hooks notify /api/revalidate after content changes. Revalidation depends on:

- the Next.js app being running;
- NEXT_APP_URL pointing to the running app; and
- REVALIDATION_SECRET matching between the app and revalidation request.

If revalidation cannot run, content saves may still succeed but pages can remain stale until revalidation, rebuild, or restart.

## Email and forms

Contact and vacancy forms are handled by Next.js API routes and send email through Gmail SMTP using Nodemailer. The authenticated sender is GMAIL_USER; visible sender addresses come from NOREPLY_EMAIL and WEBSITE_EMAIL.

Contact submissions, vacancy applications, and CV documents are protected Payload collections. Do not make them publicly writable or expose the CV directory through Nginx.

## Operational ownership

The client's IT owner should have access to:

- VPS SSH access;
- Nginx and systemd administration;
- PostgreSQL administration and backup storage;
- the approved credential store containing production secrets;
- the source repository and deployment workstation/WSL environment; and
- the Payload admin account for content editors.

The systemd unit definition is stored outside the repository on the VPS at /etc/systemd/system/rahatlyk.service. Inspect it with:

    sudo systemctl show rahatlyk.service -p FragmentPath
    sudo systemctl cat rahatlyk.service

The client should nominate separate owners for infrastructure, content administration, and domain/email services.
