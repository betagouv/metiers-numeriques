import ß from 'bhala'

import notion from '../services/notion'
import handleError from './handleError'

export default async function outputTypeFromNotionDatabase(databaseId: string) {
  try {
    const data = await notion.database.findMany(databaseId)

    const propertiesShape = data.reduce((shape, { properties }) => {
      // console.log(properties)

      const newKeys = Object.keys(properties)

      newKeys.forEach(newKey => {
        if (shape[newKey] !== undefined) {
          return
        }

        // eslint-disable-next-line no-param-reassign
        shape[newKey] = {
          isOptional: false,
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
          ß.debug(`'${shapeKey}': NotionDatabaseItemPropertyAsCreatedTime`)
          break

        case 'checkbox':
          ß.debug(`'${shapeKey}': NotionDatabaseItemPropertyAsCheckbox`)
          break

        case 'date':
          ß.debug(`'${shapeKey}': NotionDatabaseItemPropertyAsDate`)
          break

        case 'files':
          ß.debug(`'${shapeKey}': NotionDatabaseItemPropertyAsFiles`)
          break

        case 'email':
          ß.debug(`'${shapeKey}': NotionDatabaseItemPropertyAsEmail`)
          break

        case 'last_edited_time':
          ß.debug(`'${shapeKey}': NotionDatabaseItemPropertyAsLastEditedTime`)
          break

        case 'multi_select':
          ß.debug(`'${shapeKey}': NotionDatabaseItemPropertyAsMultiSelect`)
          break

        case 'number':
          ß.debug(`'${shapeKey}': NotionDatabaseItemPropertyAsNumber`)
          break

        case 'people':
          ß.debug(`'${shapeKey}': NotionDatabaseItemPropertyAsPeople`)
          break

        case 'rich_text':
          ß.debug(`'${shapeKey}': NotionDatabaseItemPropertyAsRichText`)
          break

        case 'select':
          ß.debug(`'${shapeKey}': NotionDatabaseItemPropertyAsSelect`)
          break

        case 'title':
          ß.debug(`'${shapeKey}': NotionDatabaseItemPropertyAsTitle`)
          break

        case 'url':
          ß.debug(`'${shapeKey}': NotionDatabaseItemPropertyAsUrl`)
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
