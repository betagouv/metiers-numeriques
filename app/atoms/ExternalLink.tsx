import styled from 'styled-components'

import type { AnchorHTMLAttributes } from 'react'

const StyledA = styled.a`
  :after {
    content: none;
  }
`

const StyledI = styled.i`
  font-size: 75%;
  margin-right: 0.25rem;
  vertical-align: -2.5px;
`

type ExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  remixIconId?: string
}

export default function ExternalLink({ children, remixIconId, ...props }: ExternalLinkProps) {
  return (
    <StyledA rel="noreferrer" target="_blank" {...props}>
      {remixIconId && <StyledI className={`ri-${remixIconId}`} />}
      {children}
    </StyledA>
  )
}
