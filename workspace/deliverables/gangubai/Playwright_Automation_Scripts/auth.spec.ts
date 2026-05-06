import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

test.describe('VWO Authentication Flow', () => {
  test('AUTH-001: Login with valid credentials', async ({ page }) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardPage(page);

    await login.goto();
    await login.login(process.env.VWO_EMAIL!, process.env.VWO_PASSWORD!);
    
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(dashboard.campaignSummary).toBeVisible({ timeout: 5000 });
    
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    expect(consoleErrors).toHaveLength(0);
  });

  test('AUTH-002: Login with invalid credentials shows error', async ({ page }) => {
    const login = new LoginPage(page);
    
    await login.goto();
    await login.login('invalid@test.com', 'wrongpassword');
    
    await expect(login.errorMessage).toContainText('Invalid email or password');
    await expect(page).toHaveURL(/.*login/);
  });

  test('AUTH-003: Session expiry redirects to login', async ({ page, context }) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardPage(page);
    
    await login.goto();
    await login.login(process.env.VWO_EMAIL!, process.env.VWO_PASSWORD!);
    
    // Simulate session expiry
    await context.clearCookies();
    await page.goto('/campaigns');
    
    await expect(page).toHaveURL(/.*login/);
    await expect(login.sessionExpiredToast).toContainText('Session expired');
  });
});