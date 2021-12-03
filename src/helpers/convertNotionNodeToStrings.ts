/* eslint-disable @typescript-eslint/no-use-before-define */

import {
  NotionDatabaseItemPropertyAsFiles,
  NotionDatabaseItemPropertyAsMultiSelect,
  NotionDatabaseItemPropertyAsRichText,
} from '../types/Notion'
import convertMarkdownToInlineHtml from './convertMarkdownToInlineHtml'
import handleError from './handleError'

export default function convertNotionNodeToStrings(
  value:
    | NotionDatabaseItemPropertyAsFiles
    | NotionDatabaseItemPropertyAsMultiSelect
    | NotionDatabaseItemPropertyAsRichText,
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

function fromFiles(value: NotionDatabaseItemPropertyAsFiles): string[] {
  return value.files.map(file => {
    if (file.type === 'external') {
      return file.external.url
    }

    return file.file.url
  })
}

function fromMultiSelect(value: NotionDatabaseItemPropertyAsMultiSelect): string[] {
  return value.multi_select.map(selectChild => convertMarkdownToInlineHtml(selectChild.name))
}

function fromRichText(value: NotionDatabaseItemPropertyAsRichText): string[] {
  const markdownSource = value.rich_text.map(richTextChild => richTextChild.plain_text).join('')
  const htmlSource = convertMarkdownToInlineHtml(markdownSource)

  if (htmlSource.length === 0) {
    return []
  }

  return [convertMarkdownToInlineHtml(markdownSource)]
}
