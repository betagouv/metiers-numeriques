/* eslint-disable no-await-in-loop, no-continue */

import axios from 'axios'
import ß from 'bhala'
import csv from 'csvtojson'

import handleError from '../helpers/handleError'
import { JOB_FILTERS } from '../legacy/utils'
import AppError from '../libs/AppError'
import notion from '../services/notion'
import notionJob from '../services/notionJob'

const { PEP_ENDPOINT } = process.env as {
  [key: string]: string
}

async function updatePepJobs() {
  try {
    const { data: pepJobsAsCsv } = await axios.get(PEP_ENDPOINT)
    const pepJobs = await csv({
      delimiter: ';',
    }).fromString(pepJobsAsCsv)

    for (const pepJob of pepJobs) {
      if (
        pepJob.JobDescription_ProfessionalCategory_ !== 'Vacant' ||
        !JOB_FILTERS.includes(pepJob.JobDescription_PrimaryProfile_)
      ) {
        continue
      }

      const isInNotion = await notion.hasPepJob(pepJob.OfferID)
      if (isInNotion) {
        // ß.debug(`[jobs/updatePepJobs()] PEP job #${pepJob.OfferID} is already in Notion.`)

        continue
      }

      ß.info(`[jobs/updatePepJobs()] Adding PEP job #${pepJob.OfferID} to Notion…`)
      await notionJob.createPage(process.env.PEP_DATABASE_ID, pepJob)
    }
  } catch (err) {
    if (!(err instanceof AppError)) {
      handleError(err, 'jobs/updatePepJobs()')
    }

    process.exit(1)
  }
}

export default updatePepJobs
