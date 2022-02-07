import styled from 'styled-components'

export const Flex = styled.div<{
  isVertical?: boolean
}>`
  display: flex;
  flex-direction: ${p => (p.isVertical ? 'column' : 'row')};

  > div:first-child {
    flex-grow: 1;
  }
  > div:not(:first-child) {
    margin-left: 1rem;
    min-width: 10rem;
  }
`
