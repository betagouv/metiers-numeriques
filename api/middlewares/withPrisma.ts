import { PrismaClient } from '@prisma/client'
import { NextApiResponse } from 'next'

import handleError from '../helpers/handleError'
import { HandlerWithPrisma, RequestWithPrisma } from '../types'

function withPrismaSingleton() {
  let prismaInstance: PrismaClient | undefined

  return function withPrisma(handler: HandlerWithPrisma) {
    const handlerWithPrisma = async (req: RequestWithPrisma, res: NextApiResponse) => {
      try {
        if (prismaInstance === undefined) {
          prismaInstance = new PrismaClient()
        }

        const reqWithPrisma: RequestWithPrisma = Object.assign(req, {
          db: prismaInstance,
        })

        await handler(reqWithPrisma, res)
      } catch (err) {
        handleError(err, 'api/middlewares/withPrisma()', res)
      } finally {
        if (prismaInstance !== undefined) {
          await prismaInstance.$disconnect()
        }
      }
    }

    return handlerWithPrisma
  }
}

export default withPrismaSingleton()
