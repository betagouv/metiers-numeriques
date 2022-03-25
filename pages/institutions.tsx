import getPrisma from '@api/helpers/getPrisma'
import InstitutionCard from '@app/organisms/InstitutionCard'
import dayjs from 'dayjs'
import Head from 'next/head'

import type { LegacyInstitutionWithRelation } from '@app/organisms/InstitutionCard'

type InstitutionListPageProps = {
  institutions: LegacyInstitutionWithRelation[]
}
export default function InstitutionListPage({ institutions }: InstitutionListPageProps) {
  const pageTitle = 'Liste des entités numériques de l’État | metiers.numerique.gouv.fr'
  const pageDescription = 'Découvrez l’ensemble des entités numériques des ministères et services de l’État.'

  return (
    <>
      <Head>
        <title>{pageTitle}</title>

        <meta content={pageDescription} name="description" />
        <meta content={pageTitle} property="og:title" />
        <meta content={pageDescription} property="og:description" />
      </Head>

      <div className="fr-container fr-py-4w" id="ministeres">
        <div className="fr-grid-row fr-grid-row--center fr-grid-row--middle">
          <div className="fr-col-md-5 fr-col-xs-6">
            <h1>Découvrez toutes les entités numériques de l’État</h1>
          </div>
          <div className="fr-col-md-5 fr-col-xs-6">
            <div>
              <img
                alt="L’État Numérique"
                src="/images/undraw_quiet_town.png"
                style={{
                  maxWidth: '100%',
                }}
              />
            </div>
          </div>
        </div>

        <div id="ministeres--list">
          {institutions.map(institution => (
            <InstitutionCard key={institution.id} institution={institution} />
          ))}
        </div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  const prisma = getPrisma()

  const institutions = await prisma.legacyInstitution.findMany({
    include: {
      logoFile: true,
      thumbnailFile: true,
    },
    orderBy: {
      title: 'asc',
    },
  })

  return {
    props: {
      institutions: institutions.map(institution => ({
        ...institution,
        logoFile: institution.logoFile
          ? {
              ...institution.logoFile,
              createdAt: dayjs(institution.logoFile.createdAt).toISOString(),
              updatedAt: dayjs(institution.logoFile.updatedAt).toISOString(),
            }
          : null,
        thumbnailFile: institution.thumbnailFile
          ? {
              ...institution.logoFile,
              createdAt: dayjs(institution.thumbnailFile.createdAt).toISOString(),
              updatedAt: dayjs(institution.thumbnailFile.updatedAt).toISOString(),
            }
          : null,
      })),
    },
    revalidate: 300,
  }
}
