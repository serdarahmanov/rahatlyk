import path from 'path'
import { readFileSync } from 'fs'
import { getPayload } from 'payload'
import config from '../payload.config'

// vacancy title (English) → image filename, in order
const VACANCY_IMAGES = [
  { titleEn: 'Marketing Manager',                   imageFile: 'vacancy image (1).png' },
  { titleEn: 'Brand & Content Designer',            imageFile: 'vacancy image (2).png' },
  { titleEn: 'Senior Accountant',                   imageFile: 'vacancy image (3).png' },
  { titleEn: 'Financial Analyst',                   imageFile: 'vacancy image (4).png' },
  { titleEn: 'Regional Sales Representative',       imageFile: 'vacancy image (5).png' },
  { titleEn: 'Key Account Manager',                 imageFile: 'vacancy image (6).png' },
  { titleEn: 'Logistics Coordinator',               imageFile: 'vacancy image (7).png' },
  { titleEn: 'Warehouse & Distribution Supervisor', imageFile: 'vacancy image (8).png' },
]

const IMAGES_DIR = path.join(process.cwd(), 'public', 'vacancy images')

async function seedVacancyImages() {
  const payload = await getPayload({ config })

  for (const { titleEn, imageFile } of VACANCY_IMAGES) {
    // Find the vacancy by English title
    const result = await payload.find({
      collection: 'vacancies',
      locale: 'en',
      limit: 1,
      where: { title: { equals: titleEn } },
    })

    if (!result.docs[0]) {
      console.warn(`  [skip] vacancy not found: "${titleEn}"`)
      continue
    }

    const vacancy = result.docs[0]
    const filePath = path.join(IMAGES_DIR, imageFile)
    const fileData = readFileSync(filePath)

    // Upload to media collection
    const media = await payload.create({
      collection: 'media',
      data: { alt: `${titleEn} — vacancy cover` },
      file: {
        data: fileData,
        mimetype: 'image/png',
        name: imageFile,
        size: fileData.length,
      },
    })

    // Attach media to the vacancy
    await payload.update({
      collection: 'vacancies',
      id: vacancy.id as number,
      data: { image: media.id },
    })

    console.log(`  [done] "${titleEn}" → ${imageFile} (media #${media.id})`)
  }

  console.log('Done.')
  process.exit(0)
}

seedVacancyImages().catch((err) => {
  console.error(err)
  process.exit(1)
})
