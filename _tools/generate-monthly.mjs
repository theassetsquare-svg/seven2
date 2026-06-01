// 월 1회 시즌 콘텐츠 자동 생성 (GitHub Actions에서 cron 호출)
// 시즌별 키워드 + 템플릿 회전으로 새 글 생성
import fs from 'fs';

const now = new Date();
const Y = now.getFullYear();
const M = now.getMonth() + 1;

// 월별 시즌 콘텐츠 (자동 회전)
const SEASONS = {
   1: { tag: 'newyear',  kw: '대전 신년회',         h1: '대전 신년회 2차',     sub: '새해 첫 모임, 의미있게',         eyebrow: '신년 모임' },
   2: { tag: 'valentine',kw: '대전 발렌타인 데이트',h1: '발렌타인 대전',       sub: '여친 연인 잊지 못할 밤',         eyebrow: '커플 데이트' },
   3: { tag: 'newterm',  kw: '대전 새학기 모임',    h1: '대전 새학기 회식',    sub: '동기·친구·동아리',               eyebrow: '봄 시즌' },
   4: { tag: 'spring',   kw: '대전 봄 데이트',      h1: '대전 봄 모임',         sub: '꽃놀이 끝나고 한 잔',            eyebrow: '봄 시즌' },
   5: { tag: 'family',   kw: '대전 어버이날 후',    h1: '5월 가족 모임',        sub: '가정의 달 마무리',               eyebrow: '5월 시즌' },
   6: { tag: 'summer',   kw: '대전 여름 야간',      h1: '대전 여름밤',          sub: '시원한 한 잔',                    eyebrow: '여름 시즌' },
   7: { tag: 'vacation', kw: '대전 휴가 모임',      h1: '대전 휴가 만남',       sub: '여름휴가 동기 모임',              eyebrow: '여름 휴가' },
   8: { tag: 'mt',       kw: '대전 MT 야간',        h1: '대전 MT 마지막밤',    sub: '대학 동아리 끝판',                eyebrow: 'MT 시즌' },
   9: { tag: 'autumn',   kw: '대전 가을 회식',      h1: '대전 가을 회식',       sub: '추석 끝, 일상 복귀',              eyebrow: '가을 시즌' },
  10: { tag: 'halloween',kw: '대전 할로윈 파티',    h1: '대전 할로윈',          sub: '코스튬 입고 한 판',               eyebrow: '핼러윈' },
  11: { tag: 'pepero',   kw: '대전 11월 모임',      h1: '대전 가을밤',          sub: '연말 시작 전 한 잔',              eyebrow: '11월' },
  12: { tag: 'yearend',  kw: '대전 송년회 2차',     h1: '대전 송년회',          sub: '한 해 마무리, 제대로',           eyebrow: '송년회 시즌' }
};

const s = SEASONS[M];
const fileName = `season-${Y}-${String(M).padStart(2,'0')}.html`;

// 페이지 템플릿
const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${s.h1} ${Y}년 ${M}월 - 둔산동 세븐나이트 W.T 원숭이 010-3242-1504</title>
  <meta name="description" content="${Y}년 ${M}월 ${s.h1}. ${s.kw} 둔산동 세븐나이트가 정답. 4인1조 부킹 즉시 세팅. W.T 원숭이 010-3242-1504." />
  <meta name="keywords" content="${s.kw}, 대전세븐나이트, 둔산동나이트, 대전 ${M}월 모임, ${s.kw} 추천, ${Y}년 대전" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <meta name="naverbot" content="index, follow" />
  <meta name="yeti" content="index, follow" />
  <link rel="canonical" href="https://theassetsquare-svg.github.io/seven2/${fileName}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${s.h1} ${Y}년 ${M}월 - 둔산동 세븐나이트" />
  <meta property="og:description" content="${s.kw} 둔산동 세븐나이트. 4인1조 부킹." />
  <meta property="og:url" content="https://theassetsquare-svg.github.io/seven2/${fileName}" />
  <meta property="og:image" content="https://theassetsquare-svg.github.io/seven2/og-home.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="1200" />
  <meta property="og:locale" content="ko_KR" />
  <meta name="thumbnail" content="https://theassetsquare-svg.github.io/seven2/og-home.png" />
  <link rel="stylesheet" href="/seven2/style.css" />

  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Article","headline":"${s.h1} ${Y}년 ${M}월","author":{"@type":"Person","name":"W.T 원숭이"},"datePublished":"${Y}-${String(M).padStart(2,'0')}-01","dateModified":"${now.toISOString().slice(0,10)}","image":"https://theassetsquare-svg.github.io/seven2/og-home.png","mainEntityOfPage":"https://theassetsquare-svg.github.io/seven2/${fileName}","inLanguage":"ko-KR"}
  </script>
