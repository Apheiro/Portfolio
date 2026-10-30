import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  timeout: 30_000,
  use: {
    // biome-ignore lint/style/useNamingConvention: Playwright's public configuration key.
    baseURL: 'http://127.0.0.1:3200',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? {
          executablePath:
            process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
        }
      : {},
  },
  projects: [
    {
      name: 'desktop',
      use: { viewport: { width: 1440, height: 1000 } },
    },
    {
      name: 'mobile',
      use: { viewport: { width: 390, height: 844 }, isMobile: true },
    },
  ],
  webServer: {
    command: 'pnpm exec next dev -p 3200',
    url: 'http://127.0.0.1:3200/mosaic-demo',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
