import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/search.page';
import { CartPage } from '../pages/cart.page';

test('Full e-commerce flow with cart validation', async ({ page }) => {
  const searchPage = new SearchPage(page);
  const cartPage = new CartPage(page);

  // Track products added to cart
  const expectedNames: string[] = [];
  const expectedPrices: number[] = [];

  // Step 1: Perform search
  await page.goto('https://your-ecommerce-site.com'); // Update with your site URL
  await searchPage.performSearch('electronics');
  await searchPage.validateKeywordInResults('electronics');

  // Step 2: Add products priced ₹500–₹1000
  const priceElements = await searchPage.productPrices.allTextContents();
  for (let i = 0; i < Math.min(10, priceElements.length); i++) {
    const price = searchPage.extractPrice(priceElements[i]);
    if (price >= 500 && price <= 1000) {
      expectedNames.push(await searchPage.searchResults.nth(i).textContent() ?? '');
      expectedPrices.push(price);
      await searchPage.addCartButtons.nth(i).click();
    }
  }

  // Step 3: Handle products under ₹500
  for (let i = 0; i < Math.min(10, priceElements.length); i++) {
    const price = searchPage.extractPrice(priceElements[i]);
    if (price > 0 && price < 500) {
      expectedNames.push(await searchPage.searchResults.nth(i).textContent() ?? '');
      expectedPrices.push(price * 2); // Quantity 2
      await searchPage.productLinks.nth(i).click();
      await page.waitForLoadState('networkidle');
      await page.locator('#quantity').fill('2'); // Update this selector
      await page.locator('.add-to-cart-detail').click(); // Update this selector
      await page.goBack();
      await page.waitForLoadState('networkidle');
    }
  }

  // Step 4: Go to cart and validate
  await page.goto('https://your-ecommerce-site.com/cart'); // Update with your cart URL

  // 1. Confirm all products are listed
  const cartNames = await cartPage.getProductNames();
  for (const name of expectedNames) {
    expect(cartNames).toContain(name);
  }

  // 2. Validate prices match
  const cartPrices = await cartPage.getProductPrices();
  expect(cartPrices).toEqual(expectedPrices);

  // 3. Validate total
  const cartTotal = await cartPage.getTotal();
  const expectedTotal = expectedPrices.reduce((sum, price) => sum + price, 0);
  expect(cartTotal).toBe(expectedTotal);
});
