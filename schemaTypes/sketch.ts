import {defineField, defineType} from 'sanity'

// 互動 / 生成式作品（sketch）：shader / R3F / 未來的 p5 等「活的影像作品」。
// 一台「觀看光的精密儀器」理應能展示生成的光，而非只有靜態相片（PM roadmap 軸 1）。
// 與 post（攝影）併入同一條「作品流」，但自有 engine / sketchId / params。
// sketchId 必須對應前台 registry（src/sketches/registry.ts）的 key——
// 新增一件作品＝前台加一個模組＋registry 一行，後台在此建一筆指向它。
export const sketch = defineType({
  name: 'sketch',
  title: '互動 / 生成作品',
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
      name: 'engine',
      title: '引擎',
      description: '此作品用哪種技術繪製（僅供展示／資料條標記，掛載仍以 sketchId 為準）。',
      type: 'string',
      options: {
        list: [
          {title: '原生 Shader (WebGL)', value: 'shader'},
          {title: 'React Three Fiber', value: 'r3f'},
        ],
        layout: 'radio',
      },
      initialValue: 'shader',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'sketchId',
      title: '作品模組 ID',
      description: '必須對應前台 registry 的 key。新作品先在前台 registry 註冊，再於此選用。',
      type: 'string',
      options: {
        list: [
          {title: 'drift-light（漂移光場・shader 範本）', value: 'drift-light'},
          {title: 'light-field（點雲光場・R3F）', value: 'light-field'},
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'params',
      title: '參數（選填）',
      description: '傳給作品的鍵值對。值會嘗試以 JSON 解析（true / 0.5 / 文字皆可）。',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'key', title: '鍵', type: 'string'},
            {name: 'value', title: '值', type: 'string'},
          ],
          preview: {
            select: {title: 'key', subtitle: 'value'},
          },
        },
      ],
    }),
    defineField({
      name: 'aspectRatio',
      title: '長寬比（選填，如 1.6）',
      description: '作品畫布比例；留空則用封面比例或預設高度。',
      type: 'number',
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
      title: '封面影像（索引縮圖／無 JS fallback／簽名來源）',
      type: 'image',
      options: {
        hotspot: true,
        metadata: ['lqip', 'palette', 'dimensions', 'exif', 'location'],
      },
      fields: [{name: 'alt', title: '替代文字（無障礙/SEO）', type: 'string'}],
    }),
    defineField({
      name: 'capture',
      title: '拍攝資料（選填・覆寫「檔案簽名」）',
      description: '與攝影作品共用同一套半真簽名語言。座標可留空。',
      type: 'object',
      options: {collapsible: true, collapsed: true},
      fields: [
        {name: 'location', title: '地點（地名）', type: 'string'},
        {name: 'coordinates', title: '座標', type: 'geopoint'},
        {name: 'year', title: '年份', type: 'string'},
        {name: 'gear', title: '器材 / 工具', type: 'string'},
        {name: 'film', title: '媒材 / 備註', type: 'string'},
      ],
    }),
    defineField({
      name: 'themes',
      title: '主題',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'theme'}]}],
    }),
    defineField({
      name: 'description',
      title: '作品描述',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
  preview: {
    select: {title: 'title', media: 'cover', engine: 'engine'},
    prepare({title, media, engine}) {
      return {title, media, subtitle: engine ? `▸ ${String(engine).toUpperCase()}` : '互動作品'}
    },
  },
})
