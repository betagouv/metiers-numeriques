import { CronJob } from 'cron'

import PepJob from './index.mjs'

const job = new CronJob('* * * * *', PepJob, null, false, 'America/Los_Angeles', null, true)

job.start()
