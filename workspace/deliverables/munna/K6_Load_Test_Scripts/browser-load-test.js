import { browser } from 'k6/experimental/browser';
import { check } from 'k6';

export const options = {
  scenarios: {
    browser: {
      executor: 'shared-iterations',
      vus: 10, // Browser tests are expensive, keep low
      iterations: 50,
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {
    'browser_web_vital_lcp': ['p(95)<2500'],
    'browser_web_vital_fid': ['p(95)<100'],
    'browser_web_vital_cls': ['p(95)<0.1'],
  },
};

export default async function () {
  const page = browser.newPage();

  try {
    // Test 1: Login page LCP
    await page.goto('https://app.vwo.com/login');
    
    check(page, {
      'login page loaded': (p) => p.locator('input[type="email"]').isVisible(),
    });

    // Fill and submit
    await page.locator('input[type="email"]').fill(__ENV.VWO_EMAIL);
    await page.locator('input[type="password"]').fill(__ENV.VWO_PASSWORD);
    await page.locator('button[type="submit"]').click();

    // Wait for dashboard
    await page.waitForSelector('[data-testid="campaign-summary"]');

    check(page, {
      'dashboard loaded': (p) => p.locator('[data-testid="campaign-summary"]').isVisible(),
    });

    // Test 2: Navigate to editor
    await page.goto('https://app.vwo.com/campaigns/e2e-test/editor');
    await page.waitForSelector('[data-testid="editor-canvas"]');

    check(page, {
      'editor canvas loaded': (p) => p.locator('[data-testid="editor-canvas"]').isVisible(),
    });

  } finally {
    await page.close();
  }
}
