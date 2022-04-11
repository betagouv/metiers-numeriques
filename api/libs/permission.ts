import { User, UserRole } from '@prisma/client'
import { AuthenticationError, ForbiddenError } from 'apollo-server-micro'
import { createRateLimitRule, RedisStore } from 'graphql-rate-limit'
import { rule } from 'graphql-shield'

import getRedis from '../helpers/getRedis'

import type { GraphQLObjectType, GraphQLResolveInfo } from 'graphql'
import type { GraphQLRateLimitConfig } from 'graphql-rate-limit'
import type { Rule } from 'graphql-shield/dist/rules'
import type { IRuleFunction, IRuleResult } from 'graphql-shield/dist/types'

const { API_SECRET } = process.env

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
    return this.setRule((_paren, _args, ctx) => {
      if (ctx.user === undefined) {
        return new AuthenticationError('Unauthorized.')
      }

      if (ctx.user.role !== UserRole.ADMINISTRATOR) {
        return new ForbiddenError('Forbidden.')
      }

      return true
    })
  }

  public get isAdministratorOrManager(): Rule {
    return this.setRule((_parent, _args, ctx) => {
      if (ctx.user === undefined) {
        return new AuthenticationError('Unauthorized.')
      }

      if (![UserRole.ADMINISTRATOR, UserRole.RECRUITER].includes(ctx.user.role)) {
        return new ForbiddenError('Forbidden.')
      }

      return true
    })
  }

  public get isMe(): Rule {
    return this.setRule((_parent, args, ctx, info: GraphQLResolveInfo) => {
      if (ctx.user === undefined) {
        return new AuthenticationError('Unauthorized.')
      }

      if ((info.returnType as GraphQLObjectType).name !== 'User' || ctx.user.id !== args.id) {
        return new ForbiddenError('Forbidden.')
      }

      return true
    })
  }

  public get isPublic(): Rule {
    const rule = async (parent, args, ctx, info) => {
      if (ctx.apiSecret === API_SECRET) {
        return true
      }

      const throttle = this.rateLimitRule({
        max: 3,
        window: '1s',
      })

      return throttle.func(parent, ctx, args, info)
    }

    return this.setRule(rule as any)
  }

  private setRule(
    ruleHandler: (
      parent: any,
      args: Record<string, any>,
      ctx: {
        apiSecret: string | undefined
        user: Common.Auth.User | undefined
      },
      info: GraphQLResolveInfo,
    ) => IRuleResult,
  ): Rule {
    const ruler: IRuleFunction = async (
      parent,
      args,
      ctx: {
        apiSecret
        user
      },
      info,
    ) => ruleHandler(parent, args, ctx, info)

    return rule({ cache: 'contextual' })(ruler)
  }
}

export default new Permission()
