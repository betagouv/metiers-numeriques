/* eslint-disable @typescript-eslint/no-use-before-define */

import {
  NotionPropertyAsDate,
  NotionPropertyAsFiles,
  NotionPropertyAsLastEditedTime,
  NotionPropertyAsRichText,
  NotionPropertyAsSelect,
  NotionPropertyAsTitle,
  NotionPropertyAsUrl,
} from '../types/Notion'
import handleError from './handleError'
import humanizeDate from './humanizeDate'
import stripHtmlTags from './stripHtmlTags'

export default function convertNotionNodeToString(
  value:
    | NotionPropertyAsDate
    | NotionPropertyAsFiles
    | NotionPropertyAsLastEditedTime
    | NotionPropertyAsRichText
    | NotionPropertyAsSelect
    | NotionPropertyAsTitle
    | NotionPropertyAsUrl,
): string | null {
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

      case 'url':
        return fromUrl(value)

      default:
        return ''
    }
  } catch (err) {
    handleError(err, 'helpers/convertNotionNodeToHtml()')
  }
}

function fromDate(value: NotionPropertyAsDate): string | null {
  if (value.date === null || value.date.start === null) {
    return null
  }

  return humanizeDate(value.date.start)
}

function fromFiles(value: NotionPropertyAsFiles): string | null {
  if (value.files.length === 0) {
    return null
  }

  const firstFile = value.files[0]

  if (firstFile.type === 'external') {
    return firstFile.external.url
  }

  return firstFile.file.url
}

function fromLastEditedTime(value: NotionPropertyAsLastEditedTime): string {
  return humanizeDate(value.last_edited_time)
}

function fromRichText(value: NotionPropertyAsRichText): string | null {
  const plainTextSource = stripHtmlTags(value.rich_text.map(richTextChild => richTextChild.plain_text).join('')).trim()

  if (plainTextSource.length === 0) {
    return null
  }

  return plainTextSource
}

function fromSelect(value: NotionPropertyAsSelect): string | null {
  if (value.select === null) {
    return null
  }

  return stripHtmlTags(value.select.name)
}

function fromTitle(value: NotionPropertyAsTitle): string | null {
  const plainTextSource = stripHtmlTags(value.title.map(titleChild => titleChild.plain_text).join('')).trim()

  if (plainTextSource.length === 0) {
    return null
  }

  return plainTextSource
}

function fromUrl(value: NotionPropertyAsUrl): string | null {
  if (value.url === null) {
    return null
  }

  return value.url
}
