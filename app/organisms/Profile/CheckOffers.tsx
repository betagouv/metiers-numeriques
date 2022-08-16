import { LinkLikeButton } from '@app/atoms/LinkLikeButton'
import { Spacer } from '@app/atoms/Spacer'
import { Title } from '@app/atoms/Title'
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
    <Title as="h1">C&apos;est tout bon !</Title>
    <Spacer units={4} />
    <LinkLikeButton href="/offres-emploi">Consulter les offres</LinkLikeButton>
    <Spacer units={2} />
    <LinkLikeButton accent="secondary" href="/candidature">
      Déposer une candidature spontanée
    </LinkLikeButton>
  </Container>
)
