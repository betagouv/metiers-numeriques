import { ApiError } from '../ApiError'

describe('api/libs/ApiError', () => {
  test(`with no [isExposed]`, () => {
    const message = 'An error message.'
    const status = 123

    const result = new ApiError(message, status)

    expect(result).toMatchObject({
      isExposed: false,
      message,
      status,
    })
  })

  test(`with [isExposed]=true`, () => {
    const message = 'An error message.'
    const status = 123
    const isExposed = true

    const result = new ApiError(message, status, isExposed)

    expect(result).toMatchObject({
      isExposed: true,
      message,
      status,
    })
  })
})
