// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',  // ← Points to your folder
  timeout: 30000,
  use: {
    browserName: 'chromium',
    channel: 'chrome',  // Ensures Chrome is used
    headless: false,    // So you can see the browser
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
});
