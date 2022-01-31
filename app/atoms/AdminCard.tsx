import { Card } from '@singularity/core'
import styled from 'styled-components'

export const AdminCard = styled(Card)<{
  isFirst?: boolean
}>`
  margin-top: ${p => (p.isFirst ? 0 : '1rem')};
`
