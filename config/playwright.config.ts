/* eslint-disable import/no-extraneous-dependencies */

import { devices } from '@playwright/test'

import type { PlaywrightTestConfig } from '@playwright/test'

const { CI } = process.env
const IS_CI = Boolean(CI)

const config: PlaywrightTestConfig = {
  forbidOnly: true,
  maxFailures: 1,
  projects: [
    {
      name: 'chrome-desktop',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  testDir: '../e2e',
  timeout: 5000,
  use: {
    headless: IS_CI,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
}

export default config
