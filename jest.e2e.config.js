const basejestConfig = require('./jest.config')

module.exports = {
    ...basejestConfig,
    testMatch: [
        "**/*.e2e.(spec|test).[tj]s?(x)"
    ],
}
