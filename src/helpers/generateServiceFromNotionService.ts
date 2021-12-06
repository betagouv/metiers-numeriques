import * as R from 'ramda'

import Institution from '../models/Institution'
import Service from '../models/Service'
import { NotionPropertyAsRelation } from '../types/Notion'
import { NotionService } from '../types/NotionService'
import convertNotionNodeToString from './convertNotionNodeToString'
import handleError from './handleError'

const getInstitution = (relation: NotionPropertyAsRelation, institutions: Institution[]): Institution | undefined => {
  if (relation.relation.length === 0) {
    return undefined
  }

  const maybeInstitution = R.find(R.propEq('id', relation.relation[0].id), institutions)

  return maybeInstitution
}

export default function generateServiceFromNotionService(
  notionService: NotionService,
  {
    institutions,
  }: {
    institutions: Institution[]
  },
) {
  try {
    const institution = getInstitution(notionService.properties.Institution, institutions)

    return new Service({
      fullName: convertNotionNodeToString(notionService.properties.NomComplet),
      id: notionService.id,
      institution,
      name: convertNotionNodeToString(notionService.properties.Nom),
      region: convertNotionNodeToString(notionService.properties.Region),
      url: convertNotionNodeToString(notionService.properties.Lien),
    })
  } catch (err) {
    handleError(err, 'helpers/generateServiceFromNotionService()')
  }
}
