module.exports = {
  clearMocks: true,
  collectCoverageFrom: [
    '<rootDir>/{api,app,common}/{helpers,hooks,libs}/**/*.ts',
    '!<rootDir>/api/libs/file.ts',
    '!<rootDir>/api/libs/googleCloud.ts',
  ],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
    },
  },
  maxWorkers: '50%',
  moduleNameMapper: {
    '^@api/(.*)$': '<rootDir>/api/$1',
    '^@app/(.*)$': '<rootDir>/app/$1',
    '^@common/(.*)$': '<rootDir>/common/$1',
  },
  preset: 'ts-jest',
  rootDir: '..',
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/config/jest.setup.js'],
  testMatch: ['**/*.test.ts'],
}
