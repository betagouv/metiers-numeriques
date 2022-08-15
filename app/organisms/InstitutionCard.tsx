import { Link } from '@app/atoms/Link'
import { theme } from '@app/theme'
import Image from 'next/image'
import React from 'react'
import styled from 'styled-components'

const Title = styled.h3`
  display: -webkit-box;
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.75rem;
  margin: 0.5rem 0 0;
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
    <Link href={`/employeurs/${institution.slug}`} noUnderline>
      {/* TODO: use next/image for external images as well */}
      {institution.logoFile ? (
        <Logo src={institution.logoFile?.url} />
      ) : (
        <Image height={90} src="/images/logo-republique.svg" width={100} />
      )}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Title>{institution.name}</Title>
      </div>
    </Link>
  </Card>
)
