import type { GlobalConfig } from 'payload'
import { revalidateHomeGlobal } from '@/lib/revalidation/payloadHooks'

export const HomeStory: GlobalConfig = {
  slug: 'home-story',
  hooks: { afterChange: [revalidateHomeGlobal] },
  label: 'Our Story Section',
  access: { read: () => true },
  admin: {
    group: 'Home',
  },
  fields: [
    { name: 'image', type: 'relationship', relationTo: 'media' as const },
    { name: 'tag',   type: 'text',         localized: true },
    { name: 'title', type: 'text',         localized: true },
    { name: 'text',  type: 'textarea',     localized: true },
  ],
}
