/* eslint-disable @typescript-eslint/no-use-before-define */

import { NotionDatabaseItemPropertyAsMultiSelect, NotionDatabaseItemPropertyAsRichText } from '../types/Notion'
import convertMarkdownToInlineHtml from './convertMarkdownToInlineHtml'
import handleError from './handleError'

export default function convertNotionNodeToStrings(
  value: NotionDatabaseItemPropertyAsMultiSelect | NotionDatabaseItemPropertyAsRichText,
): string[] {
  try {
    switch (value.type) {
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
