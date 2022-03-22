import { User, UserRole } from '@prisma/client'
import { AuthenticationError, ForbiddenError } from 'apollo-server-micro'
import { rule } from 'graphql-shield'

import type { GraphQLObjectType, GraphQLResolveInfo } from 'graphql'
import type { Rule } from 'graphql-shield/dist/rules'
import type { IRuleFunction, IRuleResult } from 'graphql-shield/dist/types'

class Permission {
  public get isAdministrator(): Rule {
    return this.setRule(user => {
      if (user === undefined) {
        return new AuthenticationError('Unauthorized.')
      }

      if (user.role !== UserRole.ADMINISTRATOR) {
        return new ForbiddenError('Forbidden.')
      }

      return true
    })
  }

  public get isAdministratorOrManager(): Rule {
    return this.setRule(user => {
      if (user === undefined) {
        return new AuthenticationError('Unauthorized.')
      }

      if (![UserRole.ADMINISTRATOR, UserRole.RECRUITER].includes(user.role)) {
        return new ForbiddenError('Forbidden.')
      }

      return true
    })
  }

  public get isMe(): Rule {
    return this.setRule((user, args, info: GraphQLResolveInfo) => {
      if (user === undefined) {
        return new AuthenticationError('Unauthorized.')
      }

      if ((info.returnType as GraphQLObjectType).name !== 'User' || user.id !== args.id) {
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
    const ruler: IRuleFunction = async (
      _parent,
      args,
      ctx: {
        user?: Common.Auth.User
      },
      info,
    ) => ruleHandler(ctx.user, args, info)

    return rule({ cache: 'contextual' })(ruler)
  }
}

export default new Permission()
