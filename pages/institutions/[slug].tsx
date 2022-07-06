import { prisma } from '@api/libs/prisma'
import { stringifyDeepDates } from '@app/helpers/stringifyDeepDates'
import { theme } from '@app/theme'
import { File } from '@prisma/client'
import Head from 'next/head'
import * as R from 'ramda'
import styled from 'styled-components'

import type { Institution } from '@prisma/client'

const Header = styled.div`
  color: white;
  background-color: ${theme.color.primary.darkBlue};
  margin: 0 -1.5rem;
  padding: 3rem 1.5rem;
`

const HeaderContainer = styled.div`
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

type InstitutionPageProps = {
  institution: Institution & { logoFile?: File }
}

export default function InstitutionPage({ institution }: InstitutionPageProps) {
  return (
    <div>
      <Head>
        <title>{institution.pageTitle}</title>
      </Head>
      <Header>
        <HeaderContainer>
          {institution.logoFile && <InstitutionLogo alt={`${institution.name} logo`} src={institution.logoFile.url} />}
          <div>
            <Title>{institution.name}</Title>
            <PageTitle>{institution.pageTitle}</PageTitle>
            {institution.url && (
              <a href={institution.url} rel="noreferrer" target="_blank">
                {institution.url}
              </a>
            )}
          </div>
        </HeaderContainer>
      </Header>
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
