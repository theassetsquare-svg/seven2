// /seven2/* 절대 경로 → 상대 경로 (Cloudflare Pages + GitHub Pages 양쪽 호환)
import fs from 'fs';

const FILES = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let total = 0;

for (const file of FILES) {
  let html = fs.readFileSync(file, 'utf-8');
  const before = html;

  // 자산: href="/seven2/style.css?v=..." → href="style.css?v=..."
  html = html.replace(/(href|src)="\/seven2\/([^"\/][^"]*?)"/g, '$1="$2"');
  // 페이지 링크: href="/seven2/" → href="./"
  html = html.replace(/href="\/seven2\/"/g, 'href="./"');

  if (html !== before) {
    fs.writeFileSync(file, html);
    const count = (before.match(/\/seven2\//g) || []).length - (html.match(/\/seven2\//g) || []).length;
    console.log(`✓ ${file.padEnd(20)} (${count}개 경로 변환)`);
    total += count;
  }
}

console.log(`\n총 ${total}개 경로 변환 — Cloudflare + GitHub 양쪽 호환`);
