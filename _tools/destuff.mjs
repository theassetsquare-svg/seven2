// 키워드 디스터핑 — 가시 본문 밀도(keyword-density.js와 동일 기준)가 2.5%를 초과하는
// 페이지만 자동 보정. title/h1/JSON-LD/meta/nav/footer 보호, lead 첫 등장 1회 보존,
// 그 외 본문 중간 등장을 의미 동등 변형으로 교체해 ~2.3%까지 낮춘다.
import fs from 'fs';
import path from 'path';

const KW = '대전세븐나이트';
const STUFF = 2.5;   // 초과 시 보정
const TARGET = 2.3;  // 보정 후 목표 상한

// 의미 동등 변형 (구글 BERT/네이버 DIA가 동일 의미로 인식)
const VARIATIONS = ['세븐나이트', '둔산동 세븐나이트', '저희 매장', '저희', '본 매장', '여기'];

function walk(d, a = []) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) {
      if (!p.includes('node_modules') && !p.includes('.git')) walk(p, a);
    } else if (f.endsWith('.html')) a.push(p);
  }
  return a;
}

// keyword-density.js와 동일한 가시 텍스트 추출 + 밀도 계산
function density(html) {
  const text = html
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const c = (text.match(new RegExp(KW, 'g')) || []).length;
  const d = text.length ? (c * KW.length / text.length * 100) : 0;
  return { c, d };
}

function destuff(file) {
  let html = fs.readFileSync(file, 'utf-8');
  const before = density(html);
  if (before.d <= STUFF) {
    return { file, changed: false, ...before };
  }

  // 보호 영역(title/h1/JSON-LD/meta/nav/footer)을 토큰으로 치환
  const protectedRegions = [];
  const protect = (re) => {
    html = html.replace(re, m => {
      protectedRegions.push(m);
      return `<!--P${protectedRegions.length - 1}-->`;
    });
  };
  protect(/<script[\s\S]*?<\/script>/gi);
  protect(/<title>[\s\S]*?<\/title>/gi);
  protect(/<h1[\s\S]*?<\/h1>/gi);
  protect(/<nav[\s\S]*?<\/nav>/gi);
  protect(/<footer[\s\S]*?<\/footer>/gi);
  protect(/<meta[^>]*>/gi);

  // 본문 키워드 위치 수집, 첫 등장(lead)은 보존하고 뒤에서부터 교체
  let varIdx = 0;
  let replaced = 0;
  while (true) {
    const restored = html.replace(/<!--P(\d+)-->/g, (_, i) => protectedRegions[+i]);
    if (density(restored).d <= TARGET) break;

    const positions = [];
    const re = new RegExp(KW, 'g');
    let m;
    while ((m = re.exec(html)) !== null) positions.push(m.index);
    if (positions.length <= 1) break; // lead 1회는 항상 보존

    const idx = positions[positions.length - 1]; // 가장 뒤쪽부터 교체
    const v = VARIATIONS[varIdx++ % VARIATIONS.length];
    html = html.slice(0, idx) + v + html.slice(idx + KW.length);
    replaced++;
  }

  html = html.replace(/<!--P(\d+)-->/g, (_, i) => protectedRegions[+i]);
  fs.writeFileSync(file, html);
  const after = density(html);
  return { file, changed: replaced > 0, replaced, before: before.d, after: after.d };
}

console.log('=== 키워드 디스터핑 (가시 밀도 2.5% 초과만) ===');
for (const file of walk('.')) {
  const r = destuff(file);
  if (r.changed) {
    console.log(`✓ ${r.file}: ${r.before.toFixed(2)}% → ${r.after.toFixed(2)}% (${r.replaced}회 분산)`);
  }
}
console.log('완료 — 2.5% 이하 페이지는 보존');
