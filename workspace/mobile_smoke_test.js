const { chromium, devices } = require('playwright');

const REPORT = {
  passed: [],
  failed: [],
  warnings: []
};

function pass(msg) {
  REPORT.passed.push(msg);
  console.log(`✅ PASSED: ${msg}`);
}

function fail(msg, details = '') {
  REPORT.failed.push({ msg, details });
  console.log(`❌ FAILED: ${msg}${details ? ' | ' + details : ''}`);
}

function warn(msg) {
  REPORT.warnings.push(msg);
  console.log(`⚠️ WARNING: ${msg}`);
}

async function runSmokeTest() {
  const browser = await chromium.launch({ headless: true });
  
  // Use iPhone 13 viewport as mobile test device
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  });
  
  const page = await context.newPage();
  
  // === TEST 1: Mobile Responsiveness ===
  console.log('\n--- TEST 1: Mobile Responsiveness ---');
  try {
    const response = await page.goto('https://app.vwo.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
    const status = response.status();
    const title = await page.title();
    
    if (status === 200) {
      pass(`Site loads on mobile viewport (status ${status}, title: "${title}")`);
    } else {
      fail('Site did not load properly', `HTTP ${status}`);
    }
    
    // Check viewport meta tag
    const viewportMeta = await page.$eval('meta[name="viewport"]', el => el.content).catch(() => null);
    if (viewportMeta) {
      pass(`Viewport meta tag present: "${viewportMeta}"`);
    } else {
      warn('No viewport meta tag found - may cause scaling issues');
    }
    
    // Check for horizontal scroll (shouldn't happen on mobile)
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const windowWidth = await page.evaluate(() => window.innerWidth);
    if (bodyScrollWidth > windowWidth) {
      fail('Horizontal scrolling detected', `body.scrollWidth (${bodyScrollWidth}) > window.innerWidth (${windowWidth})`);
    } else {
      pass('No horizontal scroll issues detected');
    }
    
    await page.screenshot({ path: 'mobile_homepage.png', fullPage: false });
    
  } catch (e) {
    fail('Mobile Responsiveness test error', e.message);
  }
  
  // === TEST 2: Touch Navigation ===
  console.log('\n--- TEST 2: Touch Navigation ---');
  try {
    // Check for hamburger menu or mobile nav
    const navButtons = await page.$$('button, [role="button"], a');
    let smallTouchTargets = 0;
    let totalButtons = 0;
    
    for (const btn of navButtons.slice(0, 30)) {
      const box = await btn.boundingBox();
      if (box) {
        totalButtons++;
        // WCAG recommends 44x44px minimum touch targets
        if (box.width < 44 || box.height < 44) {
          smallTouchTargets++;
        }
      }
    }
    
    if (smallTouchTargets > 0) {
      warn(`${smallTouchTargets}/${totalButtons} interactive elements have touch targets smaller than 44x44px`);
    } else {
      pass('Touch targets appear adequately sized');
    }
    
    // Try clicking main nav elements
    const clickableLinks = await page.$$('a, button');
    let clickableCount = 0;
    for (const el of clickableLinks.slice(0, 10)) {
      if (await el.isVisible().catch(() => false)) {
        clickableCount++;
      }
    }
    pass(`${clickableCount} visible interactive elements found for touch navigation`);
    
  } catch (e) {
    fail('Touch Navigation test error', e.message);
  }
  
  // === TEST 3: Login on Mobile ===
  console.log('\n--- TEST 3: Login on Mobile ---');
  try {
    // Look for login link/button
    const loginLink = await page.$('text=/Log ?[Ii]n|Sign ?[Ii]n/');
    const loginBtn = await page.$('a[href*="login"], button:has-text("Login"), button:has-text("Sign in")');
    
    if (loginLink || loginBtn) {
      pass('Login link/button found on mobile homepage');
      
      // Try navigating to login page
      const loginElement = loginLink || loginBtn;
      await loginElement.click();
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      
      await page.screenshot({ path: 'mobile_login.png', fullPage: false });
      
      // Check for form inputs
      const inputs = await page.$$('input[type="email"], input[type="text"], input[type="password"], input[placeholder*="email" i], input[placeholder*="password" i]');
      if (inputs.length >= 2) {
        pass('Login form inputs visible on mobile');
      } else if (inputs.length > 0) {
        warn('Only partial login form inputs found');
      } else {
        warn('Could not verify login form inputs (may be on different page)');
      }
    } else {
      warn('No obvious login link found - may require direct URL navigation');
      // Try direct login URL
      await page.goto('https://app.vwo.com/login', { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {});
      const url = page.url();
      if (url.includes('login')) {
        pass('Direct /login URL accessible on mobile');
        await page.screenshot({ path: 'mobile_login.png', fullPage: false });
      }
    }
  } catch (e) {
    fail('Login on Mobile test error', e.message);
  }
  
  // === TEST 4: Dashboard Mobile View ===
  console.log('\n--- TEST 4: Dashboard Mobile View ---');
  try {
    // Try to access dashboard (usually requires login, so we check if redirected properly)
    const dashResponse = await page.goto('https://app.vwo.com/dashboard', { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => null);
    
    if (dashResponse) {
      const url = page.url();
      if (url.includes('dashboard')) {
        pass('Dashboard page loads on mobile viewport');
        await page.screenshot({ path: 'mobile_dashboard.png', fullPage: false });
      } else if (url.includes('login')) {
        pass('Dashboard properly redirects to login when unauthenticated (expected behavior)');
      } else {
        warn(`Dashboard navigation resulted in: ${url}`);
      }
    }
  } catch (e) {
    fail('Dashboard Mobile View test error', e.message);
  }
  
  // === TEST 5: Form Inputs ===
  console.log('\n--- TEST 5: Form Inputs ---');
  try {
    // Go back to login or homepage
    await page.goto('https://app.vwo.com', { waitUntil: 'domcontentloaded', timeout: 20000 });
    
    // Find any form inputs
    const allInputs = await page.$$('input, textarea, select');
    const visibleInputs = [];
    for (const inp of allInputs.slice(0, 20)) {
      if (await inp.isVisible().catch(() => false)) {
        visibleInputs.push(inp);
      }
    }
    
    if (visibleInputs.length > 0) {
      pass(`${visibleInputs.length} visible form inputs found`);
      
      // Check input types for mobile keyboard support
      const inputTypes = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('input')).map(i => ({
          type: i.type,
          inputmode: i.inputMode,
          placeholder: i.placeholder?.slice(0, 20)
        }));
      });
      
      const hasEmailType = inputTypes.some(i => i.type === 'email');
      const hasTelType = inputTypes.some(i => i.type === 'tel');
      const hasNumberType = inputTypes.some(i => i.type === 'number');
      const hasInputMode = inputTypes.some(i => i.inputmode);
      
      if (hasEmailType || hasTelType || hasNumberType || hasInputMode) {
        pass('Mobile-friendly input types detected (email/tel/number/inputmode)');
      } else {
        warn('No specialized mobile input types found - generic keyboard will show');
      }
    } else {
      warn('No visible form inputs on current page');
    }
    
  } catch (e) {
    fail('Form Inputs test error', e.message);
  }
  
  // === FINAL REPORT ===
  console.log('\n========== MOBILE SMOKE TEST REPORT ==========');
  console.log(`✅ Passed: ${REPORT.passed.length}`);
  console.log(`❌ Failed: ${REPORT.failed.length}`);
  console.log(`⚠️ Warnings: ${REPORT.warnings.length}`);
  
  console.log('\n--- PASSED ---');
  REPORT.passed.forEach(p => console.log(`  ✅ ${p}`));
  
  if (REPORT.failed.length > 0) {
    console.log('\n--- FAILED ---');
    REPORT.failed.forEach(f => console.log(`  ❌ ${f.msg}${f.details ? ' | ' + f.details : ''}`));
  }
  
  if (REPORT.warnings.length > 0) {
    console.log('\n--- WARNINGS ---');
    REPORT.warnings.forEach(w => console.log(`  ⚠️ ${w}`));
  }
  
  await browser.close();
}

runSmokeTest().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
