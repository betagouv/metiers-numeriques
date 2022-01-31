import styled from 'styled-components'

export const Subtitle = styled.h2`
  border-bottom: solid 1px ${p => p.theme.color.secondary.background};
  color: ${p => p.theme.color.secondary.active};
  font-size: 125%;
  font-weight: 500;
  margin-bottom: ${p => p.theme.padding.layout.small};
  padding-bottom: ${p => p.theme.padding.layout.tiny};
`
