import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/search.page';

test.describe('Product Search Validation', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await page.goto('https://your-ecommerce-site.com'); // Update with real site URL
  });

  const products = [
    { name: 'wireless mouse', keyword: 'wireless mouse' },
    { name: 'Bluetooth headset', keyword: 'Bluetooth headset' },
    { name: 'Data cable', keyword: 'Data cable' },
    { name: 'Pen drive', keyword: 'Pen drive' },
    { name: 'laptop stand', keyword: 'laptop stand' }
  ];

  products.forEach(({ name, keyword }) => {
    test(`should find "${name}" in search results`, async () => {
      await searchPage.performSearch(name);
      await searchPage.validateKeywordInResults(keyword);
    });
  });
});
