import handleError from '@common/helpers/handleError'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import 'dayjs/locale/fr'

dayjs.extend(relativeTime)
dayjs.locale('fr')

function humanizeDate(isoDate: string): string
function humanizeDate(date: Date): string
function humanizeDate(date: string | Date): string {
  try {
    if ((!(date instanceof Date) && typeof date !== 'string') || !dayjs(date).isValid) {
      return ''
    }

    return dayjs(date).format('DD/MM/YYYY')
  } catch (err) /* istanbul ignore next */ {
    handleError(err, 'app/helpers/humanizeDate()')

    return ''
  }
}

export { humanizeDate }
