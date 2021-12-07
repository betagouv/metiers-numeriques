import Entity from '../models/Entity'
import { NotionEntity } from '../types/NotionEntity'
import convertNotionNodeToString from './convertNotionNodeToString'
import handleError from './handleError'

export default function generateEntityFromNotionEntity(notionEntity: NotionEntity) {
  try {
    return new Entity({
      fullName: convertNotionNodeToString(notionEntity.properties.NomComplet),
      id: notionEntity.id,
      logoUrl: convertNotionNodeToString(notionEntity.properties.Logo),
      name: convertNotionNodeToString(notionEntity.properties.Nom) || '⚠️ {Nom} manquant',
    })
  } catch (err) {
    handleError(err, 'helpers/generateServiceFromNotionService()')
  }
}
