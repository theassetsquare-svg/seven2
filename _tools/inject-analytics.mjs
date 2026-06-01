// GA4 + Naver/Google verification 자동 삽입
// 사용법: GA4_ID=G-XXXX NAVER_KEY=abc GOOGLE_KEY=def node _tools/inject-analytics.mjs
import fs from 'fs';
import path from 'path';

const GA4 = process.env.GA4_ID || 'G-XXXXXXXXXX';
const NAVER = process.env.NAVER_KEY || 'NAVER_VERIFICATION_CODE_HERE';
const GOOGLE = process.env.GOOGLE_KEY || 'GOOGLE_VERIFICATION_CODE_HERE';

const PAGES = ['index.html','guide.html','reviews.html','price.html','faq.html',
               'hoesik-2cha.html','birthday.html','first-visit.html','group.html'];

const ANALYTICS = `
  <!-- Google Analytics 4 -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${GA4}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA4}', { 'anonymize_ip': true });
    // 전화 클릭 자동 이벤트
    document.addEventListener('DOMContentLoaded', function(){
      document.querySelectorAll('a[href^="tel:"]').forEach(function(a){
        a.addEventListener('click', function(){
          gtag('event', 'phone_call', { 'phone_number': '01032421504' });
        });
      });
    });
  </script>
  <!-- /GA4 -->`;

for (const file of PAGES) {
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf-8');

  // 1. 인증 코드 교체
  html = html.replace(/NAVER_VERIFICATION_CODE_HERE/g, NAVER);
  html = html.replace(/GOOGLE_VERIFICATION_CODE_HERE/g, GOOGLE);

  // 2. GA4 삽입 (이미 있으면 교체, 없으면 </head> 직전에)
  if (html.includes('googletagmanager.com/gtag/js')) {
    html = html.replace(/<!-- Google Analytics 4 -->[\s\S]*?<!-- \/GA4 -->/, ANALYTICS.trim());
  } else {
    html = html.replace(/<\/head>/, ANALYTICS + '\n</head>');
  }

  // 3. 인증 메타 없으면 추가 (index.html 외 페이지용)
  if (!html.includes('google-site-verification')) {
    const meta = `\n  <meta name="google-site-verification" content="${GOOGLE}" />\n  <meta name="naver-site-verification" content="${NAVER}" />`;
    html = html.replace(/<link rel="canonical"/, meta + '\n  <link rel="canonical"');
  }

  fs.writeFileSync(file, html);
  console.log(`✓ ${file}`);
}

console.log(`\nGA4 ID: ${GA4}`);
console.log(`Naver: ${NAVER}`);
console.log(`Google: ${GOOGLE}`);
console.log('\n환경변수로 실제 키 넣어 다시 실행하세요:');
console.log('GA4_ID=G-XXXX NAVER_KEY=xxx GOOGLE_KEY=xxx node _tools/inject-analytics.mjs');
