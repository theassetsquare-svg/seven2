# 대전세븐나이트 — W.T 원숭이 랜딩페이지

대전세븐나이트 4인1조 부킹 W.T 원숭이 (☎ 010-3242-1504) 공식 랜딩페이지.
네이버·구글·AI 검색 상위노출용 SEO 풀패키지 적용.

## 구조

```
seven2/
├─ index.html         # 메인 페이지 (Korean SEO + JSON-LD 6종)
├─ style.css          # 모바일 우선 다크테마
├─ main.js            # 클릭 트래킹 + exit-intent 모달
├─ robots.txt         # Yeti(네이버), Googlebot, Daumoa 허용
├─ sitemap.xml        # 검색엔진용 사이트맵
├─ site.webmanifest   # PWA + tel: 단축아이콘
├─ favicon.svg        # 인라인 SVG 파비콘
└─ README.md
```

## 적용된 SEO 항목

- **메타 태그** — title(60자), description(155자), 한글 키워드 14개, 지역 메타(geo.region=KR-30 대전)
- **Open Graph + Twitter Card** — 카톡/페이스북/트위터 미리보기 대응
- **JSON-LD 구조화 데이터 6종** — NightClub, LocalBusiness, FAQPage, WebSite, BreadcrumbList, Organization
- **검색엔진 인증** — Google / Naver(yeti) / Daum 봇 허용 + 사이트 인증 메타 슬롯
- **시맨틱 HTML5** — header/nav/main/section/footer/article 구조, h1 단일
- **모바일 우선** — viewport, 반응형 그리드, prefers-reduced-motion 대응
- **접근성** — skip-link, ARIA, lang=ko, 색상대비 WCAG AA
- **성능** — preconnect, preload, defer, lazy-loading
- **PWA** — site.webmanifest + tel: 단축아이콘

## 자연스러운 체류시간 ↑ 장치 (어뷰징 X)

1. 후기 4건 + 평균별점 (스크롤 시 시선 잡기)
2. FAQ 8건 — 누르면 펼쳐지는 details (네이버에서 좋아함)
3. 4인1조 시스템 단계 5스텝
4. exit-intent 모달 (데스크톱에서 마우스가 위로 빠질 때 한 번)
5. 섹션 페이드인 인터랙션
6. 상단 sticky 통화바 (전화 1탭)

## 클릭 → 전화 즉시 연결

모든 CTA는 `<a href="tel:01032421504">`. iOS/Android 양쪽에서 1탭으로 다이얼러 호출.

- 상단 sticky 바
- 히어로 메인 버튼
- 최종 CTA (페이지 하단)
- exit-intent 모달
- 푸터 전화번호

## 사용자가 직접 채워야 하는 값

| 위치 | 항목 | 비고 |
|---|---|---|
| `index.html` `meta[name=google-site-verification]` | 구글 서치콘솔 인증코드 | search.google.com/search-console |
| `index.html` `meta[name=naver-site-verification]` | 네이버 서치어드바이저 인증코드 | searchadvisor.naver.com |
| `og-image.png` | 1200×630 OG 이미지 | 카톡/페북 공유시 노출 |
| `apple-touch-icon.png` | 180×180 PNG | iOS 홈화면 아이콘 |
| `index.html` `meta[property=og:url]` 등 | 도메인 | 자체도메인 사면 전체 교체 |

## 배포 (GitHub Pages)

```bash
git remote add origin https://github.com/theassetsquare-svg/seven2.git
git add .
git commit -m "대전세븐나이트 W.T 원숭이 랜딩페이지 + 풀 SEO"
git branch -M main
git push -u origin main
```

이후 GitHub 저장소 → Settings → Pages → Source: `main` / `/ (root)` 선택.
배포 URL: `https://seven2.pages.dev/`

## 검색 등록 (배포 직후 필수)

1. **네이버 서치어드바이저** — https://searchadvisor.naver.com → 사이트 등록 → 사이트맵 제출
2. **구글 서치콘솔** — https://search.google.com/search-console → URL 접두어 등록 → sitemap.xml 제출
3. **다음(카카오) 검색등록** — https://register.search.daum.net
4. **빙 웹마스터** — https://www.bing.com/webmasters
5. **네이버 플레이스** — 매장 위치 등록 (오프라인 매장이 있다면 필수)

## 법적 고지

만 19세 이상 이용. 청소년 출입·고용 금지. 음주운전 절대 금물 (대리운전 권장).
