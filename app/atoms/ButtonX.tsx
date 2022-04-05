import { ButtonHTMLAttributes } from 'react'
import { X } from 'react-feather'
import styled from 'styled-components'

const StyledButton = styled.button`
  line-height: 0;
  padding: 0;
`

export type ButtonXProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

export function ButtonX(props: ButtonXProps) {
  return (
    <StyledButton type="button" {...props}>
      <X />
    </StyledButton>
  )
}
