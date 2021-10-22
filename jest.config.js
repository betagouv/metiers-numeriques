/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  preset: 'ts-jest',
  testMatch: [
    // "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)",
    "!**/*.integration.(spec|test).[tj]s?(x)",
    "!**/*.e2e.(spec|test).[tj]s?(x)"
  ],
    testPathIgnorePatterns: [
      "/node_modules/",
      "dist"
  ],
};
