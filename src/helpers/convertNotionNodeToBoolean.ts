/* eslint-disable @typescript-eslint/no-use-before-define */

import { NotionPropertyAsCheckbox } from '../types/Notion'
import handleError from './handleError'

export default function convertNotionNodeToBoolean(value: NotionPropertyAsCheckbox): boolean {
  try {
    switch (value.type) {
      case 'checkbox':
        return fromCheckbox(value)

      default:
        return false
    }
  } catch (err) {
    handleError(err, 'helpers/convertNotionNodeToHtml()')
  }
}

function fromCheckbox(value: NotionPropertyAsCheckbox): boolean {
  return value.checkbox
}
