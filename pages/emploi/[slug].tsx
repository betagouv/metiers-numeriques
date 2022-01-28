import getPrisma from '@api/helpers/getPrisma'
import Link from '@app/atoms/Link'
import generateJobStructuredData from '@app/helpers/generateJobStructuredData'
import generateKeyFromValue from '@app/helpers/generateKeyFromValue'
import { normalizeDate } from '@app/helpers/normalizeDate'
import renderMarkdown from '@app/helpers/renderMarkdown'
import { JobState } from '@prisma/client'
import dayjs from 'dayjs'
import Head from 'next/head'

import type { LegacyJobWithRelation } from '@app/organisms/JobCard'

type JobPageProps = {
  isExpired: boolean
  job: LegacyJobWithRelation
}
export default function JobPage({ isExpired, job }: JobPageProps) {
  const pageTitle = `${job.title} | metiers.numerique.gouv.fr`
  const pageDescription = job.mission || ''
  const structuredData = generateJobStructuredData(job)

  return (
    <>
      <Head>
        <title>{pageTitle}</title>

        <meta content={pageDescription} name="description" />
        <meta content={pageTitle} property="og:title" />
        <meta content={pageDescription} property="og:description" />

        {!isExpired && <script type="application/ld+json">{structuredData}</script>}
      </Head>

      <div className="fr-container" id="job-detail">
        <div className="fr-mb-4w fr-mt-6w">
          <h1>{job.title}</h1>
        </div>

        {isExpired && (
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
            {!isExpired && job.updatedAt && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Mis à jour le</div>
                <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
                  <p>{job.updatedAt}</p>
                </div>
              </div>
            )}

            {job.legacyService?.legacyEntity && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Entité parente</div>
                <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
                  <p>{job.legacyService.legacyEntity.fullName || job.legacyService.legacyEntity.name}</p>
                </div>
              </div>
            )}
            {!job.legacyService?.legacyEntity && Boolean(job.department.length) && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Entité parente</div>
                <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
                  <p>{job.department.join(', ')}</p>
                </div>
              </div>
            )}

            {job.legacyService && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Entité recruteuse</div>
                <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
                  <p>
                    {job.legacyService.url && (
                      <a href={job.legacyService.url} rel="noopener noreferrer" target="_blank">
                        {job.legacyService.fullName || job.legacyService.name}
                      </a>
                    )}
                    {!job.legacyService.url && (job.legacyService.fullName || job.legacyService.name)}
                  </p>
                </div>
              </div>
            )}
            {!job.legacyService && job.entity && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Entité recruteuse</div>
                <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
                  <p>{job.entity}</p>
                </div>
              </div>
            )}

            {Boolean(job.locations.length) && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Localisation</div>
                <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
                  {job.locations.map(location => (
                    <p key={generateKeyFromValue(location)}>{location}</p>
                  ))}
                </div>
              </div>
            )}

            {Boolean(job.openedToContractTypes.length) && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Localisation</div>
                <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
                  <p>{job.openedToContractTypes.join(', ')}</p>
                </div>
              </div>
            )}

            {job.salary && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Rémunération</div>
                <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
                  <p>{job.salary}</p>
                </div>
              </div>
            )}

            {Boolean(job.experiences.length) && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Expérience</div>
                <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
                  <p>{job.experiences.join(', ')}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="fr-my-4w" id="job-detail-main-fields">
          {job.team && (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h3>Équipe</h3>
              </div>
              <div className="fr-col-12 fr-col-md-9">{renderMarkdown(job.team)}</div>
            </div>
          )}

          {job.mission && (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h3>Mission</h3>
              </div>
              <div className="fr-col-12 fr-col-md-9">{renderMarkdown(job.mission)}</div>
            </div>
          )}

          {job.tasks && (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h3>Votre rôle</h3>
              </div>
              <div className="fr-col-12 fr-col-md-9">{renderMarkdown(job.tasks)}</div>
            </div>
          )}

          {job.advantages && (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h3>
                  Les plus
                  <br />
                  du poste
                </h3>
              </div>
              <div className="fr-col-12 fr-col-md-9">{renderMarkdown(job.advantages)}</div>
            </div>
          )}

          {job.profile && (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h3>Votre profil</h3>
              </div>
              <div className="fr-col-12 fr-col-md-9">{renderMarkdown(job.profile)}</div>
            </div>
          )}

          {job.conditions && (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h3>
                  Conditions particulières
                  <br />
                  du poste
                </h3>
              </div>
              <div className="fr-col-12 fr-col-md-9">{renderMarkdown(job.conditions)}</div>
            </div>
          )}
        </div>
      </div>

      <div
        className="trk-candidature fr-container fr-py-4w"
        style={{
          backgroundColor: '#F0F0F0',
        }}
      >
        {!isExpired && job.teamInfo && (
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-md-3">
              <p>Si vous avez des questions</p>
            </div>
            <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">{renderMarkdown(job.teamInfo)}</div>
          </div>
        )}

        {!isExpired && job.toApply && (
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-md-3">
              <p>Pour candidater</p>
            </div>
            <div
              className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0"
              style={{
                fontWeight: 700,
              }}
            >
              {renderMarkdown(job.toApply)}
            </div>
          </div>
        )}

        {!isExpired && job.more && (
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-md-3">
              <p>Pour en savoir plus</p>
            </div>
            <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">{renderMarkdown(job.more)}</div>
          </div>
        )}

        {job.limitDate && (
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-md-3">
              <p>Date Limite</p>
            </div>
            <div
              className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0"
              style={{
                color: isExpired ? 'red' : 'inherit',
                fontWeight: 700,
              }}
            >
              <p>{job.limitDate}</p>
            </div>
          </div>
        )}

        {!isExpired && job.hiringProcess && (
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-md-3">
              <p>Processus de recrutement</p>
            </div>
            <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">{renderMarkdown(job.hiringProcess)}</div>
          </div>
        )}

        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-12 fr-col-md-3">
            <p>Référence interne</p>
          </div>
          <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
            <p>
              <code>{job.reference}</code>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getStaticPaths() {
  const prisma = getPrisma()
  const legacyJobs = await prisma.legacyJob.findMany({
    where: {
      NOT: {
        state: JobState.DRAFT,
      },
    },
  })

  const paths = legacyJobs.map(({ slug }) => ({
    params: { slug },
  }))

  return {
    fallback: 'blocking',
    paths,
  }
}

export async function getStaticProps({ params: { slug } }) {
  const prisma = getPrisma()
  const job = await prisma.legacyJob.findUnique({
    include: {
      legacyService: {
        include: {
          legacyEntity: true,
        },
      },
    },
    where: {
      slug,
    },
  })

  if (job === null || job.state !== JobState.PUBLISHED) {
    return {
      notFound: true,
    }
  }

  const isExpired = dayjs(job.limitDate).isBefore(dayjs(), 'day')

  return {
    props: {
      isExpired,
      job: {
        ...job,
        createdAt: job.createdAt ? normalizeDate(job.createdAt) : null,
        limitDate: job.limitDate ? normalizeDate(job.limitDate) : null,
        publicationDate: job.publicationDate ? normalizeDate(job.publicationDate) : null,
        updatedAt: job.updatedAt ? normalizeDate(job.updatedAt) : null,
      },
    },
    revalidate: 300,
  }
}
