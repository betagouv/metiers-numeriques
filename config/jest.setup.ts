import { jest } from '@jest/globals'
import ß from 'bhala'

jest.mock('@sentry/nextjs')
jest.mock('react-hot-toast')

// eslint-disable-next-line no-console
console.debug = jest.fn()
// eslint-disable-next-line no-console
console.error = jest.fn()
ß.error = jest.fn()
