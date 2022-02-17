import NextLink from 'next/link'

import type { AnchorHTMLAttributes } from 'react'

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
}

export default function Link({ children, href, ...props }: LinkProps) {
  return (
    <NextLink href={href}>
      <a href={href} {...props}>
        {children}
      </a>
    </NextLink>
  )
}
