import { NavLink } from '@app/atoms/NavLink'
import classnames from 'classnames'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import styled from 'styled-components'

import { Brand } from './Brand'
import { Toolbar } from './Toolbar'

const StyledHeader = styled.header`
  position: sticky;
  top: 0px;
  z-index: 2;

  @media screen and (min-width: 992px) {
    box-shadow: none;
  }
`

const HeaderMenu = styled.div`
  box-shadow: none !important;
  border-bottom: solid 1px var(--border-default-grey);
  border-top: solid 1px var(--border-default-grey);
`

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  const headerMenuClassName = classnames('fr-header__menu', 'fr-modal', {
    'fr-modal--opened': isMenuOpen,
  })

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen)
  }, [isMenuOpen])

  return (
    <StyledHeader className="fr-header" role="banner">
      <div className="fr-header__body">
        <div className="fr-container">
          <div className="fr-header__body-row">
            <Brand onToggleMenu={toggleMenu} />

            <Toolbar />
          </div>
        </div>
      </div>

      <HeaderMenu className={headerMenuClassName} id="header-menu" role="dialog">
        <div className="fr-container">
          <button aria-controls="header-menu" className="fr-link--close fr-link" onClick={toggleMenu} type="button">
            Fermer
          </button>
          <div className="fr-header__menu-links" />
          <nav aria-label="Menu principal" className="fr-nav" role="navigation">
            <ul className="fr-nav__list">
              <NavLink
                aria-current={router.pathname === '/' ? 'page' : undefined}
                className="fr-nav__link"
                href="/"
                onClick={closeMenu}
              >
                Accueil
              </NavLink>
              <NavLink
                aria-current={router.pathname === '/offres-emploi' ? 'page' : undefined}
                className="fr-nav__link"
                href="/offres-emploi"
                onClick={closeMenu}
              >
                Offres d’emploi
              </NavLink>
              <NavLink className="fr-nav__link" href="/admin" onClick={closeMenu}>
                Déposer une offre
              </NavLink>
            </ul>
          </nav>
        </div>
      </HeaderMenu>
    </StyledHeader>
  )
}
