export class ApiError extends Error {
  public isExposed: boolean
  public status: number

  constructor(message: string, status: number, isExposed: boolean = false) {
    /* istanbul ignore next */
    {
      super(message)
    }

    this.isExposed = isExposed
    this.status = status
  }
}
