import { theme } from '@app/theme'
import { File, Institution, Testimony } from '@prisma/client'
import React from 'react'
import styled from 'styled-components'

type TestimonyWithRelation = Testimony & { avatarFile: File }
export type InstitutionWithRelation = Institution & { logoFile?: File; testimonies: TestimonyWithRelation[] }

const HeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  background-color: ${theme.color.primary.darkBlue};

  @media screen and (max-width: 767px) {
    top: 11.7rem;
  }
`

const Header = styled.div`
  color: white;
  padding: 3rem 1.5rem;
  width: 78rem;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
`

const Title = styled.h1`
  color: white;
  font-size: 4rem;
  line-height: 4rem;
  margin-bottom: 0;

  @media screen and (min-width: 768px) {
    margin-left: -5px;
  }

  @media screen and (max-width: 767px) {
    font-size: 2rem;
    line-height: 2.25rem;
  }
`

const PageTitle = styled.div`
  color: white;
  font-size: 1.5rem;
  line-height: 2rem;
  margin: 0.5rem 0;

  @media screen and (max-width: 767px) {
    font-size: 1rem;
    line-height: 1.25rem;
  }
`

const InstitutionLogo = styled.img`
  width: 100px;
  height: 90px;
  object-fit: contain;
  margin-right: 2rem;
`

type InstitutionHeaderProps = {
  institution: InstitutionWithRelation
}

export const InstitutionHeader = ({ institution }: InstitutionHeaderProps) => (
  <HeaderContainer>
    <Header className="fr-container fr-py-4w">
      <Row>
        {institution.logoFile && <InstitutionLogo alt={`${institution.name} logo`} src={institution.logoFile.url} />}
        <div>
          <Title>{institution.name}</Title>
          <PageTitle>{institution.pageTitle}</PageTitle>
          {institution.url && (
            <a href={institution.url} rel="noreferrer" target="_blank">
              {institution.url.replace(/https?:\/\//, '')}
            </a>
          )}
        </div>
      </Row>
    </Header>
  </HeaderContainer>
)
