import * as R from 'ramda'

import generateJobFromNotionJob from '../helpers/generateJobFromNotionJob'
import generateJobFromNotionPepJob from '../helpers/generateJobFromNotionPepJob'
import generateJobFromNotionSkbJob from '../helpers/generateJobFromNotionSkbJob'
import Job from '../models/Job'
import notion from './notion'

const sortByPublishedAtDesc: (jobs: Job[]) => Job[] = R.sortWith([R.descend(R.prop('updatedAt'))])

class Data {
  public async getJobs(): Promise<Job[]> {
    const notionJobs = await notion.findManyJobs()
    const notionPepJobs = await notion.findManyPepJobs()
    const notionSkbJobs = await notion.findManySkbJobs()
    const jobs = notionJobs.map(generateJobFromNotionJob)
    const pepJobs = notionPepJobs.map(generateJobFromNotionPepJob)
    const skbJobs = notionSkbJobs.map(generateJobFromNotionSkbJob)

    const allJobs = [...jobs, ...pepJobs, ...skbJobs]
    const allJobsSorted = sortByPublishedAtDesc(allJobs)

    return allJobsSorted
  }
}

export default new Data()
