import type { GlobalConfig } from 'payload'
import { revalidateAboutGlobal } from '@/lib/revalidation/payloadHooks'

export const AboutMosaic: GlobalConfig = {
  slug: 'about-mosaic',
  label: 'Mosaic',
  hooks: { afterChange: [revalidateAboutGlobal] },
  access: { read: () => true },
  admin: {
    group: 'About',
    description: 'The two portrait images shown in the About page mosaic section.',
  },
  fields: [
    {
      name: 'leftImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Left Image',
    },
    {
      name: 'rightImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Right Image',
    },
  ],
}
