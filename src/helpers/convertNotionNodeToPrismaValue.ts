/* eslint-disable @typescript-eslint/no-use-before-define */

import daysjs from 'dayjs'

import {
  NotionPropertyAsCheckbox,
  NotionPropertyAsCreatedTime,
  NotionPropertyAsDate,
  NotionPropertyAsLastEditedTime,
  NotionPropertyAsRichText,
  NotionPropertyAsSelect,
  NotionPropertyAsTitle,
} from '../types/Notion'
import handleError from './handleError'

function convertNotionNodeToPrismaValue(value: NotionPropertyAsCheckbox): boolean
function convertNotionNodeToPrismaValue(value: NotionPropertyAsCreatedTime | NotionPropertyAsLastEditedTime): Date
function convertNotionNodeToPrismaValue(value: NotionPropertyAsDate): Date | null
function convertNotionNodeToPrismaValue(
  value: NotionPropertyAsRichText | NotionPropertyAsSelect | NotionPropertyAsTitle,
): string | null
function convertNotionNodeToPrismaValue(
  value:
    | NotionPropertyAsCheckbox
    | NotionPropertyAsCreatedTime
    | NotionPropertyAsDate
    | NotionPropertyAsLastEditedTime
    | NotionPropertyAsRichText
    | NotionPropertyAsSelect
    | NotionPropertyAsTitle,
): Boolean | Date | string | null {
  try {
    switch (value.type) {
      case 'checkbox':
        return fromCheckbox(value)

      case 'created_time':
        return fromCreatedTime(value)

      case 'date':
        return fromDate(value)

      case 'last_edited_time':
        return fromLastEditedTime(value)

      case 'rich_text':
        return fromRichText(value)

      case 'select':
        return fromSelect(value)

      case 'title':
        return fromTitle(value)

      default:
        return null
    }
  } catch (err) {
    handleError(err, 'helpers/convertNotionNodeToPrismaValue()')
  }
}

function fromCheckbox(value: NotionPropertyAsCheckbox): boolean {
  return value.checkbox
}

function fromCreatedTime(value: NotionPropertyAsCreatedTime): Date {
  return daysjs(value.created_time).utc().toDate()
}

function fromDate(value: NotionPropertyAsDate): Date | null {
  if (value.date === null || value.date.start === null) {
    return null
  }

  return daysjs(value.date.start).utc().toDate()
}

function fromLastEditedTime(value: NotionPropertyAsLastEditedTime): Date {
  return daysjs(value.last_edited_time).utc().toDate()
}

function fromRichText(value: NotionPropertyAsRichText): string | null {
  const markdownSource = value.rich_text
    .map(richTextChild => richTextChild.plain_text)
    .join('')
    .trim()

  if (markdownSource.length === 0) {
    return null
  }

  return markdownSource
}

function fromSelect(value: NotionPropertyAsSelect): string | null {
  if (value.select === null) {
    return null
  }

  const markdownSource = value.select.name.trim()

  return markdownSource
}

function fromTitle(value: NotionPropertyAsTitle): string {
  const markdownSource = value.title
    .map(titleChild => titleChild.plain_text)
    .join('')
    .trim()

  return markdownSource
}

export default convertNotionNodeToPrismaValue
