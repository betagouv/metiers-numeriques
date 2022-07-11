import { prisma } from '@api/libs/prisma'
import { stringifyDeepDates } from '@app/helpers/stringifyDeepDates'
import { JobSearchBar } from '@app/organisms/JobSearchBar'
import { TestimonialBar } from '@app/organisms/TestimonialBar'
import { TopJobsBar } from '@app/organisms/TopJobsBar'
import { JobState } from '@prisma/client'
import Head from 'next/head'

import type { JobWithRelation } from '@app/organisms/JobCard'
import type { Institution } from '@prisma/client'

type HomePageProps = {
  // eslint-disable-next-line react/no-unused-prop-types
  topInstitutions: Institution[]
  topJobs: JobWithRelation[]
}
export default function HomePage({ topJobs }: HomePageProps) {
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
    </div>
  )
}

export async function getStaticProps() {
  const topInstitutions = await prisma.institution.findMany({
    orderBy: {
      name: 'asc',
    },
    select: {
      id: true,
      name: true,
    },
    take: 3,
  })

  const topJobs = await prisma.job.findMany({
    include: {
      address: true,
      applicationContacts: true,
      infoContact: true,
      profession: true,
      recruiter: true,
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

  const normalizedTopJobs = topJobs.map(stringifyDeepDates)

  return {
    props: {
      topInstitutions,
      topJobs: normalizedTopJobs,
    },
    revalidate: 300,
  }
}
