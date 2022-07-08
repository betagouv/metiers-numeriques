import { theme } from '@app/theme'
import styled from 'styled-components'

export const Title = styled.h1<{
  as: 'h1' | 'h2' | 'h3' | 'h4'
  isFirst?: boolean
}>`
  color: ${theme.color.primary.darkBlue};
  font-size: ${p => theme.typography.mobile[p.as].size};
  font-weight: ${p => theme.typography.mobile[p.as].weight};
  line-height: 1;
  margin-top: ${p => (p.isFirst ? 0 : '2rem')};

  @media screen and (min-width: 768px) {
    font-size: ${p => theme.typography.desktop[p.as].size};
    font-weight: ${p => theme.typography.desktop[p.as].weight};
  }
`
