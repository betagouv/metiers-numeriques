import NextLink from 'next/link'
import styled from 'styled-components'

import type { AnchorHTMLAttributes } from 'react'

const StyledAnchor = styled.a`
  --blend: none;
`

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
}

export default function Link({ children, href, ...props }: LinkButtonProps) {
  return (
    <NextLink href={href}>
      <StyledAnchor href={href} {...props}>
        {children}
      </StyledAnchor>
    </NextLink>
  )
}
