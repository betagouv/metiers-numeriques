import ß from 'bhala'

import notion from '../services/notion'
import { NotionProperty } from '../types/Notion'
import handleError from './handleError'

type Shape = {
  [key: string]: {
    type: NotionProperty['type']
  }
}

export default async function outputTypeFromNotionDatabase(databaseId: string) {
  try {
    const data = await notion.database.findMany(databaseId)

    const propertiesShape = data.reduce((shape: Shape, { properties }): Shape => {
      // console.log(properties)

      const newKeys = Object.keys(properties)

      newKeys.forEach(newKey => {
        if (shape[newKey] !== undefined) {
          return
        }

        // eslint-disable-next-line no-param-reassign
        shape[newKey] = {
          type: properties[newKey].type,
        }
      })

      return shape
    }, {})

    const propertiesShapeKeys = Object.keys(propertiesShape).sort()
    propertiesShapeKeys.forEach(shapeKey => {
      const shape = propertiesShape[shapeKey]

      switch (shape.type) {
        case 'created_time':
          ß.debug(`'${shapeKey}': NotionPropertyAsCreatedTime`)
          break

        case 'checkbox':
          ß.debug(`'${shapeKey}': NotionPropertyAsCheckbox`)
          break

        case 'date':
          ß.debug(`'${shapeKey}': NotionPropertyAsDate`)
          break

        case 'files':
          ß.debug(`'${shapeKey}': NotionPropertyAsFiles`)
          break

        case 'email':
          ß.debug(`'${shapeKey}': NotionPropertyAsEmail`)
          break

        case 'last_edited_time':
          ß.debug(`'${shapeKey}': NotionPropertyAsLastEditedTime`)
          break

        case 'multi_select':
          ß.debug(`'${shapeKey}': NotionPropertyAsMultiSelect`)
          break

        case 'number':
          ß.debug(`'${shapeKey}': NotionPropertyAsNumber`)
          break

        case 'people':
          ß.debug(`'${shapeKey}': NotionPropertyAsPeople`)
          break

        case 'relation':
          ß.debug(`'${shapeKey}': NotionPropertyAsRelation`)
          break

        case 'rich_text':
          ß.debug(`'${shapeKey}': NotionPropertyAsRichText`)
          break

        case 'select':
          ß.debug(`'${shapeKey}': NotionPropertyAsSelect`)
          break

        case 'title':
          ß.debug(`'${shapeKey}': NotionPropertyAsTitle`)
          break

        case 'url':
          ß.debug(`'${shapeKey}': NotionPropertyAsUrl`)
          break

        default:
          // eslint-disable-next-line no-console
          console.debug(data[0].properties[shapeKey])
          throw new Error(`Unknown Notion database item property type "${shape.type}".`)
      }
    })
  } catch (err) {
    handleError(err, 'helpers/outputTypeFromNotionDatabase()')
  }
}
