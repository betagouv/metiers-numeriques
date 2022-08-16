import { withAuth } from 'next-auth/middleware'

// eslint-disable-next-line import/no-default-export
export default withAuth({
  // @ts-expect-error FIXME: TS complains about next-auth typing.
  callbacks: {
    authorized({ token }) {
      if (token) {
        if (token.user.role === 'CANDIDATE' || !token.user.isActive) {
          return false
        }

        return true
      }
    },
  },
  pages: {
    signIn: '/connexion',
  },
})

export const config = {
  matcher: ['/admin'],
}
