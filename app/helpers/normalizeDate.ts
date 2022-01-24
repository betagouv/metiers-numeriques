import handleError from '@common/helpers/handleError'
import daysjs from 'dayjs'

export default function normalizeDate(date: Date): string {
  try {
    if (!(date instanceof Date)) {
      return ''
    }

    return daysjs(date).format('DD/MM/YYYY')
  } catch (err) {
    handleError(err, 'app/helpers/normalizeDate()')

    return ''
  }
}
