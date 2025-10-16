import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 5000 },
  fullyParallel: false,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:9000',
    actionTimeout: 10_000,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
  // Optional: automatically start Vite dev server for tests
//   webServer: {
//     command: 'npm run dev',
//     url: 'http://localhost:5173',
//     timeout: 60_000,
//     reuseExistingServer: !process.env.CI,
//   },
})
