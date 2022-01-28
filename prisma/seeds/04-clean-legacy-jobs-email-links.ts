/* eslint-disable no-await-in-loop, no-continue */

import ß from 'bhala'

import type { PrismaClient } from '@prisma/client'

const cleanMarkdownEmailLinks = (source: string): string =>
  source.replace(/\[([a-z0-9_\-.]+@[a-z0-9_\-.]+\.[a-z]+)\]/g, '[mailto:$1]')

export async function cleanLegacyJobsEmailLinks(prisma: PrismaClient) {
  ß.info('Cleaning legacy jobs email links…')
  const legacyJobs = await prisma.legacyJob.findMany()
  let counter = 0

  for (const legacyJob of legacyJobs) {
    if (legacyJob.teamInfo !== null) {
      const cleanedTeamInfo = cleanMarkdownEmailLinks(legacyJob.teamInfo)

      if (cleanedTeamInfo !== legacyJob.teamInfo) {
        // console.log()
        // console.log('=============================================================')
        // console.log(legacyJob.teamInfo)
        // console.log('-------------------------------------------------------------')
        // console.log(cleanedTeamInfo)
        // console.log('=============================================================')

        await prisma.legacyJob.update({
          data: {
            teamInfo: cleanedTeamInfo,
          },
          where: {
            id: legacyJob.id,
          },
        })

        counter += 1
      }
    }

    if (legacyJob.toApply !== null) {
      const cleanedToApply = cleanMarkdownEmailLinks(legacyJob.toApply)

      if (cleanedToApply !== legacyJob.toApply) {
        // console.log()
        // console.log('=============================================================')
        // console.log(legacyJob.toApply)
        // console.log('-------------------------------------------------------------')
        // console.log(cleanedToApply)
        // console.log('=============================================================')

        await prisma.legacyJob.update({
          data: {
            toApply: cleanedToApply,
          },
          where: {
            id: legacyJob.id,
          },
        })

        counter += 1
      }
    }
  }

  ß.success(`${counter} legacy jobs email links cleaned.`)
}
