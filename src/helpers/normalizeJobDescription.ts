import handleError from './handleError'
import stripHtmlTags from './stripHtmlTags'

export default function normalizeJobDescription(htmlSource: string): string {
  try {
    if (htmlSource.length < 50) {
      return `Description erronée 😟 ! Aidez-nous en nous le signalant par email à contact@metiers.numerique.gouv.fr.`
    }

    return stripHtmlTags(htmlSource)
  } catch (err) {
    handleError(err, 'helpers/stripHtmlTags()')
  }
}
