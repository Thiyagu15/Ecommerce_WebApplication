import { test, expect } from '@playwright/test';

test.setTimeout(60000);

test('Add products priced between $5 and $10 to cart', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await page.waitForLoadState('networkidle');

  // Add products priced between $5 and $10
  const products = page.locator('.inventory_item');
  const count = await products.count();

  let added = 0;
  for (let i = 0; i < count; i++) {
    const product = products.nth(i);
    const priceText = await product.locator('.inventory_item_price').textContent();
    const price = parseFloat(priceText!.replace('$', ''));

    if (price >= 5 && price <= 10) {
      await product.locator('button').click();
      added++;
    }
  }

  // Navigate to cart and wait for it to load
  await page.locator('.shopping_cart_link').click();
  await page.waitForLoadState('networkidle');

  // Validate the count of added items
  const cartItems = page.locator('.cart_item');
  await expect(cartItems).toHaveCount(added);

  await context.close();
});
