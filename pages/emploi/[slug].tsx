import { prisma } from '@api/libs/prisma'
import { ExternalLink } from '@app/atoms/ExternalLink'
import { Link } from '@app/atoms/Link'
import { SoftParagraph } from '@app/atoms/SoftParagraph'
import { generateJobStructuredData } from '@app/helpers/generateJobStructuredData'
import { getCountryFromCode } from '@app/helpers/getCountryFromCode'
import { humanizeDate } from '@app/helpers/humanizeDate'
import { humanizeSeniority } from '@app/helpers/humanizeSeniority'
import { renderMarkdown } from '@app/helpers/renderMarkdown'
import { stringifyDeepDates } from '@app/helpers/stringifyDeepDates'
import { matomo, MatomoGoal } from '@app/libs/matomo'
import { JobApplicationModal } from '@app/organisms/JobApplicationModal'
import { JOB_CONTRACT_TYPE_LABEL } from '@common/constants'
import { JobState } from '@prisma/client'
import dayjs from 'dayjs'
import Head from 'next/head'
import * as R from 'ramda'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import type { JobWithRelation } from '@app/organisms/JobCard'
import type { Job } from '@prisma/client'

export const JobContent = styled.div`
  ul {
    margin: 0;
    padding-left: 0;
  }
  ol > li {
    font-size: 1.25rem;
    line-height: 1.6;
    padding-left: 1rem;
  }
  ul > li {
    font-size: 1.25rem;
    line-height: 1.6;
    list-style-type: none;
    padding-left: 2.5rem;
    position: relative;
  }
  ul > li::before {
    border-color: #00a8a8;
    border-style: solid;
    border-width: 0 2px 2px 0;
    content: '';
    display: block;
    height: 1.15rem;
    left: 0;
    position: absolute;
    top: 0;
    transform-origin: bottom left;
    transform: rotate(40deg);
    width: 0.65rem;
  }
  ul > li * {
    font-size: inherit;
    line-height: inherit;
  }
  ul > li > ul > li::before {
    width: 0.625rem;
  }

  section {
    h2 {
      margin: 1.15rem 0 0 0;
    }

    .fr-col-md-9 {
      padding-top: 0;
    }

    @media screen and (min-width: 768px) {
      h2 {
        margin: 0;
      }

      .fr-col-md-9 {
        padding-top: 1.15rem;
      }
    }
  }
`

export const JobInfo = styled.div`
  background-color: #f0f0f0;
`

export const isJobFilledOrExpired = (job: Job) =>
  job.state === JobState.FILLED || dayjs(job.expiredAt).isBefore(dayjs(), 'day')

