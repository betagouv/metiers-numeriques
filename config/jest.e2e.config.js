const basejestConfig = require('./jest.config')

module.exports = {
  ...basejestConfig,
  preset: undefined,
  testMatch: ['**/*.e2e.test.[tj]s?(x)'],
}
