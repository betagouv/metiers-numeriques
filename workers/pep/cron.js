import { CronJob } from 'cron'

import PepJob from './index.js'

const job = new CronJob('* * * * *', PepJob, null, false, 'America/Los_Angeles', null, true)

job.start()
