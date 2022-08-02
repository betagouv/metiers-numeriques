import { prisma } from '@api/libs/prisma'
import { LinkLikeButton } from '@app/atoms/LinkLikeButton'
import { Title } from '@app/atoms/Title'
import { stringifyDeepDates } from '@app/helpers/stringifyDeepDates'
import { InstitutionsList } from '@app/organisms/InstitutionsList'
import { JobSearchBar } from '@app/organisms/JobSearchBar'
import { TestimonialBar } from '@app/organisms/TestimonialBar'
import { TopJobsBar } from '@app/organisms/TopJobsBar'
import { JobState } from '@prisma/client'
import Head from 'next/head'
import styled from 'styled-components'

import type { JobWithRelation } from '@app/organisms/JobCard'
import type { Institution } from '@prisma/client'

const InstitutionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

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
      {!!topInstitutions?.length && (
        <InstitutionsContainer>
          <Title as="h2" isFirst>
            Les employeurs de la semaine
          </Title>
          <InstitutionsList institutions={topInstitutions} />
          <LinkLikeButton accent="secondary" href="/institutions">
            Toutes les institutions
          </LinkLikeButton>
        </InstitutionsContainer>
      )}
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
