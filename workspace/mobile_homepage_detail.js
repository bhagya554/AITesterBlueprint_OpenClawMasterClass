const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();
  
  await page.goto('https://app.vwo.com', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  
  console.log('URL:', page.url());
  console.log('Title:', await page.title());
  
  // Get page text
  const text = await page.evaluate(() => document.body.innerText);
  console.log('\n--- Full page text ---');
  console.log(text);
  
  // Check all visible elements
  const visibleEls = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('a, button, input, [role="button"], [role="link"]'));
    return all
      .filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.top < window.innerHeight;
      })
      .map(el => ({
        tag: el.tagName,
        text: el.textContent?.trim().slice(0, 60),
        class: el.className?.slice(0, 60),
        href: el.href?.slice(0, 80),
        rect: { x: Math.round(el.getBoundingClientRect().x), y: Math.round(el.getBoundingClientRect().y), w: Math.round(el.getBoundingClientRect().width), h: Math.round(el.getBoundingClientRect().height) }
      }));
  });
  
  console.log('\n--- Visible interactive elements ---');
  visibleEls.forEach((el, i) => console.log(`${i}: ${el.tag} | "${el.text}" | ${JSON.stringify(el.rect)} | class=${el.class}`));
  
  await page.screenshot({ path: 'mobile_homepage_final.png', fullPage: true });
  console.log('\nScreenshot: mobile_homepage_final.png');
  
  await browser.close();
})();
