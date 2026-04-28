// IndexNow ping - Bing/Yandex/Naver(2024+)에 즉시 인덱싱 통지
// 사용법: node _tools/indexnow.mjs
const KEY = 'bd0c822862ed44539963709b53f2ef76';
const HOST = 'theassetsquare-svg.github.io';
const SITE = `https://${HOST}/seven2/`;

const PAGES = [
  '', 'guide.html', 'reviews.html', 'price.html', 'faq.html',
  'hoesik-2cha.html', 'birthday.html', 'first-visit.html', 'group.html'
];

const body = {
  host: HOST,
  key: KEY,
  keyLocation: `${SITE}${KEY}.txt`,
  urlList: PAGES.map(p => SITE + p)
};

// IndexNow 엔드포인트들 (모두 같은 IndexNow 네트워크 공유)
const ENDPOINTS = [
  'https://api.indexnow.org/indexnow',  // 통합
  'https://www.bing.com/indexnow',      // Bing (=ChatGPT/Copilot)
  'https://yandex.com/indexnow',        // Yandex
  'https://searchadvisor.naver.com/indexnow' // Naver (2024년 도입)
];

console.log('IndexNow ping 시작...');
console.log(`URL ${body.urlList.length}개 통지`);

for (const ep of ENDPOINTS) {
  try {
    const res = await fetch(ep, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    console.log(`${res.status} ${res.statusText}  ←  ${ep}`);
  } catch (e) {
    console.log(`ERR  ←  ${ep}: ${e.message}`);
  }
}

console.log('\n완료. 일반적으로 24~72시간 내 인덱싱 반영.');
