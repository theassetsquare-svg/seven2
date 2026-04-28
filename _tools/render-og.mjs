// SVG → PNG 변환 (pure Node, no browser)
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import fs from 'fs';

const svg = fs.readFileSync('og-square.svg', 'utf-8');

// 1. 1:1 정사각 1200x1200 (네이버, 트위터 summary, 인스타, AI 검색 썸네일)
{
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
    background: '#0a0a0a',
    font: { loadSystemFonts: true, defaultFontFamily: 'sans-serif' }
  });
  const png = resvg.render().asPng();
  fs.writeFileSync('og-square.png', png);
  console.log('✓ og-square.png (1200x1200) ' + png.length + ' bytes');
}

// 2. 1.91:1 1200x630 (페북/카톡 큰 카드) — 정사각 SVG를 가운데 배치하고 좌우 패딩
{
  // SVG를 일단 800x800 PNG로 만든 다음 1200x630 캔버스 가운데 합성
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 600 },
    background: '#0a0a0a',
    font: { loadSystemFonts: true }
  });
  const square = resvg.render().asPng();

  await sharp({
    create: { width: 1200, height: 630, channels: 4, background: { r: 10, g: 10, b: 10, alpha: 1 } }
  })
    .composite([{ input: square, top: 15, left: 300 }])
    .png()
    .toFile('og-image.png');

  const stats = fs.statSync('og-image.png');
  console.log('✓ og-image.png  (1200x630)  ' + stats.size + ' bytes');
}

// 3. apple-touch-icon 180x180 (1:1)
{
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 180 },
    background: '#1a0810'
  });
  const png = resvg.render().asPng();
  fs.writeFileSync('apple-touch-icon.png', png);
  console.log('✓ apple-touch-icon.png (180x180) ' + png.length + ' bytes');
}

// 4. PWA 아이콘 192x192 + 512x512 (1:1)
for (const size of [192, 512]) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
    background: '#1a0810'
  });
  const png = resvg.render().asPng();
  fs.writeFileSync(`icon-${size}.png`, png);
  console.log(`✓ icon-${size}.png (${size}x${size}) ` + png.length + ' bytes');
}

console.log('\n전체 OG/아이콘 이미지 생성 완료');
