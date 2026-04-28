// 자동 캐시 무효화 — 모든 자산 URL에 ?v=HASH 자동 부착
// 상대/절대 경로 모두 처리 (Cloudflare Pages + GitHub Pages 양쪽 호환)
import fs from 'fs';
import { execSync } from 'child_process';

let VERSION;
try { VERSION = execSync('git rev-parse --short HEAD').toString().trim(); }
catch { VERSION = Date.now().toString(36); }

console.log(`버전: ${VERSION}\n`);

const ASSET_EXT = '(?:css|js|svg|png|webmanifest|ico)';
const PATTERNS = [
  // 상대 경로 자산: href="style.css", src="main.js"
  { re: new RegExp(`(href|src)="((?:\\./)?[\\w\\-]+\\.${ASSET_EXT})"`, 'g'),
    repl: '$1="$2?v=' + VERSION + '"' },
  // 절대 경로 (구버전 호환): href="/seven2/style.css"
  { re: new RegExp(`(href|src)="(/seven2/[^"?#]+\\.${ASSET_EXT})"`, 'g'),
    repl: '$1="$2?v=' + VERSION + '"' },
  // OG 이미지 절대 URL
  { re: /(content|href)="(https:\/\/theassetsquare-svg\.github\.io\/seven2\/[^"?#]+\.(png|svg|webmanifest|css))"/g,
    repl: `$1="$2?v=${VERSION}"` },
  // JSON-LD image
  { re: /"image":\s*"(https:\/\/[^"?#]+\.(png|svg))"/g,
    repl: `"image": "$1?v=${VERSION}"` },
  { re: /"image":\s*\["(https:\/\/[^"?#]+\.(png|svg))","(https:\/\/[^"?#]+\.(png|svg))"\]/g,
    repl: `"image": ["$1?v=${VERSION}","$3?v=${VERSION}"]` },
];

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let total = 0;

for (const file of files) {
  let html = fs.readFileSync(file, 'utf-8');
  const before = html;
  html = html.replace(/\?v=[a-f0-9]{6,}/g, '');

  let count = 0;
  for (const { re, repl } of PATTERNS) {
    const m = html.match(re);
    if (m) count += m.length;
    html = html.replace(re, repl);
  }

  if (html !== before) {
    fs.writeFileSync(file, html);
    console.log(`✓ ${file.padEnd(20)} (${count}개 자산 버저닝)`);
    total += count;
  }
}

console.log(`\n총 ${total}개 자산에 ?v=${VERSION} 부착`);
