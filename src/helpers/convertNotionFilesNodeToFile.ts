import { NotionPropertyAsFiles } from '../types/Notion'
import convertNotionFilesNodeToFiles from './convertNotionFilesNodeToFiles'
import handleError from './handleError'

export default function convertNotionFilesNodeToFile(value: NotionPropertyAsFiles): Common.Data.File | null {
  try {
    const maybeFile = convertNotionFilesNodeToFiles(value)[0]
    if (maybeFile === undefined) {
      return null
    }

    return maybeFile
  } catch (err) {
    handleError(err, 'helpers/convertNotionFilesNodeToFile()')
  }
}
