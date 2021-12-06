import Service from '../models/Service'
import { NotionService } from '../types/NotionService'
import convertNotionNodeToString from './convertNotionNodeToString'
import handleError from './handleError'

export default function generateServiceFromNotionService(notionService: NotionService) {
  try {
    return new Service({
      fullName: convertNotionNodeToString(notionService.properties.NomComplet),
      id: notionService.id,
      name: convertNotionNodeToString(notionService.properties.Nom),
      region: convertNotionNodeToString(notionService.properties.Region),
      url: convertNotionNodeToString(notionService.properties.Lien),
    })
  } catch (err) {
    handleError(err, 'helpers/generateServiceFromNotionService()')
  }
}
