const basejestConfig = require('./jest.config')

module.exports = {
  ...basejestConfig,
  // preset: 'ts-jest',
  testMatch: ['**/*.e2e.test.[tj]s?(x)'],
}
