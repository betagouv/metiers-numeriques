import { prisma } from '@api/libs/prisma'
import { renderHTML } from '@app/helpers/renderHTML'
import { stringifyDeepDates } from '@app/helpers/stringifyDeepDates'
import { TabMenu } from '@app/molecules/TabMenu'
import { InstitutionHeader, InstitutionWithRelation } from '@app/organisms/InstitutionHeader'
import { JobCard, JobWithRelation } from '@app/organisms/JobCard'
import { theme } from '@app/theme'
import { Institution, JobState } from '@prisma/client'
import Head from 'next/head'
import * as R from 'ramda'
import { useState } from 'react'
import styled from 'styled-components'

const SubTitle = styled.h2`
  font-size: 2.5rem;
  line-height: 3rem;
  color: ${theme.color.primary.darkBlue};
  font-weight: 500;
  margin-bottom: 2.5rem;

  @media screen and (max-width: 767px) {
    margin-bottom: 1.5rem;
  }
`

const Card = styled.div`
  background-color: ${theme.color.primary.lightBlue};
  border-radius: 0.5rem;
  box-shadow: ${theme.shadow.large};
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 1.5rem;
  height: 100%;
  justify-content: space-between;
`

const TestimonyAvatar = styled.img`
  width: 128px;
  height: 128px;
  object-fit: cover;
  border-radius: 64px;

  @media screen and (max-width: 767px) {
    width: 90px;
    height: 90px;
    object-fit: cover;
    border-radius: 45px;
  }
`

const TestimonyAuthorContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-top: 1.5rem;
  gap: 1.5rem;
`

const TestimonyAuthor = styled.div`
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 2rem;
  margin-bottom: 0.75rem;

  @media screen and (max-width: 767px) {
    font-size: 1.25rem;
    line-height: 1.5rem;
  }
`

const HTMLBody = styled.div`
  p {
    font-size: 1rem;
  }
`

type InstitutionTabFields = keyof Pick<
  Institution,
  | 'description'
  | 'values'
  | 'challenges'
  | 'mission'
  | 'projects'
  | 'organisation'
  | 'figures'
  | 'wantedSkills'
  | 'recruitmentProcess'
  | 'workingWithUs'
>

type Tab = { key: InstitutionTabFields; label: string }

const TABS: Tab[] = [
  { key: 'description', label: "Notre raison d'être" },
  { key: 'values', label: 'Nos valeurs' },
  { key: 'challenges', label: 'Nos enjeux' },
  { key: 'mission', label: 'Nos missions' },
  { key: 'projects', label: 'Nos projets' },
  { key: 'organisation', label: 'Notre organisation' },
  { key: 'figures', label: 'Nos chiffres clés' },
  { key: 'wantedSkills', label: 'Les profils recherchés' },
  { key: 'recruitmentProcess', label: 'Nos process de recrutement' },
  { key: 'workingWithUs', label: 'Nous rejoindre' },
]

type InstitutionPageProps = {
  institution: InstitutionWithRelation
  jobs: JobWithRelation[]
}

export default function InstitutionPage({ institution, jobs }: InstitutionPageProps) {
  const [currentBodyKey, setCurrentBodyKey] = useState<InstitutionTabFields>('description')

  const content = institution[currentBodyKey]

  const tabs = TABS.filter(tab => !!institution[tab.key]).map(tab => ({
    ...tab,
    onClick: () => setCurrentBodyKey(tab.key),
  }))

  return (
    <>
      <Head>
        <title>{institution.pageTitle} | Métiers du Numérique</title>

        {institution.pageTitle && <meta content={institution.pageTitle} property="og:title" />}
        {institution.description && (
          <>
            <meta content={institution.description} property="og:description" />
            <meta content={institution.description} name="description" />
          </>
        )}
      </Head>
      <InstitutionHeader institution={institution} />

      <div className="fr-container fr-mb-12v fr-mt-16v">
        <TabMenu tabs={tabs} />

        {content && (
          <section className="fr-grid-row fr-grid-row--gutters fr-mt-12v fr-mb-24v">
            <div className="fr-col-12 fr-col-md-9">
              <HTMLBody className="content">{renderHTML(content)}</HTMLBody>
            </div>
          </section>
        )}

        {!!institution.testimonies?.length && (
          <>
            <SubTitle>{institution.testimonyTitle || 'Ils y travaillent'}</SubTitle>
            <div className="fr-grid-row fr-grid-row--gutters fr-pb-24v">
              {institution.testimonies.map(testimony => (
                <div key={testimony.id} className="fr-col-12 fr-col-md-6">
                  <Card>
                    <p>{testimony.testimony}</p>
                    <TestimonyAuthorContainer>
                      <TestimonyAvatar src={testimony.avatarFile.url} />
                      <TestimonyAuthor>
                        {testimony.name}, {testimony.job}
                      </TestimonyAuthor>
                    </TestimonyAuthorContainer>
                  </Card>
                </div>
              ))}
            </div>
          </>
        )}

        {!!jobs?.length && (
          <>
            <SubTitle>Offres en cours</SubTitle>
            <div className="fr-grid-row fr-grid-row--gutters">
              {jobs.map(job => (
                <div key={job.id} className="fr-col-12 fr-col-md-4">
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export async function getStaticPaths() {
  const institutions = await prisma.institution.findMany()
  const slugs = R.pipe(R.map(R.prop('slug')), R.uniq)(institutions)
  const paths = slugs.map(slug => ({ params: { slug } }))

  return {
    fallback: 'blocking',
    paths,
  }
}

export async function getStaticProps({ params: { slug } }) {
  const institution = await prisma.institution.findUnique({
    include: {
      logoFile: true,
      testimonies: {
        include: {
          avatarFile: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        take: 2,
      },
    },
    where: {
      slug,
    },
  })

  if (institution === null || !institution.pageTitle || !institution.description) {
    return {
      notFound: true,
    }
  }

  const jobs = await prisma.job.findMany({
    include: {
      address: true,
      applicationContacts: true,
      infoContact: true,
      profession: true,
      recruiter: {
        include: {
          institution: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: 3,
    where: {
      recruiter: {
        institutionId: institution.id,
      },
      state: JobState.PUBLISHED,
    },
  })

  const institutionWithHumanDates = stringifyDeepDates(institution)
  const jobsWithHumanDates = stringifyDeepDates(jobs)

  return {
    props: { institution: institutionWithHumanDates, jobs: jobsWithHumanDates },
    revalidate: 300,
  }
}
