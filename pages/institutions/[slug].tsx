import { prisma } from '@api/libs/prisma'
import { renderMarkdown } from '@app/helpers/renderMarkdown'
import { stringifyDeepDates } from '@app/helpers/stringifyDeepDates'
import { JobCard, JobWithRelation } from '@app/organisms/JobCard'
import { theme } from '@app/theme'
import { Institution } from '@prisma/client'
import Head from 'next/head'
import { InstitutionHeader } from 'pages/institutions/InstitutionHeader'
import { TabMenu } from 'pages/institutions/TabMenu'
import { InstitutionWithRelation } from 'pages/institutions/types'
import * as R from 'ramda'
import { useState } from 'react'
import styled from 'styled-components'

const ContentContainer = styled.div`
  margin-top: 11rem;
  margin-bottom: 4rem;
`

const SubTitle = styled.h2`
  font-size: 2.5rem;
  line-height: 3rem;
  color: ${theme.color.primary.darkBlue};
  font-weight: 500;
  margin-bottom: 2.5rem;
`

const Card = styled.div`
  background-color: ${theme.color.primary.lightBlue};
  border-radius: 0.5rem;
  box-shadow: ${theme.shadow.large};
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 1.5rem;
`

const TestimonyAvatar = styled.img`
  width: 128px;
  height: 128px;
  object-fit: cover;
  border-radius: 64px;
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
`

type InstitutionTabFields = keyof Pick<
  Institution,
  'description' | 'challenges' | 'mission' | 'structure' | 'organisation'
>

type Tab = { key: InstitutionTabFields; label: string }

const TABS: Tab[] = [
  { key: 'description', label: 'Description' },
  { key: 'challenges', label: 'Enjeux' },
  { key: 'mission', label: 'Mission' },
  { key: 'structure', label: 'Structure' },
  { key: 'organisation', label: 'Organisation' },
]

type InstitutionPageProps = {
  institution: InstitutionWithRelation
  jobs: JobWithRelation[]
}

export default function InstitutionPage({ institution, jobs }: InstitutionPageProps) {
  const [currentBodyKey, setCurrentBodyKey] = useState<InstitutionTabFields>('description')

  const bodyMarkdown = institution[currentBodyKey]

  const tabs = TABS.map(tab => ({
    ...tab,
    onClick: () => setCurrentBodyKey(tab.key),
  }))

  return (
    <div>
      <Head>
        <title>{institution.pageTitle}</title>
      </Head>
      <InstitutionHeader institution={institution} />

      <ContentContainer>
        <TabMenu tabs={tabs} />

        {bodyMarkdown && (
          <section className="fr-grid-row fr-grid-row--gutters fr-pb-24v">
            <div className="fr-col-12 fr-col-md-9">{renderMarkdown(bodyMarkdown)}</div>
          </section>
        )}

        <SubTitle>Ils travaillent {institution.pageTitle}</SubTitle>
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

        <SubTitle>Offres en cours</SubTitle>
        <div className="fr-grid-row fr-grid-row--gutters fr-pb-24v">
          {jobs.map(job => (
            <div key={job.id} className="fr-col-12 fr-col-md-4">
              <JobCard job={job} />
            </div>
          ))}
        </div>
      </ContentContainer>
    </div>
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

  if (institution === null) {
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
      recruiter: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: 3,
    where: {
      recruiter: {
        institutionId: institution.id,
      },
    },
  })

  const institutionWithHumanDates = stringifyDeepDates(institution)
  const jobsWithHumanDates = stringifyDeepDates(jobs)

  return {
    props: { institution: institutionWithHumanDates, jobs: jobsWithHumanDates },
    revalidate: 300,
  }
}
