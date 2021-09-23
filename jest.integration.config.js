const basejestConfig = require('./jest.config')

module.exports = {
    ...basejestConfig,
    testMatch: [
        // "**/__tests__/**/*.[jt]s?(x)",
        "**/*.integration.(spec|test).[tj]s?(x)"
    ],
}
