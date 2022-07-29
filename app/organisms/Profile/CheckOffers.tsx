import { Button } from '@app/atoms/Button'
import { Spacer } from '@app/atoms/Spacer'
import { Title } from '@app/atoms/Title'
import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0 6rem;
`

export const CheckOffers = () => (
  <Container>
    <Title as="h1">C'est tout bon !</Title>
    <Spacer units={2} />
    <Link href="/offres-emploi">
      <Button>Consulter les offres</Button>
    </Link>
  </Container>
)
