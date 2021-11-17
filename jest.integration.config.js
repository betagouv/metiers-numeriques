const basejestConfig = require('./jest.config')

module.exports = {
  ...basejestConfig,
  testMatch: ['**/*.integration.(spec|test).[tj]s?(x)'],
  testTimeout: 30000,
}
