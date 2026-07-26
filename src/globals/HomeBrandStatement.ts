import type { GlobalConfig } from 'payload'
import { revalidateHomeGlobal } from '@/lib/revalidation/payloadHooks'

export const HomeBrandStatement: GlobalConfig = {
  slug: 'home-brand-statement',
  hooks: { afterChange: [revalidateHomeGlobal] },
  label: 'Brand Statement Section',
  access: { read: () => true },
  admin: {
    group: 'Home',
    description: 'Localized paragraph shown under the RAHATLYK wordmark in the brand statement section.',
  },
  fields: [
    { name: 'heading', type: 'text', localized: true, label: 'Heading (wordmark)' },
    { name: 'text', type: 'textarea', localized: true, label: 'Brand Statement Text' },
  ],
}
