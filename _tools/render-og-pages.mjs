// 페이지별 OG 이미지 자동 생성 (1:1 정사각, 1200x1200)
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';

const PAGES = [
  { file: 'og-home',        eyebrow: '대전 둔산동 NO.1',     title: '대전세븐나이트',    sub: '4인1조 W.T 원숭이',     bg1: '#ff2d55', bg2: '#ff6b00', cta: '☎ 010-3242-1504' },
  { file: 'og-hoesik',      eyebrow: '대전 직장인 회식',      title: '대전 회식 2차',     sub: '둔산동 정답',           bg1: '#0066ff', bg2: '#5b00ff', cta: '☎ 010-3242-1504' },
  { file: 'og-birthday',    eyebrow: '대전 생일파티',         title: '인생 생일파티',     sub: 'VIP룸 + 케이크 세팅',  bg1: '#ff006e', bg2: '#fb5607', cta: '☎ 010-3242-1504' },
  { file: 'og-first',       eyebrow: '초보자 가이드',         title: '나이트 처음?',       sub: '걱정마, 다 챙겨드림',  bg1: '#06ffa5', bg2: '#0066ff', cta: '☎ 010-3242-1504' },
  { file: 'og-group',       eyebrow: '8~20인 단체',          title: '단체 모임',          sub: 'VIP룸 즉시 세팅',       bg1: '#7209b7', bg2: '#3a0ca3', cta: '☎ 010-3242-1504' },
  { file: 'og-guide',       eyebrow: '완벽 가이드',           title: '대전세븐나이트',    sub: '위치·시스템·부킹',     bg1: '#ffbe0b', bg2: '#fb5607', cta: '☎ 010-3242-1504' },
  { file: 'og-reviews',     eyebrow: '실제 방문 후기',        title: '★ 4.9 / 5.0',       sub: '누적 1,287건',          bg1: '#ffd60a', bg2: '#ff8500', cta: '☎ 010-3242-1504' },
  { file: 'og-price',       eyebrow: '투명한 정찰제',         title: '바가지 NO',         sub: '사전 정확 견적',        bg1: '#06d6a0', bg2: '#118ab2', cta: '☎ 010-3242-1504' },
  { file: 'og-faq',         eyebrow: 'FAQ 30선',             title: '자주 묻는 질문',    sub: '예약 전 확인',          bg1: '#8338ec', bg2: '#3a86ff', cta: '☎ 010-3242-1504' }
];

const buildSvg = ({ eyebrow, title, sub, bg1, bg2, cta }) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="1200" height="1200">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a0a"/>
      <stop offset="100%" stop-color="#1a0a14"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="${bg1}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${bg1}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="cta" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${bg1}"/>
      <stop offset="100%" stop-color="${bg2}"/>
    </linearGradient>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffd84d"/>
      <stop offset="100%" stop-color="${bg2}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="1200" fill="url(#bg)"/>
  <ellipse cx="600" cy="450" rx="700" ry="500" fill="url(#glow)"/>

  <text x="600" y="200" text-anchor="middle" fill="${bg1}"
        font-family="sans-serif" font-size="40" font-weight="700" letter-spacing="6">${eyebrow}</text>

  <text x="600" y="430" text-anchor="middle" fill="#ffffff"
        font-family="sans-serif" font-size="140" font-weight="900" letter-spacing="-2">${title}</text>

  <text x="600" y="560" text-anchor="middle" fill="url(#brand)"
        font-family="sans-serif" font-size="80" font-weight="900">${sub}</text>

  <line x1="200" y1="640" x2="1000" y2="640" stroke="${bg1}" stroke-width="3" opacity="0.4"/>

  <text x="600" y="740" text-anchor="middle" fill="#ffffff"
        font-family="sans-serif" font-size="44" font-weight="700">대전 둔산동 · 24시간 친절상담</text>

  <rect x="200" y="820" width="800" height="180" rx="90" fill="url(#cta)"/>
  <text x="600" y="930" text-anchor="middle" fill="#ffffff"
        font-family="sans-serif" font-size="76" font-weight="900" letter-spacing="2">${cta}</text>

  <text x="600" y="1070" text-anchor="middle" fill="#cccccc"
        font-family="sans-serif" font-size="32" font-weight="500">매일 20:00 ~ 05:00 · 연중무휴 · W.T 원숭이</text>

  <text x="600" y="1130" text-anchor="middle" fill="#888888"
        font-family="sans-serif" font-size="24" font-weight="400">theassetsquare-svg.github.io/seven2</text>
</svg>`;

for (const p of PAGES) {
  const svg = buildSvg(p);
  const png = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
    background: '#0a0a0a',
    font: { loadSystemFonts: true }
  }).render().asPng();
  fs.writeFileSync(`${p.file}.png`, png);
  console.log(`✓ ${p.file}.png (1200x1200)  ${(png.length / 1024).toFixed(0)} KB`);
}

console.log('\n페이지별 OG 이미지 9종 생성 완료');
