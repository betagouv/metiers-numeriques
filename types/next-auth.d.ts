/* eslint-disable typescript-sort-keys/interface,@typescript-eslint/no-unused-vars */
import { UserRole } from '@prisma/client'
import NextAuth from 'next-auth'

type AuthUser = {
  id: string
  email: string
  firstName: string
  lastName: string
  institutionId?: string
  recruiterId?: string
  isActive: boolean
  role: UserRole
}

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: AuthUser
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    user: AuthUser
  }
}
