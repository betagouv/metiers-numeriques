/* eslint-disable @typescript-eslint/no-use-before-define */

import {
  NotionDatabaseItemPropertyAsDate,
  NotionDatabaseItemPropertyAsFiles,
  NotionDatabaseItemPropertyAsLastEditedTime,
  NotionDatabaseItemPropertyAsRichText,
  NotionDatabaseItemPropertyAsSelect,
  NotionDatabaseItemPropertyAsTitle,
} from '../types/Notion'
import handleError from './handleError'
import humanizeDate from './humanizeDate'

export default function convertNotionNodeToString(
  value:
    | NotionDatabaseItemPropertyAsDate
    | NotionDatabaseItemPropertyAsFiles
    | NotionDatabaseItemPropertyAsLastEditedTime
    | NotionDatabaseItemPropertyAsRichText
    | NotionDatabaseItemPropertyAsSelect
    | NotionDatabaseItemPropertyAsTitle,
): string {
  try {
    switch (value.type) {
      case 'date':
        return fromDate(value)

      case 'files':
        return fromFiles(value)

      case 'last_edited_time':
        return fromLastEditedTime(value)

      case 'rich_text':
        return fromRichText(value)

      case 'select':
        return fromSelect(value)

      case 'title':
        return fromTitle(value)

      default:
        return ''
    }
  } catch (err) {
    handleError(err, 'helpers/convertNotionNodeToHtml()')
  }
}

function fromDate(value: NotionDatabaseItemPropertyAsDate): string {
  if (value.date === null || value.date.start === null) {
    return ''
  }

  return humanizeDate(value.date.start)
}

function fromFiles(value: NotionDatabaseItemPropertyAsFiles): string {
  if (value.files.length === 0) {
    return ''
  }

  const firstFile = value.files[0]

  if (firstFile.type === 'external') {
    return firstFile.external.url
  }

  return firstFile.file.url
}

function fromLastEditedTime(value: NotionDatabaseItemPropertyAsLastEditedTime): string {
  return humanizeDate(value.last_edited_time)
}

function fromRichText(value: NotionDatabaseItemPropertyAsRichText): string {
  return value.rich_text.map(richTextChild => richTextChild.plain_text).join('')
}

function fromSelect(value: NotionDatabaseItemPropertyAsSelect): string {
  if (value.select === null) {
    return ''
  }

  return value.select.name
}

function fromTitle(value: NotionDatabaseItemPropertyAsTitle): string {
  return value.title.map(titleChild => titleChild.plain_text).join('')
}
