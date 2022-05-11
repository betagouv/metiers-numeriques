import styled from 'styled-components'

export const Alert = styled.div<{
  isFirst?: boolean
}>`
  background-color: ${p => p.theme.color.warning.background};
  border: solid 1px ${p => p.theme.color.warning.default};
  border-left: solid 0.25rem ${p => p.theme.color.warning.active};
  border-radius: 0.25rem;
  cursor: pointer;
  margin-top: ${p => (p.isFirst ? '0' : '0.5rem')};
  padding: 0.5rem;
`
