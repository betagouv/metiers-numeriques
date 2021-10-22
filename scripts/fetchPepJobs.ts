import { config } from 'dotenv';

import { fetchPepJobs } from '../src/schedulers/pepJobsScheduler';

config();

fetchPepJobs().then();
