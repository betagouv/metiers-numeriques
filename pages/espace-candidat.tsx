import { prisma } from '@api/libs/prisma'
import { LinkLikeButton } from '@app/atoms/LinkLikeButton'
import { Message } from '@app/atoms/Message'
import { Spacer } from '@app/atoms/Spacer'
import { Title } from '@app/atoms/Title'
import { stringifyDeepDates } from '@app/helpers/stringifyDeepDates'
import { JobApplicationCard, JobApplicationWithJob } from '@app/organisms/JobApplicationCard'
import { ProfileLayout } from '@app/organisms/Profile/ProfileLayout'
import { JobApplicationStatus, JobState } from '@prisma/client'
import { getSession } from 'next-auth/react'
import React from 'react'
import styled from 'styled-components'

type CandidateHomePageProps = {
  applications: JobApplicationWithJob[]
}

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`

export default function CandidateHomePage({ applications }: CandidateHomePageProps) {
  const adhocApplication = applications.find(application => !application.job)

  const pendingApplications = applications.filter(
    application =>
      application.job &&
      application.status !== JobApplicationStatus.REJECTED &&
      application?.job?.state === JobState.PUBLISHED,
  )
  const pastApplications = applications.filter(
    application => application.job && !pendingApplications.map(app => app.id).includes(application.id),
  )

  return (
    <ProfileLayout>
      <Title as="h1">Ton espace candidat</Title>
      <Spacer units={2} />
      {!applications.length && (
        <div>
          <Message status="info">Vous n&apos;avez pas de candidatures en cours</Message>
          <Spacer units={2} />
          <ActionButtons>
            <LinkLikeButton href="/offres-emploi" size="medium">
              Voir les offres
            </LinkLikeButton>
            <LinkLikeButton accent="secondary" href="/candidature" size="medium">
              Déposer une candidature spontanée
            </LinkLikeButton>
          </ActionButtons>
        </div>
      )}
      {(!!adhocApplication || !!pendingApplications.length) && (
        <>
          <h4>En cours</h4>
          {adhocApplication && <JobApplicationCard application={adhocApplication} />}
          {pendingApplications.map(application => (
            <JobApplicationCard key={application.id} application={application} />
          ))}
          <Spacer units={1} />
        </>
      )}
      {!!pastApplications.length && (
        <>
          <h4>Terminées</h4>
          {pastApplications.map(application => (
            <JobApplicationCard key={application.id} application={application} />
          ))}
        </>
      )}
      <Spacer units={1} />
    </ProfileLayout>
  )
}

export async function getServerSideProps({ req }) {
  const auth = await getSession({ req })

  const applications = await prisma.jobApplication.findMany({
    include: {
      job: true,
    },
    orderBy: { updatedAt: 'desc' },
    where: { candidate: { userId: auth?.user?.id } },
  })

  return { props: { applications: stringifyDeepDates(applications) } }
}
