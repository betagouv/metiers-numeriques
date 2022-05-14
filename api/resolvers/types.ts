export type Context = {
  user: Common.Auth.User
}

export type GetAllArgs<T = Record<string, any>> = {
  orderBy?: [keyof T, 'asc' | 'desc']
  pageIndex: number
  perPage: number
  query?: string
}

export type GetAllResponse<T> = {
  /* Total number of pages */
  count: number
  data: T[]
  /** Page index (starting from 0) */
  index: number
  /* Total number of items */
  length: number
}
