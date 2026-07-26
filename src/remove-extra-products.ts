import { createRequire } from 'node:module'
import { getPayload } from 'payload'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')

// The one product to keep. Matched by its English slug so the roman-numeral
// pagination-test copies ("still-water-19l-ii", "-iii") are NOT mistaken for it.
const KEEP_SLUG_EN = 'still-water-19l'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function collectMediaIds(product: any): (number | string)[] {
  const ids: (number | string)[] = []
  for (const photo of product.photos ?? []) {
    const media = photo?.media
    if (media != null) ids.push(typeof media === 'object' ? media.id : media)
  }
  if (product.video != null) {
    ids.push(typeof product.video === 'object' ? product.video.id : product.video)
  }
  return ids
}

async function removeExtraProducts() {
  loadEnvConfig(process.cwd())
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  console.log(`Looking up product to keep (slug: "${KEEP_SLUG_EN}")...`)
  const keepResult = await payload.find({
    collection: 'products',
    locale: 'en',
    limit: 1,
    where: { slug: { equals: KEEP_SLUG_EN } },
  })
  const keepProduct = keepResult.docs[0]

  if (!keepProduct) {
    console.error(`No product found with slug "${KEEP_SLUG_EN}" — aborting, nothing was deleted.`)
    process.exit(1)
  }

  console.log(`  Keeping: "${keepProduct.name}" (id: ${keepProduct.id})`)
  const keepMediaIds = new Set(collectMediaIds(keepProduct).map(String))

  const all = await payload.find({
    collection: 'products',
    locale: 'en',
    limit: 1000,
    pagination: false,
  })

  const toDelete = all.docs.filter((doc) => doc.id !== keepProduct.id)
  console.log(`\nDeleting ${toDelete.length} product(s)...`)

  const mediaToDelete = new Set<string>()

  for (const product of toDelete) {
    // Some products (the "II"/"III" pagination-test copies) reuse the exact
    // same uploaded photos/video as the product we're keeping — never queue
    // those for deletion even though they also appear on a deleted product.
    collectMediaIds(product).forEach((id) => {
      const key = String(id)
      if (!keepMediaIds.has(key)) mediaToDelete.add(key)
    })

    await payload.delete({ collection: 'products', id: product.id })
    console.log(`  [product] deleted: ${product.name} (id: ${product.id})`)
  }

  console.log(`\nDeleting ${mediaToDelete.size} media file(s) no longer used by the kept product...`)
  for (const id of mediaToDelete) {
    try {
      await payload.delete({ collection: 'media', id })
      console.log(`  [media] deleted: ${id}`)
    } catch (err) {
      console.warn(`  [media] failed to delete ${id}:`, err instanceof Error ? err.message : err)
    }
  }

  console.log('\nDone.')
  process.exit(0)
}

removeExtraProducts().catch((err) => {
  console.error(err)
  process.exit(1)
})
