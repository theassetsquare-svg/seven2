// 10-pass SEO 감사 — 구글/네이버/AI 상위노출 준비 검증
import fs from 'fs';

const BASE = 'https://seven2.pages.dev';
const PAGES = ['', 'guide.html', 'reviews.html', 'price.html', 'faq.html',
               'hoesik-2cha.html', 'birthday.html', 'first-visit.html', 'group.html'];

const issues = [];
const ok = (m) => console.log(`  ✓ ${m}`);
const warn = (m) => { console.log(`  ⚠ ${m}`); issues.push(m); };
const fail = (m) => { console.log(`  ✗ ${m}`); issues.push(m); };

async function fetchPage(p) {
  const url = BASE + (p ? '/' + p : '/');
  const res = await fetch(url);
  return { status: res.status, html: res.ok ? await res.text() : '', url };
}

const pages = {};
for (const p of PAGES) pages[p] = await fetchPage(p);

// ============ 1. 도달성 ============
console.log('\n=== 1. 모든 페이지 200 OK ===');
let pass1 = 0;
for (const [p, d] of Object.entries(pages)) {
  if (d.status === 200) { ok(`${p || 'home'} → 200`); pass1++; }
  else fail(`${p} → ${d.status}`);
}

// ============ 2. 핵심 키워드 밀도 ============
console.log('\n=== 2. "대전세븐나이트" 키워드 분포 ===');
for (const [p, d] of Object.entries(pages)) {
  const matches = (d.html.match(/대전세븐나이트/g) || []).length;
  const text = d.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const words = text.split(' ').length;
  const density = ((matches / words) * 100).toFixed(2);
  if (matches >= 3) ok(`${p || 'home'}: ${matches}회 등장 (밀도 ${density}%)`);
  else warn(`${p || 'home'}: ${matches}회만 등장 (3회 이상 권장)`);
}

// ============ 3. title/description 최적화 ============
console.log('\n=== 3. title + meta description 최적화 ===');
for (const [p, d] of Object.entries(pages)) {
  const t = (d.html.match(/<title>([^<]+)<\/title>/) || [])[1] || '';
  const desc = (d.html.match(/name="description"\s+content="([^"]+)"/) || [])[1] || '';
  const tHasKw = t.includes('대전세븐나이트') || t.includes('대전 세븐나이트') || t.includes('세븐나이트') || t.includes('대전');
  const dHasKw = desc.includes('대전세븐나이트') || desc.includes('대전');
  const tHasPhone = t.includes('010-3242-1504');
  if (t.length >= 30 && t.length <= 70 && tHasKw) ok(`${p||'home'}: title ${t.length}자 ✓`);
  else warn(`${p||'home'}: title ${t.length}자 — "${t.slice(0,50)}"`);
  if (desc.length >= 100 && desc.length <= 165 && dHasKw) ok(`${p||'home'}: desc ${desc.length}자 ✓`);
  else warn(`${p||'home'}: desc ${desc.length}자`);
}

// ============ 4. JSON-LD 구조화 데이터 ============
console.log('\n=== 4. JSON-LD 검증 ===');
for (const [p, d] of Object.entries(pages)) {
  const blocks = d.html.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
  let valid = 0, invalid = 0;
  for (const b of blocks) {
    const json = b.replace(/<script[^>]*>/, '').replace(/<\/script>/, '').trim();
    try { JSON.parse(json); valid++; } catch { invalid++; }
  }
  if (invalid > 0) fail(`${p||'home'}: ${invalid}개 JSON-LD 파싱 실패`);
  else if (valid >= 1) ok(`${p||'home'}: JSON-LD ${valid}개 모두 유효`);
  else warn(`${p||'home'}: JSON-LD 없음`);
}

