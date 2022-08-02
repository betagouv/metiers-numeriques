import { UserRole } from '@prisma/client'
import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/connexion',
  },
})

export const config = {
  matcher: ['/admin'],
}
