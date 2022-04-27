import { generateSitemapEntry } from '@api/helpers/generateSitemapEntry'
import { ApiError } from '@api/libs/ApiError'
import { prisma } from '@api/libs/prisma'
import { handleError } from '@common/helpers/handleError'
import { JobState } from '@prisma/client'
import ß from 'bhala'

import type { NextApiRequest, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/sitemap.ts'
const MAIN_PATHS = ['/', '/donnees-personnelles-et-cookies', '/emplois' /* , '/institutions' */, '/mentions-legales']

export default async function Sitemap(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)
    }

    ß.info(`[${ERROR_PATH}] Fetching jobs…`)
    const jobs = await prisma.job.findMany({
      where: {
        NOT: {
          state: JobState.DRAFT,
        },
      },
    })

    // ß.info(`[${ERROR_PATH}] Fetching institutions…`)
    // const institutions = await prisma.legacyInstitution.findMany()

    ß.info(`[${ERROR_PATH}] Fetching archived jobs…`)
    const archivedJobs = await prisma.archivedJob.findMany()

    const sitemapRows = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]

    ß.info(`[${ERROR_PATH}] Mapping main pages…`)
    MAIN_PATHS.forEach(path => {
      sitemapRows.push(generateSitemapEntry(path))
    })
    ß.success(`[${ERROR_PATH}] ${MAIN_PATHS.length} main pages mapped.`)

    ß.info(`[${ERROR_PATH}] Mapping jobs…`)
    jobs.forEach(({ slug, updatedAt }) => {
      sitemapRows.push(generateSitemapEntry(`/emploi/${slug}`, updatedAt))
    })
    ß.success(`[${ERROR_PATH}] ${jobs.length} jobs mapped.`)

    // ß.info(`[${ERROR_PATH}] Mapping institutions…`)
    // institutions.forEach(({ slug, updatedAt }) => {
    // sitemapRows.push(generateSitemapEntry(`/institution/${slug}`, updatedAt))
    // })
    // ß.success(`[${ERROR_PATH}] ${institutions.length} institutions mapped.`)

    ß.info(`[${ERROR_PATH}] Mapping archived jobs…`)
    archivedJobs.forEach(({ slug, updatedAt }) => {
      sitemapRows.push(generateSitemapEntry(`/emploi/archive/${slug}`, updatedAt))
    })
    ß.success(`[${ERROR_PATH}] ${archivedJobs.length} archived jobs mapped.`)

    sitemapRows.push('</urlset>')
    const sitemap = sitemapRows.join('\n')

    res.status(200).setHeader('Content-Type', 'application/xml').send(sitemap)
  } catch (err) {
    handleError(err, ERROR_PATH, res)
  }
}
