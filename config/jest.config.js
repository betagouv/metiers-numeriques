const ESM_DEPENDENCIES = ['ky-universal']

module.exports = {
  clearMocks: true,
  collectCoverageFrom: [
    '<rootDir>/{api,app,common}/{helpers,hooks,libs}/**/*.ts',
    '!<rootDir>/api/libs/prisma.ts',
    '!<rootDir>/api/libs/redis.ts',
  ],
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.test.json',
      useESM: true,
    },
  },
  maxWorkers: '50%',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@api/(.*)$': '<rootDir>/api/$1',
    '^@app/(.*)$': '<rootDir>/app/$1',
    '^@common/(.*)$': '<rootDir>/common/$1',
  },
  preset: 'ts-jest/presets/js-with-ts-esm',
  rootDir: '..',
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/config/jest.setup.ts'],
  testMatch: ['**/*.test.ts'],
  transformIgnorePatterns: [`/node_modules/(?!${ESM_DEPENDENCIES.join('|')})`],
}
