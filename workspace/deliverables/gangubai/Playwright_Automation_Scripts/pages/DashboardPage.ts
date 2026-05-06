import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly campaignSummary: Locator;
  readonly recentActivity: Locator;
  readonly charts: Locator;
  readonly createCampaignButton: Locator;

  constructor(private readonly page: Page) {
    this.campaignSummary = page.locator('[data-testid="campaign-summary"]');
    this.recentActivity = page.locator('[data-testid="recent-activity"]');
    this.charts = page.locator('[data-testid="dashboard-charts"]');
    this.createCampaignButton = page.locator('[data-testid="create-campaign-btn"]');
  }
}