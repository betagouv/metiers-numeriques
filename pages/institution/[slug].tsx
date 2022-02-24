import getPrisma from '@api/helpers/getPrisma'
import { generateKeyFromValues } from '@app/helpers/generateKeyFromValues'
import renderLegacyInstitutionFile from '@app/helpers/renderLegacyInstitutionFile'
import renderLegacyInstitutionSocialNetwork from '@app/helpers/renderLegacyInstitutionSocialNetwork'
import renderMarkdown from '@app/helpers/renderMarkdown'
import uncapitalizeFirstLetter from '@app/helpers/uncapitalizeFirstLetter'
import { LegacyInstitutionSection } from '@prisma/client'
import dayjs from 'dayjs'
import Head from 'next/head'
import * as R from 'ramda'

import type { LegacyInstitutionWithRelation } from '@app/organisms/InstitutionCard'

const filterAddressFiles = R.filter(R.propEq('section', LegacyInstitutionSection.address))
const filterJoinTeamFiles = R.filter(R.propEq('section', LegacyInstitutionSection.joinTeam))
const filterKeyNumbersFiles = R.filter(R.propEq('section', LegacyInstitutionSection.keyNumbers))
const filterMotivationFiles = R.filter(R.propEq('section', LegacyInstitutionSection.motivation))
const filterOrganizationFiles = R.filter(R.propEq('section', LegacyInstitutionSection.organization))
const filterProjectFiles = R.filter(R.propEq('section', LegacyInstitutionSection.project))
const filterTestimonialFiles = R.filter(R.propEq('section', LegacyInstitutionSection.testimonial))
const filterValueFiles = R.filter(R.propEq('section', LegacyInstitutionSection.value))

