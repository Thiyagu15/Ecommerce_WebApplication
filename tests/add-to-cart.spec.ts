import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/search.page';

test('Add products priced between ₹500 and ₹1000 to cart', async ({ page }) => {
  const searchPage = new SearchPage(page);

  // Step 1: Go to site and perform search
  await page.goto('https://your-ecommerce-site.com'); // Replace with actual URL
  await searchPage.performSearch('electronics');
  await searchPage.validateKeywordInResults('electronics');

  // Step 2: Add products in ₹500–₹1000 range
  await searchPage.addProductsInPriceRangeToCart(500, 1000, 10);

  // Optional: Add light validation (e.g., check that at least one was added)
  // This can be expanded based on your app's behavior
  const cartBadge = page.locator('.cart-badge'); // Example: cart item counter
  await expect(cartBadge).toHaveText(/1|2|3|4|5/); // At least one item added
});
