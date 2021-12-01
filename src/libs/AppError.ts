class AppError extends Error {
  public isHandled: boolean

  constructor(message: string, isHandled = false) {
    super(message)

    this.isHandled = isHandled
  }
}

export default AppError
