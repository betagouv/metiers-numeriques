/* eslint-disable import/no-extraneous-dependencies */

import { devices } from '@playwright/test'

import type { PlaywrightTestConfig } from '@playwright/test'

const { CI } = process.env
const IS_CI = Boolean(CI)

const config: PlaywrightTestConfig = {
  expect: {
    timeout: 10000,
  },
  forbidOnly: IS_CI,
  globalSetup: './playwright.setup.ts',
  maxFailures: 1,
  projects: [
    {
      name: 'CHROME DESKTOP',
      use: {
        ...devices['Desktop Chrome'],
        viewport: {
          height: 720,
          width: 1280,
        },
      },
    },
  ],
  reportSlowTests: null,
  retries: 2,
  testDir: '../e2e',
  timeout: 30000,
  use: {
    bypassCSP: true,
    headless: IS_CI,
    locale: 'fr-FR',
    screenshot: IS_CI ? 'only-on-failure' : 'off',
    timezoneId: 'Europe/Paris',
    trace: 'retain-on-failure',
    video: IS_CI
      ? 'off'
      : {
          mode: 'retain-on-failure',
          size: {
            height: 720 * 2,
            width: 1280 * 2,
          },
        },
  },
  workers: 1,
}

export default config
