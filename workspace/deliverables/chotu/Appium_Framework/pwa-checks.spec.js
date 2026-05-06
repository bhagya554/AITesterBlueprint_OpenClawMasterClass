const { remote } = require('webdriverio');

async function runPwaTests() {
  const driver = await remote({
    protocol: 'http',
    hostname: 'hub-cloud.browserstack.com',
    port: 443,
    path: '/wd/hub',
    capabilities: {
      platformName: 'Android',
      'appium:browserName': 'Chrome',
      'appium:deviceName': 'Google Pixel 8',
      'appium:automationName': 'UiAutomator2',
    }
  });

  try {
    await driver.url('https://app.vwo.com');

    // Check manifest
    const manifest = await driver.executeAsync((done) => {
      fetch('/manifest.json')
        .then(r => r.json())
        .then(done)
        .catch(() => done(null));
    });

    if (!manifest) {
      throw new Error('❌ PWA manifest not found');
    }

    console.log('✅ Manifest valid:', manifest.name);

    // Check service worker
    const swRegistered = await driver.execute(() => {
      return navigator.serviceWorker?.controller?.state === 'activated';
    });

    if (!swRegistered) {
      console.warn('⚠️ Service worker not activated');
    } else {
      console.log('✅ Service worker active');
    }

    // Check install prompt
    const isInstallable = await driver.execute(() => {
      return window.deferredPrompt !== undefined;
    });

    console.log(isInstallable ? '✅ PWA installable' : '⚠️ Not installable');

  } finally {
    await driver.deleteSession();
  }
}

runPwaTests().catch(console.error);