</head>
<body>
  <div class="callbar">
    <a href="tel:01032421504" class="callbar__btn">
      <span class="callbar__pulse"></span>
      ☎ 010-3242-1504 · ${s.h1} 즉시 예약
    </a>
  </div>

  <header class="hero">
    <nav class="nav">
      <a href="/seven2/">홈</a>
      <a href="/seven2/guide.html">가이드</a>
      <a href="/seven2/reviews.html">후기</a>
      <a href="/seven2/price.html">가격</a>
      <a href="/seven2/faq.html">FAQ</a>
    </nav>
    <div class="hero__inner">
      <p class="hero__eyebrow">${s.eyebrow} · ${Y}년 ${M}월</p>
      <h1 class="hero__title">${s.h1}<br /><span class="hero__brand">세븐나이트</span></h1>
      <p class="hero__sub">${s.sub}. 둔산동 W.T 원숭이가 책임 안내.</p>
    </div>
  </header>

  <main class="section" style="max-width:820px">
    <article>
      <h2>${Y}년 ${M}월 ${s.h1}, 어디로?</h2>
      <p class="lead">
        ${Y}년 ${M}월, ${s.kw}을 찾는 분들께 가장 많이 추천되는 곳. 둔산동 세븐나이트입니다.
        <strong>4인1조 부킹 라인 우선 배정</strong>으로 자리 빠르게 잡고, 정찰제로 결제도 깔끔합니다.
      </p>

      <h2>${s.h1} 추천 이유</h2>
      <ul>
        <li><strong>단체 즉시 세팅</strong> — 4~20인 자리 한 번에</li>
        <li><strong>정찰제</strong> — 도착 후 추가요금 없음</li>
        <li><strong>VIP룸</strong> — 프라이빗 공간 즉시 가능</li>
        <li><strong>24시간 응대</strong> — 도착 30분 전 전화면 끝</li>
      </ul>

      <h2>예약 방법</h2>
      <p>
        <strong>전화 한 통 끝</strong>: 010-3242-1504. 인원·도착 시각만 알려주세요.
      </p>

      <p style="text-align:center;margin-top:40px">
        <a href="tel:01032421504" class="btn btn--primary btn--xl">☎ 010-3242-1504</a>
      </p>

      <h2>관련 페이지</h2>
      <ul>
        <li><a href="/seven2/hoesik-2cha.html">대전 회식 2차</a></li>
        <li><a href="/seven2/birthday.html">생일파티 VIP룸</a></li>
        <li><a href="/seven2/group.html">단체 모임 8~20인</a></li>
        <li><a href="/seven2/first-visit.html">처음 방문 가이드</a></li>
      </ul>
    </article>
  </main>

  <footer class="footer">
    <p><strong>대전세븐나이트 · W.T 원숭이</strong> · <a href="tel:01032421504">010-3242-1504</a></p>
    <p class="footer__legal">⚠ 만 19세 이상 이용. 청소년 출입·고용 금지.</p>
  </footer>
</body>
</html>`;

fs.writeFileSync(fileName, html);
console.log(`✓ ${fileName} 생성 (${s.kw})`);

// 사이트맵에 추가
let sm = fs.readFileSync('sitemap.xml', 'utf-8');
const newEntry = `  <url><loc>https://theassetsquare-svg.github.io/seven2/${fileName}</loc><lastmod>${now.toISOString().slice(0,10)}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n</urlset>`;
if (!sm.includes(fileName)) {
  sm = sm.replace('</urlset>', newEntry);
  fs.writeFileSync('sitemap.xml', sm);
  console.log('✓ sitemap.xml 업데이트');
}

console.log(`\n${Y}년 ${M}월 시즌 콘텐츠 생성 완료`);
