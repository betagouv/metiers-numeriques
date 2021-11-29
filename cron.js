const { CronJob } = require('cron')

const { fetchPepJobs } = require('./src/schedulers/pepJobsScheduler')

const jobs = [
  {
    cronTime: '0 8 * * *',
    isActive: process.env.FEATURE_FLAG_FETCH_PEP_JOBS,

    name: 'fetchPepJobs',
    // every day at 8:00
    onTick: () => fetchPepJobs,
  },
]

let activeJobs = 0
for (const job of jobs) {
  const cronjob = { start: true, timeZone: 'Europe/Paris', ...job }

  if (cronjob.isActive) {
    console.log(`🚀 The job "${cronjob.name}" is ON ${cronjob.cronTime}`)
    new CronJob(cronjob)
    activeJobs++
  } else {
    console.log(`❌ The job "${cronjob.name}" is OFF`)
  }
}
console.log(`Started ${activeJobs} / ${jobs.length} cron jobs`)
