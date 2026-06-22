import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
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
