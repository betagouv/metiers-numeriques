import { handleError } from '@common/helpers/handleError'
import sha1 from 'sha1'

export function generateKeyFromValues(...values: any[]): string {
  try {
    if (values.length === 0) {
      return ''
    }

    return sha1(JSON.stringify(values))
  } catch (err) /* istanbul ignore next */ {
    handleError(err, 'app/helpers/generateKeyFromValues()')

    return ''
  }
}
