/* eslint-disable @typescript-eslint/no-use-before-define */

import {
  NotionDatabaseItemProperty,
  NotionDatabaseItemPropertyAsDate,
  NotionDatabaseItemPropertyAsRichText,
  NotionDatabaseItemPropertyAsSelect,
  NotionDatabaseItemPropertyAsTitle,
} from '../types/Notion'
import convertMarkdownToHtml from './convertMarkdownToHtml'
import convertMarkdownToInlineHtml from './convertMarkdownToInlineHtml'
import handleError from './handleError'
import humanizeDate from './humanizeDate'

export default function convertNotionNodeToHtml(
  value: NotionDatabaseItemProperty,
  isInline: boolean = false,
): string | undefined {
  try {
    switch (value.type) {
      case 'date':
        return fromDate(value)

      case 'rich_text':
        return fromRichText(value, isInline)

      case 'select':
        return fromSelect(value, isInline)

      case 'title':
        return fromTitle(value, isInline)

      default:
        return undefined
    }
  } catch (err) {
    handleError(err, 'helpers/convertNotionNodeToHtml()')
  }
}

function fromDate(value: NotionDatabaseItemPropertyAsDate): string | undefined {
  if (value.date === null) {
    return undefined
  }

  return humanizeDate(value.date.start)
}

function fromRichText(value: NotionDatabaseItemPropertyAsRichText, isInline: boolean): string {
  const markdownSource = value.rich_text.map(richTextChild => richTextChild.plain_text).join('')

  if (isInline) {
    return convertMarkdownToInlineHtml(markdownSource)
  }

  return convertMarkdownToHtml(markdownSource)
}

function fromSelect(value: NotionDatabaseItemPropertyAsSelect, isInline): string | undefined {
  if (value.select === null) {
    return undefined
  }

  const markdownSource = value.select.name

  if (isInline) {
    return convertMarkdownToInlineHtml(markdownSource)
  }

  return convertMarkdownToHtml(markdownSource)
}

function fromTitle(value: NotionDatabaseItemPropertyAsTitle, isInline: boolean): string {
  const markdownSource = value.title.map(titleChild => titleChild.plain_text).join('')

  if (isInline) {
    return convertMarkdownToInlineHtml(markdownSource)
  }

  return convertMarkdownToHtml(markdownSource)
}
