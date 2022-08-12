import { prisma } from '@api/libs/prisma'
import { Title } from '@app/atoms/Title'
import { humanizeDate } from '@app/helpers/humanizeDate'
import { renderMarkdownOrHtml } from '@app/helpers/renderMarkdownOrHtml'
import { stringifyDeepDates } from '@app/helpers/stringifyDeepDates'
import { JobMenu } from '@app/organisms/JobMenu'
import Head from 'next/head'

import { Body, InfoBar, JobContent } from '../[slug]'

import type { ArchivedJob } from '@prisma/client'

type ArchivedJobPageProps = {
  data: ArchivedJob
}

export default function JobPage({ data: archivedJob }: ArchivedJobPageProps) {
  const pageDescription = archivedJob.missionDescription
  const pageTitle = `${archivedJob.title} | Métiers du Numérique`

  return (
    <div className="fr-container">
      <Head>
        <title>{pageTitle}</title>

        <meta content={pageDescription} name="description" />
        <meta content={pageTitle} property="og:title" />
        <meta content={pageDescription} property="og:description" />
      </Head>

      <Title as="h1" isFirst>
        {archivedJob.title}
      </Title>

      <InfoBar>
        <div>
          <i className="ri-calendar-line" />
          {humanizeDate(archivedJob.expiredAt)}
        </div>
        <div>
          <i className="ri-suitcase-line" />
          {archivedJob.recruiterName}
        </div>
        <div>
          <i className="ri-map-pin-line" />
          {archivedJob.region}
        </div>
      </InfoBar>

      <Body>
        <JobMenu job={archivedJob as any} />

        <JobContent className="fr-container--fluid">
          <Title as="h2" id="mission" isFirst>
            Mission
          </Title>
          {renderMarkdownOrHtml(archivedJob.missionDescription)}

          {archivedJob.profileDescription && (
            <>
              <Title as="h2" id="profil-recherche">
                Profil recherché
              </Title>
              {renderMarkdownOrHtml(archivedJob.profileDescription)}
            </>
          )}

          <Title as="h2" id="pour-candidater">
            Pour candidater
          </Title>
          <p>
            Date limite :{' '}
            <strong
              style={{
                color: 'red',
              }}
            >
              {humanizeDate(archivedJob.expiredAt)}
            </strong>
          </p>
          <p>
            Référence interne : <code>{archivedJob.id.toUpperCase()}</code>
          </p>
        </JobContent>
      </Body>
    </div>
  )
}

export async function getServerSideProps({ params: { slug } }) {
  const archivedJob = await prisma.archivedJob.findUnique({
    include: {
      profession: true,
    },
    where: {
      slug,
    },
  })

  if (archivedJob === null) {
    return {
      notFound: true,
    }
  }

  const archivedJobWithHumanDates = stringifyDeepDates(archivedJob)

  return {
    props: {
      data: archivedJobWithHumanDates,
    },
  }
}
