import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.locator('[data-testid="email-input"]').fill(process.env.VWO_EMAIL!);
  await page.locator('[data-testid="password-input"]').fill(process.env.VWO_PASSWORD!);
  await page.locator('[data-testid="signin-btn"]').click();
  
  await page.waitForURL(/.*dashboard/);
  await page.context().storageState({ path: 'auth.json' });
});