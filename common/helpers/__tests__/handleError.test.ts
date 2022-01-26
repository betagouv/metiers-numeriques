/* eslint-disable max-classes-per-file, no-console */

import handleError from '../handleError'

describe('api/helpers/handleError()', () => {
  test('with a string error', () => {
    const error = 'A string error.'

    handleError(error, `a/path`)
  })

  test('with an instance of Error error', () => {
    const error = new Error(`An Error message.`)

    handleError(error, `a/path`)
  })

  test('with an CustomError error', () => {
    class CustomError extends Error {}

    const error = new CustomError(`A CustomError message.`)
    handleError(error, `a/path`)
  })

  test('with a TooCustomError error', () => {
    class TooCustomError {}

    const error = new TooCustomError()
    handleError(error, `a/path`)
  })

  test('with an undefined error', () => {
    handleError(undefined, `a/path`)
  })

  test('with no path', () => {
    handleError(``)
  })
})
