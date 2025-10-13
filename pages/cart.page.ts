import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartProductNames: Locator;
  readonly cartProductPrices: Locator;
  readonly cartTotal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartProductNames = page.locator('.cart-product-name');    // Update selector if needed
    this.cartProductPrices = page.locator('.cart-product-price');  // Update selector if needed
    this.cartTotal = page.locator('.cart-total-price');            // Update selector if needed
  }

  async getProductNames(): Promise<string[]> {
    return await this.cartProductNames.allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const texts = await this.cartProductPrices.allTextContents();
    return texts.map(text => this.extractPrice(text ?? ''));
  }

  async getTotal(): Promise<number> {
    const text = await this.cartTotal.textContent();
    return this.extractPrice(text ?? '');
  }

  extractPrice(text: string): number {
    const match = text.replace(/,/g, '').match(/₹\s*(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }
}
