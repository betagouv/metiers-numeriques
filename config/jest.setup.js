const ß = require('bhala')

jest.mock('@sentry/nextjs')
jest.mock('@common/helpers/handleError')

// eslint-disable-next-line no-console
console.error = jest.fn()
ß.error = jest.fn()
