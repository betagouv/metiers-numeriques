import getPrisma from '@api/helpers/getPrisma'
import { Nexauth, PrismaAdapter } from 'nexauth'

import type { User } from '@prisma/client'

export default Nexauth<User>({
  adapter: new PrismaAdapter({
    prismaInstance: getPrisma(),
  }),
  config: {
    accessTokenPublicUserProps: ['email', 'firstName', 'id', 'lastName', 'role'],
    firstUserDefaultProps: {
      isActive: true,
      role: 'ADMINISTRATOR',
    },
    logInConditions: [user => user.isActive],
    newUserAllowedProps: ['email', 'firstName', 'lastName', 'password'],
  },
})
