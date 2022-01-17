import * as R from 'ramda'

import Job from '../models/Job'
import { NotionPropertyAsRelation } from '../types/Notion'
import { NotionJob } from '../types/NotionJob'
import convertNotionNodeToPrismaValue from './convertNotionNodeToPrismaValue'
import convertNotionNodeToString from './convertNotionNodeToString'
import convertNotionNodeToStrings from './convertNotionNodeToStrings'
import handleError from './handleError'
import slugify from './slugify'

import type { LegacyService } from '@prisma/client'

const getService = (relation: NotionPropertyAsRelation, services: LegacyService[]): LegacyService | undefined => {
  if (relation.relation.length === 0) {
    return undefined
  }

  const maybeService = R.find<LegacyService>(R.propEq('id', relation.relation[0].id), services)

  return maybeService
}

export default function generateJobFromNotionJob(
  notionJob: NotionJob,
  {
    services,
  }: {
    services: LegacyService[]
  },
) {
  try {
    const { id } = notionJob
    const title = convertNotionNodeToString(notionJob.properties.Name) || '⚠️ {Name} manquant'

    const service = getService(notionJob.properties.Service, services)

    return new Job({
      advantages: convertNotionNodeToPrismaValue(notionJob.properties['Les plus du poste']),
      conditions: convertNotionNodeToPrismaValue(notionJob.properties['Conditions particulières du poste']),
      createdAt: convertNotionNodeToPrismaValue(notionJob.properties.CreeLe),
      department: convertNotionNodeToStrings(notionJob.properties['Ministère']),
      entity: convertNotionNodeToPrismaValue(notionJob.properties['Entité recruteuse']),
      experiences: convertNotionNodeToStrings(notionJob.properties['Expérience']),
      hiringProcess: convertNotionNodeToPrismaValue(notionJob.properties['Processus de recrutement']),
      id: notionJob.id,
      legacyServiceId: service ? service.id : null,
      limitDate: convertNotionNodeToPrismaValue(notionJob.properties['Date limite']),
      locations: convertNotionNodeToStrings(notionJob.properties.Localisation),
      mission: convertNotionNodeToPrismaValue(notionJob.properties.Mission),
      more: convertNotionNodeToPrismaValue(notionJob.properties['Pour en savoir plus']),
      openedToContractTypes: convertNotionNodeToStrings(notionJob.properties['Poste ouvert aux']),
      profile: convertNotionNodeToPrismaValue(notionJob.properties['Votre profil']),
      publicationDate: convertNotionNodeToPrismaValue(notionJob.properties['Date de saisie']),
      reference: `MNN-${id}`,
      salary: convertNotionNodeToPrismaValue(notionJob.properties['Rémunération']),
      slug: slugify(title, id),
      tasks: convertNotionNodeToPrismaValue(notionJob.properties['Ce que vous ferez']),
      team: convertNotionNodeToPrismaValue(notionJob.properties['Équipe']),
      teamInfo: convertNotionNodeToPrismaValue(notionJob.properties['Si vous avez des questions']),
      title,
      toApply: convertNotionNodeToPrismaValue(notionJob.properties['Pour candidater']),
      updatedAt: convertNotionNodeToPrismaValue(notionJob.properties.MisAJourLe),
      // updatedDate: convertNotionNodeToString(notionJob.properties.MisAJourLe) || '⚠️ {MisAJourLe} manquant',
    })
  } catch (err) {
    handleError(err, 'helpers/generateJobFromNotionJob()')
  }
}
