import { getPayload } from 'payload'
import { cache } from 'react'
import config from '@payload-config'

// cache() deduplicates within a single server render pass
export const getPayloadClient = cache(async () => getPayload({ config }))
