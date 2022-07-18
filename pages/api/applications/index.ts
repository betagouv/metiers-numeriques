import { prisma } from '@api/libs/prisma'
import { handleError } from '@common/helpers/handleError'
import { JobContractType } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function ApiJobApplicationsEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getJobApplications(req, res)
    default:
      return defaultResponse(req, res)
  }
}

const getJobApplications = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { contractTypes, domainIds, jobId, professionId, region } = req.query

    const data = await prisma.jobApplication.findMany({
      include: {
        candidate: {
          include: { domains: true, professions: true, user: true },
        },
        cvFile: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
      where: {
        candidate: {
          region,
          ...(contractTypes
            ? {
                contractTypes: { hasSome: decodeURIComponent(contractTypes as string).split(',') as JobContractType[] },
              }
            : {}),
          ...(domainIds
            ? { domains: { some: { id: { in: decodeURIComponent(domainIds as string).split(',') } } } }
            : {}),
          ...(professionId ? { professions: { some: { id: professionId } } } : {}),
        },
        jobId: jobId ? (jobId as string) : null,
      },
    })

    res.send(data)
  } catch (err) {
    handleError(err, 'pages/api/job-applications/duplicate.ts > query.getJobApplications()')

    res.status(400).send([])
  }
}

const defaultResponse = (req: NextApiRequest, res: NextApiResponse) => res.status(404)
