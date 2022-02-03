import handleError from '@common/helpers/handleError'

export function convertErrorToPojo(error: Error): Common.Pojo {
  try {
    const { message } = error

    return {
      ...error,
      message,
    }
  } catch (err) {
    handleError(err, 'app/helpers/convertErrorToPojo()')

    return {}
  }
}
