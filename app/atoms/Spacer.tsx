import styled from 'styled-components'

export const Spacer = styled.div<{ units?: number }>`
  margin-bottom: ${p => p.units || 1}rem;
`
