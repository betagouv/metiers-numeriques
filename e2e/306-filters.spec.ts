// TODO: fix auto import
import { test, expect } from '@playwright/test'
import { JobContractType, JobRemoteStatus, JobState, PrismaClient } from '@prisma/client'
import * as R from 'ramda'

import { TEST_JOBS } from './constants.js' // TODO: fix file extension

// TODO: create factory
const baseJob = TEST_JOBS[0]
const jobInput = {
  ...R.omit(['address', 'applicationContacts', 'infoContact', 'profession', 'recruiter', 'seniorityInYears'], baseJob),
  address: {
    create: {
      city: 'Alençon',
      postalCode: '61000',
      region: 'Normandie',
      street: '20 avenue de Ségur',
    },
  },
  contractTypes: [JobContractType.FREELANCER],
  expiredAt: new Date('2030-12-12'),
  infoContact: {
    create: baseJob.infoContact,
  },
  profession: {
    create: baseJob.profession,
  },
  recruiter: {
    create: {
      name: baseJob.recruiter.displayName,
    },
  },
  remoteStatus: JobRemoteStatus.FULL,
  seniorityInMonths: 0,
  slug: 'job-remote',
  state: JobState.PUBLISHED,
  updatedAt: new Date(),
}

test.describe('Client > Jobs Filters', () => {
  test.beforeAll(async () => {
    const prisma = new PrismaClient()
    await prisma.job.create({
      data: jobInput,
    })
  })

  test.slow()

  // TODO: make test cases more robust (to actually show that it filters some offers ^^")
  test('Remote Filter', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await page.click('"Télétravail"')
    await page.locator('#accordion__panel-remoteStatusesFilter :text("Total")').click()
    await expect(page.locator('.job-card', { hasText: baseJob.title })).toBeVisible()
  })

  test('Region Filter', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await page.click('"Région"')
    await page.locator('polygon[data-id="Normandie"]').click()
    await expect(page.locator('.job-card', { hasText: baseJob.title })).toBeVisible()
  })

  test('Contract Type Filter', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await page.click('"Contrats"')
    await page.locator('#accordion__panel-contractTypesFilter :text("Freelance")').click()
    await expect(page.locator('.job-card', { hasText: baseJob.title })).toBeVisible()
  })

  test.only('Profession Filter', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await page.locator(`#accordion__panel-professionIdFilter :text("${baseJob.profession.name}")`).click()
    await expect(page.locator('.job-card', { hasText: baseJob.title })).toBeVisible()
  })
})
