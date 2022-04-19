import { JobSource } from '@prisma/client'

import type { PrismaClient } from '@prisma/client'

export async function getRecruiterIdFromName(prisma: PrismaClient, recruiterName: string): Promise<string> {
  const existingRecruiter = await prisma.recruiter.findFirst({
    where: {
      name: recruiterName,
    },
  })

  if (existingRecruiter !== null) {
    return existingRecruiter.id
  }

  const newRecruiter = await prisma.recruiter.create({
    data: {
      name: recruiterName,
      source: JobSource.PEP,
    },
  })

  return newRecruiter.id
}
