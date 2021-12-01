module.exports = {
  coverageProvider: 'v8',
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.test.json',
    },
  },
  preset: 'ts-jest',
  rootDir: '..',
  testMatch: ['**/*.test.[tj]s?(x)', '!**/*.integration.test.[tj]s?(x)', '!**/*.e2e.test.[tj]s?(x)'],
}