type JobPageProps = {
  data: JobWithRelation
  isFilledOrExpired: boolean
  isPreview: boolean
}
export default function JobPage({ data, isFilledOrExpired, isPreview }: JobPageProps) {
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)

  const pageTitle = useMemo(() => `${data.title} | metiers.numerique.gouv.fr`, [])

  const closeApplicationModal = useCallback(() => {
    setIsApplicationModalOpen(false)
  }, [])

  const openApplicationModal = useCallback(() => {
    setIsApplicationModalOpen(true)

    matomo.trackGoal(MatomoGoal.NEW_JOB_APPLICATION)
  }, [])

  const job = data as JobWithRelation
  const location =
    job.address !== null
      ? `${job.address.street}, ${job.address.city}, ${job.address.region}, ${getCountryFromCode(job.address.country)}`
      : undefined
  const pageDescription = job.missionDescription
  const structuredData = !isPreview ? generateJobStructuredData(job) : ''

  return (
    <>
      <Head>
        <title>{pageTitle}</title>

        <meta content={pageDescription} name="description" />
        <meta content={pageTitle} property="og:title" />
        <meta content={pageDescription} property="og:description" />

        {!isFilledOrExpired && !isPreview && (
          //  eslint-disable-next-line react/no-danger
          <script dangerouslySetInnerHTML={{ __html: structuredData }} type="application/ld+json" />
        )}
      </Head>

      <JobContent className="fr-container--fluid">
        <div className="fr-pt-6w">
          <h1>{job.title}</h1>
        </div>

        {isFilledOrExpired && (
          <div className="fr-alert fr-alert--warning fr-my-2w">
            <p className="fr-alert__title">Cette offre a déjà été pourvue !</p>
            <p
              style={{
                paddingTop: '1rem',
              }}
            >
              <Link href="/emplois">Voulez-vous rechercher un autre offre d’emploi ?</Link>
            </p>
          </div>
        )}

        <div className="fr-callout fr-px-0 fr-my-2w">
          <div className="fr-callout__text fr-text--lg">
            {!isFilledOrExpired && job.updatedAt && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Mis à jour le</div>
                <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">{humanizeDate(job.updatedAt)}</div>
              </div>
            )}

            {job.recruiter && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Recruteur</div>
                <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
                  {job.recruiter.websiteUrl && (
                    <a href={job.recruiter.websiteUrl} rel="noopener noreferrer" target="_blank">
                      {job.recruiter.displayName}
                    </a>
                  )}
                  {!job.recruiter.websiteUrl && job.recruiter.displayName}
                </div>
              </div>
            )}

            {location && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Lieu</div>
                <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">{location}</div>
              </div>
            )}

            {Boolean(job.contractTypes.length) && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Types de contrat</div>
                <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
                  {job.contractTypes.map(contractType => JOB_CONTRACT_TYPE_LABEL[contractType]).join(', ')}
                </div>
              </div>
            )}

            {job.salaryMin && job.salaryMax && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Rémunération</div>
                <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
                  <p>{`Entre ${job.salaryMin}K€ et ${job.salaryMax}K€ bruts annuels, selon l’expérience.`}</p>
                </div>
              </div>
            )}

            <section className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Expérience requise</div>
              <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
                <p>{humanizeSeniority(job.seniorityInMonths)}</p>
              </div>
            </section>
          </div>
        </div>

        <div className="fr-my-4w">
          {job.missionDescription && (
            <section className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h2>Mission</h2>
              </div>
              <div className="fr-col-12 fr-col-md-9">{renderMarkdown(job.missionDescription)}</div>
            </section>
          )}

          {job.teamDescription && (
            <section className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h2>Équipe</h2>
              </div>
              <div className="fr-col-12 fr-col-md-9">{renderMarkdown(job.teamDescription)}</div>
            </section>
          )}

          {job.contextDescription && (
            <section className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h2>Contexte</h2>
              </div>
              <div className="fr-col-12 fr-col-md-9">{renderMarkdown(job.contextDescription)}</div>
            </section>
          )}

          {job.perksDescription && (
            <section className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h2>Avantages</h2>
              </div>
              <div className="fr-col-12 fr-col-md-9">{renderMarkdown(job.perksDescription)}</div>
            </section>
          )}

          {job.tasksDescription && (
            <section className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h2>Votre rôle</h2>
              </div>
              <div className="fr-col-12 fr-col-md-9">{renderMarkdown(job.tasksDescription)}</div>
            </section>
          )}

          {job.profileDescription && (
            <section className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h2>Votre profil</h2>
              </div>
              <div className="fr-col-12 fr-col-md-9">{renderMarkdown(job.profileDescription)}</div>
            </section>
          )}

          {job.particularitiesDescription && (
            <section className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h2>
                  Conditions particulières
                  <br />
                  du poste
                </h2>
              </div>
              <div className="fr-col-12 fr-col-md-9">{renderMarkdown(job.particularitiesDescription)}</div>
            </section>
          )}

          {!isFilledOrExpired && (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3" />
              <div className="fr-col-12 fr-pt-4w fr-col-md-9">
                <button
                  className="fr-btn fr-btn--lg"
                  onClick={openApplicationModal}
                  style={{
                    lineHeight: 1,
                    minHeight: 'auto',
                    padding: '0.75rem 2rem 0.9rem',
                  }}
                  type="button"
                >
                  POSTULER À CETTE OFFRE
                </button>
              </div>
            </div>
          )}
        </div>
      </JobContent>

      <JobInfo className="fr-container--fluid fr-mt-4w fr-mb-0 fr-text--lg">
        {!isFilledOrExpired && job.infoContact && (
          <div className="fr-grid-row">
            <div className="fr-col-12 fr-px-2w fr-pt-2w fr-pb-0 fr-col-md-3 fr-pl-md-2w fr-pr-md-0 fr-py-md-1w fr-pt-md-2w">
              Envoyez vos questions à :
            </div>
            <div className="fr-col-12 fr-px-2w fr-pt-0 fr-pb-1w fr-col-md-9 fr-pl-md-0 fr-pr-md-2w fr-py-md-1w fr-pt-md-2w">
              <SoftParagraph>
                <strong>{job.infoContact.name}</strong>
              </SoftParagraph>
              {job.infoContact.position && (
                <SoftParagraph>
                  <em>{job.infoContact.position}</em>
                </SoftParagraph>
              )}
              <ExternalLink href={`mailto:${job.infoContact.email}`} remixIconId="mail-send-line">
                {job.infoContact.email}
              </ExternalLink>
            </div>
          </div>
        )}

        <div className="fr-grid-row">
          <div className="fr-col-12 fr-px-2w fr-pt-3w fr-pb-0 fr-col-md-3 fr-pl-md-2w fr-pr-md-0 fr-py-md-1w">
            Date Limite :
          </div>
          <div
            className="fr-col-12 fr-px-2w fr-pt-0 fr-pb-1w fr-col-md-9 fr-pl-md-0 fr-pr-md-2w fr-py-md-1w"
            style={{
              color: isFilledOrExpired ? 'red' : 'inherit',
              fontWeight: 700,
            }}
          >
            {humanizeDate(job.expiredAt)}
          </div>
        </div>

        {!isFilledOrExpired && job.processDescription && (
          <div className="fr-grid-row">
            <div className="fr-col-12 fr-px-2w fr-pt-3w fr-pb-0 fr-col-md-3 fr-pl-md-2w fr-pr-md-0 fr-py-md-1w">
              Processus de recrutement :
            </div>
            <div className="fr-col-12 fr-px-2w fr-pt-0 fr-pb-1w fr-col-md-9 fr-pl-md-0 fr-pr-md-2w fr-py-md-1w">
              {renderMarkdown(job.processDescription)}
            </div>
          </div>
        )}

        <div className="fr-grid-row" style={{ opacity: 0.65 }}>
          <div className="fr-col-12 fr-px-2w fr-pt-3w fr-pb-0 fr-col-md-3 fr-pl-md-2w fr-pr-md-0 fr-py-md-1w fr-pb-md-2w">
            <p>Référence interne :</p>
          </div>
          <div className="fr-col-12 fr-px-2w fr-pt-0 fr-pb-3w fr-col-md-9 fr-pl-md-0 fr-pr-md-2w fr-py-md-1w fr-pb-md-2w">
            <code>{job.id.toUpperCase()}</code>
          </div>
        </div>
      </JobInfo>

      {isApplicationModalOpen && <JobApplicationModal job={job} onDone={closeApplicationModal} />}
    </>
  )
}

export async function getStaticPaths() {
  const jobs = await prisma.job.findMany({
    where: {
      NOT: {
        state: JobState.DRAFT,
      },
    },
  })

  const nonExpiredJobs = jobs.filter(isJobFilledOrExpired)

  const slugs = R.pipe(R.map(R.prop('slug')), R.uniq)(nonExpiredJobs)

  const paths = slugs.map(slug => ({
    params: { slug },
  }))

  return {
    fallback: 'blocking',
    paths,
  }
}

export async function getStaticProps({ params: { slug } }) {
  const job = await prisma.job.findUnique({
    include: {
      address: true,
      applicationContacts: true,
      infoContact: true,
      profession: true,
      recruiter: true,
    },
    where: {
      slug,
    },
  })

  if (job === null || ![JobState.FILLED, JobState.PUBLISHED].includes(job.state as any)) {
    return {
      notFound: true,
    }
  }

  const isFilledOrExpired = isJobFilledOrExpired(job)
  const jobWithHumanDates = stringifyDeepDates(job)

  return {
    props: {
      data: jobWithHumanDates,
      isFilledOrExpired,
      isPreview: false,
    },
    revalidate: 300,
  }
}
