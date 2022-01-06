import { NotionPropertyAsFiles } from '../types/Notion'
import handleError from './handleError'

export default function convertNotionFilesNodeToFiles(value: NotionPropertyAsFiles): Common.Data.File[] {
  try {
    const urls = value.files.map(file => {
      const url = file.type === 'external' ? file.external.url : file.file.url

      return {
        name: file.name,
        url,
      }
    })

    return urls
  } catch (err) {
    handleError(err, 'helpers/convertNotionFilesNodeToFiles()')
  }
}
