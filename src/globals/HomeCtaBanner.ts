import type { GlobalConfig } from 'payload'
import { revalidateHomeGlobal } from '@/lib/revalidation/payloadHooks'

export const HomeCtaBanner: GlobalConfig = {
  slug: 'home-cta-banner',
  hooks: { afterChange: [revalidateHomeGlobal] },
  label: 'CTA Banner (Last Section)',
  access: { read: () => true },
  admin: {
    group: 'Home',
    description: 'The animated blue gradient background is static. Manage text and button link here.',
  },
  fields: [
    { name: 'title',    type: 'text',     localized: true },
    { name: 'subtitle', type: 'text',     localized: true },
    { name: 'ctaLabel', type: 'text',     localized: true },
    { name: 'ctaHref',  type: 'text' },
  ],
}
