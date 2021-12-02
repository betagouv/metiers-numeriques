import ß from 'bhala'
import { CronJob } from 'cron'

import updateCache from '../jobs/updateCache'

const JOBS = [
  {
    // Each minute
    cronTime: '1 * * * *',
    name: 'Update Cache',
    onTick: updateCache,
  },
]

JOBS.forEach(job => {
  const cronjob = {
    start: true,
    timeZone: 'Europe/Paris',
    ...job,
  }

  ß.info(`[workers/cacheUpdater.js] Initializing job "${cronjob.name}" @ ${cronjob.cronTime}…`)
  // eslint-disable-next-line no-new
  new CronJob(cronjob)
})

ß.success(`[cron.js] Started ${JOBS.length} cron jobs.`)
