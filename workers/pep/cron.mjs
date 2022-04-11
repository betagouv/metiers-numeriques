import { CronJob } from 'cron'

import PepJob from './index.mjs'

const job = new CronJob('*/5 * * * *', PepJob, null, false, 'America/Los_Angeles', null, true)

job.start()
