import { prisma } from '@api/libs/prisma'
import { Link } from '@app/atoms/Link'
import { LinkLikeButton } from '@app/atoms/LinkLikeButton'
import { Message } from '@app/atoms/Message'
import { Spacer } from '@app/atoms/Spacer'
import { Title } from '@app/atoms/Title'
import { stringifyDeepDates } from '@app/helpers/stringifyDeepDates'
import { ProfileLayout } from '@app/organisms/Profile/ProfileLayout'
import { theme } from '@app/theme'
import { Job, JobApplication, JobApplicationStatus, JobState } from '@prisma/client'
import { getSession } from 'next-auth/react'
import React from 'react'
import styled from 'styled-components'

type JobApplicationWithJob = JobApplication & { job: Job }

type CandidateHomePageProps = {
  applications: JobApplicationWithJob[]
}

type ApplicationCardProps = {
  application: JobApplicationWithJob
}

const CardContainer = styled.div`
  border-radius: 0.5rem;
  box-shadow: 0 0 10px ${theme.color.neutral.lightGrey};
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
`

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`

const InfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 60%;
`

const JobTitle = styled.div`
  flex: 1;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  text-decoration: underline;
`

const Dot = styled.div<{ status: 'success' | 'danger' }>`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background-color: ${p => (p.status === 'success' ? theme.color.success.herbal : theme.color.danger.scarlet)};
  box-shadow: 0 0 5px ${theme.color.neutral.lightGrey};
  margin-right: 1rem;
`

const RejectionReason = styled.div`
  margin-top: 1rem;
  font-size: 0.75rem;
  color: ${theme.color.danger.scarlet};
`

const ApplicationCard = ({ application }: ApplicationCardProps) => {
  const isAdHoc = !application.job
  const status =
    application.status !== JobApplicationStatus.REJECTED && (isAdHoc || application.job.state === JobState.PUBLISHED)
      ? 'success'
      : 'danger'

  return (
    <CardContainer>
      <InfoContainer>
        <TitleContainer>
          <Dot status={status} />
          <JobTitle>
            {isAdHoc ? (
              'Candidature spontanée'
            ) : (
              <Link href={`/emploi/${application.job.slug}`} target="_blank">
                {application.job.title}
              </Link>
            )}
          </JobTitle>
        </TitleContainer>
        <LinkLikeButton accent="secondary" href={`/candidature/${isAdHoc ? '' : application.job.id}`} size="small">
          Editer ma candidature
        </LinkLikeButton>
      </InfoContainer>
      {!isAdHoc && application.job.state === JobState.DRAFT && (
        <RejectionReason>L&apos;offre a été dépubliée</RejectionReason>
      )}
      {!isAdHoc && application.job.state === JobState.FILLED && (
        <RejectionReason>L&apos;offre a été pourvue</RejectionReason>
      )}
      {application.rejectionReason && <RejectionReason>{application.rejectionReason}</RejectionReason>}
    </CardContainer>
  )
}

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
          {adhocApplication && <ApplicationCard application={adhocApplication} />}
          {pendingApplications.map(application => (
            <ApplicationCard key={application.id} application={application} />
          ))}
          <Spacer units={1} />
        </>
      )}
      {!!pastApplications.length && (
        <>
          <h4>Terminées</h4>
          {pastApplications.map(application => (
            <ApplicationCard key={application.id} application={application} />
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
