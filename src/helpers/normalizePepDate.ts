import daysjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import handleError from './handleError'

import 'dayjs/locale/fr'

daysjs.extend(relativeTime)
daysjs.locale('fr')

export default function normalizePepDate(date: string): Date | null {
  try {
    const dateResults = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/.exec(date)
    if (dateResults === null) {
      return null
    }

    const [, day, month, year, hour, minute, second] = dateResults
    const dayJsDate = daysjs()
      .year(Number(year))
      .month(Number(month) - 1)
      .date(Number(day))
      .hour(Number(hour))
      .minute(Number(minute))
      .second(Number(second))
      .millisecond(0)
      .toDate()

    return dayJsDate
  } catch (err) {
    handleError(err, 'helpers/normalizePepDate()')
  }
}
