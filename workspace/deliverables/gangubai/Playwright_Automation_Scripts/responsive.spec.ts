import { test, expect } from '@playwright/test';

test.describe('VWO Responsive Layout', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 }
  ];

  for (const viewport of viewports) {
    test(`RESP: ${viewport.name} layout at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/dashboard');
      
      // Check no horizontal scroll
      const body = page.locator('body');
      const scrollWidth = await body.evaluate(el => el.scrollWidth);
      const clientWidth = await body.evaluate(el => el.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // 1px tolerance
      
      // Touch targets on mobile/tablet
      if (viewport.width <= 768) {
        const touchTargets = page.locator('button, a, [role="button"]');
        for (let i = 0; i < Math.min(await touchTargets.count(), 10); i++) {
          const box = await touchTargets.nth(i).boundingBox();
          if (box) {
            expect(box.height).toBeGreaterThanOrEqual(44);
            expect(box.width).toBeGreaterThanOrEqual(44);
          }
        }
      }
    });
  }
});