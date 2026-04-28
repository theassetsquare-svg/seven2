// 메인 도메인을 Cloudflare Pages로 통일
import fs from 'fs';
const OLD = 'https://theassetsquare-svg.github.io/seven2/';
const NEW = 'https://seven2.pages.dev/';
const exts = ['.html', '.xml', '.txt', '.json', '.md', '.webmanifest'];
const files = fs.readdirSync('.').filter(f => exts.some(e => f.endsWith(e)));
let total = 0;
for (const file of files) {
  let s = fs.readFileSync(file, 'utf-8');
  const before = s;
  s = s.replaceAll(OLD, NEW);
  if (s !== before) {
    fs.writeFileSync(file, s);
    const count = (before.match(new RegExp(OLD.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    console.log(`✓ ${file} (${count}개)`);
    total += count;
  }
}
console.log(`\n총 ${total}개 URL → ${NEW}`);
