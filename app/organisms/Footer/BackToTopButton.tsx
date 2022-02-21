import { useEffect, useRef } from 'react'
import styled from 'styled-components'

const StyledButton = styled.button`
  background-color: #2943d1;
  border-radius: 50%;
  bottom: 6.25rem;
  box-shadow: none;
  color: transparent;
  height: 3.75rem !important;
  max-height: 3.75rem !important;
  max-width: 3.75rem !important;
  /* opacity: 0; */
  padding: 1.125rem !important;
  position: fixed;
  right: 1.5rem;
  width: 3.75rem !important;

  ::before {
    color: white;
  }

  :hover {
    background-image: none;
  }
`

export function BackToTopButton() {
  const $backToTopButton = useRef<HTMLButtonElement>(null)

  const goToTop = () => {
    window.scroll({
      behavior: 'smooth',
      top: 0,
    })
  }

  useEffect(() => {
    window.document.addEventListener('scroll', () => {
      if ($backToTopButton.current === null) {
        return
      }

      if (window.scrollY < window.innerHeight) {
        $backToTopButton.current.style.opacity = String(Math.round((100 * window.scrollY) / window.innerHeight) / 100)

        return
      }

      $backToTopButton.current.style.opacity = '1'
    })
  }, [])

  return (
    <StyledButton
      ref={$backToTopButton}
      className="fr-btn fr-fi-arrow-up-line"
      onClick={goToTop}
      title="Revenir en haut de la page"
    >
      Revenir en haut de la page
    </StyledButton>
  )
}
