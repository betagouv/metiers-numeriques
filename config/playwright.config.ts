/* eslint-disable import/no-extraneous-dependencies */

import { devices } from '@playwright/test'

import type { PlaywrightTestConfig } from '@playwright/test'

const { CI } = process.env
const IS_CI = Boolean(CI)

const config: PlaywrightTestConfig = {
  forbidOnly: IS_CI,
  globalSetup: './playwright.setup.ts',
  maxFailures: 1,
  projects: [
    {
      name: 'CHROME DESKTOP',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  testDir: '../e2e',
  timeout: 10000,
  use: {
    headless: IS_CI,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  workers: 1,
}

export default config
