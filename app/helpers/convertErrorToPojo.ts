import { handleError } from '@common/helpers/handleError'

export function convertErrorToPojo(error: Error): Common.Pojo {
  try {
    const { message } = error

    return {
      ...error,
      message,
    }
  } catch (err) /* istanbul ignore next */ {
    handleError(err, 'app/helpers/convertErrorToPojo()')

    return {}
  }
}
