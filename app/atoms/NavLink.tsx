import NextLink from 'next/link'

import type { AnchorHTMLAttributes } from 'react'

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
}

export function NavLink({ children, href, ...props }: LinkButtonProps) {
  return (
    <li className="fr-nav__item">
      <NextLink href={href}>
        <a className="fr-nav__link" href={href} {...props}>
          {children}
        </a>
      </NextLink>
    </li>
  )
}
