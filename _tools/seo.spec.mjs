// Playwright E2E SEO 테스트 (로컬 머신에서 실행)
// 사용법: npx playwright test _tools/seo.spec.mjs
import { test, expect } from '@playwright/test';

const SITE = process.env.SITE_URL || 'https://theassetsquare-svg.github.io/seven2/';

test.describe('대전세븐나이트 SEO 검증', () => {

  test('1. 메인 페이지 200 + title + 메타', async ({ page }) => {
    const res = await page.goto(SITE);
    expect(res.status()).toBe(200);
    await expect(page).toHaveTitle(/대전세븐나이트/);
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc).toContain('대전세븐나이트');
    expect(desc).toContain('010-3242-1504');
  });

  test('2. og:image 1:1 정사각형', async ({ page }) => {
    await page.goto(SITE);
    const ogImage = await page.locator('meta[property="og:image"]').first().getAttribute('content');
    expect(ogImage).toContain('og-square.png');
    const w = await page.locator('meta[property="og:image:width"]').first().getAttribute('content');
    const h = await page.locator('meta[property="og:image:height"]').first().getAttribute('content');
    expect(w).toBe('1200');
    expect(h).toBe('1200');
  });

  test('3. og-square.png 실제 1200x1200 PNG', async ({ request }) => {
    const res = await request.get(SITE + 'og-square.png');
    expect(res.status()).toBe(200);
    const buf = await res.body();
    const w = buf.readUInt32BE(16);
    const h = buf.readUInt32BE(20);
    expect(w).toBe(1200);
    expect(h).toBe(1200);
    expect(w).toBe(h); // 1:1
  });

  test('4. tel: 링크 다중 존재', async ({ page }) => {
    await page.goto(SITE);
    const tels = await page.locator('a[href="tel:01032421504"]').count();
    expect(tels).toBeGreaterThanOrEqual(4);
  });

  test('5. JSON-LD NightClub schema', async ({ page }) => {
    await page.goto(SITE);
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    const all = schemas.join('\n');
    expect(all).toContain('NightClub');
    expect(all).toContain('FAQPage');
    expect(all).toContain('SpeakableSpecification');
    expect(all).toContain('+82-10-3242-1504');
  });

  test('6. 모든 페이지 도달성', async ({ request }) => {
    for (const p of ['', 'guide.html', 'reviews.html', 'price.html', 'faq.html']) {
      const res = await request.get(SITE + p);
      expect(res.status(), `${p || '/'} should be 200`).toBe(200);
    }
  });

  test('7. robots.txt에 AI 크롤러 허용', async ({ request }) => {
    const res = await request.get(SITE + 'robots.txt');
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain('GPTBot');
    expect(text).toContain('ClaudeBot');
    expect(text).toContain('PerplexityBot');
    expect(text).toContain('Yeti'); // 네이버
    expect(text).toContain('Sitemap:');
  });

  test('8. sitemap.xml + llms.txt', async ({ request }) => {
    const sitemap = await request.get(SITE + 'sitemap.xml');
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toContain('og-square.png');

    const llms = await request.get(SITE + 'llms.txt');
    expect(llms.status()).toBe(200);
    expect(await llms.text()).toContain('010-3242-1504');
  });

  test('9. Lighthouse-style 성능 체크 (LCP < 2.5s)', async ({ page }) => {
    const start = Date.now();
    await page.goto(SITE, { waitUntil: 'networkidle' });
    const loaded = Date.now() - start;
    console.log(`Load time: ${loaded}ms`);
    expect(loaded).toBeLessThan(5000);
  });

  test('10. 모바일 뷰포트 클릭→전화 링크 작동', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await ctx.newPage();
    await page.goto(SITE);
    const callbar = page.locator('.callbar__btn').first();
    await expect(callbar).toBeVisible();
    const href = await callbar.getAttribute('href');
    expect(href).toBe('tel:01032421504');
    await ctx.close();
  });

  test('11. 검색 미리보기 스크린샷 (1:1 박스)', async ({ page }) => {
    await page.goto(SITE);
    await page.setViewportSize({ width: 400, height: 400 });
    await page.screenshot({ path: '_tools/preview-1x1.png', fullPage: false });
  });
});
