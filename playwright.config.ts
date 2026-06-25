import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  outputDir: './portfolio-assets/screenshots',
  use: {
    baseURL: 'https://cesardemacedo.github.io/OODI-SMART-BUILDING',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
