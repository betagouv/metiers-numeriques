import handleError from '@common/helpers/handleError'
import daysjs from 'dayjs'

function normalizeDate(isoDate: string): string
function normalizeDate(date: Date): string
function normalizeDate(date: string | Date): string {
  try {
    if ((!(date instanceof Date) && typeof date !== 'string') || !daysjs(date).isValid) {
      return ''
    }

    return daysjs(date).format('DD/MM/YYYY')
  } catch (err) {
    handleError(err, 'app/helpers/normalizeDate()')

    return ''
  }
}

export { normalizeDate }
