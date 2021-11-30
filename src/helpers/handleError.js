const ß = require('bhala')

const AppError = require('../libs/AppError')

const getErrorConstructorName = error => {
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
 *
 * @param {*} error
 * @param {string} [path]
 * @param {import('express').Response} [res]
 */
function handleError(error, path, res) {
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

    if (error instanceof Error && error.isAxiosError) {
      console.error(error.response?.data)
    } else {
      console.error(error)
    }
  }

  if (res === undefined) {
    throw new AppError('This error is handled.', true)
  }

  res.render('error')
}

module.exports = handleError
