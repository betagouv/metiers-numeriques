import handleError from '@common/helpers/handleError'

/**
 * Normalize a French human date (i.e.: `22/02/2022`) to an ISO 8601 one (i.e.: `2022-02-22`).
 *
 * @see https://developers.google.com/search/docs/advanced/structured-data/job-posting#job-posting-definition
 * @see https://schema.org/Date
 * @see https://schema.org/DateTime
 */
export function convertHumanDateToIso8601(humanDate: string): string {
  try {
    return `${humanDate.substring(6, 4)}-${humanDate.substring(3, 2)}-${humanDate.substring(0, 2)}`
  } catch (err) /* istanbul ignore next */ {
    handleError(err, 'app/helpers/convertHumanDateToIso8601()')

    return ''
  }
}
