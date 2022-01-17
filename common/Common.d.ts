declare namespace Common {
  /**
   * Make this type nullable.
   */
  type Nullable<T> = T | null

  type AnyProps = {
    [key: string]: any
  }

  type BNS = boolean | number | string | null

  /**
   * Plain Old Javascript Object
   */
  type Pojo = Record<string, BNS | BNS[] | Pojo | Pojo[]>

  namespace Api {
    type ResponseBody<T = undefined> = ResponseBodyError | ResponseBodySuccess<T>

    type ResponseBodyError = {
      code: number
      hasError: true
      message: string
    }

    type ResponseBodySuccess<T = undefined> = {
      data: T
      hasError: false
    }
  }

  namespace Auth {
    type User = {
      /** User email */
      email: string
      /** User first name */
      firstName: string
      /** User ID */
      id: string
      /** User last name */
      lastName: string
      /** User role */
      role: User.Role
    }
  }

  namespace Data {
    type File = {
      name: string
      url: string
    }
  }

  namespace User {
    type Role = 'ADMINISTRATOR' | 'ENTITY_MANAGER' | 'SERVICE_MANAGER'
  }
}
