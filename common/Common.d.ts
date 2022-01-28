declare namespace Common {
  /**
   * Make this type nullable.
   */
  type Nullable<T> = T | null

  type BNS = boolean | number | string | null

  type FunctionLike<R = void | Promise<void>> = () => R

  type FunctionLike<R = void | Promise<void>> = () => R

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

  namespace App {
    type SelectOption<T extends string> = {
      label: string
      value: T
    }
  }

  namespace Auth {
    import type { User as PrismaUser } from '@prisma/client'

    type User = Pick<PrismaUser, 'email' | 'firstName' | 'id' | 'lastName' | 'role'>
  }
}
