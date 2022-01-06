import { NotionPropertyAsFiles } from '../types/Notion'
import handleError from './handleError'

export default function convertNotionFilesNodeToUrls(value: NotionPropertyAsFiles): string[] {
  try {
    const urls = value.files.map(file => (file.type === 'external' ? file.external.url : file.file.url))

    return urls
  } catch (err) {
    handleError(err, 'helpers/convertNotionFilesNodeToUrls()')
  }
}
