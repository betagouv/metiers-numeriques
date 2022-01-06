module.exports = {
  clearMocks: true,
  coverageProvider: 'v8',
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
    },
  },
  preset: 'ts-jest',
  rootDir: '..',
  testMatch: ['!**/*.e2e.[tj]s?(x)', '!**/*.inte.test.[tj]s?(x)', '**/*.unit.test.[tj]s?(x)'],
}
