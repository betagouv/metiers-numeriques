import { generateSitemapEntry } from '@api/helpers/generateSitemapEntry'
import { ApiError } from '@api/libs/ApiError'
import { prisma } from '@api/libs/prisma'
import { handleError } from '@common/helpers/handleError'
import { JobState } from '@prisma/client'
import { B } from 'bhala'

import type { NextApiRequest, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/sitemap.ts'
const MAIN_PATHS = ['/', '/donnees-personnelles-et-cookies', '/mentions-legales']

export default async function Sitemap(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)
    }

    B.info(`[${ERROR_PATH}] Fetching jobs…`)
    const jobs = await prisma.job.findMany({
      where: {
        NOT: {
          state: JobState.DRAFT,
        },
      },
    })

    B.info(`[${ERROR_PATH}] Fetching archived jobs…`)
    const archivedJobs = await prisma.archivedJob.findMany()

    const sitemapRows = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]

    B.info(`[${ERROR_PATH}] Mapping main pages…`)
    MAIN_PATHS.forEach(path => {
      sitemapRows.push(generateSitemapEntry(path))
    })
    B.success(`[${ERROR_PATH}] ${MAIN_PATHS.length} main pages mapped.`)

    B.info(`[${ERROR_PATH}] Mapping jobs…`)
    jobs.forEach(({ slug, updatedAt }) => {
      sitemapRows.push(generateSitemapEntry(`/emploi/${slug}`, updatedAt))
    })
    B.success(`[${ERROR_PATH}] ${jobs.length} jobs mapped.`)

    B.info(`[${ERROR_PATH}] Mapping archived jobs…`)
    archivedJobs.forEach(({ slug, updatedAt }) => {
      sitemapRows.push(generateSitemapEntry(`/emploi/archive/${slug}`, updatedAt))
    })
    B.success(`[${ERROR_PATH}] ${archivedJobs.length} archived jobs mapped.`)

    sitemapRows.push('</urlset>')
    const sitemap = sitemapRows.join('\n')

    res.status(200).setHeader('Content-Type', 'application/xml').send(sitemap)
  } catch (err) {
    handleError(err, ERROR_PATH, res)
  }
}
