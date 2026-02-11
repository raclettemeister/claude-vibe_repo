// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 60000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_PORT ? `http://localhost:${process.env.PLAYWRIGHT_PORT}` : 'http://localhost:3333',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `python3 -m http.server ${process.env.PLAYWRIGHT_PORT || 3333}`,
    url: process.env.PLAYWRIGHT_PORT ? `http://localhost:${process.env.PLAYWRIGHT_PORT}` : 'http://localhost:3333',
    reuseExistingServer: !process.env.CI,
    timeout: 10000,
  },
});
