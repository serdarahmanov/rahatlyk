import { getPayload } from 'payload'
import config from '../payload.config'
import { VACANCY_DEPARTMENTS, VACANCIES_SEED } from './lib/data/vacancies-payload'

async function seedVacancies() {
  const payload = await getPayload({ config })

  // ── 1. Departments ──────────────────────────────────────────────────────────
  console.log('Seeding vacancy departments...')

  const deptIdBySlug: Record<string, number> = {}

  for (const dept of VACANCY_DEPARTMENTS) {
    const existing = await payload.find({
      collection: 'vacancy-departments',
      limit: 1,
      where: { slug: { equals: dept.slug } },
    })

    if (existing.docs[0]) {
      const id = existing.docs[0].id as number
      deptIdBySlug[dept.slug] = id
      for (const locale of ['en', 'tm', 'ru'] as const) {
        await payload.update({
          collection: 'vacancy-departments',
          id,
          locale,
          data: { label: dept.label[locale] },
        })
      }
      console.log(`  [dept] updated: ${dept.slug}`)
    } else {
      const created = await payload.create({
        collection: 'vacancy-departments',
        locale: 'en',
        data: { slug: dept.slug, label: dept.label.en },
      })
      const id = created.id as number
      deptIdBySlug[dept.slug] = id
      for (const locale of ['tm', 'ru'] as const) {
        await payload.update({
          collection: 'vacancy-departments',
          id,
          locale,
          data: { label: dept.label[locale] },
        })
      }
      console.log(`  [dept] created: ${dept.slug}`)
    }
  }

  // ── 2. Vacancies ────────────────────────────────────────────────────────────
  console.log('Seeding vacancies...')

  for (const v of VACANCIES_SEED) {
    const deptId = deptIdBySlug[v.department]
    if (!deptId) {
      console.warn(`  [vacancy] unknown department slug "${v.department}", skipping: ${v.titleEn}`)
      continue
    }

    const existing = await payload.find({
      collection: 'vacancies',
      locale: 'en',
      limit: 1,
      where: { title: { equals: v.titleEn } },
    })

    // Build locale data with item IDs so Payload can match existing array rows
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const localizedDataWithIds = (locale: 'en' | 'tm' | 'ru', doc: any) => ({
      title:    v.title[locale],
      location: v.location[locale],
      overview: v.overview[locale],
      responsibilities: v.responsibilities.map((r, i) => ({
        ...(doc?.responsibilities?.[i]?.id ? { id: doc.responsibilities[i].id } : {}),
        text: r[locale],
      })),
      requirements: v.requirements.map((r, i) => ({
        ...(doc?.requirements?.[i]?.id ? { id: doc.requirements[i].id } : {}),
        text: r[locale],
      })),
      niceToHave: v.niceToHave.map((r, i) => ({
        ...(doc?.niceToHave?.[i]?.id ? { id: doc.niceToHave[i].id } : {}),
        text: r[locale],
      })),
      benefits: v.benefits.map((r, i) => ({
        ...(doc?.benefits?.[i]?.id ? { id: doc.benefits[i].id } : {}),
        text: r[locale],
      })),
    })

    if (existing.docs[0]) {
      const id = existing.docs[0].id as number
      // Fetch full doc to get array item IDs
      const fullDoc = await payload.findByID({ collection: 'vacancies', id, locale: 'en' })
      for (const locale of ['en', 'tm', 'ru'] as const) {
        await payload.update({
          collection: 'vacancies',
          id,
          locale,
          data: {
            ...localizedDataWithIds(locale, fullDoc),
            ...(locale === 'en' ? {
              department: deptId,
              type:       v.type,
              salary:     v.salary,
              postedDate: v.postedDate,
            } : {}),
          },
        })
      }
      console.log(`  [vacancy] updated: ${v.titleEn}`)
    } else {
      const created = await payload.create({
        collection: 'vacancies',
        locale: 'en',
        data: {
          ...localizedDataWithIds('en', null),
          department: deptId,
          type:       v.type,
          salary:     v.salary,
          postedDate: v.postedDate,
        },
      })
      const id = created.id as number
      for (const locale of ['tm', 'ru'] as const) {
        await payload.update({
          collection: 'vacancies',
          id,
          locale,
          data: localizedDataWithIds(locale, created),
        })
      }
      console.log(`  [vacancy] created: ${v.titleEn}`)
    }
  }

  console.log('Done.')
  process.exit(0)
}

seedVacancies().catch((err) => {
  console.error(err)
  process.exit(1)
})
