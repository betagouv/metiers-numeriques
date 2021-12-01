import { stripHtml } from 'string-strip-html'

import handleError from './handleError'

export default function stripHtmlTags(htmlSource: string): string {
  try {
    return stripHtml(htmlSource).result
  } catch (err) {
    handleError(err, 'helpers/stripHtmlTags()')
  }
}
