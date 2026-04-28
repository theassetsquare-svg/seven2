// 라이브 사이트 + 로컬 파일 SEO 검증
import fs from 'fs';

const SITE = 'https://theassetsquare-svg.github.io/seven2/';
const PAGES = ['', 'guide.html', 'reviews.html', 'price.html', 'faq.html'];
const ASSETS = ['og-square.png', 'og-image.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png',
                'favicon.svg', 'robots.txt', 'sitemap.xml', 'site.webmanifest', 'llms.txt'];

const ok = (m) => console.log('  ✓ ' + m);
const fail = (m) => console.log('  ✗ ' + m);
const info = (m) => console.log('  · ' + m);

async function head(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.status;
  } catch (e) { return 0; }
}

async function get(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return { status: res.status, text: '' };
    return { status: res.status, text: await res.text() };
  } catch (e) { return { status: 0, text: '' }; }
}

function extractMeta(html, selector) {
  const re = new RegExp(`<meta[^>]+${selector}[^>]+content=["']([^"']+)["']`, 'i');
  const m = html.match(re);
  return m ? m[1] : null;
}

console.log('\n=== 1. 라이브 사이트 도달성 ===\n');

const liveStatus = await head(SITE);
if (liveStatus === 200) {
  ok(`라이브 사이트 200 OK: ${SITE}`);
} else if (liveStatus === 404) {
  fail(`라이브 사이트 404 — GitHub Pages 미활성. Settings → Pages → Source: main / (root) 활성화 필요`);
} else {
  fail(`라이브 사이트 응답: ${liveStatus}`);
}

console.log('\n=== 2. 페이지별 도달성 ===\n');
for (const p of PAGES) {
  const url = SITE + p;
  const s = await head(url);
  if (s === 200) ok(`${p || '/'} → 200`);
  else fail(`${p || '/'} → ${s}`);
}

console.log('\n=== 3. 정적 자원 도달성 ===\n');
for (const a of ASSETS) {
  const s = await head(SITE + a);
  if (s === 200) ok(`${a} → 200`);
  else fail(`${a} → ${s}`);
}

console.log('\n=== 4. 로컬 파일 검증 ===\n');
for (const a of ASSETS) {
  if (fs.existsSync(a)) {
    const sz = fs.statSync(a).size;
    ok(`${a} (${(sz/1024).toFixed(1)} KB)`);
  } else fail(`${a} 없음`);
}

console.log('\n=== 5. index.html SEO 메타 검증 (로컬) ===\n');
const html = fs.readFileSync('index.html', 'utf-8');
const checks = [
  ['title', /<title>([^<]+)<\/title>/, 60, 'title 태그'],
  ['description', /<meta\s+name="description"\s+content="([^"]+)"/, 160, 'meta description'],
  ['og:image (정사각)', /og:image"\s+content="[^"]*og-square\.png"/, null, 'og:image 1:1'],
  ['og:image:width=1200', /og:image:width"\s+content="1200"/, null, 'og:image width'],
  ['og:image:height=1200', /og:image:height"\s+content="1200"/, null, 'og:image height (1:1)'],
  ['twitter:image (정사각)', /twitter:image"\s+content="[^"]*og-square\.png"/, null, 'twitter 정사각'],
  ['naver thumbnail', /name="thumbnail"\s+content="[^"]*og-square\.png"/, null, '네이버 썸네일 1:1'],
  ['canonical', /rel="canonical"\s+href="[^"]+"/, null, 'canonical URL'],
  ['lang=ko', /<html\s+lang="ko"/, null, '한국어 언어 선언'],
  ['JSON-LD NightClub', /"@type":\s*"NightClub"/, null, 'NightClub schema'],
  ['JSON-LD FAQPage', /"@type":\s*"FAQPage"/, null, 'FAQ schema'],
  ['JSON-LD Speakable', /"@type":\s*"SpeakableSpecification"/, null, 'Speakable schema'],
  ['JSON-LD Service', /"@type":\s*"Service"/, null, 'Service schema'],
  ['tel: 링크', /href="tel:01032421504"/, null, 'click-to-call'],
  ['naver verification slot', /naver-site-verification/, null, '네이버 인증 슬롯'],
  ['google verification slot', /google-site-verification/, null, '구글 인증 슬롯']
];
for (const [name, re, maxLen, label] of checks) {
  const m = html.match(re);
  if (m) {
    if (maxLen && m[1] && m[1].length > maxLen) {
      info(`${label}: ${m[1].length}자 (권장 ${maxLen}자 이하) - "${m[1].slice(0,50)}..."`);
    } else {
      ok(`${label}${m[1] ? ': ' + m[1].slice(0, 80) : ''}`);
    }
  } else {
    fail(`${label} 누락`);
  }
}

console.log('\n=== 6. tel: 링크 카운트 ===\n');
const telCount = (html.match(/href="tel:01032421504"/g) || []).length;
ok(`index.html 내 click-to-call 링크: ${telCount}개`);

console.log('\n=== 7. JSON-LD 블록 카운트 ===\n');
const ldCount = (html.match(/<script\s+type="application\/ld\+json">/g) || []).length;
ok(`index.html 내 JSON-LD 블록: ${ldCount}개`);

console.log('\n=== 8. 이미지 비율 검증 ===\n');
async function pngSize(file) {
  const buf = fs.readFileSync(file);
  // PNG IHDR: bytes 16-23 = width(4) + height(4)
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  return { w, h };
}
for (const f of ['og-square.png', 'og-image.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png']) {
  if (!fs.existsSync(f)) { fail(`${f} 파일 없음`); continue; }
  const { w, h } = await pngSize(f);
  const ratio = (w/h).toFixed(3);
  const expected = f === 'og-image.png' ? '1.905 (1.91:1)' : '1.000 (1:1)';
  const isSquare = w === h;
  const isCorrect = f === 'og-image.png' ? Math.abs(w/h - 1.905) < 0.01 : isSquare;
  if (isCorrect) ok(`${f}: ${w}x${h} ratio=${ratio} → ${expected} ✓`);
  else fail(`${f}: ${w}x${h} ratio=${ratio} (예상 ${expected})`);
}

console.log('\n=== 검증 완료 ===\n');
