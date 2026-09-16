# Payload Learnings

## Admin Sidebar Group Ordering

Payload admin sidebar groups are ordered by the order of `collections` and `globals` in `payload.config.ts`.

Payload supports `admin.group` on collections/globals, but there is no simple built-in `groupOrder: []` config. The first item from a group decides where that group appears in the sidebar.

Example:

```ts
collections: [
  ProductCategories,
  Products,

  ArticleCategories,
  Articles,

  VacancyDepartments,
  Vacancies,
]
```

- Products
- Articles
- Vacancies

For this project, prefer this collection order:

```ts
collections: [
  ProductCategories,
  Products,

  ArticleCategories,
  Articles,

  VacancyDepartments,
  Vacancies,
  CVDocuments,

  ContactSubmissions,
  VacancyApplications,

  Media,
  Users,
]
```

Expected group order:

- Products
- Articles
- Vacancies
- Forms
- Media
- Users

Each collection should set the matching group:

```ts
admin: {
  group: 'Products',
}
```

The same rule applies to globals: their sidebar order follows the `globals: []` array. If exact custom behavior is needed, such as icons, pinned links, or tabbed sidebar sections, use a custom sidebar/plugin instead of only basic Payload config.

## Hiding Sidebar Items

Collections and globals can be hidden from the admin sidebar with `admin.hidden`.

Always hidden:

```ts
admin: {
  hidden: true,
}
```

Conditionally hidden by user:

```ts
admin: {
  hidden: ({ user }) => user?.role !== 'admin',
}
```

Use this for admin-only or manager-only areas, such as `Users`, `CVDocuments`, `ContactSubmissions`, or `VacancyApplications`. Payload supports `hidden` as either `true` or a function based on the current user.

## Hiding Links But Keeping Routes

Use `admin.group: false` for internal/helper collections or globals that should not appear in the sidebar, while keeping their admin routes accessible.

```ts
admin: {
  group: false,
}
```

This is different from `admin.hidden`: `group: false` removes the navigation link but does not block direct access to the admin route.

## Sidebar Labels

Use `labels` to make collection/global names cleaner in the sidebar.

```ts
export const VacancyApplications: CollectionConfig = {
  slug: 'vacancy-applications',
  labels: {
    singular: 'Application',
    plural: 'Applications',
  },
}
```

This lets the sidebar show `Applications` instead of `Vacancy Applications`.

## Custom Links After Navigation

Payload admin can add custom components around the navigation area. Use `afterNavLinks` to append helpful links or actions after the normal sidebar links.

```ts
admin: {
  components: {
    afterNavLinks: [
      '@/components/admin/OpenWebsiteLink',
    ],
  },
}
```

Useful links/actions:

- Open Website
- View Sitemap
- Clear Cache
- Documentation
- Support

This is useful for adding a button like `Open rahatlyk.com`. If the whole sidebar/mobile menu needs custom behavior, Payload's `Nav` component can be replaced instead.

## Edit Page Field Sidebar

This is different from the main left admin sidebar. Fields can be moved into the right sidebar inside collection/global edit pages with `admin.position: 'sidebar'`.

```ts
{
  name: 'featured',
  type: 'checkbox',
  defaultValue: false,
  admin: {
    position: 'sidebar',
  },
}
```

Good fields for the edit-page sidebar:

- date
- featured
- category
- slug
- SEO noIndex
- publishedAt

For `Articles`, good candidates are:

```ts
{ name: 'category', type: 'relationship', relationTo: 'article-categories', required: true, admin: { position: 'sidebar' } },
{ name: 'date', type: 'date', required: true, admin: { position: 'sidebar' } },
{ name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
```

## Database Pool Config

The current Payload Postgres config only sets the connection string:

```ts
pool: {
  connectionString: process.env.DATABASE_URI ?? process.env.DATABASE_URL,
}
```

For production, prefer explicit pool limits and timeouts:

```ts
db: postgresAdapter({
  pool: {
    connectionString: process.env.DATABASE_URI ?? process.env.DATABASE_URL,
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  },
})
```

Payload's Postgres adapter uses Drizzle with `node-postgres`, so these pool options control the underlying Postgres connection behavior.

## Draft And Preview Workflow

Use Payload versions with drafts for content that should be reviewed before publishing.

```ts
versions: {
  drafts: true,
}
```

Good admin workflow:

- draft content
- preview before publish
- publish only when ready
- rollback to an older version

Useful collections:

- Articles
- Products
- Vacancies
- ProductCategories
- ArticleCategories

## Jobs Queue For Background Tasks

Payload has built-in Jobs Queue support. Use jobs for slow or retryable work instead of doing everything inside request handlers or `afterChange` hooks.

```ts
jobs: {
  tasks: [
    // send vacancy application notification
    // regenerate sitemap
    // send contact form email
    // cleanup old CV files
    // sync products/articles
  ],
}
```

Queue tasks with `payload.jobs.queue`. Jobs can also be scheduled with cron-style schedules.

Practical uses for this site:

- Contact form: queue the email so the user does not wait if Gmail is slow.
- Vacancy application: queue HR email, applicant confirmation email, and any internal notification.
- Maintenance: regenerate sitemap, clean old CV files, or sync content.

This is safer and more resilient than doing all side effects inline during a request or directly inside `afterChange`.

## Admin Branding

Use Payload admin metadata to make the CMS feel like Rahatlyk's own internal system instead of the default Payload admin.

```ts
admin: {
  user: Users.slug,
  meta: {
    titleSuffix: '- Rahatlyk CMS',
    icons: [
      {
        rel: 'icon',
        type: 'image/png',
        url: '/favicon.png',
      },
    ],
  },
}
```

This is useful for client handoff because the admin UI feels branded and purpose-built.

## CORS And CSRF Protection

For production, explicitly define allowed origins for Payload `cors` and `csrf`. This helps prevent API/admin abuse when Payload is exposed online.

```ts
const allowedOrigins = [
  process.env.NEXT_PUBLIC_SITE_URL,
  'https://rahatlyk.com',
  'https://www.rahatlyk.com',
].filter(Boolean)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rahatlyk.com',

  cors: allowedOrigins,
  csrf: allowedOrigins,

  // rest of config...
})
```

Keep this list tight: only include trusted production and preview domains that should access the Payload API/admin.
