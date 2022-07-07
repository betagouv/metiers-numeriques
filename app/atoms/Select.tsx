import { theme } from '@app/theme'
import ReactSelect from 'react-select'
import styled from 'styled-components'

import type { GroupBase } from 'react-select'
import type { StateManagerProps } from 'react-select/dist/declarations/src/useStateManager'

const Box = styled.div`
  position: relative;
`

const StyledReactSelect = styled(ReactSelect)`
  .react-select__control {
    background-color: ${theme.color.neutral.silver};
    border: solid 1px ${theme.color.neutral.black};
    border-radius: 0.25rem;
  }

  .react-select__value-container {
    color: ${theme.color.neutral.black};
    font-size: 100%;
    line-height: 1;
    padding: 1.25rem 1.25rem 0.25rem;
  }

  .react-select__menu {
    z-index: 1000;
  }

  /* width: 100%; */

  ::placeholder {
    color: ${theme.color.neutral.darkGrey};
    font-size: 90%;
    font-style: normal;
  }

  :hover {
    .react-select__control {
      background-color: ${theme.color.primary.lightBlue};
      border: solid 1px ${theme.color.primary.darkBlue};
    }
  }

  :focus {
    .react-select__control {
      background-color: ${theme.color.neutral.white};
      border: solid 1px ${theme.color.primary.darkBlue};
    }

    ::placeholder {
      color: ${theme.color.neutral.lightGrey};
      font-size: 90%;
      font-style: normal;
    }
  }
`

const Label = styled.label`
  color: ${theme.color.neutral.darkGrey};
  font-size: 80%;
  left: 1.5rem;
  position: absolute;
  top: 0.5rem;
  z-index: 1;
`

export type SelectOption<Value = string> = {
  label: string
  value: Value
}
type SelectProps<Option> = StateManagerProps<Option, boolean, GroupBase<Option>> & {
  error?: string
  helper?: string
  label: string
  name: string
}
export function Select<Option = SelectOption>({ error, helper, ...nativeProps }: SelectProps<Option>) {
  const { name } = nativeProps
  // eslint-disable-next-line no-nested-ternary
  const ariaDescribedBy = error ? `${name}-error` : helper ? `${name}-helper` : undefined
  const label = 'label' in nativeProps ? nativeProps.label : undefined

  return (
    <Box className="TextInput">
      {label && <Label htmlFor={name}>{label}</Label>}

      <StyledReactSelect
        aria-describedby={ariaDescribedBy}
        classNamePrefix="react-select"
        id={name}
        {...(nativeProps as any)}
      />

      {error && (
        <p className="fr-error-text" id={`${name}-error`}>
          {error}
        </p>
      )}

      {helper && (
        <p className="fr-hint-text" id={`${name}-helper`}>
          {helper}
        </p>
      )}
    </Box>
  )
}
