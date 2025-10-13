import { Page, Locator } from '@playwright/test';

export class SearchPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchResults: Locator;
  readonly productPrices: Locator;
  readonly addCartButtons: Locator;
  readonly productLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('#search-input');        // Update selector as needed
    this.searchResults = page.locator('.product-title');     // Update selector as needed
    this.productPrices = page.locator('.product-price');     // Update selector as needed
    this.addCartButtons = page.locator('.add-to-cart');      // Update selector as needed
    this.productLinks = page.locator('.product-link');       // Update selector as needed
  }

  async performSearch(productName: string) {
    await this.searchInput.fill(productName);
    await this.searchInput.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  async validateKeywordInResults(keyword: string) {
    const resultText = await this.searchResults.allTextContents();
    const found = resultText.some(text => text.toLowerCase().includes(keyword.toLowerCase()));
    if (!found) {
      throw new Error(`Expected keyword "${keyword}" not found in search results`);
    }
  }

  async addProductsInPriceRangeToCart(minPrice: number, maxPrice: number, count: number = 10) {
    const priceElements = await this.productPrices.elementHandles();
    for (let i = 0; i < Math.min(count, priceElements.length); i++) {
      const priceText = await priceElements[i].textContent();
      const price = this.extractPrice(priceText ?? '');
      if (price >= minPrice && price <= maxPrice) {
        await this.addCartButtons.nth(i).click();
      }
    }
  }

  async handleLowPriceProducts(count: number = 10) {
    const priceElements = await this.productPrices.elementHandles();
    for (let i = 0; i < Math.min(count, priceElements.length); i++) {
      const priceText = await priceElements[i].textContent();
      const price = this.extractPrice(priceText ?? '');
      if (price > 0 && price < 500) {
        await this.productLinks.nth(i).click();
        await this.page.waitForLoadState('networkidle');
        const quantityInput = this.page.locator('#quantity'); // Update selector
        await quantityInput.fill(''); // Clear first for reliability
        await quantityInput.fill('2');
        const addToCartDetail = this.page.locator('.add-to-cart-detail'); // Update selector
        await addToCartDetail.click();
        await this.page.goBack();
        await this.page.waitForLoadState('networkidle');
      }
    }
  }

  extractPrice(text: string): number {
    const match = text.replace(/,/g, '').match(/₹\s*(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }
}
