# Appium Framework

**Agent:** Chotu 📱  
**Framework:** WebdriverIO + Appium 2.x  
**Cloud Grid:** BrowserStack / Sauce Labs  

---

## Structure

```
Appium_Framework/
├── mobile-login.spec.js     # Login flow on real devices
├── pwa-checks.spec.js       # PWA manifest, SW, installability
├── gestures.spec.js         # Swipe, pinch, pull-to-refresh
├── wdio.conf.js             # WebdriverIO config (multi-device)
├── utils/
│   ├── touch-targets.js     # WCAG 44x44 validation
│   └── device-helpers.js    # Orientation, network throttling
└── README.md                # This file
```

---

## Setup

```bash
npm install @wdio/cli @wdio/appium-service @wdio/browserstack-service
npx wdio config  # Generate wdio.conf.js
```

## wdio.conf.js (excerpt)

```js
exports.config = {
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,
  hostname: 'hub-cloud.browserstack.com',
  capabilities: [
    { platformName: 'Android', 'appium:deviceName': 'Samsung Galaxy S24' },
    { platformName: 'iOS', 'appium:deviceName': 'iPhone 15 Pro' }
  ],
  services: ['browserstack'],
  framework: 'mocha',
  reporters: ['allure']
};
```

## Run

```bash
# All mobile tests
npx wdio wdio.conf.js

# Specific suite
npx wdio wdio.conf.js --spec ./mobile-login.spec.js
```

## Key Features

- **Real device cloud:** No emulators for Tier-1
- **Touch actions:** Native gesture sequences
- **WCAG validation:** Automated touch-target sizing
- **PWA audit:** Manifest + service worker checks

📱 *Chotu: "Touch targets too small? I find 'em all."*
