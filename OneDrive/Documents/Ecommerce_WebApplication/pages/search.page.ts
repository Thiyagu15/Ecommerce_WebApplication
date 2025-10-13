import { Page, Locator } from '@playwright/test';

export class SearchPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchResults: Locator;

  constructor(page: Page) {
    this.page = page;
    // Update the selectors below as per your application's DOM
    this.searchInput = page.locator('#search-input');
    this.searchResults = page.locator('.product-title');
  }

  async performSearch(productName: string) {
    await this.searchInput.fill(productName);
    await this.searchInput.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  async validateKeywordInResults(keyword: string) {
    const resultText = await this.searchResults.allTextContents();
    const normalizedResults = resultText.map(text => text.toLowerCase());
    const normalizedKeyword = keyword.toLowerCase();
    const found = normalizedResults.some(text => text.includes(normalizedKeyword));
    if (!found) {
      throw new Error(`Expected keyword "${keyword}" not found in search results`);
    }
  }
}
