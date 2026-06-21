import {defineField, defineType} from 'sanity'

export const about = defineType({
  name: 'about',
  title: '關於作者',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '姓名/名稱',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'photo',
      title: '個人照片',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', title: '替代文字', type: 'string'}],
    }),
    defineField({
      name: 'bio',
      title: '個人簡介',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'cv',
      title: '經歷 / CV',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'cvEntry',
          title: '簡歷項目',
          fields: [
            defineField({name: 'year', title: '年份', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'title', title: '內容', type: 'string', validation: (r) => r.required()}),
            defineField({
              name: 'category',
              title: '分類',
              type: 'string',
              options: {
                list: [
                  {title: '個展 (Solo Exhibition)', value: 'solo'},
                  {title: '聯展 (Group Exhibition)', value: 'group'},
                  {title: '獲獎/補助 (Award/Grant)', value: 'award'},
                  {title: '出版 (Publication)', value: 'publication'},
                  {title: '其他 (Other)', value: 'other'},
                ],
              },
              initialValue: 'solo',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'contact',
      title: '聯絡與社群連結',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'contactLink',
          title: '聯絡方式',
          fields: [
            {name: 'label', title: '名稱 (例：Email, Instagram)', type: 'string', validation: (r) => r.required()},
            {name: 'url', title: '連結或聯絡內容 (例：mailto:..., https://...)', type: 'string', validation: (r) => r.required()},
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {title: 'name', media: 'photo'},
    prepare({title, media}) {
      return {
        title: title || '關於作者',
        subtitle: '個人資料與 CV',
        media,
      }
    },
  },
})
