import { getCountryFromCode } from '@app/helpers/getCountryFromCode'
import { humanizeDate } from '@app/helpers/humanizeDate'
import { matomo, MatomoGoal } from '@app/libs/matomo'
import { theme } from '@app/theme'
import { JOB_CONTRACT_TYPE_LABEL } from '@common/constants'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { Link } from '../atoms/Link'

import type { Address, Contact, Job, Profession, Recruiter } from '@prisma/client'

export type JobWithRelation = Job & {
  address: Address
  applicationContacts: Contact[]
  infoContact: Contact
  profession: Profession
  recruiter: Recruiter
}

const Box = styled.div`
  display: flex;
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
  color: #666666;
  font-size: 85%;
`

const Title = styled.h3`
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 150%;
  font-weight: 600;
  line-height: 1.25;
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
  font-weight: 600;
  margin-top: 0.5rem !important;

  > i {
    color: ${theme.color.primary.azure};
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
  const seniorityInYears = useMemo(() => Math.ceil(job.seniorityInMonths / 12), [])

  const trackJobOpening = useCallback(() => {
    matomo.trackGoal(MatomoGoal.JOB_OPENING)
  }, [])

  return (
    <Box className="JobCard">
      <Card>
        <Date>Publiée le {humanizeDate(job.updatedAt)}</Date>

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
            marginTop: '1.15rem',
          }}
        >
          {job.contractTypes.map(contractType => (
            <li
              key={`${job.id}-${contractType}`}
              className="fr-tag fr-tag--sm"
              style={{
                backgroundColor: 'var(--background-flat-info)',
                color: 'white',
              }}
            >
              {JOB_CONTRACT_TYPE_LABEL[contractType]}
            </li>
          ))}

          <li
            key={`${job.id}-${job.seniorityInMonths}`}
            className="fr-tag fr-tag--sm"
            style={{
              backgroundColor: 'var(--background-flat-success)',
              color: 'white',
            }}
          >
            {/* eslint-disable-next-line no-nested-ternary */}
            {seniorityInYears === 0
              ? 'Ouvert aux débutant·es'
              : seniorityInYears === 1
              ? `Min. 1 an d’expérience`
              : `Min. ${seniorityInYears} ans d’expérience`}
          </li>
        </ul>

        <Excerpt>{job.missionDescription}</Excerpt>

        <Info>
          <i className="ri-map-pin-line" />
          {location}
        </Info>

        <Info>
          <i className="ri-suitcase-line" />
          {job.recruiter.websiteUrl && (
            <a href={job.recruiter.websiteUrl} rel="noopener noreferrer" target="_blank">
              {job.recruiter.displayName}
            </a>
          )}
          {!job.recruiter.websiteUrl && job.recruiter.displayName}
        </Info>
      </Card>
    </Box>
  )
}
