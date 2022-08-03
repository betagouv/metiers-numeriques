import { withAuth } from 'next-auth/middleware'

// eslint-disable-next-line import/no-default-export
export default withAuth({
  pages: {
    signIn: '/connexion',
  },
})

export const config = {
  matcher: ['/admin'],
}
