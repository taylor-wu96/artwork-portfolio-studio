import {defineField, defineType} from 'sanity'

// 系列 / 組曲（series）：把作品編成「被編排的序列」——zine 的本質。
// 與「主題（theme）」不同：theme 是語意標籤（多對多、無序）；series 是策展順序
// （作者手動拖曳排序的一條動線）。放映模式（階段 G）的序列由此接上資料層。
export const series = defineType({
  name: 'series',
  title: '系列 / 組曲',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '名稱',
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
      name: 'description',
      title: '序言 / 描述',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'cover',
      title: '系列封面',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', title: '替代文字', type: 'string'}],
    }),
    defineField({
      name: 'works',
      title: '作品序列',
      description: '拖曳排序——這就是觀者翻閱的順序（zine 動線）。',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'post'}]}],
    }),
    defineField({
      name: 'order',
      title: '排序權重',
      description: '數字越小越前面；留空則依名稱排序。',
      type: 'number',
    }),
  ],
  preview: {
    select: {title: 'title', media: 'cover', works: 'works'},
    prepare({title, media, works}) {
      const n = Array.isArray(works) ? works.length : 0
      return {title, media, subtitle: `${n} 件作品`}
    },
  },
})
