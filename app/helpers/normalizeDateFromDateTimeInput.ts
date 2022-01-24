import handleError from '@common/helpers/handleError'
import daysjs from 'dayjs'

/**
 * Normalize an ISO date string (i.e.: `2022-01-03T08:31:00.000Z`) for a date input (i.e.: `2022-01-03`).
 */
export default function normalizeDateFromDateTimeInput(isoDate: string | null): string | null {
  try {
    if (isoDate === null) {
      return null
    }

    return daysjs(isoDate).format('YYYY-MM-DDTHH:mm')
  } catch (err) {
    handleError(err, 'app/helpers/normalizeDateFromDateTimeInput()')

    return ''
  }
}
