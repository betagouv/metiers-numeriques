import * as R from 'ramda'

import generateJobFromNotionJob from '../helpers/generateJobFromNotionJob'
import generateJobFromNotionPepJob from '../helpers/generateJobFromNotionPepJob'
import generateJobFromNotionSkbJob from '../helpers/generateJobFromNotionSkbJob'
import generateMinistryFromNotionMinistry from '../helpers/generateMinistryFromNotionMinistry'
import Job from '../models/Job'
import Ministry from '../models/Ministry'
import notion from './notion'

const sortByUpdatedAtDesc: (jobs: Job[]) => Job[] = R.sortWith([R.descend(R.prop('updatedAt'))])
const sortByTitleAsc: (ministries: Ministry[]) => Ministry[] = R.sortWith([R.ascend(R.prop('title'))])

class Data {
  public async getJobs(): Promise<Job[]> {
    const notionJobs = await notion.findManyJobs()
    const notionPepJobs = await notion.findManyPepJobs()
    const notionSkbJobs = await notion.findManySkbJobs()
    const jobs = notionJobs.map(generateJobFromNotionJob)
    const pepJobs = notionPepJobs.map(generateJobFromNotionPepJob)
    const skbJobs = notionSkbJobs.map(generateJobFromNotionSkbJob)

    const allJobs = [...jobs, ...pepJobs, ...skbJobs]
    const allJobsSorted = sortByUpdatedAtDesc(allJobs)

    return allJobsSorted
  }

  public async getMinistries(): Promise<Ministry[]> {
    const notionMinistries = await notion.findManyMinistries()
    const ministries = notionMinistries.map(generateMinistryFromNotionMinistry)

    const ministriesSorted = sortByTitleAsc(ministries)

    return ministriesSorted
  }
}

export default new Data()
