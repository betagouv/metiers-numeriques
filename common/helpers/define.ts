import handleError from '@common/helpers/handleError'
import * as R from 'ramda'

export function define<T>(value: T | null | undefined): T | undefined {
  try {
    if (value === null || R.isEmpty(value)) {
      return
    }

    if (typeof value === 'string' && R.isEmpty(value.trim())) {
      return
    }

    return value
  } catch (err) {
    handleError(err, 'app/helpers/undefine()')
  }
}
