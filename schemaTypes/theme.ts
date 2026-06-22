import {defineField, defineType} from 'sanity'

export const theme = defineType({
  name: 'theme',
  title: '主題',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '名稱',
      type: 'string',
      description: '例：光、門檻與邊界、衰敗與生機',
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
      name: 'description',
      title: '描述',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'cover',
      title: '主題封面',
      description: '主題索引頁的代表影像。',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', title: '替代文字', type: 'string'}],
    }),
    defineField({
      name: 'order',
      title: '排序權重',
      description: '數字越小越前面；留空則依名稱排序。',
      type: 'number',
    }),
  ],
})
