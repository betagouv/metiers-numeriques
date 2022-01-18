import handleError from '@common/helpers/handleError'
import sha1 from 'sha1'

export default function generateKeyFromValue(value: any): string {
  try {
    if (value === undefined) {
      return ''
    }

    return sha1(JSON.stringify(value))
  } catch (err) {
    handleError(err, 'app/helpers/generateKeyFromValue()')

    return ''
  }
}
