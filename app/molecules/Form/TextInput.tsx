import classnames from 'classnames'
import { useFormikContext } from 'formik'
import styled from 'styled-components'

import type { InputHTMLAttributes } from 'react'

const StyledInput = styled.input``

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  name: string
}

export function TextInput({ autoComplete = 'off', disabled, label, name, type = 'text', ...props }: TextInputProps) {
  const { errors, handleChange, isSubmitting, submitCount, touched, values } = useFormikContext<any>()

  const hasError = (touched[name] !== undefined || submitCount > 0) && Boolean(errors[name])
  const maybeError = hasError ? String(errors[name]) : undefined

  const ariaDescribedBy = hasError ? `${name}-error` : undefined
  const boxClassName = classnames('fr-input-group', {
    'fr-input-group--error': hasError,
  })
  const className = classnames('fr-input', {
    'fr-input--error': hasError,
  })
  const isControlledDisabled = disabled || isSubmitting
  const value = values[name]

  return (
    <div className={boxClassName}>
      <label className="fr-label" htmlFor={name}>
        {label}
      </label>

      <StyledInput
        aria-describedby={ariaDescribedBy}
        autoComplete={autoComplete}
        className={className}
        defaultValue={value}
        disabled={isControlledDisabled}
        id={name}
        name={name}
        onChange={handleChange}
        type={type}
        {...props}
      />

      {hasError && (
        <p className="fr-error-text" id={`${name}-error`}>
          {maybeError}
        </p>
      )}
    </div>
  )
}
