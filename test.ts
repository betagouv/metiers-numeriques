import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function test() {
  const user = await prisma.user.findFirst({
    where: {
      email: 'ivan.gabriele@gmail.com',
    },
  })

  console.log(user)
}

test()
