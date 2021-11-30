/* eslint-disable no-await-in-loop, no-continue */

const axios = require('axios')
const ß = require('bhala')
const csv = require('csvtojson')

const handleError = require('../helpers/handleError')
const { JOB_FILTERS } = require('../legacy/utils')
const AppError = require('../libs/AppError')
const notion = require('../services/notion')
const notionJob = require('../services/notionJob')

async function updatePepJobs() {
  try {
    const { data: pepJobsAsCsv } = await axios.get(process.env.PEP_ENDPOINT)
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

module.exports = updatePepJobs
