// import generateKeyFromValue from '@app/helpers/generateKeyFromValue'
import { getCountryFromCode } from '@app/helpers/getCountryFromCode'
import { humanizeDate } from '@app/helpers/humanizeDate'
import { matomo, MatomoGoal } from '@app/libs/matomo'
import { JOB_CONTRACT_TYPE_LABEL } from '@common/constants'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'

import Link from '../atoms/Link'

import type { Address, Contact, Job, Profession, Recruiter } from '@prisma/client'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      acronym: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }
}

export type JobWithRelation = Job & {
  address: Address
  applicationContacts: Contact[]
  infoContact: Contact
  profession: Profession
  recruiter: Recruiter
}

const Excerpt = styled.p`
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  display: -webkit-box;
  font-size: 1.15rem;
  line-clamp: 3;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
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
    <div className="fr-col-12 fr-py-2w fr-col-md-12 job-card">
      <div className="fr-card fr-card--horizontal fr-card--no-arrow shadow-lg rounded-lg zoomable">
        <div className="fr-card__body">
          <div className="fr-grid-row fr-grid-row--gutters fr-pb-2w">
            <div className="fr-col-12 fr-col-md-3 hidden-md">
              <p
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  fontSize: '1rem',
                }}
              >
                <i className="ri-building-fill fr-mr-2w" />
                {job.recruiter.websiteUrl && (
                  <a href={job.recruiter.websiteUrl} rel="noopener noreferrer" target="_blank">
                    {job.recruiter.fullName && <acronym title={job.recruiter.fullName}>{job.recruiter.name}</acronym>}
                  </a>
                )}
                {!job.recruiter.websiteUrl && job.recruiter.fullName && (
                  <acronym title={job.recruiter.fullName}>{job.recruiter.name}</acronym>
                )}
                {!job.recruiter.websiteUrl && !job.recruiter.fullName && job.recruiter.name}
              </p>

              <p
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  fontSize: '1rem',
                }}
              >
                <i className="ri-map-pin-fill fr-mr-2w" />
                {location}
              </p>

              {job.updatedAt && (
                <p
                  style={{
                    alignItems: 'center',
                    display: 'flex',
                    fontSize: '1rem',
                  }}
                >
                  <i className="ri-calendar-fill fr-mr-2w" />
                  {humanizeDate(job.updatedAt)}
                </p>
              )}
            </div>

            <div className="fr-col-12 fr-col-md-9">
              <h4 className="fr-card__lead">
                <Link
                  className="fr-card__link"
                  href={`/emploi/${job.slug}`}
                  onAuxClick={trackJobOpening}
                  onClick={trackJobOpening}
                >
                  {job.title}
                </Link>
              </h4>

              <Excerpt className="fr-card__desc">{job.missionDescription}</Excerpt>

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
            </div>
          </div>

          <div
            className="rf-hidden-md-flex"
            style={{
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
            }}
          >
            <Link
              className="fr-btn fr-btn--sm fr-fi-arrow-right-line fr-btn--icon-right"
              href={`/emploi/${job.slug}`}
              onAuxClick={trackJobOpening}
              onClick={trackJobOpening}
            >
              Lire l’offre d’emploi
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
