import classnames from 'classnames'
import { useFormikContext } from 'formik'

import type { InputHTMLAttributes } from 'react'

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  helper?: string
  isInline?: boolean
  label: string
  name: string
}

export function TextInput({
  autoComplete = 'off',
  disabled,
  helper,
  isInline = false,
  label,
  name,
  type = 'text',
  ...props
}: TextInputProps) {
  const { errors, handleChange, isSubmitting, submitCount, touched, values } = useFormikContext<any>()

  const hasError = (touched[name] !== undefined || submitCount > 0) && Boolean(errors[name])
  const maybeError = hasError ? String(errors[name]) : undefined

  const ariaDescribedBy = hasError ? `${name}-error` : undefined
  const boxClassName = classnames({
    'fr-input-group': !isInline,
    'fr-input-group--error': hasError,
    'fr-input-wrap': isInline,
    'fr-input-wrap--addon': isInline,
  })
  const className = classnames('fr-input', {
    'fr-input--error': hasError,
  })
  const isControlledDisabled = disabled || isSubmitting
  const value = values[name]

  if (isInline) {
    return (
      <>
        <label className="fr-label" htmlFor={name}>
          Votre adresse électronique (ex. : nom@domaine.fr)
        </label>

        <div className="fr-input-wrap fr-input-wrap--addon">
          <input
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

          <button className="fr-btn" disabled={isControlledDisabled} type="submit">
            S’abonner
          </button>
        </div>

        {hasError && <p className="fr-error-text">{maybeError}</p>}

        {helper && (
          <p className="fr-hint-text" id={`${name}Helper`}>
            {helper}
          </p>
        )}
      </>
    )
  }

  return (
    <div className={boxClassName}>
      <label className="fr-label" htmlFor={name}>
        {label}
      </label>

      <input
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
