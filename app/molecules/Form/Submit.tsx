import { useFormikContext } from 'formik'
import styled from 'styled-components'

import type { ButtonHTMLAttributes } from 'react'

const StyledButton = styled.button`
  white-space: nowrap;
`

type SubmitProps = ButtonHTMLAttributes<HTMLButtonElement>

export function Submit({ disabled, onClick, ...props }: SubmitProps) {
  const { isSubmitting } = useFormikContext<any>()

  const isControlledDisabled = disabled || isSubmitting

  return <StyledButton className="fr-btn" disabled={isControlledDisabled} type="submit" {...props} />
}
