import { Field } from '@singularity/core'
import styled from 'styled-components'

export const FieldGroup = styled(Field)`
  display: flex;

  > div {
    flex-grow: 1;
  }
  > div > input {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }

  > span {
    align-self: flex-start;
    background-color: ${p => p.theme.color.list.odd};
    border-bottom: solid 1px ${p => p.theme.color.secondary.default};
    border-bottom-right-radius: ${p => p.theme.appearance.borderRadius.medium};
    border-right: solid 1px ${p => p.theme.color.secondary.default};
    border-top: solid 1px ${p => p.theme.color.secondary.default};
    border-top-right-radius: ${p => p.theme.appearance.borderRadius.medium};
    margin-top: 1.45rem;
    padding: ${p => p.theme.padding.input.medium};
  }
`
