const { remote } = require('webdriverio');

const capabilities = {
  platformName: 'Android',
  'appium:platformVersion': '14',
  'appium:deviceName': 'Samsung Galaxy S24',
  'appium:automationName': 'UiAutomator2',
  'appium:browserName': 'Chrome',
  'appium:orientation': 'PORTRAIT',
  'bstack:options': {
    userName: process.env.BROWSERSTACK_USERNAME,
    accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
  }
};

async function runMobileTests() {
  const driver = await remote({
    protocol: 'http',
    hostname: 'hub-cloud.browserstack.com',
    port: 443,
    path: '/wd/hub',
    capabilities
  });

  try {
    await driver.url('https://app.vwo.com/login');

    // Test touch-friendly login
    const emailField = await driver.$('input[type="email"]');
    await emailField.setValue('test@example.com');

    const passwordField = await driver.$('input[type="password"]');
    await passwordField.setValue('password123');

    const loginBtn = await driver.$('button[type="submit"]');
    
    // Verify touch target size
    const size = await loginBtn.getSize();
    if (size.height < 44 || size.width < 44) {
      console.warn('⚠️ Touch target below WCAG threshold:', size);
    }

    await loginBtn.click();
    await driver.waitUntil(async () => {
      const url = await driver.getUrl();
      return url.includes('/dashboard');
    }, { timeout: 10000 });

    console.log('✅ Mobile login flow passed');

    // Test swipe on campaign list
    await driver.url('https://app.vwo.com/campaigns');
    const firstCampaign = await driver.$('[data-testid="campaign-row"]');
    await firstCampaign.touchAction([
      { action: 'press', x: 300, y: 200 },
      { action: 'moveTo', x: 100, y: 200 },
      { action: 'release' }
    ]);

    const actionMenu = await driver.$('[data-testid="swipe-actions"]');
    await expect(actionMenu).toBeDisplayed();

  } finally {
    await driver.deleteSession();
  }
}

runMobileTests().catch(console.error);
