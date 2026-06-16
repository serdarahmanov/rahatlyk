import { getPayload } from 'payload'
import config from '../payload.config'
import { ARTICLES } from './lib/data/news'
import { PRODUCTS } from './lib/data/products'
import { VACANCIES } from './lib/data/vacancies'

async function seed() {
  const payload = await getPayload({ config })

  console.log('Seeding articles...')
  for (const article of ARTICLES) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {
      title: article.title,
      category: article.category,
      date: article.date,
      featured: article.featured,
      emoji: article.emoji,
      images: article.images.map((url) => ({ url })),
      body: article.body.map((text) => ({ text })),
    }

    const existing = await payload.find({
      collection: 'articles',
      limit: 1,
      where: { title: { equals: article.title } },
    })

    if (existing.docs[0]) {
      await payload.update({
        collection: 'articles',
        id: existing.docs[0].id,
        data,
      })
      console.log(`  updated ${article.title}`)
    } else {
      await payload.create({
        collection: 'articles',
        data,
      })
      console.log(`  created ${article.title}`)
    }
  }

  console.log('Seeding products...')
  for (const product of PRODUCTS) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {
      name: product.name,
      tagline: product.tagline,
      date: product.date,
      category: product.category,
      description: product.description,
      longDescription: product.longDescription,
      features: product.features.map((text) => ({ text })),
      nutrition: product.nutrition.map(({ label, value }) => ({ label, value })),
      volumes: product.volumes.map((value) => ({ value })),
      photos: (product.photos ?? []).map((url) => ({ url })),
    }

    const existing = await payload.find({
      collection: 'products',
      limit: 1,
      where: { name: { equals: product.name } },
    })

    if (existing.docs[0]) {
      await payload.update({
        collection: 'products',
        id: existing.docs[0].id,
        data,
      })
      console.log(`  updated ${product.name}`)
    } else {
      await payload.create({
        collection: 'products',
        data,
      })
      console.log(`  created ${product.name}`)
    }
  }

  console.log('Seeding vacancies...')
  for (const vacancy of VACANCIES) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {
      title: vacancy.title,
      department: vacancy.department,
      location: vacancy.location,
      type: vacancy.type,
      overview: vacancy.overview,
      responsibilities: vacancy.responsibilities.map((text) => ({ text })),
      requirements: vacancy.requirements.map((text) => ({ text })),
      niceToHave: vacancy.niceToHave.map((text) => ({ text })),
      benefits: vacancy.benefits.map((text) => ({ text })),
      salary: vacancy.salary,
      postedDate: vacancy.postedDate,
    }

    const existing = await payload.find({
      collection: 'vacancies',
      limit: 1,
      where: { title: { equals: vacancy.title } },
    })

    if (existing.docs[0]) {
      await payload.update({
        collection: 'vacancies',
        id: existing.docs[0].id,
        data,
      })
      console.log(`  updated ${vacancy.title}`)
    } else {
      await payload.create({
        collection: 'vacancies',
        data,
      })
      console.log(`  created ${vacancy.title}`)
    }
  }

  console.log('Done.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
