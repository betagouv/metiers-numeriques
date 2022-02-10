import handleError from '@common/helpers/handleError'
import dayjs from 'dayjs'

export function humanizeDeepDates(input: any): Common.Pojo {
  try {
    if (input instanceof Date) {
      return dayjs(input).format('DD/MM/YYYY')
    }

    if (input === null || ['boolean', 'number', 'string'].includes(typeof input)) {
      return input
    }

    if (Array.isArray(input)) {
      return input.map(humanizeDeepDates)
    }

    const inputAsPojo = {}

    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        inputAsPojo[key] = humanizeDeepDates(input[key])
      }
    }

    return inputAsPojo
  } catch (err) /* istanbul ignore next */ {
    handleError(err, 'app/helpers/humanizeDeepDates()')

    return ''
  }
}
