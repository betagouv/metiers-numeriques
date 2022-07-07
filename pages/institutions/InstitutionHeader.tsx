import { theme } from '@app/theme'
import React from 'react'
import styled from 'styled-components'

import { InstitutionWithRelation } from './types'

const HeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  background-color: ${theme.color.primary.darkBlue};
  position: absolute;
  top: 11rem;
  left: 0;
  width: 100%;

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
  line-height: 3.7rem;
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
  margin-bottom: 0.5rem;

  @media screen and (max-width: 767px) {
    font-size: 1rem;
    line-height: 1.25rem;
  }
`

const InstitutionLogo = styled.img`
  width: 100px;
  height: 90px;
  object-fit: cover;
  margin-right: 2rem;
`

type InstitutionHeaderProps = {
  institution: InstitutionWithRelation
}

export const InstitutionHeader = ({ institution }: InstitutionHeaderProps) => (
  <HeaderContainer>
    <Header className="fr-py-4w">
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
