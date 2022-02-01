import handleError from '@common/helpers/handleError'
import dayjs from 'dayjs'

function normalizeDate(isoDate: string): string
function normalizeDate(date: Date): string
function normalizeDate(date: string | Date): string {
  try {
    if ((!(date instanceof Date) && typeof date !== 'string') || !dayjs(date).isValid) {
      return ''
    }

    return dayjs(date).format('DD/MM/YYYY')
  } catch (err) /* istanbul ignore next */ {
    handleError(err, 'app/helpers/normalizeDate()')

    return ''
  }
}

export { normalizeDate }
