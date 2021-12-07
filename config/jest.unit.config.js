const basejestConfig = require('./jest.config')

module.exports = {
  ...basejestConfig,
  setupFilesAfterEnv: ['<rootDir>/config/jest.setup.js'],
  testMatch: ['**/*.unit.test.[tj]s?(x)'],
  testTimeout: 30000,
}
