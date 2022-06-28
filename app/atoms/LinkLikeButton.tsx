import Link from 'next/link'
import { AnchorHTMLAttributes } from 'react'

import { StyledButton } from './Button'

import type { ButtonProps } from './Button'

type LinkAsButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  Pick<ButtonProps, 'accent' | 'size'> & {
    href: string
    isExternal?: boolean
  }
export function LinkLikeButton({
  accent = 'primary',
  className,
  isExternal = false,
  size = 'normal',
  ...rest
}: LinkAsButtonProps) {
  const { href } = rest
  const rel = isExternal ? 'noopener noreferrer' : undefined
  const target = isExternal ? '_blank' : undefined

  return (
    <Link href={href}>
      <StyledButton accent={accent} as="a" rel={rel} size={size} target={target} {...(rest as any)} />
    </Link>
  )
}
