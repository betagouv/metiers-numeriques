/**
 * @jest-environment jsdom
 */

import handleError from '@common/helpers/handleError'

import { convertErrorToPojo } from '../convertErrorToPojo'

describe('app/helpers/convertErrorToPojo()', () => {
  test(`with a native Error`, () => {
    const error = new Error('An error message.')

    const result = convertErrorToPojo(error)

    expect(result).toEqual({
      message: 'An error message.',
    })
  })

  test(`with a custom Error`, () => {
    class CustomError extends Error {
      private code: number

      constructor(message: string, code: number) {
        super(message)

        this.code = code
      }
    }

    const error = new CustomError('An custom error message.', 42)

    const result = convertErrorToPojo(error)

    expect(result).toEqual({
      code: 42,
      message: 'An custom error message.',
    })
  })

  test(`with undefined`, () => {
    const error = undefined

    const result = convertErrorToPojo(error as any)

    expect(result).toEqual({})

    expect(handleError).toHaveBeenCalledTimes(1)
  })
})
