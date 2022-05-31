import { jest } from '@jest/globals'
import { B } from 'bhala'

jest.mock('@sentry/nextjs')
jest.mock('react-hot-toast')
jest.mock('ioredis', () => jest.requireActual('ioredis-mock'))

// eslint-disable-next-line no-console
console.debug = jest.fn()
// eslint-disable-next-line no-console
console.error = jest.fn()
B.error = jest.fn()
