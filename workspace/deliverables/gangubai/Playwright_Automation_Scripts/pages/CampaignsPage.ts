import { Page, Locator } from '@playwright/test';

export class CampaignsPage {
  readonly editorCanvas: Locator;
  readonly pauseButton: Locator;
  readonly confirmButton: Locator;

  constructor(private readonly page: Page) {
    this.editorCanvas = page.locator('[data-testid="editor-canvas"]');
    this.pauseButton = page.locator('[data-testid="pause-btn"]');
    this.confirmButton = page.locator('[data-testid="confirm-btn"]');
  }

  async selectCampaignType(type: string) {
    await this.page.locator(`text=${type}`).click();
  }

  async fillCampaignName(name: string) {
    await this.page.locator('[data-testid="campaign-name-input"]').fill(name);
  }

  async fillTargetUrl(url: string) {
    await this.page.locator('[data-testid="target-url-input"]').fill(url);
  }

  async clickCreate() {
    await this.page.locator('[data-testid="create-campaign-btn"]').click();
  }

  async openActionsForCampaign(name: string) {
    const row = this.campaignRow(name);
    await row.locator('[data-testid="actions-menu"]').click();
  }

  async confirmModal() {
    await this.confirmButton.click();
  }

  async filterByStatus(status: string) {
    await this.page.locator('[data-testid="status-filter"]').selectOption(status);
  }

  campaignRow(name: string): Locator {
    return this.page.locator(`[data-testid="campaign-row"]:has-text("${name}")`);
  }

  statusBadge(status: string): Locator {
    return this.page.locator(`[data-testid="status-badge"]:has-text("${status}")`);
  }
}