// 각 페이지에 자기 OG 이미지 연결
import fs from 'fs';

const MAP = {
  'index.html':       'og-home.png',
  'guide.html':       'og-guide.png',
  'reviews.html':     'og-reviews.png',
  'price.html':       'og-price.png',
  'faq.html':         'og-faq.png',
  'hoesik-2cha.html': 'og-hoesik.png',
  'birthday.html':    'og-birthday.png',
  'first-visit.html': 'og-first.png',
  'group.html':       'og-group.png'
};

for (const [file, img] of Object.entries(MAP)) {
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf-8');
  // og-square.png → 페이지 전용 이미지
  const before = html;
  html = html.replace(/og-square\.png/g, img);
  if (html !== before) {
    fs.writeFileSync(file, html);
    console.log(`✓ ${file}  →  ${img}`);
  } else {
    console.log(`· ${file} (변경 없음)`);
  }
}
