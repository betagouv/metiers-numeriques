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
): string | undefined {
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

function fromDate(value: NotionPropertyAsDate): string | undefined {
  if (value.date === null || value.date.start === null) {
    return undefined
  }

  return humanizeDate(value.date.start)
}

function fromFiles(value: NotionPropertyAsFiles): string | undefined {
  if (value.files.length === 0) {
    return undefined
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

function fromRichText(value: NotionPropertyAsRichText): string | undefined {
  const plainTextSource = stripHtmlTags(value.rich_text.map(richTextChild => richTextChild.plain_text).join('')).trim()

  if (plainTextSource.length === 0) {
    return undefined
  }

  return plainTextSource
}

function fromSelect(value: NotionPropertyAsSelect): string | undefined {
  if (value.select === null) {
    return undefined
  }

  return stripHtmlTags(value.select.name)
}

function fromTitle(value: NotionPropertyAsTitle): string | undefined {
  const plainTextSource = stripHtmlTags(value.title.map(titleChild => titleChild.plain_text).join('')).trim()

  if (plainTextSource.length === 0) {
    return undefined
  }

  return plainTextSource
}

function fromUrl(value: NotionPropertyAsUrl): string | undefined {
  if (value.url === null) {
    return undefined
  }

  return value.url
}
