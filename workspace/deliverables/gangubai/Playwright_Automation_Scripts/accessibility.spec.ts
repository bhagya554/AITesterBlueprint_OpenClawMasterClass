import { test, expect } from '@playwright/test';

test.describe('VWO Accessibility Tests', () => {
  test('A11Y-001: Keyboard navigation on login', async ({ page }) => {
    await page.goto('/login');
    
    // Tab through all interactive elements
    const interactiveElements = [
      '[data-testid="email-input"]',
      '[data-testid="password-input"]',
      '[data-testid="signin-btn"]',
      '[data-testid="forgot-password-link"]'
    ];
    
    for (const selector of interactiveElements) {
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus');
      await expect(focused).toHaveCSS('outline', /solid|auto/);
    }
    
    // Submit with Enter
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });

  test('A11Y-002: axe-core audit on dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // axe-core would be injected via builder pattern in real setup
    // Simplified assertion structure
    const images = page.locator('img');
    for (let i = 0; i < await images.count(); i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
    
    const buttons = page.locator('button:not([aria-label]):not(:has-text())');
    await expect(buttons).toHaveCount(0);
  });
});