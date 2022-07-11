import { getCountryFromCode } from '@app/helpers/getCountryFromCode'
import { humanizeDate } from '@app/helpers/humanizeDate'
import { matomo, MatomoGoal } from '@app/libs/matomo'
import { theme } from '@app/theme'
import { useCallback } from 'react'
import styled from 'styled-components'

import { Link } from '../atoms/Link'

import type { Address, Contact, Job, Profession, Recruiter, Domain } from '@prisma/client'

export type JobWithRelation = Job & {
  address: Address
  applicationContacts: Contact[]
  domains: Domain[]
  infoContact: Contact
  profession: Profession
  recruiter: Recruiter
}

const Box = styled.div`
  display: flex;
`

const Row = styled(Box)`
  flex-direction: row;
  gap: 1.5rem;
`

const Card = styled.div`
  border-radius: 0.5rem;
  box-shadow: ${theme.shadow.large};
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 1.5rem;
`

const Date = styled.p`
  font-size: 0.8rem;
  font-weight: 300;
`

const Title = styled.h3`
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 2rem;
  margin: 0.5rem 0 0;
`

const Excerpt = styled.p`
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  display: -webkit-box;
  font-size: 110%;
  line-clamp: 3;
  line-height: 1.5;
  margin-bottom: 1rem !important;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Info = styled.p`
  font-size: 90%;
  margin-top: 0.5rem !important;

  > i {
    font-size: 120%;
    font-weight: 500;
    margin-right: 0.5rem;
    vertical-align: -2.5px;
  }
`

type JobCardProps = {
  job: JobWithRelation
}

export function JobCard({ job }: JobCardProps) {
  const location = job.address.country === 'FR' ? job.address.region : getCountryFromCode(job.address.country)

  const trackJobOpening = useCallback(() => {
    matomo.trackGoal(MatomoGoal.JOB_OPENING)
  }, [])

  return (
    <Box className="JobCard">
      <Card>
        <Date>publiée le {humanizeDate(job.updatedAt)}</Date>

        <Title>
          <Link
            href={`/emploi/${job.slug}`}
            noUnderline
            onAuxClick={trackJobOpening}
            onClick={trackJobOpening}
            target="_blank"
          >
            {job.title}
          </Link>
        </Title>

        <ul
          className="fr-tags-group"
          style={{
            marginTop: '0.5rem',
          }}
        >
          <li
            className="fr-tag fr-tag--sm"
            style={{
              backgroundColor: theme.color.neutral.silver,
            }}
          >
            {job.profession.name}
          </li>

          {job?.domains
            ?.sort((a, b) => a.name.localeCompare(b.name))
            ?.map(domain => (
              <li
                key={domain.id}
                className="fr-tag fr-tag--sm"
                style={{
                  backgroundColor: theme.color.primary.lightBlue,
                }}
              >
                {domain.name}
              </li>
            ))}
        </ul>

        <Excerpt>{job.missionDescription}</Excerpt>

        <Row>
          <Info>
            <i className="ri-map-pin-line" style={{ color: theme.color.danger.rubicund }} />
            {location}
          </Info>

          <Info>
            <i className="ri-suitcase-line" style={{ color: theme.color.primary.azure }} />
            {job.recruiter.websiteUrl && (
              <a href={job.recruiter.websiteUrl} rel="noopener noreferrer" target="_blank">
                {job.recruiter.displayName}
              </a>
            )}
            {!job.recruiter.websiteUrl && job.recruiter.displayName}
          </Info>
        </Row>
      </Card>
    </Box>
  )
}
