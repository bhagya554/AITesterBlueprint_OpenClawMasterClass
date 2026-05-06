import { test, expect } from '@playwright/test';
import { DashboardPage } from './pages/DashboardPage';
import { CampaignsPage } from './pages/CampaignsPage';

test.describe('VWO Dashboard & Campaigns', () => {
  test.beforeEach(async ({ page }) => {
    // Auth state loaded from setup
    await page.goto('/dashboard');
  });

  test('DASH-001: Dashboard loads all widgets', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    
    await expect(dashboard.campaignSummary).toBeVisible();
    await expect(dashboard.recentActivity).toBeVisible();
    await expect(dashboard.charts).toBeVisible();
    
    const failedBanners = page.locator('text=/failed to load/i');
    await expect(failedBanners).toHaveCount(0);
  });

  test('CAMP-001: Create A/B campaign', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const campaigns = new CampaignsPage(page);
    
    await dashboard.createCampaignButton.click();
    await campaigns.selectCampaignType('A/B Test');
    await campaigns.fillCampaignName('E2E_Test_Campaign');
    await campaigns.fillTargetUrl('https://example.com');
    await campaigns.clickCreate();
    
    await expect(page).toHaveURL(/.*editor/);
    await expect(campaigns.editorCanvas).toBeVisible();
  });

  test('CAMP-002: Pause active campaign', async ({ page }) => {
    const campaigns = new CampaignsPage(page);
    
    await page.goto('/campaigns');
    await campaigns.openActionsForCampaign('E2E_Test_Campaign');
    await campaigns.pauseButton.click();
    await campaigns.confirmModal();
    
    await expect(campaigns.statusBadge('Paused')).toBeVisible();
    await expect(page.locator('text=Campaign paused')).toBeVisible();
  });

  test('CAMP-003: Archive paused campaign', async ({ page }) => {
    const campaigns = new CampaignsPage(page);
    
    await page.goto('/campaigns');
    await campaigns.filterByStatus('Archived');
    
    const archivedCampaign = campaigns.campaignRow('E2E_Test_Campaign');
    await expect(archivedCampaign).toBeVisible();
    await archivedCampaign.locator('[data-testid="edit-btn"]').toBeDisabled();
  });
});