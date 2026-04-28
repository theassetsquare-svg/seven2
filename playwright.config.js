// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './_tools',
  testMatch: '**/*.spec.mjs',
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    actionTimeout: 10000,
    navigationTimeout: 30000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'desktop-chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-naver',   use: { ...devices['iPhone 13'] } }
  ]
});
