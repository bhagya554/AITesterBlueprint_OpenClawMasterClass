# Playwright Automation Scripts

**Agent:** GanguBhai 🕸️  
**Framework:** Playwright + TypeScript  
**Browsers:** Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari  

---

## Structure

```
Playwright_Automation_Scripts/
├── playwright.config.ts        # Multi-browser parallel config
├── auth.setup.ts              # Global authentication setup
├── auth.spec.ts               # Authentication flows
├── dashboard-campaigns.spec.ts # Dashboard & campaign CRUD
├── editor.spec.ts             # Visual editor interactions
├── accessibility.spec.ts      # A11y validations
├── responsive.spec.ts         # Viewport breakpoints
├── pages/
│   ├── LoginPage.ts           # POM: Login
│   ├── DashboardPage.ts       # POM: Dashboard
│   └── CampaignsPage.ts       # POM: Campaigns
└── README.md                  # This file
```

---

## Setup

```bash
npm install @playwright/test allure-playwright
npx playwright install

# Environment
cp .env.example .env
# Fill: VWO_EMAIL, VWO_PASSWORD
```

## Run

```bash
# All tests
npx playwright test

# Specific suite
npx playwright test auth.spec.ts

# Debug
npx playwright test --debug

# Report
npx playwright show-report
```

## CI

GitHub Actions sharded across 4 workers. See `.github/workflows/e2e.yml` (not included, standard Playwright action).

---

## Key Features

- **POM Pattern:** All pages abstracted for maintainability
- **Auth State Reuse:** `auth.json` shared across specs
- **Parallel Sharding:** 4 workers in CI
- **Screenshot/Video:** On failure only
- **Trace:** Retained on first retry

🕸️ *Ready to break things.*