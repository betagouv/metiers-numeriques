import styled from 'styled-components'

export const Row = styled.div<{ centered?: boolean; gap?: number }>`
  display: flex;
  flex-direction: row;
  gap: 1rem ${p => p.gap || 2}rem;
  ${p => (p.centered ? 'justify-content: center;' : '')}
`

export const Col = styled.div<{ scroll?: boolean; size: number }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  flex-basis: ${p => p.size}%;
  ${p => (p.scroll ? 'overflow-y: scroll;' : '')}
`
