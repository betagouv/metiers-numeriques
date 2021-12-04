/* eslint-disable no-console */

import { AxiosError } from 'axios'
import ß from 'bhala'
import { Response } from 'express'

import AppError from '../libs/AppError'

const getErrorConstructorName = (error: any): string => {
  if (error === undefined || error.constructor === undefined) {
    return 'undefined'
  }

  return error.constructor.name
}

/**
 * Handle all kinds of errors. Any error should be caught and handled by this function.
 *
 * @example
 * handleError(err, "controllers/MyClass.myMethod()");
 * handleError(err, "helpers/myFunction()");
 * handleError(err, "scripts/myFileName#oneOfTheScriptFunctions()");
 */
export default function handleError(error: any, path?: string, res?: Response): never {
  const errorPath = path || 'Unknown Path'

  let errorString
  switch (true) {
    case typeof error === 'string':
      errorString = error
      break

    case error instanceof AppError && error.isHandled:
      break

    case error instanceof Error:
    case error instanceof AppError:
      errorString = error.message
      break

    default:
      // eslint-disable-next-line no-case-declarations
      ß.error(`[helpers/handleError()] This type of error can't be processed. This should never happen.`)
      ß.error(`[helpers/handleError()] Error Type: ${typeof error}`)
      ß.error(`[helpers/handleError()] Error Constructor: ${getErrorConstructorName(error)}`)
      errorString = String(error)
  }

  if (!(error instanceof AppError) || !error.isHandled) {
    ß.error(`[${errorPath}] ${errorString}`)

    if (error instanceof Error && (error as AxiosError).isAxiosError) {
      console.error((error as AxiosError).response?.data)
    } else {
      console.error(error)
    }
  }

  if (res === undefined) {
    throw new AppError('This error is handled.', true)
  }

  return res.render('500') as never
}
