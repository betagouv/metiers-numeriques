import prismaClient from '@prisma/client'
import ß from 'bhala'
import { createWriteStream } from 'fs'
import { SitemapStream } from 'sitemap'

const MAIN_PATHS = ['/', '/donnees-personnelles-et-cookies', '/emplois', '/institutions', '/mentions-legales']

export async function generateSitemap() {
  const prisma = new prismaClient.PrismaClient()

  ß.info('[bot] Fetching jobs…')
  const jobs = await prisma.job.findMany({
    where: {
      NOT: {
        state: prismaClient.JobState.DRAFT,
      },
    },
  })

  // ß.info('[bot] Fetching institutions…')
  // const institutions = await prisma.legacyInstitution.findMany()

  ß.info('[bot] Fetching archived jobs…')
  const archivedJobs = await prisma.archivedJob.findMany()

  const sitemap = new SitemapStream({
    hostname: 'https://metiers.numerique.gouv.fr',
  })

  const writeStream = createWriteStream('./public/sitemap.xml')
  sitemap.pipe(writeStream)

  ß.info('[bot] Mapping main pages…')
  MAIN_PATHS.forEach(path => {
    sitemap.write({
      url: path,
    })
  })
  ß.success(`[bot] ${MAIN_PATHS.length} main pages mapped.`)

  ß.info('[bot] Mapping jobs…')
  jobs.forEach(({ slug }) => {
    sitemap.write({
      url: `/emploi/${slug}`,
    })
  })
  ß.success(`[bot] ${jobs.length} jobs mapped.`)

  // ß.info('[bot] Mapping institutions…')
  // institutions.forEach(({ slug }) => {
  //   sitemap.write({
  //     url: `/institution/${slug}`,
  //   })
  // })
  // ß.success(`[bot] ${institutions.length} institutions mapped.`)

  ß.info('[bot] Mapping archived jobs…')
  archivedJobs.forEach(({ slug }) => {
    sitemap.write({
      url: `/emploi/archive/${slug}`,
    })
  })
  ß.success(`[bot] ${archivedJobs.length} archived jobs mapped.`)

  sitemap.end()
}
