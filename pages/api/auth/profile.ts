import { ApiEndpoint } from '@api/libs/endpoint'
import { prisma } from '@api/libs/prisma'
import { handleError } from '@common/helpers/handleError'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

const updateProfile = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })

  if (!session) {
    res.status(401).end()

    return
  }

  const {
    contractTypes,
    currentJob,
    domainIds,
    firstName,
    githubUrl,
    hiddenFromInstitutions,
    lastName,
    linkedInUrl,
    phone,
    portfolioUrl,
    professionIds,
    region,
    seniorityInYears,
  } = JSON.parse(req.body)

  try {
    const updatedUser = await prisma.user.update({
      data: {
        firstName,
        lastName,
      },
      where: {
        id: session.user.id,
      },
    })

    const candidateUpdateBody = {
      contractTypes,
      currentJob,

      githubUrl,

      linkedInUrl,
      phone,
      portfolioUrl,

      region,
      seniorityInYears: +seniorityInYears,
    }

    const updatedCandidate = await prisma.candidate.upsert({
      create: {
        ...candidateUpdateBody,
        domains: {
          connect: domainIds?.map(domainId => ({
            id: domainId,
          })),
        },
        hiddenFromInstitutions: {
          connect: hiddenFromInstitutions?.map(institutionId => ({
            id: institutionId,
          })),
        },
        professions: {
          connect: professionIds?.map(professionId => ({
            id: professionId,
          })),
        },
        user: {
          connect: { id: updatedUser.id },
        },
      },
      update: {
        ...candidateUpdateBody,
        domains: {
          set: domainIds?.map(domainId => ({
            id: domainId,
          })),
        },
        hiddenFromInstitutions: {
          set: hiddenFromInstitutions?.map(institutionId => ({
            id: institutionId,
          })),
        },
        professions: {
          set: professionIds?.map(professionId => ({
            id: professionId,
          })),
        },
      },
      where: {
        userId: session.user.id,
      },
    })

    res.status(200).send({ ...updatedUser, candidate: updatedCandidate })
  } catch (err) {
    handleError(err, 'pages/api/auth/profile.ts > query.updateProfile()')
    res.status(400).end()
  }
}

export default ApiEndpoint({
  PUT: {
    handler: updateProfile,
    permission: 'ME',
  },
})
