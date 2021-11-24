const basejestConfig = require('./jest.config')

module.exports = {
  ...basejestConfig,
  setupFilesAfterEnv: ['./jest.setup.js'],
  testMatch: ['**/*.integration.(spec|test).[tj]s?(x)'],
  testTimeout: 30000,
}
