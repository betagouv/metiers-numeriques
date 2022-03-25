import handleError from '@common/helpers/handleError'
import * as R from 'ramda'

export function isObjectEmpty(obj: Common.Pojo): boolean {
  try {
    return R.pipe(R.values, R.reject(R.isNil), R.reject(R.isEmpty), R.isEmpty)(obj)
  } catch (err) /* istanbul ignore next */ {
    handleError(err, 'app/helpers/isObjectEmpty()')

    return false
  }
}
