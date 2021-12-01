import ß from 'bhala'

import notion from '../services/notion'
import handleError from './handleError'

export default async function outputTypeFromNotionDatabase(databaseId: string) {
  try {
    const data = await notion.database.findMany(databaseId)

    const propertiesShape = data.reduce((shape, { properties }) => {
      const shapeKeys = Object.keys(shape)
      const newKeys = Object.keys(properties)

      shapeKeys.forEach(shapeKey => {
        if (newKeys.includes(shapeKey)) {
          // if (properties[shapeKey].type === 'url' && (properties[shapeKey] as any).url === null) {
          // if ((properties as any)[shapeKey].type === 'people' && (properties as any)[shapeKey].people.length > 0) {
          //   console.log((properties as any)[shapeKey])
          //   console.log((properties as any)[shapeKey].people[0])
          // }

          return
        }

        shapeKeys[shapeKey].isOptional = true
      })

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
          ß.debug(`'${shapeKey}'${shape.isOptional ? '?' : ''}: NotionDatabaseItemPropertyAsCreatedTime`)
          break

        case 'checkbox':
          ß.debug(`'${shapeKey}'${shape.isOptional ? '?' : ''}: NotionDatabaseItemPropertyAsCheckbox`)
          break

        case 'date':
          ß.debug(`'${shapeKey}'${shape.isOptional ? '?' : ''}: NotionDatabaseItemPropertyAsDate`)
          break

        case 'files':
          ß.debug(`'${shapeKey}'${shape.isOptional ? '?' : ''}: NotionDatabaseItemPropertyAsFiles`)
          break

        case 'multi_select':
          ß.debug(`'${shapeKey}'${shape.isOptional ? '?' : ''}: NotionDatabaseItemPropertyAsMultiSelect`)
          break

        case 'people':
          ß.debug(`'${shapeKey}'${shape.isOptional ? '?' : ''}: NotionDatabaseItemPropertyAsPeople`)
          break

        case 'rich_text':
          ß.debug(`'${shapeKey}'${shape.isOptional ? '?' : ''}: NotionDatabaseItemPropertyAsRichText`)
          break

        case 'select':
          ß.debug(`'${shapeKey}'${shape.isOptional ? '?' : ''}: NotionDatabaseItemPropertyAsSelect`)
          break

        case 'title':
          ß.debug(`'${shapeKey}'${shape.isOptional ? '?' : ''}: NotionDatabaseItemPropertyAsTitle`)
          break

        case 'url':
          ß.debug(`'${shapeKey}'${shape.isOptional ? '?' : ''}: NotionDatabaseItemPropertyAsUrl`)
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
