const basejestConfig = require('./jest.config')

module.exports = {
    ...basejestConfig,
    testTimeout: 10000,
    testMatch: [
        "**/*.e2e.(spec|test).[tj]s?(x)"
    ],
}
