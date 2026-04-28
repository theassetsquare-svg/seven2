// 풀 강도 sitemap.xml 자동 생성 (Google/Naver 권장 사양 준수)
import fs from 'fs';

const HOST = 'https://seven2.pages.dev';
const NOW = new Date().toISOString();

// 각 페이지 + 페이지별 이미지 + 메타데이터
const PAGES = [
  { loc: '/',                  img: 'og-home.png',     priority: '1.0', freq: 'daily',
    title: '대전세븐나이트 W.T 원숭이',  caption: '대전 둔산동 No.1 나이트 4인1조 부킹' },
  { loc: '/guide.html',        img: 'og-guide.png',    priority: '0.9', freq: 'weekly',
    title: '대전세븐나이트 완벽 가이드',  caption: '위치·시스템·부킹 전부 정리' },
  { loc: '/reviews.html',      img: 'og-reviews.png',  priority: '0.9', freq: 'weekly',
    title: '대전세븐나이트 후기 모음',   caption: '실제 방문자 1,287건 평점 4.9' },
  { loc: '/price.html',        img: 'og-price.png',    priority: '0.8', freq: 'weekly',
    title: '대전세븐나이트 가격 안내',   caption: '정찰제 운영 바가지 없음' },
  { loc: '/faq.html',          img: 'og-faq.png',      priority: '0.8', freq: 'weekly',
    title: '대전세븐나이트 FAQ 30선',    caption: '예약 전 자주 묻는 질문' },
  { loc: '/hoesik-2cha.html',  img: 'og-hoesik.png',   priority: '0.8', freq: 'weekly',
    title: '대전 회식 2차 추천',         caption: '둔산동 직장인 회식 정답' },
  { loc: '/birthday.html',     img: 'og-birthday.png', priority: '0.8', freq: 'weekly',
    title: '대전 생일파티 장소',         caption: 'VIP룸 + 케이크 세팅' },
  { loc: '/first-visit.html',  img: 'og-first.png',    priority: '0.8', freq: 'weekly',
    title: '대전 나이트 처음 가는 법',   caption: '초보자 5단계 가이드' },
  { loc: '/group.html',        img: 'og-group.png',    priority: '0.8', freq: 'weekly',
    title: '대전 단체 모임 장소',         caption: 'VIP룸 8~20인' }
];

const xml = [];
xml.push('<?xml version="1.0" encoding="UTF-8"?>');
xml.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
xml.push('        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
xml.push('        xmlns:xhtml="http://www.w3.org/1999/xhtml">');

for (const p of PAGES) {
  xml.push('  <url>');
  xml.push(`    <loc>${HOST}${p.loc}</loc>`);
  xml.push(`    <lastmod>${NOW}</lastmod>`);
  xml.push(`    <changefreq>${p.freq}</changefreq>`);
  xml.push(`    <priority>${p.priority}</priority>`);
  xml.push(`    <image:image>`);
  xml.push(`      <image:loc>${HOST}/${p.img}</image:loc>`);
  xml.push(`      <image:title>${p.title}</image:title>`);
  xml.push(`      <image:caption>${p.caption}</image:caption>`);
  xml.push(`    </image:image>`);
  xml.push('  </url>');
}
xml.push('</urlset>');

fs.writeFileSync('sitemap.xml', xml.join('\n') + '\n');
console.log(`✓ sitemap.xml 생성 — ${PAGES.length}개 URL + ${PAGES.length}개 이미지 (Google 이미지 검색용)`);
console.log(`  - lastmod: ${NOW}`);
console.log(`  - 호스트: ${HOST}`);
