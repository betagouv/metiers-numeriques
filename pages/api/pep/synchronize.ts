/* eslint-disable no-await-in-loop, no-continue */

import { convertExpiredAtTextToDate } from '@api/helpers/convertExpiredAtTextToDate'
import { convertHtmlToMarkdown } from '@api/helpers/convertHtmlToMarkdown'
import { getAddressIdFromPepAddress } from '@api/helpers/getAddressIdFromPepAddress'
import { getRecruiterIdFromName } from '@api/helpers/getRecruiterIdFromName'
import { loadPageAsCheerioInstance } from '@api/helpers/loadPageAsCheerioInstance'
import { normalizePepProfession } from '@api/helpers/normalizePepProfession'
import { ApiError } from '@api/libs/ApiError'
import { prisma } from '@api/libs/prisma'
import { extractPepChapterFromMainContent } from '@app/helpers/extractPepChapterFromMainContent'
import { handleError } from '@common/helpers/handleError'
import { slugify } from '@common/helpers/slugify'
import { JobContractType, JobSource } from '@prisma/client'
import ß from 'bhala'
import cuid from 'cuid'
import dayjs from 'dayjs'

import type { Job } from '@prisma/client'
import type { Cheerio, CheerioAPI } from 'cheerio'
import type { NextApiRequest, NextApiResponse } from 'next'

// const { API_SECRET, NODE_ENV } = process.env
const { API_SECRET } = process.env
const BASE_URL = 'https://place-emploi-public.gouv.fr'
// const IS_PROD = NODE_ENV === 'production'
const SCRIPT_PATH = 'pages/api/pep/synchronize.js'
const MAX_PEP_JOBS_INDEX_DEPTH = 20
const MAX_PEP_JOBS_PER_CALL = 2

const selectInJobCard = ($root: CheerioAPI, index: number, selector: string): Cheerio<any> =>
  $root(`.fr-grid-row .fr-col-12:nth-child(${index + 1}) .card.card--offer ${selector}`)

async function getJobList(
  pageNumber: number = 1,
  jobList: Array<{
    sourceUrl: string
    title: string
  }> = [],
): Promise<
  Array<{
    sourceUrl: string
    title: string
  }>
> {
  try {
    const $root = await loadPageAsCheerioInstance(`${BASE_URL}/nos-offres/filtres/domaine/3522/page/${pageNumber}`)
    const $jobList = $root('.js-results .fr-grid-row .card.card--offer')

    for (let index = 0; index < $jobList.length; index += 1) {
      const title = selectInJobCard($root, index, 'h3').text().trim()
      const sourceUrl = (selectInJobCard($root, index, 'h3 a').attr('href') as string).trim()
      if (title === undefined || sourceUrl === undefined) {
        ß.error(`[${SCRIPT_PATH}] \`title\` or \`sourceUrl\` is undefined.`)

        continue
      }
      const existingJob = await prisma.job.findFirst({
        where: {
          sourceUrl,
        },
      })
      if (existingJob === null) {
        jobList.push({
          sourceUrl,
          title,
        })
      }

      if (jobList.length === MAX_PEP_JOBS_PER_CALL) {
        return jobList
      }
    }

    if (pageNumber === MAX_PEP_JOBS_INDEX_DEPTH) {
      return jobList
    }

    return await getJobList(pageNumber + 1, jobList)
  } catch (err) {
    handleError(err, SCRIPT_PATH)

    return []
  }
}

