/* eslint-disable @typescript-eslint/no-use-before-define */

import { NotionPropertyAsFiles, NotionPropertyAsMultiSelect, NotionPropertyAsRichText } from '../types/Notion'
import handleError from './handleError'
import stripHtmlTags from './stripHtmlTags'

export default function convertNotionNodeToStrings(
  value: NotionPropertyAsFiles | NotionPropertyAsMultiSelect | NotionPropertyAsRichText,
): string[] {
  try {
    switch (value.type) {
      case 'files':
        return fromFiles(value)

      case 'multi_select':
        return fromMultiSelect(value)

      case 'rich_text':
        return fromRichText(value)

      default:
        return []
    }
  } catch (err) {
    handleError(err, 'helpers/convertNotionNodeToStrings()')
  }
}

function fromFiles(value: NotionPropertyAsFiles): string[] {
  return value.files.map(file => {
    if (file.type === 'external') {
      return file.external.url
    }

    return file.file.url
  })
}

function fromMultiSelect(value: NotionPropertyAsMultiSelect): string[] {
  return value.multi_select.map(selectChild => stripHtmlTags(selectChild.name))
}

function fromRichText(value: NotionPropertyAsRichText): string[] {
  return stripHtmlTags(value.rich_text.map(richTextChild => richTextChild.plain_text).join(''))
    .split(/,|;|\n/)
    .map(row => row.replace(/^-\s+/g, '').trim())
}
