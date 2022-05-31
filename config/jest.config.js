export default {
  clearMocks: true,
  collectCoverageFrom: [
    '<rootDir>/{api,app,common}/{helpers,hooks,libs}/**/*.{ts,tsx}',
    '!<rootDir>/api/libs/prisma.ts',
    '!<rootDir>/api/libs/redis.ts',
  ],
  maxWorkers: '50%',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@api/(.*)$': '<rootDir>/api/$1',
    '^@app/(.*)$': '<rootDir>/app/$1',
    '^@common/(.*)$': '<rootDir>/common/$1',
  },
  rootDir: '..',
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/config/jest.setup.ts'],
  testMatch: ['**/*.test.{ts,tsx}'],
  transform: {
    '.*\\.(j|t)sx?$': [
      '@swc/jest',
      {
        jsc: {
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },

  transformIgnorePatterns: [],
}
