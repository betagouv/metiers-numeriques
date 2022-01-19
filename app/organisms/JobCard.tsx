import generateKeyFromValue from '@app/helpers/generateKeyFromValue'
import normalizeJobDescription from '@app/helpers/normalizeJobDescription'
import Link from 'next/link'

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

type JobCardProps = {
  job: LegacyJobWithRelation
}
export default function JobCard({ job }: JobCardProps) {
  const description = normalizeJobDescription(job)

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
                  {job.updatedAt}
                </p>
              )}
            </div>

            <div className="fr-col-12 fr-col-md-9">
              <h4 className="fr-card__lead">
                <a className="fr-card__link" href={`/emploi/${job.slug}`}>
                  {job.title}
                </a>
              </h4>

              <p className="fr-card__desc excerpt">{description}</p>

              <ul className="fr-tags-group">
                {job.experiences
                  .filter(experience => experience.trim().length > 0)
                  .map(experience => (
                    <li
                      key={generateKeyFromValue(`${job.id}-${experience}`)}
                      className="fr-tag fr-tag--sm"
                      style={{
                        backgroundColor: 'var(--bf200-bf300)',
                        color: 'var(--bf500-plain)',
                      }}
                    >
                      {experience}
                    </li>
                  ))}

                {job.openedToContractTypes
                  .filter(openedToContractType => openedToContractType.trim().length > 0)
                  .map(openedToContractType => (
                    <li
                      key={generateKeyFromValue(`${job.id}-${openedToContractType}`)}
                      className="fr-tag fr-tag--sm"
                      style={{
                        backgroundColor: 'var(--bf200-bf300)',
                        color: 'var(--bf500-plain)',
                      }}
                    >
                      {openedToContractType}
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div
            className="hidden-md-flex"
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

            <Link href={`/emploi/${job.slug}`}>
              <a className="trk-lire-offre fr-btn fr-btn--sm" href={`/emploi/${job.slug}`}>
                Lire l’offre d’emploi!
                <span aria-hidden="true" className="fr-fi-arrow-right-line fr-pl-1w" />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}