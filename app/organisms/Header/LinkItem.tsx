import { theme } from '@app/theme'
import styled from 'styled-components'

export const LinkItem = styled.li`
  position: relative;
  padding: 0 1rem;
  height: 2.75rem;
  cursor: pointer;
  white-space: nowrap;

  a {
    line-height: 2.5rem;

    &:hover {
      color: ${theme.color.primary.darkBlue};
    }
  }
`
