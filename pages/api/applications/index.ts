import { prisma } from '@api/libs/prisma'
import { handleError } from '@common/helpers/handleError'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import * as R from 'ramda'

export default async function ApiJobApplicationsEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getJobApplications(req, res)
    case 'POST':
      return createOrUpdateJobApplication(req, res)
    default:
      return defaultResponse(req, res)
  }
}

const getJobApplications = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req })

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
    if (session?.user?.institutionId) {
      candidateFilterProps.hiddenFromInstitutions = {
        none: { id: session.user.institutionId },
      }
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

const createOrUpdateJobApplication = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = JSON.parse(req.body)
    const applicationBody = {
      applicationLetter: body.application.applicationLetter,
      candidateId: body.candidate.id,
      cvFileId: body.application.cvFileId,
    }

    const createApplicationResponse = await prisma.jobApplication.upsert({
      create: applicationBody,
      update: applicationBody,
      // https://github.com/prisma/prisma/issues/5233
      where: { id: body.application.id || '0' },
    })

    if (body.candidate.githubUrl || body.candidate.portfolioUrl) {
      await prisma.candidate.update({
        data: {
          githubUrl: body.candidate.githubUrl,
          portfolioUrl: body.candidate.portfolioUrl,
        },
        where: { id: body.candidate.id },
      })
    }

    res.status(200).send(createApplicationResponse)
  } catch (err) {
    handleError(err, 'pages/api/applications/index.ts > query.createJobApplication()')
    res.status(400).end()
  }
}

const defaultResponse = (req: NextApiRequest, res: NextApiResponse) => res.status(404)
