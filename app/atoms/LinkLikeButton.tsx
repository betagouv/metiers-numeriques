import Link from 'next/link'
import { AnchorHTMLAttributes } from 'react'

import { StyledButton } from './Button'

type LinkAsButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  accent?: 'moutarde' | 'normal'
  href: string
  isExternal?: boolean
  isLight?: boolean
  isSecondary?: boolean
  size?: 'large' | 'normal' | 'small'
}

export function LinkLikeButton({
  accent = 'normal',
  className,
  href,
  isExternal = false,
  isLight = false,
  isSecondary = false,
  size = 'normal',
  ...rest
}: LinkAsButtonProps) {
  const rel = isExternal ? 'noopener noreferrer' : undefined
  const target = isExternal ? '_blank' : undefined

  return (
    <Link href={href}>
      <StyledButton
        accent={accent}
        as="a"
        href={href}
        isLight={isLight}
        isSecondary={isSecondary}
        rel={rel}
        size={size}
        target={target}
        {...rest}
      />
    </Link>
  )
}
