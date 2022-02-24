import { JobState } from '@prisma/client'
import ß from 'bhala'
import { createWriteStream } from 'fs'
// eslint-disable-next-line import/no-extraneous-dependencies
import * as R from 'ramda'
import { SitemapStream } from 'sitemap'

import getPrisma from '../../api/helpers/getPrisma'

const MAIN_PATHS = ['/', '/donnees-personnelles-et-cookies', '/emplois', '/institutions', '/mentions-legales']

async function generateSitemap() {
  ß.info('[scripts/build/generateSitemap.js] Fetching jobs…')
  const jobs = await getPrisma().job.findMany({
    where: {
      NOT: {
        state: JobState.DRAFT,
      },
    },
  })
  const legacyJobs = await getPrisma().legacyJob.findMany({
    where: {
      NOT: {
        isMigrated: true,
        state: JobState.DRAFT,
      },
    },
  })
  const allJobs = R.uniqBy(R.prop('slug'))([...jobs, ...legacyJobs])

  ß.info('[scripts/build/generateSitemap.js] Fetching institutions…')
  const institutions = await getPrisma().legacyInstitution.findMany()

  ß.info('[scripts/build/generateSitemap.js] Fetching archived jobs…')
  const archivedJobs = await getPrisma().archivedJob.findMany()

  const sitemap = new SitemapStream({
    hostname: 'https://metiers.numerique.gouv.fr',
  })

  const writeStream = createWriteStream('./public/sitemap.xml')
  sitemap.pipe(writeStream)

  ß.info('[scripts/build/generateSitemap.js] Mapping main pages…')
  MAIN_PATHS.forEach(path => {
    sitemap.write({
      url: path,
    })
  })
  ß.success(`[scripts/build/generateSitemap.js] ${MAIN_PATHS.length} main pages mapped.`)

  ß.info('[scripts/build/generateSitemap.js] Mapping jobs…')
  allJobs.forEach(({ slug }) => {
    sitemap.write({
      url: `/emploi/${slug}`,
    })
  })
  ß.success(`[scripts/build/generateSitemap.js] ${allJobs.length} jobs mapped.`)

  ß.info('[scripts/build/generateSitemap.js] Mapping institutions…')
  institutions.forEach(({ slug }) => {
    sitemap.write({
      url: `/institution/${slug}`,
    })
  })
  ß.success(`[scripts/build/generateSitemap.js] ${institutions.length} institutions mapped.`)

  ß.info('[scripts/build/generateSitemap.js] Mapping archived jobs…')
  archivedJobs.forEach(({ slug }) => {
    sitemap.write({
      url: `/emploi/archive/${slug}`,
    })
  })
  ß.success(`[scripts/build/generateSitemap.js] ${archivedJobs.length} archived jobs mapped.`)

  sitemap.end()
  setInterval(process.exit, 2000)
}

generateSitemap()
