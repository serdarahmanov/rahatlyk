import type { GlobalConfig } from 'payload'
import { revalidateSiteSettingsGlobal } from '@/lib/revalidation/payloadHooks'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  hooks: { afterChange: [revalidateSiteSettingsGlobal] },
  access: { read: () => true },
  admin: {
    group: 'Settings',
  },
  fields: [
    { name: 'instagramUrl', type: 'text', label: 'Instagram URL' },
    { name: 'youtubeUrl',   type: 'text', label: 'YouTube URL'   },
    { name: 'facebookUrl',  type: 'text', label: 'Facebook URL'  },
  ],
}
