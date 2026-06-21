const { createClient } = require('@sanity/client');
const { createReadStream } = require('fs');
const path = require('path');

// This script is run via `npx sanity exec seed-cms.js` inside studio-artwork-portfolio.
async function main() {
  const client = createClient({
    projectId: 'z4fuhbhm',
    dataset: 'production',
    apiVersion: '2024-03-11',
    token: 'skY6f72XxXKh6QTmUQJ4POsxkN6buXV4P5ssh4i0uaXMojI8GcFSzxrNI6TCMe9rF3L3NsqPHRTgggQQA',
    useCdn: false,
  });
  console.log('Sanity project connected. Loading seed assets...');

  // Paths to generated images (absolute paths)
  const images = {
    doorway: '/Users/taylor/.gemini/antigravity-ide/brain/6effd473-fbd4-4631-a0a3-c8a102260f7c/doorway_light_1782031786792.png',
    rustMoss: '/Users/taylor/.gemini/antigravity-ide/brain/6effd473-fbd4-4631-a0a3-c8a102260f7c/rust_moss_1782031830223.png',
    corridor: '/Users/taylor/.gemini/antigravity-ide/brain/6effd473-fbd4-4631-a0a3-c8a102260f7c/long_corridor_1782031869013.png',
    reflection: '/Users/taylor/.gemini/antigravity-ide/brain/6effd473-fbd4-4631-a0a3-c8a102260f7c/gallery_reflection_1782031889623.png',
    portrait: '/Users/taylor/.gemini/antigravity-ide/brain/6effd473-fbd4-4631-a0a3-c8a102260f7c/artist_portrait_1782031905277.png',
  };

  const assets = {};

  for (const [key, filePath] of Object.entries(images)) {
    console.log(`Uploading ${key} image: ${filePath}...`);
    try {
      const doc = await client.assets.upload('image', createReadStream(filePath), {
        filename: path.basename(filePath),
      });
      assets[key] = doc;
      console.log(`Uploaded ${key} asset successfully: ${doc._id}`);
    } catch (err) {
      console.error(`Failed to upload ${key}:`, err.message);
    }
  }

  console.log('Updating existing posts...');
  
  // 1. doorway-light post (artwork)
  if (assets.doorway) {
    await client
      .patch('post-doorway-light')
      .set({
        category: 'artwork',
        cover: {
          _type: 'image',
          asset: { _type: 'reference', _ref: assets.doorway._id },
        },
      })
      .commit();
    console.log('Updated doorway-light cover & category.');
  }

  // 2. rust-and-moss post (artwork)
  if (assets.rustMoss) {
    await client
      .patch('post-rust-and-moss')
      .set({
        category: 'artwork',
        cover: {
          _type: 'image',
          asset: { _type: 'reference', _ref: assets.rustMoss._id },
        },
      })
      .commit();
    console.log('Updated rust-and-moss cover & category.');
  }

  // 3. corridor post (artwork)
  if (assets.corridor) {
    await client
      .patch('post-corridor')
      .set({
        category: 'artwork',
        cover: {
          _type: 'image',
          asset: { _type: 'reference', _ref: assets.corridor._id },
        },
      })
      .commit();
    console.log('Updated corridor cover & category.');
  }

  // Ensure any other posts are marked as artwork
  const otherPosts = await client.fetch('*[_type == "post" && !defined(category)]');
  for (const post of otherPosts) {
    await client.patch(post._id).set({ category: 'artwork' }).commit();
    console.log(`Marked post ${post.title} as artwork.`);
  }

  console.log('Creating seed Gallery post (影像集)...');
  const galleryPost = {
    _id: 'post-light-scales',
    _type: 'post',
    title: '光影刻度',
    category: 'gallery',
    slug: { _type: 'slug', current: 'light-scales' },
    publishedAt: '2026-06-20T10:00:00Z',
    cover: assets.reflection
      ? { _type: 'image', asset: { _type: 'reference', _ref: assets.reflection._id } }
      : undefined,
    gallery: [
      assets.reflection && {
        _key: 'g1',
        _type: 'image',
        asset: { _type: 'reference', _ref: assets.reflection._id },
        caption: '第一刻：玻璃上的街道映射與寂靜人影，冷光與暖燈的虛實交疊。',
      },
      assets.doorway && {
        _key: 'g2',
        _type: 'image',
        asset: { _type: 'reference', _ref: assets.doorway._id },
        caption: '第二刻：門板隙縫透入的強烈晨光，在幽暗的混凝土空間中劃出幾何線條。',
      },
      assets.corridor && {
        _key: 'g3',
        _type: 'image',
        asset: { _type: 'reference', _ref: assets.corridor._id },
        caption: '第三刻：長廊深處的暖色微光，吸引着視線穿過幽深的透視。',
      },
    ].filter(Boolean),
  };

  await client.createOrReplace(galleryPost);
  console.log('Created gallery post "光影刻度".');

  console.log('Creating seed Essay post (散文創作)...');
  const essayPost = {
    _id: 'post-empty-museum',
    _type: 'post',
    title: '在無人的美術館',
    category: 'essay',
    slug: { _type: 'slug', current: 'empty-museum' },
    publishedAt: '2026-06-19T09:00:00Z',
    cover: assets.doorway
      ? { _type: 'image', asset: { _type: 'reference', _ref: assets.doorway._id } }
      : undefined,
    body: [
      {
        _key: 'e1',
        _type: 'block',
        children: [
          {
            _key: 'es1',
            _type: 'span',
            text: '週一的午後，美術館休館。沒有觀眾，沒有喧嘩，只有巨大的幾何挑高與漫無目的的陽光。',
          },
        ],
        style: 'normal',
      },
      {
        _key: 'e2',
        _type: 'block',
        children: [
          {
            _key: 'es2',
            _type: 'span',
            text: '我沿著洗石子地板緩步走著，鞋底與地面摩擦的沙沙聲在空曠的展間裡激起微弱的迴響。牆上的框畫在陰影中凝視著對面的空氣，它們此時不需要被觀看，也早已擁有自己的生命。對攝影師而言，這種無人的狀態反而是最真實的。當事物不再為了迎合目光而存在，它們才真正回歸到事物本身。',
          },
        ],
        style: 'normal',
      },
      {
        _key: 'e3',
        _type: 'block',
        children: [
          {
            _key: 'es3',
            _type: 'span',
            text: '光線隨時間悄悄漂移，從東側的落地窗，移到展間的隔板，再慢慢拉長成一道刺入深處的斜角。這一刻，美術館本身就是一件巨大的裝置藝術。它在沉默中展演著時間的流逝，展演著空間的微小衰敗，也展演著光影的平靜呼吸。我在這片巨大的安靜中坐下，看著光點在水泥牆上慢慢熄滅。',
          },
        ],
        style: 'normal',
      },
    ],
  };

  await client.createOrReplace(essayPost);
  console.log('Created essay post "在無人的美術館".');

  console.log('Creating about-author singleton (關於作者)...');
  const aboutDoc = {
    _id: 'about-author',
    _type: 'about',
    name: '吳泰勒 / Taylor Wu',
    photo: assets.portrait
      ? { _type: 'image', asset: { _type: 'reference', _ref: assets.portrait._id } }
      : undefined,
    bio: [
      {
        _key: 'b1',
        _type: 'block',
        children: [
          {
            _key: 'bs1',
            _type: 'span',
            text: 'Taylor Wu 是一名工作於台北的獨立攝影與文字創作者。其創作長期關注都市邊緣、廢棄空間與日常光影的閾限狀態（liminal state）。',
          },
        ],
        style: 'normal',
      },
      {
        _key: 'b2',
        _type: 'block',
        children: [
          {
            _key: 'bs2',
            _type: 'span',
            text: '透過大片留白與時間性檔案的建構，他的作品呈現出一種宛如美術館圖錄的冷靜與克制，試圖在影像中捕捉「衰敗與生機並存」的視覺瞬間。除了靜態影像攝影，他也常以極簡隨筆記錄光線消逝的軌跡。',
          },
        ],
        style: 'normal',
      },
    ],
    cv: [
      {
        _key: 'cv1',
        year: '2026',
        title: '個展《光・門檻・衰敗》，台北美術館預備展間',
        category: 'solo',
      },
      {
        _key: 'cv2',
        year: '2025',
        title: '聯展《城市邊界的碎片》，東京當代藝術中心',
        category: 'group',
      },
      {
        _key: 'cv3',
        year: '2024',
        title: '獲得 國家文化藝術基金會 攝影創作補助',
        category: 'award',
      },
      {
        _key: 'cv4',
        year: '2023',
        title: '出版攝影 Zine《光點呼吸錄》',
        category: 'publication',
      },
    ],
    contact: [
      {
        _key: 'c1',
        label: 'Email',
        url: 'mailto:taylor.wu@example.com',
      },
      {
        _key: 'c2',
        label: 'Instagram',
        url: 'https://instagram.com/taylor_wu_photo',
      },
    ],
  };

  await client.createOrReplace(aboutDoc);
  console.log('Created about page information.');

  console.log('Seed process completed successfully.');
}

main().catch((err) => {
  console.error('Seed process failed:', err);
  process.exit(1);
});
