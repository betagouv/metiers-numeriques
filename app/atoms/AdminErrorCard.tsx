import { Card } from '@singularity/core'
import styled from 'styled-components'

import { Subtitle } from './Subtitle'

/* eslint-disable sort-keys-fix/sort-keys-fix */
export const ADMIN_ERROR: Record<string, AdminErrorCardProps> = {
  NOT_FOUND: {
    title: 'Donnée introuvable',
    message: 'Cette donnée n’existe pas ou plus.',
  },
  GRAPHQL_REQUEST: {
    title: 'Erreur de requête GraphQL',
    message: 'Une erreur est survenue durant le chargement de cette donnée.',
  },
}
/* eslint-enable sort-keys-fix/sort-keys-fix */

export const StyledCard = styled(Card)`
  margin-bottom: 1rem;

  > p {
    font-weight: 400;
    margin-top: 0.5rem;
  }
`

type AdminErrorCardPropsWithDictionary = {
  error: AdminErrorCardProps
}

type AdminErrorCardProps = {
  message: string
  title: string
}

function AdminErrorCard({ error }: AdminErrorCardPropsWithDictionary): JSX.Element
function AdminErrorCard({ message, title }: AdminErrorCardProps): JSX.Element
function AdminErrorCard({ error, message, title }: any) {
  const controlledTitle = title || error.title
  const controlledMessage = message || error.message

  return (
    <StyledCard>
      <Subtitle accent="danger">{controlledTitle}</Subtitle>

      <p>{controlledMessage}</p>
    </StyledCard>
  )
}

export { AdminErrorCard }
