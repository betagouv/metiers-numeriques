import ß from 'bhala'
import { createWriteStream } from 'fs'
// eslint-disable-next-line import/no-extraneous-dependencies
import { SitemapStream } from 'sitemap'

import { CACHE_KEY } from '../constants'
import cache from '../helpers/cache'
import data from '../services/data'

const MAIN_PATHS = ['/', '/donnees-personnelles-et-cookies', '/emplois', '/institutions', '/mentions-legales']

async function generateSitemap() {
  ß.info('[scripts/generateSitemap.js] Fetching jobs…')
  const jobs = await cache.getOrCacheWith(CACHE_KEY.JOBS, data.getJobs)

  ß.info('[scripts/generateSitemap.js] Fetching institutions…')
  const institutions = await cache.getOrCacheWith(CACHE_KEY.INSTITUTIONS, data.getInstitutions)

  const sitemap = new SitemapStream({
    hostname: 'https://metiers.numerique.gouv.fr',
  })

  const writeStream = createWriteStream('./public/sitemap.xml')
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

  ß.info('[scripts/generateSitemap.js] Mapping institutions…')
  institutions.forEach(({ slug }) => {
    sitemap.write({
      url: `/institution/${slug}`,
    })
  })

  sitemap.end()
  setInterval(process.exit, 2000)
}

generateSitemap()
