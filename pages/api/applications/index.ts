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
    const { contractTypes, domainIds, jobId, keyword, professionId, region, seniority } = req.query

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
          seniorityInYears: {
            gte: +(seniority || 0),
          },
          ...(contractTypes
            ? {
                contractTypes: { hasSome: decodeURIComponent(contractTypes as string).split(',') as JobContractType[] },
              }
            : {}),
          ...(domainIds
            ? { domains: { some: { id: { in: decodeURIComponent(domainIds as string).split(',') } } } }
            : {}),
          ...(professionId ? { professions: { some: { id: professionId } } } : {}),
          OR: [
            {
              currentJob: {
                contains: keyword,
                mode: 'insensitive',
              },
            },
            {
              user: {
                firstName: {
                  contains: keyword,
                  mode: 'insensitive',
                },
              },
            },
            {
              user: {
                lastName: {
                  contains: keyword,
                  mode: 'insensitive',
                },
              },
            },
          ],
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
