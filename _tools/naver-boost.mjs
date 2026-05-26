// 네이버 SEO 보강: geo.position / ICBM / hreflang ko-KR
// 모든 HTML 파일에 누락된 메타를 idempotent하게 주입
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const LAT = 36.3504;
const LON = 127.3845;

const NAVER_BLOCK = `  <meta name="geo.region" content="KR-30" />
  <meta name="geo.placename" content="대전광역시 서구 둔산동" />
  <meta name="geo.position" content="${LAT};${LON}" />
  <meta name="ICBM" content="${LAT}, ${LON}" />`;

const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));

for (const file of files) {
  const full = path.join(ROOT, file);
  let html = fs.readFileSync(full, 'utf-8');
  let changed = false;

  // 1. geo.position / ICBM 주입 (이미 있으면 스킵)
  if (!html.includes('name="geo.position"')) {
    if (html.includes('name="geo.placename"')) {
      // index.html: 기존 geo.placename 뒤에 position/ICBM 추가
      html = html.replace(
        /(<meta name="geo\.placename"[^>]*>)/,
        `$1\n  <meta name="geo.position" content="${LAT};${LON}" />\n  <meta name="ICBM" content="${LAT}, ${LON}" />`
      );
    } else {
      // 서브페이지: canonical 직전에 전체 geo 블록 삽입
      html = html.replace(
        /(\s*)(<link rel="canonical")/,
        `$1${NAVER_BLOCK.trimStart()}\n  $2`.replace('$2', '<link rel="canonical"')
      );
      // 위 replace가 placeholder 문제 있을 수 있으니 안전한 방식으로 재시도
      if (!html.includes('name="geo.position"')) {
        html = html.replace(
          /<link rel="canonical"/,
          `${NAVER_BLOCK}\n  <link rel="canonical"`
        );
      }
    }
    changed = true;
  }

  // 2. hreflang ko-KR alternate (canonical 뒤에 추가)
  if (!html.includes('hreflang="ko-KR"')) {
    const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/);
    if (canonicalMatch) {
      const url = canonicalMatch[1];
      const altLinks = `\n  <link rel="alternate" hreflang="ko-KR" href="${url}" />\n  <link rel="alternate" hreflang="x-default" href="${url}" />`;
      html = html.replace(
        /(<link rel="canonical" href="[^"]+"\s*\/>)/,
        `$1${altLinks}`
      );
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(full, html);
    console.log(`✓ ${file}`);
  } else {
    console.log(`- ${file} (이미 적용됨)`);
  }
}

console.log('\n네이버 SEO 메타 보강 완료.');
