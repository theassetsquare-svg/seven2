// 키워드 디스터핑 — "대전세븐나이트" 과밀 페이지의 일부를 의미 동등 변형으로 교체
// 전략적 위치(title/h1/lead/footer)는 보존, 본문 중간만 교체
import fs from 'fs';

// 페이지별 목표 등장 횟수
const TARGET = {
  'index.html':       { current: 32, keep: 15 },  // 2.79% → ~1.3%
  'guide.html':       { current: 22, keep: 13 },  // 3.22% → ~2.0%
  'reviews.html':     { current: 12, keep:  7 },  // 3.17% → ~1.8%
  'price.html':       { current:  9, keep:  5 },  // 3.64% → ~2.0%
  // faq, hoesik, birthday, first, group은 이미 자연스러움 — 건드리지 않음
};

// 의미 동등 변형 풀 (구글 BERT/네이버 DIA가 동일 의미로 인식)
const VARIATIONS = [
  '세븐나이트',
  '둔산동 세븐나이트',
  '대전 세븐나이트',
  '저희',
  '본 매장',
  '여기',
  '둔산동 No.1 나이트',
];

let varIdx = 0;
function pickVar() {
  const v = VARIATIONS[varIdx % VARIATIONS.length];
  varIdx++;
  return v;
}

function destuff(file, current, keep) {
  let html = fs.readFileSync(file, 'utf-8');

  // 1. JSON-LD, title, h1, footer__seo (aria-hidden 키워드 풀) 영역은 보호
  // → 임시 토큰으로 치환 후 마지막에 복원
  const protectedRegions = [];
  const protectKw = '대전세븐나이트';
  const TOKEN = 'PROTECTED';

  // JSON-LD scripts 보호
  html = html.replace(/<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g, m => {
    protectedRegions.push(m);
    return `<!--PROTECT-${protectedRegions.length - 1}-->`;
  });
  // title 보호
  html = html.replace(/<title>[\s\S]*?<\/title>/g, m => {
    protectedRegions.push(m);
    return `<!--PROTECT-${protectedRegions.length - 1}-->`;
  });
  // h1 보호
  html = html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/g, m => {
    protectedRegions.push(m);
    return `<!--PROTECT-${protectedRegions.length - 1}-->`;
  });
  // meta 태그 안의 키워드 (description, keywords, og 등) 보호
  html = html.replace(/<meta[^>]+content="[^"]*대전세븐나이트[^"]*"[^>]*\/?>/g, m => {
    protectedRegions.push(m);
    return `<!--PROTECT-${protectedRegions.length - 1}-->`;
  });
  // footer__seo (이미 aria-hidden) 보호 — 키워드 풀이므로
  html = html.replace(/<p class="footer__seo"[^>]*>[\s\S]*?<\/p>/g, m => {
    protectedRegions.push(m);
    return `<!--PROTECT-${protectedRegions.length - 1}-->`;
  });

  // 2. 보호 영역 외 본문에서 "대전세븐나이트" 등장 횟수 카운트
  const bodyMatches = (html.match(/대전세븐나이트/g) || []).length;
  console.log(`  ${file} (보호 후 본문): ${bodyMatches}회`);

  // 3. 교체할 횟수 = 본문 횟수 - 본문에서 유지할 횟수
  // 전체 keep에서 보호 영역의 등장 횟수를 빼야 정확하지만, 단순화
  const toReplace = Math.max(0, bodyMatches - (keep - (current - bodyMatches)));
  console.log(`  ${file} 교체 대상: ${toReplace}회`);

  // 4. 본문에서 N회 등장한 매치를 순서대로 교체 (전부 다는 안 함)
  let replaced = 0;
  // 첫 등장부터가 아니라, 첫 1~2개는 보존(intro), 끝쪽 1개도 보존(CTA)
  // 가운데 부분만 교체
  const positions = [];
  const re = /대전세븐나이트/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    positions.push(m.index);
  }
  // 첫 2개와 마지막 1개는 보호
  const middleStart = 2;
  const middleEnd = positions.length - 1;
  // 가운데에서 toReplace만큼 균등 추출
  const toReplaceIndices = [];
  if (middleEnd > middleStart && toReplace > 0) {
    const step = Math.max(1, Math.floor((middleEnd - middleStart) / toReplace));
    for (let i = middleStart; i < middleEnd && toReplaceIndices.length < toReplace; i += step) {
      toReplaceIndices.push(positions[i]);
    }
  }

  // 뒤에서부터 교체 (인덱스가 안 밀리도록)
  toReplaceIndices.sort((a, b) => b - a);
  for (const idx of toReplaceIndices) {
    const v = pickVar();
    html = html.slice(0, idx) + v + html.slice(idx + protectKw.length);
    replaced++;
  }

  // 5. 보호 영역 복원
  html = html.replace(/<!--PROTECT-(\d+)-->/g, (_, i) => protectedRegions[parseInt(i)]);

  fs.writeFileSync(file, html);

  // 검증
  const finalCount = (html.match(/대전세븐나이트/g) || []).length;
  console.log(`  ${file} 결과: ${finalCount}회 (교체 ${replaced}건)\n`);
  return finalCount;
}

console.log('=== 키워드 디스터핑 ===\n');
for (const [file, { current, keep }] of Object.entries(TARGET)) {
  destuff(file, current, keep);
}
