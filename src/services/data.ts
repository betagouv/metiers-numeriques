import * as R from 'ramda'

import generateInstitutionFromNotionInstitution from '../helpers/generateInstitutionFromNotionInstitution'
import generateJobFromNotionJob from '../helpers/generateJobFromNotionJob'
import generateJobFromNotionPepJob from '../helpers/generateJobFromNotionPepJob'
import generateJobFromNotionSkbJob from '../helpers/generateJobFromNotionSkbJob'
import sortJobsByQuality from '../helpers/sortJobsByQuality'
import Institution from '../models/Institution'
import Job from '../models/Job'
import notion from './notion'

const sortByUpdatedAtDesc: (jobs: Job[]) => Job[] = R.sort(R.descend(R.prop('updatedAt')))
const sortByTitleAsc: (institutions: Institution[]) => Institution[] = R.sort(R.ascend(R.prop('title')))

class Data {
  public async getInstitutions(): Promise<Institution[]> {
    const notionInstitutions = await notion.findManyInstitutions()
    const institutions = notionInstitutions.map(generateInstitutionFromNotionInstitution)

    const institutionsSorted = sortByTitleAsc(institutions)

    return institutionsSorted
  }

  public async getJobs(): Promise<Job[]> {
    const notionJobs = await notion.findManyJobs()
    const notionPepJobs = await notion.findManyPepJobs()
    const notionSkbJobs = await notion.findManySkbJobs()
    const jobs = notionJobs.map(generateJobFromNotionJob)
    const pepJobs = notionPepJobs.map(generateJobFromNotionPepJob)
    const skbJobs = notionSkbJobs.map(generateJobFromNotionSkbJob)

    const allJobs = [...jobs, ...pepJobs, ...skbJobs]
    const allJobsSortedByUpdatedAtDesc = sortByUpdatedAtDesc(allJobs)
    const allJobsSortedByQuality = sortJobsByQuality(allJobsSortedByUpdatedAtDesc)

    return allJobsSortedByQuality
  }
}

export default new Data()
