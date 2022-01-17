import { USER_ROLE } from '@common/constants'
import { User } from '@prisma/client'
import { AuthenticationError, ForbiddenError } from 'apollo-server-micro'
import { rule } from 'graphql-shield'

import type { GraphQLResolveInfo } from 'graphql'
import type { Rule } from 'graphql-shield/dist/rules'
import type { IRuleResult } from 'graphql-shield/dist/types'

class Permission {
  public get isAdministrator(): Rule {
    return this.setRule(user => {
      if (user === undefined) {
        return new AuthenticationError('Unauthorized.')
      }

      if (user.role !== USER_ROLE.ADMINISTRATOR) {
        return new ForbiddenError('Forbidden.')
      }

      return true
    })
  }

  public get isMe(): Rule {
    return this.setRule((user, args, info) => {
      if (user === undefined) {
        return new AuthenticationError('Unauthorized.')
      }

      if ((info.returnType as any).name !== 'User' || user.id !== args.id) {
        return new ForbiddenError('Forbidden.')
      }

      return true
    })
  }

  public get isPublic(): Rule {
    return this.setRule(() => true)
  }

  private setRule(
    ruleHandler: (
      user: Common.Auth.User | undefined,
      args: Record<string, any>,
      info: GraphQLResolveInfo,
    ) => IRuleResult,
  ): Rule {
    return rule({ cache: 'contextual' })(
      async (
        parent,
        args,
        ctx: {
          user?: Common.Auth.User
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        info,
      ) => ruleHandler(ctx.user, args, info),
    )
  }
}

export default new Permission()
