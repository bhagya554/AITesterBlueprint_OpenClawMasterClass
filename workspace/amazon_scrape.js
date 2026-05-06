const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    Object.defineProperty(navigator, 'plugins', { get: () => [{name: "Chrome PDF Plugin"}, {name: "Native Client"}] });
    window.chrome = { runtime: {} };
  });
  
  // Try Amazon with cookies first
  console.log('=== AMAZON.IN: iPhone 16 ===');
  await page.goto('https://www.amazon.in', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  
  // Type search query
  await page.fill('#twotabsearchtextbox', 'iPhone 16');
  await page.press('#twotabsearchtextbox', 'Enter');
  await page.waitForTimeout(5000);
  
  // Take screenshot
  await page.screenshot({ path: 'C:\\Users\\91733\\.openclaw\\workspace\\amazon_iphone16_results.png' });
  
  // Get page content to analyze
  const htmlContent = await page.content();
  
  // Check if we got 503
  if (htmlContent.includes('503') || htmlContent.includes('Oops!')) {
    console.log('Amazon returned 503 error - bot detection triggered');
  }
  
  // Try to get visible text
  const visibleText = await page.evaluate(() => {
    const results = [];
    const items = document.querySelectorAll('[data-component-type="s-search-result"]');
    items.forEach((item, i) => {
      if (i < 5) {
        const title = item.innerText.split('\n')[0];
        const priceMatch = item.innerText.match(/₹[\d,]+/);
        results.push({
          title: title.substring(0, 100),
          price: priceMatch ? priceMatch[0] : 'No price found'
        });
      }
    });
    return results;
  });
  
  console.log('Amazon visible results:', JSON.stringify(visibleText, null, 2));
  
  // Try Flipkart
  console.log('\n=== FLIPKART: iPhone 16 ===');
  await page.goto('https://www.flipkart.com/search?q=iphone+16&otracker=search&otracker1=search&marketplace=FLIPKART', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);
  
  await page.screenshot({ path: 'C:\\Users\\91733\\.openclaw\\workspace\\flipkart_iphone16_results.png' });
  
  const flipkartVisible = await page.evaluate(() => {
    const results = [];
    const items = document.querySelectorAll('._1AtVbE, [data-id]');
    items.forEach((item, i) => {
      if (i < 5) {
        const text = item.innerText;
        const title = text.split('\n')[0];
        const priceMatch = text.match(/₹[\d,]+/);
        results.push({
          title: title.substring(0, 100),
          price: priceMatch ? priceMatch[0] : 'No price found'
        });
      }
    });
    return results;
  });
  
  console.log('Flipkart visible results:', JSON.stringify(flipkartVisible, null, 2));
  
  await browser.close();
})();
