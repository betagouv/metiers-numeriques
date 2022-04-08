import { User, UserRole } from '@prisma/client'
import { AuthenticationError, ForbiddenError } from 'apollo-server-micro'
import { createRateLimitRule, RedisStore } from 'graphql-rate-limit'
import { rule } from 'graphql-shield'

import getRedis from '../helpers/getRedis'

import type { GraphQLObjectType, GraphQLResolveInfo } from 'graphql'
import type { GraphQLRateLimitConfig } from 'graphql-rate-limit'
import type { Rule } from 'graphql-shield/dist/rules'
import type { IRuleFunction, IRuleResult } from 'graphql-shield/dist/types'

class Permission {
  private rateLimitRule: any

  constructor() {
    const rateLimitDirectiveOptions: GraphQLRateLimitConfig = {
      formatError: ({ fieldName }) => `Rate limit reached. Too many ${fieldName} calls.`,
      identifyContext: ctx => ctx?.request?.ipAddress || ctx?.id,
      store: new RedisStore(getRedis()),
    }
    this.rateLimitRule = createRateLimitRule(rateLimitDirectiveOptions)
  }

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
    return this.rateLimitRule({
      max: 3,
      window: '1s',
    })
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
