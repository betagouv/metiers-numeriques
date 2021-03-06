import { prisma } from '@api/libs/prisma'
import { stringifyDeepDates } from '@app/helpers/stringifyDeepDates'
import { JobSearchBar } from '@app/organisms/JobSearchBar'
import { TestimonialBar } from '@app/organisms/TestimonialBar'
import { TopInstitutionsBar } from '@app/organisms/TopInstitutionsBar'
import { TopJobsBar } from '@app/organisms/TopJobsBar'
import { JobState } from '@prisma/client'
import Head from 'next/head'

import type { JobWithRelation } from '@app/organisms/JobCard'
import type { Institution } from '@prisma/client'

type HomePageProps = {
  topInstitutions: Institution[]
  topJobs: JobWithRelation[]
}
export default function HomePage({ topInstitutions, topJobs }: HomePageProps) {
  const pageTitle = 'Métiers du Numérique | Découvrez les offres d’emploi du numérique au sein de l’État.'
  const pageDescription =
    'Découvrez l’ensemble des offres d’emploi du numérique au sein de l’État et des administrations territoriales.'

  return (
    <div className="fr-container fr-pb-4w">
      <Head>
        <title>{pageTitle}</title>

        <meta content={pageDescription} name="description" />
        <meta content={pageTitle} property="og:title" />
        <meta content={pageDescription} property="og:description" />
      </Head>

      <JobSearchBar />
      <TopJobsBar jobs={topJobs} />
      <TestimonialBar />
      {!!topInstitutions?.length && <TopInstitutionsBar institutions={topInstitutions} />}
    </div>
  )
}

export async function getStaticProps() {
  const topJobs = await prisma.job.findMany({
    include: {
      address: true,
      applicationContacts: true,
      infoContact: true,
      profession: true,
      recruiter: {
        include: {
          institution: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: 3,
    where: {
      AND: {
        expiredAt: {
          gt: new Date(),
        },
        state: JobState.PUBLISHED,
      },
    },
  })

  const topInstitutions = await prisma.institution.findMany({
    include: {
      logoFile: true,
    },
    orderBy: { updatedAt: 'desc' },
    take: 3,
    where: {
      description: { not: null },
      pageTitle: { not: null },
      testimonyTitle: { not: null },
    },
  })

  const normalizedTopJobs = topJobs.map(stringifyDeepDates)
  const normalizedTopInstitutions = topInstitutions.map(stringifyDeepDates)

  return {
    props: {
      topInstitutions: normalizedTopInstitutions,
      topJobs: normalizedTopJobs,
    },
    revalidate: 300,
  }
}
