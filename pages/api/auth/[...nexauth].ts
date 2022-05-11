import { prisma } from '@api/libs/prisma'
import { User } from '@prisma/client'
import { Nexauth, PrismaAdapter } from 'nexauth'

export default Nexauth<User>({
  adapter: new PrismaAdapter({
    prismaInstance: prisma,
  }),
  config: {
    accessTokenPublicUserProps: ['email', 'firstName', 'id', 'institutionId', 'lastName', 'recruiterId', 'role'],
    firstUserDefaultProps: {
      isActive: true,
      role: 'ADMINISTRATOR',
    },
    logInConditions: [user => user.isActive],
    newUserAllowedProps: ['email', 'firstName', 'extra', 'lastName', 'password'],
  },
})
