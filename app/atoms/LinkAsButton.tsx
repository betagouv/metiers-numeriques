import Link from 'next/link'

import { Button } from './Button'

import type { ButtonProps } from './Button'

const openInNewTab = (url: string): void => {
  window.open(url, '_blank')
}

type LinkAsButtonProps = ButtonProps & {
  href: string
  isExternal?: boolean
}

export function LinkAsButton({ href, isExternal = false, ...props }: LinkAsButtonProps) {
  if (!isExternal) {
    return (
      <Link href={href}>
        <Button {...props} />
      </Link>
    )
  }

  return <Button onClick={() => openInNewTab(href)} {...props} />
}
