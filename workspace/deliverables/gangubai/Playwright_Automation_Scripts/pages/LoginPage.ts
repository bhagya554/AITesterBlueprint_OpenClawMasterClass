import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorMessage: Locator;
  readonly sessionExpiredToast: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.locator('[data-testid="email-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.signInButton = page.locator('[data-testid="signin-btn"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.sessionExpiredToast = page.locator('[data-testid="session-expired-toast"]');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}