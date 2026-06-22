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
      name: 'status',
      title: '狀態',
      description: '進行中＝索引上顯示綠色「進行中」標記；完成＝正式收錄。',
      type: 'string',
      options: {
        list: [
          {title: '完成 (Done)', value: 'done'},
          {title: '進行中 (Work in progress)', value: 'wip'},
          {title: '草稿 (Draft)', value: 'draft'},
        ],
        layout: 'radio',
      },
      initialValue: 'done',
    }),
    defineField({
      name: 'featured',
      title: '置頂精選',
      description: '在首頁／索引置頂呈現。',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'cover',
      title: '封面影像',
      type: 'image',
      options: {hotspot: true}, // hotspot = 焦點裁切，攝影必備
      fields: [{name: 'alt', title: '替代文字（無障礙/SEO）', type: 'string'}],
    }),
    defineField({
      name: 'capture',
      title: '拍攝資料（選填・餵「檔案簽名」）',
      description:
        '有填就用真的，沒填則由 slug 生成決定性的座標／編碼（觀看的機器・半真化）。座標可留空。',
      type: 'object',
      options: {collapsible: true, collapsed: true},
      fields: [
        {name: 'location', title: '地點（地名）', type: 'string'},
        {name: 'coordinates', title: '座標', type: 'geopoint'},
        {name: 'year', title: '年份', type: 'string'},
        {name: 'gear', title: '器材', type: 'string'},
        {name: 'film', title: '底片 / 感光', type: 'string'},
      ],
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
