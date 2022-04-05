import getPrisma from '@api/helpers/getPrisma'
import Link from '@app/atoms/Link'
import { humanizeDate } from '@app/helpers/humanizeDate'
import renderMarkdown from '@app/helpers/renderMarkdown'
import { stringifyDeepDates } from '@app/helpers/stringifyDeepDates'
import Head from 'next/head'
import { useMemo } from 'react'

import type { ArchivedJob } from '@prisma/client'

type ArchivedJobPageProps = {
  data: ArchivedJob
}

export default function JobPage({ data: archivedJob }: ArchivedJobPageProps) {
  const pageTitle = useMemo(() => `${archivedJob.title} | metiers.numerique.gouv.fr`, [])

  const pageDescription = archivedJob.missionDescription

  return (
    <>
      <Head>
        <title>{pageTitle}</title>

        <meta content={pageDescription} name="description" />
        <meta content={pageTitle} property="og:title" />
        <meta content={pageDescription} property="og:description" />
      </Head>

      <div className="fr-container" id="job-detail">
        <div className="fr-mb-4w fr-mt-6w">
          <h1>{archivedJob.title}</h1>
        </div>

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

        <div className="fr-callout fr-px-0 fr-my-2w">
          <div className="fr-callout__text fr-text--lg">
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Recruteur</div>
              <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">{archivedJob.recruiterName}</div>
            </div>

            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Région</div>
              <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">{archivedJob.region}</div>
            </div>
          </div>
        </div>

        <div className="fr-my-4w" id="job-detail-main-fields">
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-md-3">
              <h3>Mission</h3>
            </div>
            <div className="fr-col-12 fr-col-md-9">{renderMarkdown(archivedJob.missionDescription)}</div>
          </div>

          {archivedJob.profileDescription && (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h3>Votre profil</h3>
              </div>
              <div className="fr-col-12 fr-col-md-9">{renderMarkdown(archivedJob.profileDescription)}</div>
            </div>
          )}
        </div>
      </div>

      <div
        className="fr-container fr-py-4w fr-text--lg"
        style={{
          backgroundColor: '#F0F0F0',
        }}
      >
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-12 fr-col-md-3">Date Limite</div>
          <div
            className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0"
            style={{
              color: 'red',
              fontWeight: 700,
            }}
          >
            {humanizeDate(archivedJob.expiredAt)}
          </div>
        </div>

        <div className="fr-grid-row fr-grid-row--gutters" style={{ opacity: 0.65 }}>
          <div className="fr-col-12 fr-col-md-3">
            <p>Référence interne</p>
          </div>
          <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
            <code>{archivedJob.id.toUpperCase()}</code>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ params: { slug } }) {
  const prisma = getPrisma()

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
