import { theme } from '@app/theme'
import styled from 'styled-components'

export const Title = styled.h1<{
  as: 'h1' | 'h2' | 'h3' | 'h4'
}>`
  color: ${theme.color.primary.darkBlue};
  font-size: ${p => theme.typography.mobile[p.as].size};
  font-weight: ${p => theme.typography.mobile[p.as].weight};

  @media screen and (min-width: 768px) {
    font-size: ${p => theme.typography.desktop[p.as].size};
    font-weight: ${p => theme.typography.desktop[p.as].weight};
  }
`
