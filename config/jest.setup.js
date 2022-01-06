// Workaround for https://github.com/jsdom/jsdom/issues/2524
const polyfillTextDecoder = require('./polyfills/polyfillTextDecoder')
const polyfillTextEncoder = require('./polyfills/polyfillTextEncoder')

if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-undef
  polyfillTextDecoder(window)
  // eslint-disable-next-line no-undef
  polyfillTextEncoder(window)
}

jest.mock('redis', () => ({
  createClient: () => ({
    connect: async () => Promise.resolve(),
    disconnect: async () => Promise.resolve(),
    get: async () => Promise.resolve(null),
    on: () => undefined,
    set: async () => Promise.resolve(),
  }),
}))
