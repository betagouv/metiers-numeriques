import handleError from '@common/helpers/handleError'
import dayjs from 'dayjs'

export function stringifyDeepDates(input: any): Common.Pojo {
  try {
    if (input instanceof Date) {
      return dayjs(input).toISOString()
    }

    if (input === null || ['boolean', 'number', 'string'].includes(typeof input)) {
      return input
    }

    if (Array.isArray(input)) {
      return input.map(stringifyDeepDates)
    }

    const inputAsPojo = {}

    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        inputAsPojo[key] = stringifyDeepDates(input[key])
      }
    }

    return inputAsPojo
  } catch (err) /* istanbul ignore next */ {
    handleError(err, 'app/helpers/stringifyDeepDates()')

    return ''
  }
}
