module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['<rootDir>/{api,app,common}/{helpers,hooks,libs}/**/*.ts'],
  coverageProvider: 'v8',
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
    },
  },
  preset: 'ts-jest',
  rootDir: '..',
  setupFiles: ['dotenv/config'],
  testMatch: ['**/*.test.ts'],
}
