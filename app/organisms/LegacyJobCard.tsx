import { generateKeyFromValues } from '@app/helpers/generateKeyFromValues'
import { humanizeDate } from '@app/helpers/humanizeDate'
import normalizeJobDescription from '@app/helpers/normalizeJobDescription'
import { matomo, MatomoGoal } from '@app/libs/matomo'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'

import Link from '../atoms/Link'

import type { LegacyEntity, LegacyJob, LegacyService } from '@prisma/client'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      acronym: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }
}

export type LegacyJobWithRelation = LegacyJob & {
  legacyService:
    | (LegacyService & {
        legacyEntity: LegacyEntity | null
      })
    | null
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

type LegacyJobCardProps = {
  job: LegacyJobWithRelation
}

export function LegacyJobCard({ job }: LegacyJobCardProps) {
  const description = useMemo(() => normalizeJobDescription(job), [])

  const trackJobOpening = useCallback(() => {
    matomo.trackGoal(MatomoGoal.JOB_OPENING)
  }, [])

  return (
    <div className="fr-col-12 fr-py-2w fr-col-md-12 job-card">
      <div className="fr-card fr-card--horizontal fr-card--no-arrow shadow-lg rounded-lg zoomable">
        <div className="fr-card__body">
          <div className="fr-grid-row fr-grid-row--gutters fr-pb-2w">
            <div className="fr-col-12 fr-col-md-3 hidden-md">
              {job.legacyService && (
                <p
                  style={{
                    alignItems: 'center',
                    display: 'flex',
                    fontSize: '1rem',
                  }}
                >
                  <i className="ri-building-fill fr-mr-2w" />
                  {job.legacyService.url && (
                    <a href={job.legacyService.url} rel="noopener noreferrer" target="_blank">
                      {job.legacyService.fullName && (
                        <acronym title={job.legacyService.fullName}>{job.legacyService.name}</acronym>
                      )}
                    </a>
                  )}
                  {!job.legacyService.url && job.legacyService.fullName && (
                    <acronym title={job.legacyService.fullName}>{job.legacyService.name}</acronym>
                  )}
                  {!job.legacyService.url && !job.legacyService.fullName && job.legacyService.name}
                </p>
              )}

              {job.legacyService && (
                <p
                  style={{
                    alignItems: 'center',
                    display: 'flex',
                    fontSize: '1rem',
                  }}
                >
                  <i className="ri-map-pin-fill fr-mr-2w" />
                  {job.legacyService.region}
                </p>
              )}

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

              <Excerpt className="fr-card__desc">{description}</Excerpt>

              <ul
                className="fr-tags-group"
                style={{
                  marginTop: '1.15rem',
                }}
              >
                {job.experiences
                  .filter(experience => experience.trim().length > 0)
                  .map(experience => (
                    <li
                      key={generateKeyFromValues(`${job.id}-${experience}`)}
                      className="fr-tag fr-tag--sm"
                      style={{
                        backgroundColor: 'var(--background-flat-info)',
                        color: 'white',
                      }}
                    >
                      {experience}
                    </li>
                  ))}

                {job.openedToContractTypes
                  .filter(openedToContractType => openedToContractType.trim().length > 0)
                  .map(openedToContractType => (
                    <li
                      key={generateKeyFromValues(`${job.id}-${openedToContractType}`)}
                      className="fr-tag fr-tag--sm"
                      style={{
                        backgroundColor: 'var(--background-flat-info)',
                        color: 'white',
                      }}
                    >
                      {openedToContractType}
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div
            className="rf-hidden-md-flex"
            style={{
              alignItems: 'flex-end',
              justifyContent: 'space-between',
            }}
          >
            <code
              style={{
                backgroundColor: 'transparent',
                opacity: 0.5,
              }}
            >
              {job.reference}
            </code>

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
