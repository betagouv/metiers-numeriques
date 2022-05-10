import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import type { MutableRefObject } from 'react'

export function ModalPortal({ children }) {
  const $modalPortal = useRef(null) as MutableRefObject<HTMLElement | null>
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    $modalPortal.current = document.getElementById('modal')

    setMounted(true)
  }, [])

  return mounted && $modalPortal.current !== null ? createPortal(children, $modalPortal.current) : null
}
