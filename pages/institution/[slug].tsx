import getPrisma from '@api/helpers/getPrisma'
import renderMarkdown from '@app/helpers/renderMarkdown'
import uncapitalizeFirstLetter from '@app/helpers/uncapitalizeFirstLetter'
import dayjs from 'dayjs'
import Head from 'next/head'

import type { LegacyInstitutionWithRelation } from '@app/organisms/InstitutionCard'

type JobPageProps = {
  institution: LegacyInstitutionWithRelation
}
export default function InstitutionPage({ institution }: JobPageProps) {
  const pageTitle = `${institution.title} | metiers.numerique.gouv.fr`
  const pageDescription = `Tout savoir sur ${uncapitalizeFirstLetter(institution.fullName)}.`

  return (
    <>
      <Head>
        <title>{pageTitle}</title>

        <meta content={pageDescription} name="description" />
        <meta content={pageTitle} property="og:title" />
        <meta content={pageDescription} property="og:description" />
      </Head>

      <div id="Institution">
        <div className="fr-container">
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-3 fr-mb-4w fr-mt-6w">
              {institution.logoFile && (
                <img alt={institution.logoFile.title} className="fr-responsive-img" src={institution.logoFile.url} />
              )}
            </div>
            <div className="fr-col-7 fr-mb-4w fr-mt-8w fr-ml-2w">
              <h1>{institution.title}</h1>
              <p>{institution.fullName}</p>
            </div>
          </div>

          {institution.motivation && (
            <div className="fr-callout fr-px-0 fr-my-2w">
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-sm-12 fr-px-8w">
                  <h5>Raison d’être</h5>
                  {institution.motivation && renderMarkdown(institution.motivation)}
                </div>
              </div>
            </div>
          )}

          <div className="fr-my-4w" id="Institution-main-fields">
            {institution.value && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-md-3 fr-col-sm-12">
                  <h3>Valeurs</h3>
                </div>
                <div className="fr-col-md-9 fr-col-sm-12 fr-mb-4w">{renderMarkdown(institution.value)}</div>
              </div>
            )}

            {institution.challenges && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-md-3 fr-col-sm-12">
                  <h3>Nos enjeux</h3>
                </div>
                <div className="fr-col-md-9 fr-col-sm-12 fr-mb-4w">{renderMarkdown(institution.challenges)}</div>
              </div>
            )}

            {institution.missions && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-md-3 fr-col-sm-12">
                  <h3>Missions</h3>
                </div>
                <div className="fr-col-md-9 fr-col-sm-12 fr-mb-4w">{renderMarkdown(institution.missions)}</div>
              </div>
            )}

            {institution.project && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-md-3 fr-col-sm-12">
                  <h3>Projets</h3>
                </div>
                <div className="fr-col-md-9 fr-col-sm-12 fr-mb-4w">{renderMarkdown(institution.project)}</div>
              </div>
            )}

            {institution.organization && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-md-3 fr-col-sm-12">
                  <h3>Organisation</h3>
                </div>
                <div className="fr-col-md-9 fr-col-sm-12 fr-mb-4w">{renderMarkdown(institution.organization)}</div>
              </div>
            )}

            {institution.testimonial && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-md-3 fr-col-sm-12">
                  <h3>Nos agents en parlent</h3>
                </div>
                <div className="fr-col-md-9 fr-col-sm-12 fr-mb-4w">
                  <p>Découvrez le témoignage de nos agents:</p>
                  {renderMarkdown(institution.testimonial)}
                </div>
              </div>
            )}

            {institution.profile && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-md-3 fr-col-sm-12">
                  <h3>Ton profil</h3>
                </div>
                <div className="fr-col-md-9 fr-col-sm-12 fr-mb-4w">{renderMarkdown(institution.profile)}</div>
              </div>
            )}

            {institution.hiringProcess && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-md-3 fr-col-sm-12">
                  <h3>Processus de recrutement</h3>
                </div>
                <div className="fr-col-md-9 fr-col-sm-12 fr-mb-4w">{renderMarkdown(institution.hiringProcess)}</div>
              </div>
            )}

            {institution.joinTeam && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-md-3 fr-col-sm-12">
                  <h3>Nous rejoindre</h3>
                </div>
                <div className="fr-col-md-9 fr-col-sm-12 fr-mb-4w">{renderMarkdown(institution.joinTeam)}</div>
              </div>
            )}
          </div>
        </div>

        <div className="fr-container fr-py-4w" style={{ backgroundColor: '#F0F0F0' }}>
          {institution.keyNumbers && (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-md-3 fr-col-sm-12">
                <h5>Chiffres clés</h5>
              </div>
              <div className="fr-col-md-9 fr-col-sm-12 fr-mb-4w">{renderMarkdown(institution.keyNumbers)}</div>
            </div>
          )}

          {institution.schedule && (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-md-3 fr-col-sm-12">
                <h5>Agenda</h5>
              </div>
              <div className="fr-col-md-9 fr-col-sm-12 fr-mb-4w">{renderMarkdown(institution.schedule)}</div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export async function getStaticPaths() {
  const prisma = getPrisma()
  const legacyInstitutions = await prisma.legacyInstitution.findMany()
  const paths = legacyInstitutions.map(({ slug }) => ({
    params: { slug },
  }))

  return {
    fallback: 'blocking',
    paths,
  }
}

export async function getStaticProps({ params: { slug } }) {
  const primsa = getPrisma()

  const institution = await primsa.legacyInstitution.findUnique({
    include: {
      logoFile: true,
      thumbnailFile: true,
    },
    where: {
      slug,
    },
  })

  if (institution === null) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      institution: {
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
              ...institution.thumbnailFile,
              createdAt: dayjs(institution.thumbnailFile.createdAt).toISOString(),
              updatedAt: dayjs(institution.thumbnailFile.updatedAt).toISOString(),
            }
          : null,
      },
    },
    revalidate: 300,
  }
}
