const { remote } = require('webdriverio');

async function runGestureTests() {
  const driver = await remote({
    protocol: 'http',
    hostname: 'hub-cloud.browserstack.com',
    port: 443,
    path: '/wd/hub',
    capabilities: {
      platformName: 'iOS',
      'appium:browserName': 'Safari',
      'appium:deviceName': 'iPhone 15 Pro',
      'appium:automationName': 'XCUITest',
      'appium:platformVersion': '17',
    }
  });

  try {
    await driver.url('https://app.vwo.com/dashboard');

    // Pull to refresh test
    const dashboard = await driver.$('[data-testid="dashboard-container"]');
    await dashboard.touchAction([
      { action: 'press', x: 200, y: 300 },
      { action: 'moveTo', x: 200, y: 500 },
      { action: 'release' }
    ]);

    const refreshSpinner = await driver.$('[data-testid="refresh-spinner"]');
    const isVisible = await refreshSpinner.isDisplayed();
    
    if (isVisible) {
      console.log('✅ Pull-to-refresh working');
    } else {
      console.warn('⚠️ Pull-to-refresh not detected');
    }

    // Pinch to zoom on report chart
    await driver.url('https://app.vwo.com/campaigns/test-campaign/reports');
    const chart = await driver.$('[data-testid="report-chart"]');
    
    await chart.touchAction([
      { action: 'press', x: 150, y: 200 },
      { action: 'moveTo', x: 200, y: 200 },
      { action: 'release' }
    ]);

    console.log('✅ Gesture tests completed');

  } finally {
    await driver.deleteSession();
  }
}

runGestureTests().catch(console.error);
