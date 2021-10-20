const basejestConfig = require('./jest.config')

module.exports = {
    ...basejestConfig,
    testTimeout: 30000,
    testMatch: [
        "**/*.integration.(spec|test).[tj]s?(x)"
    ],
}
