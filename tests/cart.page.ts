import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartProductNames: Locator;
  readonly cartProductPrices: Locator;
  readonly cartTotal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartProductNames = page.locator('.cart-product-name');   // selector for product name in cart
    this.cartProductPrices = page.locator('.cart-product-price'); // selector for product price in cart
    this.cartTotal = page.locator('.cart-total-price');           // selector for cart total price
  }

  async getCartProducts(): Promise<string[]> {
    return await this.cartProductNames.allTextContents();
  }

  async getCartPrices(): Promise<number[]> {
    const priceTexts = await this.cartProductPrices.allTextContents();
    return priceTexts.map(text => this.extractPrice(text));
  }

  async getCartTotal(): Promise<number> {
    const text = await this.cartTotal.textContent();
    return this.extractPrice(text ?? '');
  }

  extractPrice(text: string): number {
    const match = text.replace(/,/g, '').match(/₹\s*(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }
}
