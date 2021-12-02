import ß from 'bhala'
import { CronJob } from 'cron'

import updatePepJobs from './jobs/updatePepJobs'
import updateSkbJobs from './jobs/updateSkbJobs'

const JOBS = [
  {
    // every day at 6am
    cronTime: '0 6 * * *',
    name: 'Update PEP Jobs',
    onTick: updatePepJobs,
  },
  {
    // every day at 8am
    cronTime: '0 8 * * *',
    name: 'Update Seekube Jobs',
    onTick: updateSkbJobs,
  },
]

JOBS.forEach(job => {
  const cronjob = { start: true, timeZone: 'Europe/Paris', ...job }

  ß.info(`[cron.js] Initializing job "${cronjob.name}" on ${cronjob.cronTime}…`)
  // eslint-disable-next-line no-new
  new CronJob(cronjob)
})

ß.success(`[cron.js] Started ${JOBS.length} cron jobs.`)
