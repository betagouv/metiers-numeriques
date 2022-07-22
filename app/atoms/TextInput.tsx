import { theme } from '@app/theme'
import styled from 'styled-components'

import type { InputHTMLAttributes } from 'react'

const InputContainer = styled.div`
  position: relative;
`

const StyledInput = styled.input`
  margin-top: 0.5rem;
  background-color: ${theme.color.neutral.silver};
  border: solid 1px ${theme.color.neutral.black};
  border-radius: 0.25rem;
  color: ${theme.color.neutral.black};
  font-size: 112.5%;
  line-height: 1;
  padding: 0.55rem 1.25rem 0.8rem;
  width: 100%;

  ::placeholder {
    color: ${theme.color.neutral.darkGrey};
    font-size: 90%;
    font-style: normal;
  }

  :hover {
    background-color: ${theme.color.primary.lightBlue};
    border: solid 1px ${theme.color.primary.darkBlue};
  }

  :focus {
    background-color: ${theme.color.neutral.white};
    border: solid 1px ${theme.color.primary.darkBlue};

    ::placeholder {
      color: ${theme.color.neutral.lightGrey};
      font-size: 90%;
      font-style: normal;
    }
  }
`

const Icon = styled.i`
  font-size: 1.5rem;
  position: absolute;
  bottom: 0.625rem;
  right: 0.75rem;
`

type TextInputPropsBase = InputHTMLAttributes<HTMLInputElement> & {
  error?: string
  helper?: string
  iconClassName?: string
  name: string
}
type TextInputPropsWithLabel = Omit<TextInputPropsBase, 'aria-label'> & {
  label: string
}
type TextInputPropsWithAriaLabel = Omit<TextInputPropsBase, 'label'> & {
  'aria-label': string
}
export type TextInputProps = TextInputPropsWithLabel | TextInputPropsWithAriaLabel
export function TextInput({
  autoComplete = 'off',
  error,
  helper,
  iconClassName,
  name,
  type = 'text',
  ...props
}: TextInputPropsWithLabel | TextInputPropsWithAriaLabel) {
  // eslint-disable-next-line no-nested-ternary
  const ariaDescribedBy = error ? `${name}-error` : helper ? `${name}-helper` : undefined
  const label = 'label' in props ? props.label : undefined

  return (
    <InputContainer className="TextInput">
      {label && <label htmlFor={name}>{label}</label>}

      <StyledInput
        aria-describedby={ariaDescribedBy}
        autoComplete={autoComplete}
        id={name}
        name={name}
        type={type}
        {...props}
      />

      {iconClassName && <Icon className={iconClassName} />}

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
    </InputContainer>
  )
}
