import { prisma } from '@api/libs/prisma'
import { renderMarkdown } from '@app/helpers/renderMarkdown'
import { stringifyDeepDates } from '@app/helpers/stringifyDeepDates'
import { theme } from '@app/theme'
import { File, Testimony } from '@prisma/client'
import Head from 'next/head'
import * as R from 'ramda'
import styled from 'styled-components'

import type { Institution } from '@prisma/client'

const HeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  background-color: ${theme.color.primary.darkBlue};
  position: absolute;
  top: 11rem;
  left: 0;
  width: 100%;
`

const Header = styled.div`
  color: white;
  padding: 3rem 1.5rem;
  width: 78rem;
`

const ContentContainer = styled.div`
  margin-top: 13rem;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
`

const Title = styled.h1`
  color: white;
  font-size: 4rem;
  line-height: 3.7rem;
  margin-left: -5px;
  margin-bottom: 0;
`

const PageTitle = styled.div`
  color: white;
  font-size: 1.5rem;
  line-height: 2rem;
  margin-bottom: 0.5rem;
`

const InstitutionLogo = styled.img`
  width: 100px;
  height: 90px;
  object-fit: cover;
  margin-right: 2rem;
`

const TestimonyTitle = styled.h2`
  margin-top: 8rem;
  font-size: 2.5rem;
  line-height: 3rem;
  color: ${theme.color.primary.darkBlue};
  font-weight: 500;
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

type TestimonyWithRelation = Testimony & { avatarFile: File }
type InstitutionWithRelation = Institution & { logoFile?: File; testimonies: TestimonyWithRelation[] }

type InstitutionPageProps = {
  institution: InstitutionWithRelation
}

export default function InstitutionPage({ institution }: InstitutionPageProps) {
  return (
    <div>
      <Head>
        <title>{institution.pageTitle}</title>
      </Head>
      <HeaderContainer>
        <Header className="fr-py-4w">
          <Row>
            {institution.logoFile && (
              <InstitutionLogo alt={`${institution.name} logo`} src={institution.logoFile.url} />
            )}
            <div>
              <Title>{institution.name}</Title>
              <PageTitle>{institution.pageTitle}</PageTitle>
              {institution.url && (
                <a href={institution.url} rel="noreferrer" target="_blank">
                  {institution.url}
                </a>
              )}
            </div>
          </Row>
        </Header>
      </HeaderContainer>

      <ContentContainer>
        {institution.description && (
          <section className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-md-9">{renderMarkdown(institution.description)}</div>
          </section>
        )}

        <TestimonyTitle>Ils travaillent {institution.pageTitle}</TestimonyTitle>
        <div className="fr-grid-row fr-grid-row--gutters">
          {R.take(2)(institution.testimonies).map(testimony => (
            <div className="fr-col-12 fr-col-md-6">
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
      </ContentContainer>
    </div>
  )
}

export async function getStaticPaths() {
  const institutions = await prisma.institution.findMany()
  const slugs = R.pipe(R.map(R.prop('slug')), R.uniq)(institutions)

  const paths = slugs.map(slug => ({
    params: { slug },
  }))

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

  const institutionWithHumanDates = stringifyDeepDates(institution)

  return {
    props: { institution: institutionWithHumanDates },
    revalidate: 300,
  }
}
