import { prisma } from '@api/libs/prisma'
import { Button } from '@app/atoms/Button'
import { ExternalLink } from '@app/atoms/ExternalLink'
import { Link } from '@app/atoms/Link'
import { LinkLikeButton } from '@app/atoms/LinkLikeButton'
import { Spacer } from '@app/atoms/Spacer'
import { Title } from '@app/atoms/Title'
import { generateJobStructuredData } from '@app/helpers/generateJobStructuredData'
import { getCountryFromCode } from '@app/helpers/getCountryFromCode'
import { humanizeDate } from '@app/helpers/humanizeDate'
import { renderMarkdownOrHtml } from '@app/helpers/renderMarkdownOrHtml'
import { stringifyDeepDates } from '@app/helpers/stringifyDeepDates'
import { matomo, MatomoGoal } from '@app/libs/matomo'
import { JobApplicationModal } from '@app/organisms/JobApplicationModal'
import { JobMenu } from '@app/organisms/JobMenu'
import { theme } from '@app/theme'
import { JOB_CONTRACT_TYPE_LABEL } from '@common/constants'
import { JobState } from '@prisma/client'
import dayjs from 'dayjs'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import type { JobWithRelation } from '@app/organisms/JobCard'
import type { Job } from '@prisma/client'

export const InfoBar = styled.div`
  display: flex;
  flex-wrap: wrap;

  > div {
    font-size: 90%;
    height: 2rem;
    white-space: nowrap;

    :not(:last-child) {
      margin-right: 2rem;
    }

    > i {
      color: ${theme.color.primary.azure};
      font-size: 120%;
      font-weight: 500;
      margin-right: 0.5rem;
      vertical-align: -2.5px;
    }
  }
`

export const Body = styled.div`
  align-items: flex-start;
  display: flex;
  margin: 4rem 0;
`

export const JobContent = styled.div`
  flex-grow: 1;
`

export const JobButton = styled(Button)`
  font-size: 150%;
  padding: 1rem 2rem 1.25rem;
`

export const isJobFilledOrExpired = (job: Job) =>
  job.state === JobState.FILLED || dayjs(job.expiredAt).isBefore(dayjs(), 'day')

