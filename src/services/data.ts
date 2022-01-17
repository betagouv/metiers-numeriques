import * as R from 'ramda'

import generateEntityFromNotionEntity from '../helpers/generateEntityFromNotionEntity'
import generateInstitutionFromNotionInstitution from '../helpers/generateInstitutionFromNotionInstitution'
import generateJobFromNotionJob from '../helpers/generateJobFromNotionJob'
import generateJobFromNotionPepJob from '../helpers/generateJobFromNotionPepJob'
import generateJobFromNotionSkbJob from '../helpers/generateJobFromNotionSkbJob'
import generateServiceFromNotionService from '../helpers/generateServiceFromNotionService'
import sortJobsByQuality from '../helpers/sortJobsByQuality'
import Entity from '../models/Entity'
import Institution from '../models/Institution'
import Job from '../models/Job'
import Service from '../models/Service'
import notion from './notion'

const sortByUpdatedAtDesc: (jobs: Job[]) => Job[] = R.sort(R.descend(R.prop('updatedAt')))
const sortByTitleAsc: (institutions: Institution[]) => Institution[] = R.sort(R.ascend(R.prop('title')))

class Data {
  constructor() {
    this.getEntities = this.getEntities.bind(this)
    this.getInstitutions = this.getInstitutions.bind(this)
    this.getJobs = this.getJobs.bind(this)
    this.getServices = this.getServices.bind(this)
  }

  public async getEntities(): Promise<Entity[]> {
    const notionEntities = await notion.findManyEntities()
    const entities = notionEntities.map(generateEntityFromNotionEntity)

    return entities
  }

  public async getInstitutions(): Promise<Institution[]> {
    const notionInstitutions = await notion.findManyInstitutions()
    const institutions = notionInstitutions.map(generateInstitutionFromNotionInstitution)

    const institutionsSorted = sortByTitleAsc(institutions)

    return institutionsSorted
  }

  public async getJobs(): Promise<Job[]> {
    const services = await this.getServices()

    const notionJobs = await notion.findManyJobs()
    const notionPepJobs = await notion.findManyPepJobs()
    const notionSkbJobs = await notion.findManySkbJobs()
    const jobs = notionJobs.map(notionJob =>
      generateJobFromNotionJob(notionJob, {
        services,
      }),
    )
    const pepJobs = notionPepJobs.map(generateJobFromNotionPepJob)
    const skbJobs = notionSkbJobs.map(generateJobFromNotionSkbJob)

    const allJobs = [...jobs, ...pepJobs, ...skbJobs]
    const allJobsSortedByUpdatedAtDesc = sortByUpdatedAtDesc(allJobs)
    const allJobsSortedByQuality = sortJobsByQuality(allJobsSortedByUpdatedAtDesc)

    return allJobsSortedByQuality
  }

  public async getServices(): Promise<Service[]> {
    const entities = await this.getEntities()

    const notionServices = await notion.findManyServices()
    const services = notionServices.map(notionJob =>
      generateServiceFromNotionService(notionJob, {
        entities,
      }),
    )

    return services
  }
}

export default new Data()
