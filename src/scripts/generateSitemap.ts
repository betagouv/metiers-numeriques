import ß from 'bhala'
import { createWriteStream } from 'fs'
// eslint-disable-next-line import/no-extraneous-dependencies
import { SitemapStream } from 'sitemap'

import data from '../services/data'

const MAIN_PATHS = ['/', '/emplois', '/institutions', '/mentions-legales']

async function generateSitemap() {
  ß.info('[scripts/generateSitemap.js] Fetching jobs…')
  const jobs = await data.getJobs()

  ß.info('[scripts/generateSitemap.js] Fetching jobs…')
  const ministries = await data.getMinistries()

  const sitemap = new SitemapStream({
    hostname: 'https://metiers.numerique.gouv.fr',
  })

  const writeStream = createWriteStream('./sitemap.xml')
  sitemap.pipe(writeStream)

  ß.info('[scripts/generateSitemap.js] Mapping main pages…')
  MAIN_PATHS.forEach(path => {
    sitemap.write({
      url: path,
    })
  })

  ß.info('[scripts/generateSitemap.js] Mapping jobs…')
  jobs.forEach(({ slug }) => {
    sitemap.write({
      url: `/emploi/${slug}`,
    })
  })

  ß.info('[scripts/generateSitemap.js] Mapping ministries…')
  ministries.forEach(({ slug }) => {
    sitemap.write({
      url: `/institution/${slug}`,
    })
  })

  sitemap.end()
}

generateSitemap()