export default async function ApiPepSynchronizeEndpoint(req: NextApiRequest, res: NextApiResponse) {
  if (API_SECRET === undefined) {
    throw new Error('`API_SECRET` is undefined.')
  }
  if (req.method !== 'GET') {
    return handleError(new ApiError('Method not allowed.', 405, true), SCRIPT_PATH, res)
  }
  if (req.headers['x-api-secret'] === undefined) {
    return handleError(new ApiError('Unauthorized.', 401, true), SCRIPT_PATH, res)
  }
  if (req.headers['x-api-secret'] !== API_SECRET) {
    return handleError(new ApiError('Forbidden.', 403, true), SCRIPT_PATH, res)
  }

  try {
    let hasMissingProfession = false
    const professions = await prisma.profession.findMany()

    ß.info(`[${SCRIPT_PATH}] Indexing new jobs…`)
    const jobList = await getJobList()
    if (jobList.length === 0) {
      ß.success(`[${SCRIPT_PATH}] No new job found.`)

      res.send({
        data: {
          count: 0,
        },
        hasError: false,
      })

      return
    }
    ß.success(`[${SCRIPT_PATH}] ${jobList.length} new job(s) indexed.`)

    ß.info(`[${SCRIPT_PATH}] Fetching new jobs …`)
    const jobs: Job[] = []
    const indexLength = jobList.length
    for (let index = 0; index < indexLength; index += 1) {
      const job = { ...jobList[index] } as Job & {
        sourceUrl: string
      }

      const $root = await loadPageAsCheerioInstance(job.sourceUrl)

      const $missionDescriptionTitle = $root("h2:contains('Vos missions en quelques mots')")
      if ($missionDescriptionTitle.length === 0) {
        ß.error(`[${SCRIPT_PATH}] Unable to find mission description at ${job.sourceUrl} …`)

        continue
      }
      const mainContentAsHtml = $missionDescriptionTitle.parent().html()
      if (mainContentAsHtml === null) {
        ß.error(`[${SCRIPT_PATH}] Unable to find mission description parent at ${job.sourceUrl}.`)

        continue
      }

      const missionDescriptionAsHtml = extractPepChapterFromMainContent(
        mainContentAsHtml,
        'Vos missions en quelques mots',
      )
      if (missionDescriptionAsHtml === undefined) {
        ß.error(`[${SCRIPT_PATH}] Unable to extract mission description ${job.sourceUrl}.`)

        continue
      }
      job.missionDescription = convertHtmlToMarkdown(missionDescriptionAsHtml)

      const profileDescriptionAsHtml = extractPepChapterFromMainContent(mainContentAsHtml, 'Profil recherché')
      if (profileDescriptionAsHtml !== undefined) {
        job.profileDescription = convertHtmlToMarkdown(profileDescriptionAsHtml)
      }

      const teamDescriptionTitleSelector = "h2:contains('Qui sommes nous ?')"
      const $teamDescriptionTitle = $root(teamDescriptionTitleSelector)
      if ($teamDescriptionTitle.length === 1 && $teamDescriptionTitle.parent().next().length === 1) {
        const teamDescriptionAsHtml = $teamDescriptionTitle.parent().next().html()
        if (teamDescriptionAsHtml === null) {
          ß.error(`[${SCRIPT_PATH}] Unable to find team description at ${job.sourceUrl}.`)

          continue
        }

        job.teamDescription = convertHtmlToMarkdown(teamDescriptionAsHtml)
      }

      const $recruiter = $root('ul.fr-grid-row > li:nth-child(2)')
      if ($recruiter.length === 0) {
        ß.error(`[${SCRIPT_PATH}] Unable to find recruiter at ${job.sourceUrl}.`)

        continue
      }
      const recruiterName = $recruiter
        .text()
        .replace(/employeur\s*:/i, '')
        .trim()
      job.recruiterId = await getRecruiterIdFromName(prisma, recruiterName)

      const $address = $root('ul.fr-grid-row > li:nth-child(3)')
      if ($address.length === 1) {
        const pepAddress = $address.text().trim()
        const addressId = await getAddressIdFromPepAddress(prisma, pepAddress)

        if (addressId !== undefined) {
          job.addressId = addressId
        }
      }

      const $expiredAt = $root('p.ic.ic--info')
      job.expiredAt =
        $expiredAt.length === 0
          ? dayjs().add(2, 'months').startOf('day').toDate()
          : convertExpiredAtTextToDate($expiredAt.text())

      const $pepProfession = $root(".fr-accordion button:contains('Métier référence')").parent().next()
      if ($pepProfession.length === 0) {
        ß.error(`[${SCRIPT_PATH}] Unable to find profession at ${job.sourceUrl}.`)

        continue
      }
      const pepProfession = $pepProfession.text().trim()
      const professionId = normalizePepProfession(professions, pepProfession)
      if (professionId === undefined) {
        hasMissingProfession = true

        continue
      }
      job.professionId = professionId

      const $processDescription = $root(".fr-accordion button:contains('Informations complémentaires')").parent().next()
      if ($processDescription.length === 1) {
        job.processDescription = $processDescription.text().trim()
      }

      job.id = cuid()
      job.slug = slugify(job.title, job.id)

      job.contractTypes = [JobContractType.CONTRACT_WORKER, JobContractType.NATIONAL_CIVIL_SERVANT]
      job.seniorityInMonths = 0
      job.source = JobSource.PEP
      job.updatedAt = dayjs().toDate()

      jobs.push(job)
    }
    if (hasMissingProfession) {
      throw new ApiError('Synchronization stopped because Some PEP professions are unknown.', 400, true)
    }
    ß.success(`[${SCRIPT_PATH}] ${jobs.length} new jobs fetched.`)

    ß.info(`[${SCRIPT_PATH}] Drafting new jobs…`)
    await prisma.job.createMany({
      data: jobs,
    })
    ß.success(`[${SCRIPT_PATH}] ${jobs.length} new jobs drafted.`)

    res.json({
      data: {
        count: jobs.length,
      },
      hasError: false,
    })
  } catch (err) {
    ß.error(`[${SCRIPT_PATH}] ${err}`)

    return handleError(err, SCRIPT_PATH, res)
  }
}
