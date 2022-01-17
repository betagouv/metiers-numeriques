import Job from '../models/Job'
import { NotionSkbJob } from '../types/NotionSkbJob'
import capitalize from './capitalize'
import convertNotionNodeToPrismaValue from './convertNotionNodeToPrismaValue'
import convertNotionNodeToString from './convertNotionNodeToString'
import convertNotionNodeToStrings from './convertNotionNodeToStrings'
import handleError from './handleError'
import slugify from './slugify'

export default function generateJobFromNotionSkbJob(notionSkbJob: NotionSkbJob) {
  try {
    const { id } = notionSkbJob
    const title = convertNotionNodeToString(notionSkbJob.properties.Titre) || '⚠️ {Titre} manquant'

    return new Job({
      advantages: null,
      conditions: null,
      createdAt: convertNotionNodeToPrismaValue(notionSkbJob.properties.CreeLe),
      department: convertNotionNodeToStrings(notionSkbJob.properties.Entreprise),
      entity: null,
      experiences: [],
      hiringProcess: null,
      id,
      legacyServiceId: null,
      limitDate: null,
      locations: convertNotionNodeToStrings(notionSkbJob.properties.Localisation),
      mission: convertNotionNodeToPrismaValue(notionSkbJob.properties.Description),
      more: null,
      openedToContractTypes: [],
      profile: null,
      publicationDate: null,
      reference: `SKB-${id}`,
      salary: null,
      slug: slugify(title, id),
      tasks: null,
      team: null,
      teamInfo: null,
      title: capitalize(title),
      toApply: null,
      updatedAt: convertNotionNodeToPrismaValue(notionSkbJob.properties.MisAJourLe),
    })
  } catch (err) {
    handleError(err, 'helpers/generateJobFromNotionSkbJob()')
  }
}
