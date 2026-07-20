import type { CollectionConfig } from 'payload'
import { lexicalEditor, LinkFeature, ParagraphFeature, InlineToolbarFeature } from '@payloadcms/richtext-lexical'
import {
  revalidateArticleChange,
  revalidateArticleDelete,
} from '@/lib/revalidation/payloadHooks'

export const Articles: CollectionConfig = {
  slug: 'articles',
  hooks: {
    afterChange: [revalidateArticleChange],
    afterDelete: [revalidateArticleDelete],
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'date', 'featured'],
    group: 'Articles',
  },
  fields: [
    { name: 'title',    type: 'text',     required: true, localized: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      localized: true,
      unique: true,
      index: true,
      admin: {
        description: 'Localized URL slug, for example new-sparkling-water-range.',
      },
    },
    { name: 'category', type: 'relationship', relationTo: 'article-categories' as const, required: true },
    { name: 'date',     type: 'date',     required: true,
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy-MM-dd' } } },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'emoji',    type: 'text' },
    {
      name: 'images',
      type: 'array',
      fields: [
        { name: 'media', type: 'relationship', relationTo: 'media' },
        {
          name: 'url',
          type: 'text',
          admin: {
            description: 'Fallback URL used when no media item is selected.',
          },
        },
      ],
    },
    {
      name: 'body',
      type: 'array',
      fields: [
        {
          name: 'text',
          type: 'richText',
          required: true,
          localized: true,
          editor: lexicalEditor({
            features: [
              ParagraphFeature(),
              InlineToolbarFeature(),
              LinkFeature({ enabledCollections: [] }),
            ],
          }),
        },
      ],
    },
  ],
}
