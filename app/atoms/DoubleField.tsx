import { Field } from '@singularity/core'
import styled from 'styled-components'

export const DoubleField = styled(Field)`
  display: flex;

  > *:first-child {
    margin-right: 0.5rem;
    width: 50%;
  }
  > *:not(:first-child) {
    margin-left: 0.5rem;
    width: 50%;
  }
`
