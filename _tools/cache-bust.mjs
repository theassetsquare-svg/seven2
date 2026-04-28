// 자동 캐시 무효화 — 모든 자산 URL에 ?v=HASH 추가
// 사용법: node _tools/cache-bust.mjs
// 동작: 현재 git 커밋 해시를 가져와서 모든 HTML의 CSS/JS/이미지 URL에 자동 부착
import fs from 'fs';
import { execSync } from 'child_process';

// 1. 버전 = 현재 git 짧은 해시 (없으면 timestamp)
let VERSION;
try {
  VERSION = execSync('git rev-parse --short HEAD').toString().trim();
} catch {
  VERSION = Date.now().toString(36);
}

console.log(`버전: ${VERSION}\n`);

// 2. 버저닝 대상 — 우리 도메인 자산만 (외부 fonts.googleapis 등 제외)
const PATTERNS = [
  // 내부 절대 경로
  { re: /href="(\/seven2\/[^"?#]+\.(css|svg|png|webmanifest|ico))"/g,         repl: `href="$1?v=${VERSION}"` },
  { re: /src="(\/seven2\/[^"?#]+\.(js|png|svg))"/g,                            repl: `src="$1?v=${VERSION}"` },
  // 절대 URL (OG 이미지 등) — theassetsquare-svg.github.io/seven2 도메인만
  { re: /content="(https:\/\/theassetsquare-svg\.github\.io\/seven2\/[^"?#]+\.(png|svg|webmanifest))"/g,
    repl: `content="$1?v=${VERSION}"` },
  { re: /href="(https:\/\/theassetsquare-svg\.github\.io\/seven2\/[^"?#]+\.(png|svg|webmanifest|css))"/g,
    repl: `href="$1?v=${VERSION}"` },
  // JSON-LD 안의 image URL
  { re: /"image":\s*"(https:\/\/theassetsquare-svg\.github\.io\/seven2\/[^"?#]+\.(png|svg))"/g,
    repl: `"image": "$1?v=${VERSION}"` },
  { re: /"image":\s*\["(https:\/\/theassetsquare-svg\.github\.io\/seven2\/[^"?#]+\.(png|svg))","(https:\/\/theassetsquare-svg\.github\.io\/seven2\/[^"?#]+\.(png|svg))"\]/g,
    repl: `"image": ["$1?v=${VERSION}","$3?v=${VERSION}"]` },
];

// 3. 모든 HTML 파일 처리
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let totalChanges = 0;

for (const file of files) {
  let html = fs.readFileSync(file, 'utf-8');
  const before = html;

  // 기존 ?v=XXX 제거 후 다시 부착 (반복 실행 가능)
  html = html.replace(/\?v=[a-f0-9]{6,}/g, '');

  // 새 버전 부착
  let count = 0;
  for (const { re, repl } of PATTERNS) {
    const matches = html.match(re);
    if (matches) count += matches.length;
    html = html.replace(re, repl);
  }

  if (html !== before) {
    fs.writeFileSync(file, html);
    console.log(`✓ ${file.padEnd(20)} (${count}개 자산 버저닝)`);
    totalChanges += count;
  }
}

console.log(`\n총 ${totalChanges}개 자산에 ?v=${VERSION} 부착`);
console.log('\n다음 단계: git add -A && git commit -m "cache-bust" && git push');
