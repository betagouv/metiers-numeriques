const CronJob = require('cron');
const fetchPepJobs = require('./schedulers/fetchPepJobs')
require('dotenv').config();

const jobs = [
  {
    cronTime: '0 8 * * 1', // every week a 8:00 on monday
    onTick: () => fetchPepJobs,
    isActive: process.env.FEATURE_FLAG_FETCH_PEP_JOBS,
    name: 'fetchPepJobs',
  }
];

let activeJobs = 0;
for (const job of jobs) {
  const cronjob = { timeZone: 'Europe/Paris', start: true, ...job };

  if (cronjob.isActive) {
    console.log(`🚀 The job "${cronjob.name}" is ON ${cronjob.cronTime}`);
    new CronJob(cronjob);
    activeJobs++;
  } else {
    console.log(`❌ The job "${cronjob.name}" is OFF`);
  }
}
console.log(`Started ${activeJobs} / ${jobs.length} cron jobs`);