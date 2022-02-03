import styled from 'styled-components'

export const Subtitle = styled.h2<{
  accent?: string
}>`
  border-bottom: solid 1px ${p => p.theme.color[p.accent || 'secondary'].background};
  color: ${p => p.theme.color[p.accent || 'secondary'].active};
  font-size: 125%;
  font-weight: 500;
  margin-bottom: ${p => p.theme.padding.layout.small};
  padding-bottom: ${p => p.theme.padding.layout.tiny};
`
