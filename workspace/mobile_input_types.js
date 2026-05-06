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
  await page.waitForTimeout(2000);
  
  const inputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input')).map(i => ({
      type: i.type,
      inputMode: i.inputMode,
      name: i.name,
      placeholder: i.placeholder,
      class: i.className,
      id: i.id
    }));
  });
  
  console.log('Input fields found:');
  inputs.forEach((inp, i) => console.log(`  ${i}: type="${inp.type}" inputMode="${inp.inputMode}" name="${inp.name}" placeholder="${inp.placeholder}"`));
  
  // Check for mobile keyboard support
  const hasEmailType = inputs.some(i => i.type === 'email');
  const hasTelType = inputs.some(i => i.type === 'tel');
  const hasNumberType = inputs.some(i => i.type === 'number');
  const hasInputMode = inputs.some(i => i.inputMode);
  
  console.log('\nMobile keyboard support:');
  console.log(`  Has type="email": ${hasEmailType}`);
  console.log(`  Has type="tel": ${hasTelType}`);
  console.log(`  Has type="number": ${hasNumberType}`);
  console.log(`  Has inputmode attribute: ${hasInputMode}`);
  
  await browser.close();
})();
