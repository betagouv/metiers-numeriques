import { Button } from '@singularity/core'
import styled from 'styled-components'

import type { ButtonHTMLAttributes } from 'react'

const StyledButton = styled(Button)`
  box-shadow: none;
  position: fixed;
  right: 1rem;
  top: 0.85rem;
  z-index: 1;

  ::before {
    color: white;
  }

  :hover {
    background-image: none;
  }
`

type AdminFloatingButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  onClick: () => void | Promise<void>
}
export function AdminFloatingButton(props: AdminFloatingButtonProps) {
  return <StyledButton accent="success" {...props} />
}