type InsitutionPageProps = {
  institution: LegacyInstitutionWithRelation
}
export default function InstitutionPage({ institution }: InsitutionPageProps) {
  // console.log(institution)
  const pageTitle = `${institution.title} | metiers.numerique.gouv.fr`
  const pageDescription = `Tout savoir sur ${uncapitalizeFirstLetter(institution.fullName)}.`
  // console.log(institution)

  const addressFiles = filterAddressFiles(institution.files || [])
  const joinTeamFiles = filterJoinTeamFiles(institution.files || [])
  const keyNumbersFiles = filterKeyNumbersFiles(institution.files || [])
  const motivationFiles = filterMotivationFiles(institution.files || [])
  const organizationFiles = filterOrganizationFiles(institution.files || [])
  const projectFiles = filterProjectFiles(institution.files || [])
  const testimonialFiles = filterTestimonialFiles(institution.files || [])
  const valueFiles = filterValueFiles(institution.files || [])

  const socialNetworkUrls = institution.socialNetworkUrls.length > 0 ? institution.socialNetworkUrls.slice(1) : []

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

                  {motivationFiles.length > 0 && (
                    <div className="FileSection">
                      {motivationFiles
                        .filter(motivationFile => !/\.(jpg|png)$/.test(motivationFile.file.url))
                        .map(renderLegacyInstitutionFile)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="fr-my-4w" id="Institution-main-fields">
            {institution.value && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-col-md-3">
                  <h3>Valeurs</h3>
                </div>
                <div className="fr-col-12 fr-col-md-9 fr-mb-md-2w">
                  {renderMarkdown(institution.value)}

                  {valueFiles.length > 0 && (
                    <div className="FileSection">{valueFiles.map(renderLegacyInstitutionFile)}</div>
                  )}
                </div>
              </div>
            )}

            {institution.challenges && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-col-md-3">
                  <h3>Nos enjeux</h3>
                </div>
                <div className="fr-col-12 fr-col-md-9 fr-mb-md-2w">{renderMarkdown(institution.challenges)}</div>
              </div>
            )}

            {institution.missions && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-col-md-3">
                  <h3>Missions</h3>
                </div>
                <div className="fr-col-12 fr-col-md-9 fr-mb-md-2w">{renderMarkdown(institution.missions)}</div>
              </div>
            )}

            {institution.project && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-col-md-3">
                  <h3>Projets</h3>
                </div>
                <div className="fr-col-12 fr-col-md-9 fr-mb-md-2w">
                  {renderMarkdown(institution.project)}

                  {projectFiles.length > 0 && (
                    <div className="FileSection">{projectFiles.map(renderLegacyInstitutionFile)}</div>
                  )}
                </div>
              </div>
            )}

            {institution.organization && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-col-md-3">
                  <h3>Organisation</h3>
                </div>
                <div className="fr-col-12 fr-col-md-9 fr-mb-md-2w">
                  {renderMarkdown(institution.organization)}

                  {organizationFiles.length > 0 && (
                    <div className="FileSection">{organizationFiles.map(renderLegacyInstitutionFile)}</div>
                  )}
                </div>
              </div>
            )}

            {institution.testimonial && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-col-md-3">
                  <h3>Nos agents en parlent</h3>
                </div>
                <div className="fr-col-12 fr-col-md-9 fr-mb-md-2w">
                  <p>Découvrez le témoignage de nos agents:</p>
                  {renderMarkdown(institution.testimonial)}

                  {testimonialFiles.length > 0 && (
                    <div className="FileSection">{testimonialFiles.map(renderLegacyInstitutionFile)}</div>
                  )}
                </div>
              </div>
            )}

            {institution.profile && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-col-md-3">
                  <h3>Ton profil</h3>
                </div>
                <div className="fr-col-12 fr-col-md-9 fr-mb-md-2w">{renderMarkdown(institution.profile)}</div>
              </div>
            )}

            {institution.hiringProcess && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-col-md-3">
                  <h3>Processus de recrutement</h3>
                </div>
                <div className="fr-col-12 fr-col-md-9 fr-mb-md-2w">{renderMarkdown(institution.hiringProcess)}</div>
              </div>
            )}

            {institution.joinTeam && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-col-md-3">
                  <h3>Nous rejoindre</h3>
                </div>
                <div className="fr-col-12 fr-col-md-9 fr-mb-md-2w">
                  {renderMarkdown(institution.joinTeam)}

                  {joinTeamFiles.length > 0 && (
                    <div className="FileSection">{joinTeamFiles.map(renderLegacyInstitutionFile)}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="fr-container fr-py-4w" style={{ backgroundColor: '#F0F0F0' }}>
          {institution.keyNumbers && (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h5>Chiffres clés</h5>
              </div>
              <div className="fr-col-12 fr-col-md-9 fr-mb-md-2w">
                {renderMarkdown(institution.keyNumbers)}

                {keyNumbersFiles.length > 0 && (
                  <div className="FileSection">{keyNumbersFiles.map(renderLegacyInstitutionFile)}</div>
                )}
              </div>
            </div>
          )}

          {institution.schedule && (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h5>Agenda</h5>
              </div>
              <div className="fr-col-12 fr-col-md-9 fr-mb-md-2w">{renderMarkdown(institution.schedule)}</div>
            </div>
          )}

          {(institution.websiteUrls.length > 0 || socialNetworkUrls.length > 0) && (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h5>Sites & réseaux</h5>
              </div>
              <div className="fr-col-12 fr-col-md-9 fr-mb-md-2w">
                {institution.websiteUrls.length > 0 && (
                  <ul>
                    {institution.websiteUrls.map(websiteUrl => (
                      <li key={generateKeyFromValues(websiteUrl)}>
                        <a href={websiteUrl} rel="noopener noreferrer" target="_blank">
                          {websiteUrl}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}

                {socialNetworkUrls.length > 0 && (
                  <p className="SocialNetworkParagraph">
                    {socialNetworkUrls.map(renderLegacyInstitutionSocialNetwork)}
                  </p>
                )}
              </div>
            </div>
          )}

          {(institution.address || addressFiles.length > 0) && (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h5>Adresses</h5>
              </div>
              <div className="fr-col-12 fr-col-md-9 fr-mb-md-2w">
                {institution.address && renderMarkdown(institution.address)}

                {addressFiles.map(addressFile => {
                  if (addressFile.file.url.search('google.com') !== -1) {
                    return (
                      <p key={addressFile.file.id}>
                        <a href={addressFile.file.url} rel="noopener noreferrer" target="_blank">
                          Voir sur Google maps
                        </a>
                      </p>
                    )
                  }

                  return (
                    <p key={addressFile.file.id}>
                      <img
                        alt={addressFile.file.title}
                        src={addressFile.file.url}
                        style={{
                          width: '100%',
                        }}
                      />
                    </p>
                  )
                })}
              </div>
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
  const prisma = getPrisma()
  const institution = await prisma.legacyInstitution.findUnique({
    include: {
      files: {
        include: {
          file: true,
        },
      },
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
        files: institution.files.map(file => ({
          ...file,
          assignedAt: dayjs(file.assignedAt).toISOString(),
          file: {
            ...file.file,
            createdAt: dayjs(file.file.createdAt).toISOString(),
            updatedAt: dayjs(file.file.updatedAt).toISOString(),
          },
        })),
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
