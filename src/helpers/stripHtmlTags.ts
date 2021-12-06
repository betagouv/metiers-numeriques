import { stripHtml } from 'string-strip-html'

import handleError from './handleError'

export default function stripHtmlTags(htmlSource: string): string {
  try {
    if (htmlSource.length < 50) {
      return `Description erronée 😟 ! Aidez-nous en nous le signalant par email à contact@metiers.numerique.gouv.fr.`
    }

    return stripHtml(htmlSource).result
  } catch (err) {
    handleError(err, 'helpers/stripHtmlTags()')
  }
}
