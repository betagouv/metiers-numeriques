class AppError extends Error {
  /**
   *
   * @param {string} message
   * @param {boolean} [isHandled]
   */
  constructor(message, isHandled = false) {
    super(message)

    this.isHandled = isHandled
  }
}

module.exports = AppError
