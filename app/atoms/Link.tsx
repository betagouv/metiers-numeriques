import NextLink from 'next/link'
import styled from 'styled-components'

import type { AnchorHTMLAttributes } from 'react'

const StyledAnchor = styled.a<{
  noUnderline: boolean
}>`
  --blend: none;
  box-shadow: ${p => (p.noUnderline ? 'none' : 'var(--link-underline)')};

  :after {
    content: ${p => (p.noUnderline ? 'none' : 'var(--link-blank-content)')};
  }
`

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  noUnderline?: boolean
}
export function Link({ noUnderline = false, ...props }: LinkProps) {
  const { href } = props

  return (
    <NextLink href={href}>
      <StyledAnchor noUnderline={noUnderline} {...props} />
    </NextLink>
  )
}
