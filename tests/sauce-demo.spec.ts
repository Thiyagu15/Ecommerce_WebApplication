import { test, expect } from '@playwright/test';

test.setTimeout(60000); // Increase timeout to 60 seconds

test('Sauce Demo - E-commerce Assessment Flow', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  const expectedNames: string[] = [];
  const expectedPrices: number[] = [];

  // Step 1: Login
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await page.waitForLoadState('networkidle');

  // Step 2: Add only specific products
  const products = page.locator('.inventory_item');
  const count = await products.count();

  for (let i = 0; i < count; i++) {
    const product = products.nth(i);
    const name = await product.locator('.inventory_item_name').textContent();
    const priceText = await product.locator('.inventory_item_price').textContent();
    const price = parseFloat(priceText!.replace('$', ''));

    if (!name || isNaN(price)) continue;

    if (name === 'Sauce Labs Bike Light' || name === 'Sauce Labs Onesie') {
      console.log(`✅ Adding: ${name} - $${price}`);
      expectedNames.push(name);
      expectedPrices.push(price);
      await product.locator('button').click();
    }
  }

  // Step 3: Go to cart and checkout
  await page.locator('.shopping_cart_link').click();
  await page.waitForLoadState('networkidle');
  await page.locator('[data-test="checkout"]').click();
  await page.waitForLoadState('networkidle');

  // Fill checkout info
  await page.locator('[data-test="firstName"]').fill('Test');
  await page.locator('[data-test="lastName"]').fill('User');
  await page.locator('[data-test="postalCode"]').fill('12345');
  await page.locator('[data-test="continue"]').click();
  await page.waitForLoadState('networkidle');

  // Step 4: Validate cart items
  const cartItems = page.locator('.cart_item');
  for (const name of expectedNames) {
    await expect(cartItems.locator('.inventory_item_name').getByText(name)).toBeVisible();
  }

  // Step 5: Validate total
  const totalText = await page.locator('.summary_total_label').textContent();
  const total = parseFloat(totalText!.replace('Total: $', ''));
  const expectedTotal = expectedPrices.reduce((sum, p) => sum + p, 0);

  expect(total).toBeCloseTo(19.42, 0.01);

  await context.close();
});
