import { Link } from '@app/atoms/Link'
import { LinkLikeButton } from '@app/atoms/LinkLikeButton'
import { theme } from '@app/theme'
import { Job, JobApplication, JobApplicationStatus, JobState } from '@prisma/client'
import React from 'react'
import styled from 'styled-components'

const CardContainer = styled.div`
  border-radius: 0.5rem;
  box-shadow: 0 0 10px ${theme.color.neutral.lightGrey};
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
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

export type JobApplicationWithJob = JobApplication & { job: Job }

type ApplicationCardProps = {
  application: JobApplicationWithJob
}

export const JobApplicationCard = ({ application }: ApplicationCardProps) => {
  const isAdHoc = !application.job
  const status =
    application.status !== JobApplicationStatus.REJECTED && (isAdHoc || application.job.state === JobState.PUBLISHED)
      ? 'success'
      : 'danger'

  const isUnpublished = !isAdHoc && application.job.state === JobState.DRAFT
  const isFilled = !isAdHoc && application.job.state === JobState.FILLED
  const isRejected = application.status === JobApplicationStatus.REJECTED && application.rejectionReasons.length

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
        {status === 'success' && (
          <LinkLikeButton accent="secondary" href={`/candidature/${isAdHoc ? '' : application.job.id}`} size="small">
            Editer ma candidature
          </LinkLikeButton>
        )}
      </InfoContainer>
      {isUnpublished && <RejectionReason>L&apos;offre a été dépubliée</RejectionReason>}
      {isFilled && <RejectionReason>L&apos;offre a été pourvue</RejectionReason>}
      {!isFilled && isRejected && (
        <RejectionReason>Candidature refusée: {application.rejectionReasons.join(', ')}</RejectionReason>
      )}
    </CardContainer>
  )
}
