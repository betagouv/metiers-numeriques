import { handleError } from '@common/helpers/handleError'
import dayjs from 'dayjs'

/**
 * Normalize an ISO date string (i.e.: `2022-01-03T08:31:00.000Z`) for a date input (i.e.: `2022-01-03`).
 */
export function normalizeDateForDateInput(isoDate: string | null): string | null {
  try {
    if (typeof isoDate !== 'string' || !dayjs(isoDate).isValid()) {
      return null
    }

    return dayjs(isoDate).format('YYYY-MM-DD')
  } catch (err) /* istanbul ignore next */ {
    handleError(err, 'app/helpers/normalizeDateForDateInput()')

    return null
  }
}
