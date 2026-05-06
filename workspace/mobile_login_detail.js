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
  
  // Direct login page with longer wait
  console.log('--- Loading /login directly with wait ---');
  await page.goto('https://app.vwo.com/login', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(5000);
  console.log('URL:', page.url());
  console.log('Title:', await page.title());
  
  // Try to find inputs in various ways
  const inputsBySelector = await page.$$('input');
  console.log('Inputs by "input" selector:', inputsBySelector.length);
  
  const inputsByRole = await page.$$('[role="textbox"], [role="input"]');
  console.log('Inputs by role:', inputsByRole.length);
  
  // Check if content is in iframe
  const frames = page.frames();
  console.log('Number of frames:', frames.length);
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    const fInputs = await f.$$('input');
    console.log(`  Frame ${i}: ${fInputs.length} inputs`);
    if (fInputs.length > 0) {
      for (const inp of fInputs) {
        const type = await inp.getAttribute('type');
        const placeholder = await inp.getAttribute('placeholder');
        console.log(`    input type=${type} placeholder=${placeholder}`);
      }
    }
  }
  
  // Get full page HTML snapshot (truncated)
  const html = await page.content();
  console.log('\n--- HTML body snippet ---');
  const bodyMatch = html.match(/<body[^>]*>([\s\S]{0,2000})/);
  if (bodyMatch) {
    console.log(bodyMatch[1].replace(/\s+/g, ' ').slice(0, 1500));
  }
  
  // Check for shadow DOM
  const shadowHosts = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    return all.filter(el => el.shadowRoot).length;
  });
  console.log('\nElements with shadow DOM:', shadowHosts);
  
  // Check page text content for clues
  const textContent = await page.evaluate(() => document.body.innerText.slice(0, 500));
  console.log('\nPage text (first 500 chars):', textContent);
  
  await page.screenshot({ path: 'mobile_login_detailed.png', fullPage: true });
  console.log('\nScreenshot saved: mobile_login_detailed.png');
  
  await browser.close();
})();
