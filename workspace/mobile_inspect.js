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
  
  // Inspect all links and buttons
  const elements = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('a, button, [role="button"], input[type="submit"], input[type="button"]'));
    return all.map(el => ({
      tag: el.tagName,
      text: el.textContent?.trim().slice(0, 50),
      href: el.href?.slice(0, 100),
      class: el.className?.slice(0, 100),
      id: el.id,
      visible: !!(el.offsetParent || el.getBoundingClientRect().width > 0),
      rect: el.getBoundingClientRect ? {
        x: Math.round(el.getBoundingClientRect().x),
        y: Math.round(el.getBoundingClientRect().y),
        w: Math.round(el.getBoundingClientRect().width),
        h: Math.round(el.getBoundingClientRect().height)
      } : null
    }));
  });
  
  console.log('All interactive elements on homepage:');
  elements.forEach((el, i) => {
    console.log(`${i}: ${el.tag} | text: "${el.text}" | visible: ${el.visible} | rect: ${JSON.stringify(el.rect)} | href: ${el.href || 'n/a'}`);
  });
  
  // Try clicking login by various selectors
  console.log('\n--- Trying to click login ---');
  const selectors = [
    'a:has-text("Login")',
    'a:has-text("Log in")',
    'a:has-text("Sign in")',
    'button:has-text("Login")',
    'button:has-text("Log in")',
    '[href*="login"]',
    '[href*="signin"]'
  ];
  
  for (const sel of selectors) {
    const el = await page.$(sel);
    if (el) {
      const text = await el.textContent();
      const visible = await el.isVisible().catch(() => false);
      console.log(`Selector "${sel}" found: text="${text?.trim()}", visible=${visible}`);
      if (visible) {
        try {
          await el.click({ timeout: 10000 });
          console.log('Click succeeded!');
          await page.waitForTimeout(3000);
          console.log('URL after click:', page.url());
          await page.screenshot({ path: 'mobile_after_login_click.png' });
          break;
        } catch (e) {
          console.log('Click failed:', e.message);
        }
      }
    } else {
      console.log(`Selector "${sel}" not found`);
    }
  }
  
  // Also try direct login URL
  console.log('\n--- Trying direct /login URL ---');
  await page.goto('https://app.vwo.com/login', { waitUntil: 'networkidle', timeout: 30000 });
  console.log('URL:', page.url());
  
  const loginInputs = await page.$$('input');
  console.log(`Found ${loginInputs.length} inputs on login page`);
  
  for (const inp of loginInputs) {
    const type = await inp.getAttribute('type');
    const placeholder = await inp.getAttribute('placeholder');
    const name = await inp.getAttribute('name');
    const visible = await inp.isVisible().catch(() => false);
    console.log(`  input type=${type} name=${name} placeholder=${placeholder} visible=${visible}`);
  }
  
  await page.screenshot({ path: 'mobile_login_direct.png', fullPage: true });
  
  await browser.close();
})();
