import { getPrisma } from '@api/helpers/getPrisma'
import ExternalLink from '@app/atoms/ExternalLink'
import Link from '@app/atoms/Link'
import { SoftParagraph } from '@app/atoms/SoftParagraph'
import { generateJobStructuredData } from '@app/helpers/generateJobStructuredData'
import { getCountryFromCode } from '@app/helpers/getCountryFromCode'
import { humanizeDate } from '@app/helpers/humanizeDate'
import { humanizeSeniority } from '@app/helpers/humanizeSeniority'
import renderMarkdown from '@app/helpers/renderMarkdown'
import { stringifyDeepDates } from '@app/helpers/stringifyDeepDates'
import { matomo, MatomoGoal } from '@app/libs/matomo'
import { JobApplicationModal } from '@app/organisms/JobApplicationModal'
import { JOB_CONTRACT_TYPE_LABEL } from '@common/constants'
import { JobState } from '@prisma/client'
import dayjs from 'dayjs'
import Head from 'next/head'
import * as R from 'ramda'
import { useCallback, useMemo, useState } from 'react'

import type { JobWithRelation } from '@app/organisms/JobCard'
import type { Job } from '@prisma/client'

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

      <div className="fr-container" id="job-detail">
        <div className="fr-pb-4w fr-pt-6w">
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

            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Expérience requise</div>
              <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
                <p>{humanizeSeniority(job.seniorityInMonths)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="fr-my-4w" id="job-detail-main-fields">
          {job.missionDescription && (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h3>Mission</h3>
              </div>
              <div className="fr-col-12 fr-col-md-9">{renderMarkdown(job.missionDescription)}</div>
            </div>
          )}

          {job.teamDescription && (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h3>Équipe</h3>
              </div>
              <div className="fr-col-12 fr-col-md-9">{renderMarkdown(job.teamDescription)}</div>
            </div>
          )}

          {job.contextDescription && (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h3>Contexte</h3>
              </div>
              <div className="fr-col-12 fr-col-md-9">{renderMarkdown(job.contextDescription)}</div>
            </div>
          )}

          {job.perksDescription && (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h3>Avantages</h3>
              </div>
              <div className="fr-col-12 fr-col-md-9">{renderMarkdown(job.perksDescription)}</div>
            </div>
          )}

          {job.tasksDescription && (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h3>Votre rôle</h3>
              </div>
              <div className="fr-col-12 fr-col-md-9">{renderMarkdown(job.tasksDescription)}</div>
            </div>
          )}

          {job.profileDescription && (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h3>Votre profil</h3>
              </div>
              <div className="fr-col-12 fr-col-md-9">{renderMarkdown(job.profileDescription)}</div>
            </div>
          )}

          {job.particularitiesDescription && (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h3>
                  Conditions particulières
                  <br />
                  du poste
                </h3>
              </div>
              <div className="fr-col-12 fr-col-md-9">{renderMarkdown(job.particularitiesDescription)}</div>
            </div>
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
                    padding: '0.75rem 2rem 1rem',
                  }}
                  type="button"
                >
                  POSTULER À CETTE OFFRE
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className="fr-container fr-py-4w fr-text--lg fr-my-0"
        style={{
          backgroundColor: '#F0F0F0',
        }}
      >
        {!isFilledOrExpired && job.infoContact && (
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-md-3">Si vous avez des questions</div>
            <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
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

        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-12 fr-col-md-3">Date Limite</div>
          <div
            className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0"
            style={{
              color: isFilledOrExpired ? 'red' : 'inherit',
              fontWeight: 700,
            }}
          >
            {humanizeDate(job.expiredAt)}
          </div>
        </div>

        {!isFilledOrExpired && job.processDescription && (
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-md-3">Processus de recrutement</div>
            <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">{renderMarkdown(job.processDescription)}</div>
          </div>
        )}

        <div className="fr-grid-row fr-grid-row--gutters" style={{ opacity: 0.65 }}>
          <div className="fr-col-12 fr-col-md-3">
            <p>Référence interne</p>
          </div>
          <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
            <code>{job.id.toUpperCase()}</code>
          </div>
        </div>
      </div>

      {isApplicationModalOpen && <JobApplicationModal job={job} onDone={closeApplicationModal} />}
    </>
  )
}

export async function getStaticPaths() {
  const prisma = getPrisma()

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
  const prisma = getPrisma()

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
