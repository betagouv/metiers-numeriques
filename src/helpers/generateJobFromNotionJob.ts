import * as R from 'ramda'

import Job from '../models/Job'
import Service from '../models/Service'
import { NotionPropertyAsRelation } from '../types/Notion'
import { NotionJob } from '../types/NotionJob'
import convertNotionNodeToHtml from './convertNotionNodeToHtml'
import convertNotionNodeToString from './convertNotionNodeToString'
import convertNotionNodeToStrings from './convertNotionNodeToStrings'
import handleError from './handleError'
import slugify from './slugify'

const getService = (relation: NotionPropertyAsRelation, services: Service[]): Service | undefined => {
  if (relation.relation.length === 0) {
    return undefined
  }

  const maybeService = R.find(R.propEq('id', relation.relation[0].id), services)

  return maybeService
}

export default function generateJobFromNotionJob(
  notionJob: NotionJob,
  {
    services,
  }: {
    services: Service[]
  },
) {
  try {
    const { id } = notionJob
    const title = convertNotionNodeToString(notionJob.properties.Name) || '⚠️ {Name} manquant'

    const service = getService(notionJob.properties.Service, services)

    return new Job({
      advantages: convertNotionNodeToHtml(notionJob.properties['Les plus du poste']),
      conditions: convertNotionNodeToHtml(notionJob.properties['Conditions particulières du poste']),
      createdAt: notionJob.properties.CreeLe.created_time,
      department: convertNotionNodeToStrings(notionJob.properties['Ministère']),
      entity: convertNotionNodeToHtml(notionJob.properties['Entité recruteuse']),
      experiences: convertNotionNodeToStrings(notionJob.properties['Expérience']),
      hiringProcess: convertNotionNodeToHtml(notionJob.properties['Processus de recrutement']),
      id: notionJob.id,
      limitDate: convertNotionNodeToString(notionJob.properties['Date limite']),
      locations: convertNotionNodeToStrings(notionJob.properties.Localisation),
      mission: convertNotionNodeToHtml(notionJob.properties.Mission),
      more: convertNotionNodeToHtml(notionJob.properties['Pour en savoir plus']),
      openedToContractTypes: convertNotionNodeToStrings(notionJob.properties['Poste ouvert aux']),
      profile: convertNotionNodeToHtml(notionJob.properties['Votre profil']),
      publicationDate: convertNotionNodeToHtml(notionJob.properties['Date de saisie']),
      reference: `MNN-${id}`,
      salary: convertNotionNodeToHtml(notionJob.properties['Rémunération']),
      service,
      slug: slugify(title, id),
      tasks: convertNotionNodeToHtml(notionJob.properties['Ce que vous ferez']),
      team: convertNotionNodeToHtml(notionJob.properties['Équipe']),
      teamInfo: convertNotionNodeToHtml(notionJob.properties['Si vous avez des questions']),
      title,
      toApply: convertNotionNodeToHtml(notionJob.properties['Pour candidater']),
      updatedAt: notionJob.properties.MisAJourLe.last_edited_time,
      updatedDate: convertNotionNodeToString(notionJob.properties.MisAJourLe) || '⚠️ {MisAJourLe} manquant',
    })
  } catch (err) {
    handleError(err, 'helpers/generateJobFromNotionJob()')
  }
}
