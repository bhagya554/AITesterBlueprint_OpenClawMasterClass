import { test, expect } from '@playwright/test';

test.describe('VWO Visual Editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/campaigns/e2e-test/editor');
  });

  test('EDIT-001: Visual editor loads target website', async ({ page }) => {
    const editorCanvas = page.locator('[data-testid="editor-canvas"]');
    const toolbar = page.locator('[data-testid="editor-toolbar"]');
    
    await expect(editorCanvas).toBeVisible({ timeout: 10000 });
    await expect(toolbar).toBeVisible();
    
    // Verify iframe loads without cross-origin errors
    const iframe = editorCanvas.locator('iframe');
    await expect(iframe).toHaveAttribute('src', /example\.com/);
  });

  test('EDIT-002: Create text variant', async ({ page }) => {
    const editor = page.locator('[data-testid="editor-canvas"]');
    
    // Select element
    await editor.locator('h1').first().click();
    await page.locator('[data-testid="edit-text-btn"]').click();
    
    // Modify text
    await page.locator('[data-testid="text-input"]').fill('Variant A - New Headline');
    await page.locator('[data-testid="save-variant-btn"]').click();
    
    // Verify
    await expect(page.locator('text=Variant A - New Headline')).toBeVisible();
    await expect(page.locator('[data-testid="history-panel"]')).toContainText('Text changed');
  });
});