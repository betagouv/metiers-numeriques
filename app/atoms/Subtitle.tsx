import styled from 'styled-components'

export const Subtitle = styled.h2<{
  accent?: string
  isFirst?: boolean
  noBorder?: boolean
  withBottomMargin?: boolean
}>`
  border-bottom: solid ${p => (p.noBorder ? 0 : '1px')} ${p => p.theme.color[p.accent || 'secondary'].background};
  color: ${p => p.theme.color[p.accent || 'secondary'].active};
  font-size: 125%;
  font-weight: 500;
  margin: ${p => (p.isFirst ? 0 : p.theme.padding.layout.medium)} 0
    ${p => (p.withBottomMargin ? p.theme.padding.layout.medium : p.theme.padding.layout.small)};
  padding-bottom: ${p => p.theme.padding.layout.tiny};
`
