import * as R from 'ramda'

import Entity from '../models/Entity'
import Service from '../models/Service'
import { NotionPropertyAsRelation } from '../types/Notion'
import { NotionService } from '../types/NotionService'
import convertNotionNodeToString from './convertNotionNodeToString'
import handleError from './handleError'

const getEntity = (relation: NotionPropertyAsRelation, entities: Entity[]): Entity | undefined => {
  if (relation.relation.length === 0) {
    return undefined
  }

  const maybeEntity = R.find<Entity>(R.propEq('id', relation.relation[0].id), entities)

  return maybeEntity
}

export default function generateServiceFromNotionService(
  notionService: NotionService,
  {
    entities,
  }: {
    entities: Entity[]
  },
) {
  try {
    const entity = getEntity(notionService.properties.Entite, entities)

    return new Service({
      entity,
      fullName: convertNotionNodeToString(notionService.properties.NomComplet),
      id: notionService.id,
      name: convertNotionNodeToString(notionService.properties.Nom) || '⚠️ {Nom} manquant',
      region: convertNotionNodeToString(notionService.properties.Region) || '⚠️ {Region} manquante',
      shortName: convertNotionNodeToString(notionService.properties.NomCourt),
      url: convertNotionNodeToString(notionService.properties.Lien),
    })
  } catch (err) {
    handleError(err, 'helpers/generateServiceFromNotionService()')
  }
}