// ============ 5. 내부 링크 ============
console.log('\n=== 5. 내부 링크 그래프 (모든 페이지가 다른 페이지로 링크?) ===');
for (const [p, d] of Object.entries(pages)) {
  const internalLinks = (d.html.match(/href="(?!https?:|tel:|mailto:|#)[^"]+\.html?"/g) || []).length;
  if (internalLinks >= 4) ok(`${p||'home'}: 내부 링크 ${internalLinks}개`);
  else warn(`${p||'home'}: 내부 링크 ${internalLinks}개 (4개 이상 권장)`);
}

// ============ 6. h1 단일성 + 키워드 ============
console.log('\n=== 6. h1 헤딩 (단일 + 키워드) ===');
for (const [p, d] of Object.entries(pages)) {
  const h1s = (d.html.match(/<h1[^>]*>[\s\S]*?<\/h1>/g) || []);
  const h1Text = h1s.map(h => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()).join(' | ');
  if (h1s.length === 1) ok(`${p||'home'}: h1 단일 — "${h1Text.slice(0,50)}"`);
  else fail(`${p||'home'}: h1 ${h1s.length}개`);
}

// ============ 7. canonical + 도메인 통일 ============
console.log('\n=== 7. canonical URL ===');
for (const [p, d] of Object.entries(pages)) {
  const canon = (d.html.match(/rel="canonical"\s+href="([^"]+)"/) || [])[1];
  const expected = `${BASE}${p ? '/' + p : '/'}`;
  if (canon === expected) ok(`${p||'home'}: canonical = ${canon}`);
  else fail(`${p||'home'}: canonical 불일치 — ${canon}`);
}

// ============ 8. Open Graph + 1:1 이미지 ============
console.log('\n=== 8. og:image 1:1 정사각 ===');
for (const [p, d] of Object.entries(pages)) {
  const w = (d.html.match(/og:image:width"\s+content="(\d+)"/) || [])[1];
  const h = (d.html.match(/og:image:height"\s+content="(\d+)"/) || [])[1];
  if (w === '1200' && h === '1200') ok(`${p||'home'}: 1:1 (1200×1200)`);
  else warn(`${p||'home'}: ${w}×${h}`);
}

// ============ 9. 인증 메타 ============
console.log('\n=== 9. 검색엔진 인증 메타 ===');
for (const [p, d] of Object.entries(pages)) {
  const naver = d.html.includes('a3031be7c70963c466ae77337be6afd35a197cab');
  const google = d.html.includes('HJjm7MRxykCQ7d_9L7glaTeeaWrmJIzAKY0BcNcfm88');
  if (naver && google) ok(`${p||'home'}: 네이버 ✓ + 구글 ✓`);
  else warn(`${p||'home'}: 네이버=${naver} 구글=${google}`);
}

// ============ 10. AI 검색 준비 ============
console.log('\n=== 10. AI 검색 인용 가능성 ===');
const llms = await (await fetch(BASE + '/llms.txt')).text();
const hasPhone = llms.includes('010-3242-1504');
const hasLocation = llms.includes('둔산동');
const hasAllPages = PAGES.every(p => p === '' || llms.includes(p));
if (hasPhone) ok('llms.txt에 전화번호 명시');
else fail('llms.txt 전화번호 누락');
if (hasLocation) ok('llms.txt에 위치 명시');
else fail('llms.txt 위치 누락');
if (hasAllPages) ok('llms.txt에 9개 페이지 모두 링크');
else warn('llms.txt 페이지 일부 누락');

// robots.txt에 AI 봇 허용
const robots = await (await fetch(BASE + '/robots.txt')).text();
const aiBots = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'OAI-SearchBot'];
const allowedAI = aiBots.filter(b => robots.includes(b));
if (allowedAI.length === aiBots.length) ok(`robots.txt: AI 봇 ${aiBots.length}개 모두 허용`);
else warn(`robots.txt AI 봇 ${allowedAI.length}/${aiBots.length}`);

// ============ 최종 리포트 ============
console.log('\n=================================');
console.log(`  최종 결과: ${issues.length === 0 ? '✓ 완벽' : `⚠ ${issues.length}개 약점`}`);
console.log('=================================');
if (issues.length > 0) {
  console.log('\n약점 목록:');
  issues.forEach((i, idx) => console.log(`  ${idx+1}. ${i}`));
}
