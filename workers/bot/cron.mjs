import { CronJob } from 'cron'

import BotJob from './index.mjs'

const job = new CronJob('* * * * *', BotJob, null, false, 'America/Los_Angeles', null, true)

job.start()
