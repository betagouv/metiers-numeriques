import { prisma } from '@api/libs/prisma'
import { handleError } from '@common/helpers/handleError'
import { NextApiRequest, NextApiResponse } from 'next'
import * as R from 'ramda'

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

    const candidateFilterProps: Record<string, Common.Pojo> = {}
    if (region) {
      candidateFilterProps.region = region
    }
    if (seniority) {
      candidateFilterProps.seniorityInYears = {
        gte: +(seniority || 0),
      }
    }
    if (contractTypes) {
      const decodedContractTypes = decodeURIComponent(contractTypes as string).split(',')
      candidateFilterProps.contractTypes = {
        hasSome: decodedContractTypes,
      }
    }
    if (domainIds) {
      const decodedDomainIds = decodeURIComponent(domainIds as string).split(',')
      candidateFilterProps.domains = { some: { id: { in: decodedDomainIds } } }
    }
    if (professionId) {
      candidateFilterProps.professions = { some: { id: professionId } }
    }
    if (keyword) {
      candidateFilterProps.OR = [
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
      ]
    }

    const filterProps: Record<string, Common.Pojo> = {
      jobId: jobId || null,
    }
    if (!R.isEmpty(candidateFilterProps)) {
      filterProps.candidate = candidateFilterProps
    }

    const data = await prisma.jobApplication.findMany({
      include: {
        candidate: {
          include: { domains: true, professions: true, user: true },
        },
        cvFile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      where: filterProps,
    })

    res.send(data)
  } catch (err) {
    handleError(err, 'pages/api/job-applications/duplicate.ts > query.getJobApplications()')

    res.status(400).send([])
  }
}

const defaultResponse = (req: NextApiRequest, res: NextApiResponse) => res.status(404)
