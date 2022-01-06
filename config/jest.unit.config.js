const basejestConfig = require('./jest.config')

module.exports = {
  ...basejestConfig,
  collectCoverageFrom: ['<rootDir>/{api,app,common}/{helpers,hooks,libs}/**/*.ts', '<rootDir>/auth/**/*.ts'],
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/config/jest.setup.js'],
  testMatch: ['**/*.inte.test.[tj]s?(x)', '**/*.unit.test.[tj]s?(x)'],
  testTimeout: 30000,
}
