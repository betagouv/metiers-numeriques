import { useFormikContext } from 'formik'
import styled from 'styled-components'

import type { ButtonHTMLAttributes, MouseEventHandler } from 'react'

const StyledButton = styled.button``

type CancelProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  onClick: MouseEventHandler<HTMLButtonElement>
}

export function Cancel({ disabled, onClick, ...props }: CancelProps) {
  const { isSubmitting } = useFormikContext<any>()

  const isControlledDisabled = disabled || isSubmitting

  return <StyledButton className="fr-btn" disabled={isControlledDisabled} onClick={onClick} type="button" {...props} />
}
