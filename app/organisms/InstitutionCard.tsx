import { Link } from '@app/atoms/Link'
import { theme } from '@app/theme'
import React from 'react'
import styled from 'styled-components'

const Title = styled.h3`
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 2rem;
  margin: 0.5rem 0 0;
`

const Excerpt = styled.p`
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  display: -webkit-box;
  font-size: 110%;
  line-clamp: 3;
  line-height: 1.5;
  margin-bottom: 1rem !important;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Card = styled.div`
  border-radius: 0.5rem;
  box-shadow: ${theme.shadow.large};
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 1.5rem;
`

const Logo = styled.img`
  height: 90px;
  object-fit: contain;
  align-self: flex-start;
`

export const InstitutionCard = ({ institution }) => (
  <Card className="InstitutionCard">
    <Link
      href={`/institutions/${institution.slug}`}
      noUnderline
      // TODO: tracking
      // onAuxClick={trackJobOpening}
      // onClick={trackJobOpening}
    >
      {/* TODO: use next/image for external images as well */}
      {institution.logoFile && <Logo src={institution.logoFile?.url} />}
      <Title>{institution.name}</Title>
      <Excerpt>{institution.description}</Excerpt>
    </Link>
  </Card>
)