type JobPageProps = {
  data: JobWithRelation
  isFilledOrExpired: boolean
  isPreview: boolean
}
export default function JobPage({ data, isFilledOrExpired, isPreview }: JobPageProps) {
  const router = useRouter()
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)

  const pageTitle = useMemo(() => `${data.title} | Métiers du Numérique`, [])

  const closeApplicationModal = useCallback(() => {
    setIsApplicationModalOpen(false)
  }, [])

  const openApplicationModal = useCallback(() => {
    setIsApplicationModalOpen(true)

    matomo.trackGoal(MatomoGoal.NEW_JOB_APPLICATION)
  }, [])

  const job = data as JobWithRelation

  const handleSendApplication = () => {
    if (job.applicationContacts.length > 0) {
      router.push(`/candidature/${job.id}`)
    } else {
      openApplicationModal()
    }
  }

  const location = job.address
    ? `${job.address.street}, ${job.address.city}, ${job.address.region}, ${getCountryFromCode(job.address.country)}`
    : undefined
  const pageDescription = job.missionDescription
  const structuredData = !isPreview ? generateJobStructuredData(job) : ''

  return (
    <div className="fr-container">
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

      <Title as="h1" isFirst>
        {job.title}
      </Title>

      <InfoBar>
        <div>
          <i className="ri-calendar-line" />
          {humanizeDate(job.expiredAt)}
        </div>
        <div>
          <i className="ri-checkbox-circle-line" />
          {job.contractTypes.map(contractType => JOB_CONTRACT_TYPE_LABEL[contractType]).join(', ')}
        </div>
        <div>
          <i className="ri-suitcase-line" />
          {job.recruiter.websiteUrl ? (
            <a href={job.recruiter.websiteUrl} rel="noopener noreferrer" target="_blank">
              {job.recruiter.displayName}
            </a>
          ) : (
            job.recruiter.displayName
          )}
        </div>
        <div>
          <i className="ri-map-pin-line" />
          {location}
        </div>
      </InfoBar>

      <Body>
        <JobMenu job={job} />

        <JobContent>
          {isFilledOrExpired && (
            <div className="fr-alert fr-alert--warning fr-my-2w">
              <p className="fr-alert__title">Cette offre a déjà été pourvue !</p>
              <p
                style={{
                  paddingTop: '1rem',
                }}
              >
                <Link href="/">Voulez-vous rechercher un autre offre d’emploi ?</Link>
              </p>
            </div>
          )}
          <Title as="h2" id="mission" isFirst>
            Mission
          </Title>
          {renderMarkdownOrHtml(job.missionDescription)}
          {job.teamDescription && (
            <>
              <Title as="h2" id="equipe">
                Équipe
              </Title>
              {renderMarkdownOrHtml(job.teamDescription)}
            </>
          )}
          {job.contextDescription && (
            <>
              <Title as="h2" id="contexte">
                Contexte
              </Title>
              {renderMarkdownOrHtml(job.contextDescription)}
            </>
          )}
          {job.perksDescription && (
            <>
              <Title as="h2" id="avantages">
                Avantages
              </Title>
              {renderMarkdownOrHtml(job.perksDescription)}
            </>
          )}
          {job.tasksDescription && (
            <>
              <Title as="h2" id="role">
                Rôle
              </Title>
              {renderMarkdownOrHtml(job.tasksDescription)}
            </>
          )}
          {job.profileDescription && (
            <>
              <Title as="h2" id="profil-recherche">
                Profil recherché
              </Title>
              {renderMarkdownOrHtml(job.profileDescription)}
            </>
          )}
          {job.particularitiesDescription && (
            <>
              <Title as="h2" id="conditions-particulieres">
                Conditions particulières
              </Title>
              {renderMarkdownOrHtml(job.particularitiesDescription)}
            </>
          )}
          <Title as="h2" id="pour-candidater">
            Pour candidater
          </Title>
          {!isFilledOrExpired && (
            <p>
              Envoyez vos questions à :{' '}
              <ExternalLink href={`mailto:${job.infoContact.email}`} remixIconId="mail-send-line">
                {job.infoContact.email}
              </ExternalLink>
            </p>
          )}
          <p>
            Date limite :{' '}
            <strong
              style={{
                color: isFilledOrExpired ? 'red' : 'inherit',
              }}
            >
              {humanizeDate(job.expiredAt)}
            </strong>
          </p>
          {!isFilledOrExpired && job.processDescription && (
            <>
              <p>Processus de recrutement :</p>
              {renderMarkdownOrHtml(job.processDescription)}
            </>
          )}
          <p>
            Référence interne : <code>{job.id.toUpperCase()}</code>
          </p>
          {!isFilledOrExpired && (
            <>
              <Spacer units={4} />
              <JobButton onClick={handleSendApplication} size="normal">
                Je candidate
              </JobButton>
            </>
          )}

          <Spacer units={1} />
          <LinkLikeButton accent="secondary" href="/candidature" size="medium">
            Tu n&apos;as pas trouvé ton bonheur ? Dépose une candidature spontanée
          </LinkLikeButton>
        </JobContent>
      </Body>

      {isApplicationModalOpen && <JobApplicationModal job={job} onDone={closeApplicationModal} />}
    </div>
  )
}

export async function getStaticPaths() {
  const publishedJobs = await prisma.job.findMany({
    where: {
      state: JobState.PUBLISHED,
    },
  })
  await prisma.$disconnect()

  const nonExpiredJobs = R.reject(isJobFilledOrExpired)(publishedJobs)

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
  await prisma.$disconnect()

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
