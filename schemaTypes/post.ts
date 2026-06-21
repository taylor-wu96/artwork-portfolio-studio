import {defineField, defineType} from 'sanity'

export const post = defineType({
  name: 'post',
  title: '文章 / 作品',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '標題',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: '網址代稱',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: '發佈日期',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'category',
      title: '分類',
      type: 'string',
      options: {
        list: [
          {title: '作品 (Artwork)', value: 'artwork'},
          {title: '影像集 (Gallery)', value: 'gallery'},
          {title: '散文創作 (Essay)', value: 'essay'},
        ],
        layout: 'radio',
      },
      initialValue: 'artwork',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'cover',
      title: '封面影像',
      type: 'image',
      options: {hotspot: true}, // hotspot = 焦點裁切，攝影必備
      fields: [{name: 'alt', title: '替代文字（無障礙/SEO）', type: 'string'}],
    }),
    defineField({
      name: 'themes',
      title: '主題',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'theme'}]}],
    }),
    defineField({
      name: 'gallery',
      title: '影像集',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [{name: 'caption', title: '說明', type: 'string'}],
        },
      ],
    }),
    defineField({
      name: 'body',
      title: '內文',
      type: 'array',
      of: [
        {type: 'block'},
        {
          type: 'image',
          options: {hotspot: true},
          fields: [{name: 'alt', title: '替代文字', type: 'string'}],
        },
      ],
    }),
  ],
  preview: {
    select: {title: 'title', media: 'cover', date: 'publishedAt'},
    prepare({title, media, date}) {
      return {
        title,
        media,
        subtitle: date ? new Date(date).toLocaleDateString('zh-TW') : '未發佈',
      }
    },
  },
})
