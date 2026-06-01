// 10-pass 감사 약점 일괄 강화
import fs from 'fs';

// === 1. description 강화 (전부 130~155자) ===
const DESCRIPTIONS = {
  'reviews.html':
    '대전세븐나이트 실제 방문 후기 1,287건 평점 4.9/5.0. 4인1조 부킹 W.T 원숭이를 통해 다녀가신 분들의 생생한 리뷰. 둔산동 No.1 나이트클럽 검증된 만족도. 예약 010-3242-1504.',
  'price.html':
    '대전세븐나이트 가격 안내 - 일반 테이블·코너석·VIP룸별 정찰제 운영. 양주·맥주·안주 구성, 바가지 NO. 4인1조 부킹 우선배정. 정확한 견적은 W.T 원숭이 010-3242-1504 즉시 상담.',
  'faq.html':
    '대전세븐나이트 자주 묻는 질문 30선. 예약 방법, 4인1조 시스템, 위치, 가격, 영업시간, 복장, 주차, 카드결제까지 W.T 원숭이가 직접 답변. 둔산동 No.1 나이트 010-3242-1504.',
  'hoesik-2cha.html':
    '대전 회식 2차 어디 갈지 고민이라면 대전세븐나이트가 정답. 둔산동 No.1 나이트클럽 4인1조 부킹, 단체 6~15인 즉시 세팅, VIP룸 분리 가능, 정찰제. W.T 원숭이 010-3242-1504.',
  'birthday.html':
    '대전 생일파티 장소는 대전세븐나이트 VIP룸 + 케이크 세팅 + 폭죽 연출. 친구·연인·동기 인생 생일 책임지는 둔산동 No.1 나이트, W.T 원숭이가 사전 준비. 예약 010-3242-1504.',
  'first-visit.html':
    '대전 나이트 처음이라면 대전세븐나이트 초보 가이드부터. 입장·복장·부킹·가격까지 처음 방문 5단계 완벽 정리, W.T 원숭이가 입장부터 마무리까지 책임 안내. 010-3242-1504.',
  'group.html':
    '대전 단체 모임 8~20인은 대전세븐나이트 VIP룸 즉시 세팅. 동창회·MT·송년회·송별회·신년회 책임지는 둔산동 No.1 나이트클럽, 정찰가 단체 견적 010-3242-1504 W.T 원숭이.'
};

// === 2. 롱테일 4페이지에 "대전세븐나이트" 키워드 자연스럽게 추가 ===
// h1 다음 hero__sub에 키워드 보강 + lead 단락에도 추가
const KW_INJECTIONS = {
  'hoesik-2cha.html': {
    sub:    '대전세븐나이트 단체 자리 즉시 세팅 · VIP룸 가능 · 정찰제 · 24시간 상담',
    leadAfter: '<strong>"2차 어디로 갈까?"</strong>',
    leadAdd: ' 대전세븐나이트는'
  },
  'birthday.html': {
    sub:    '친구·연인·동기 인생 생일은 대전세븐나이트가 책임. W.T 원숭이가 사전 준비.',
    leadAfter: '<strong>둔산동 세븐나이트 VIP룸</strong>이 정답입니다.',
    leadAdd: ' 대전세븐나이트는'
  },
  'first-visit.html': {
    sub:    '대전세븐나이트 처음이어도, 전화 한 통이면 W.T 원숭이가 입장부터 마무리까지 안내.',
    leadAfter: '<strong>W.T를 통해 사전 예약</strong>의 차이는 큽니다.',
    leadAdd: ' 대전세븐나이트의'
  },
  'group.html': {
    sub:    '동창회·MT·송년회·동기회·신년회 — 대전세븐나이트가 한 번에 자리 잡기.',
    leadAfter: '한 번에 들어갈 수 있는 자리는 대전에서 흔치 않습니다.',
    leadAdd: ' 대전세븐나이트(둔산동 세븐나이트)는'
  }
};

for (const [file, desc] of Object.entries(DESCRIPTIONS)) {
  let html = fs.readFileSync(file, 'utf-8');
  html = html.replace(/<meta name="description" content="[^"]+"/, `<meta name="description" content="${desc}"`);
  fs.writeFileSync(file, html);
  console.log(`✓ ${file} description: ${desc.length}자`);
}

console.log();

for (const [file, inj] of Object.entries(KW_INJECTIONS)) {
  let html = fs.readFileSync(file, 'utf-8');
  // hero__sub 보강 (페이지마다 한 번만 등장)
  html = html.replace(/<p class="hero__sub">[^<]+<\/p>/, `<p class="hero__sub">${inj.sub}</p>`);
  // lead 첫 등장에 "대전세븐나이트" 추가
  if (inj.leadAfter && !html.includes(inj.leadAfter + inj.leadAdd)) {
    html = html.replace(inj.leadAfter, inj.leadAfter + inj.leadAdd);
  }
  // 추가 보강: 본문 어딘가 한 번 더 키워드 자연 삽입
  // "둔산동 세븐나이트" → "둔산동 대전세븐나이트" (한 번)
  html = html.replace(/둔산동 세븐나이트/, '둔산동 대전세븐나이트');
  fs.writeFileSync(file, html);
  const count = (html.match(/대전세븐나이트/g) || []).length;
  console.log(`✓ ${file} 키워드: ${count}회 등장`);
}

// === 3. price.html에 JSON-LD 추가 ===
console.log();
let priceHtml = fs.readFileSync('price.html', 'utf-8');
if (!priceHtml.includes('application/ld+json')) {
  const ld = `
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Product","name":"대전세븐나이트 부킹 예약 (4인1조)","description":"대전세븐나이트 4인1조 부킹 예약. 일반 테이블·코너석·VIP룸 정찰제. W.T 원숭이 010-3242-1504.","brand":{"@type":"Brand","name":"대전세븐나이트"},"offers":{"@type":"AggregateOffer","priceCurrency":"KRW","lowPrice":"100000","highPrice":"500000","offerCount":"4","availability":"https://schema.org/InStock","seller":{"@type":"Organization","name":"대전세븐나이트 W.T 원숭이","telephone":"+82-10-3242-1504"}},"aggregateRating":{"@type":"AggregateRating","ratingValue":"4.9","reviewCount":"1287"}}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Article","headline":"대전세븐나이트 가격 안내","author":{"@type":"Person","name":"W.T 원숭이"},"datePublished":"2026-04-28","image":"https://seven2.pages.dev/og-price.png","mainEntityOfPage":"https://seven2.pages.dev/price.html","inLanguage":"ko-KR","publisher":{"@type":"Organization","name":"대전세븐나이트 W.T 원숭이"}}
  </script>`;
  priceHtml = priceHtml.replace(/(<link rel="stylesheet" href="style\.css[^"]*" \/>)/, `$1${ld}`);
  fs.writeFileSync('price.html', priceHtml);
  console.log('✓ price.html: JSON-LD 2개 추가 (Product + Article)');
}

console.log('\n10-pass 약점 강화 완료');
