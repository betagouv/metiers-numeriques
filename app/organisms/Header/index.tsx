import { NavLink } from '@app/atoms/NavLink'
import { UserRole } from '@prisma/client'
import classnames from 'classnames'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import styled from 'styled-components'

import { Brand } from './Brand'
import { Toolbar } from './Toolbar'

const StyledHeader = styled.header`
  position: sticky;
  top: 0px;
  z-index: 2;
  border-bottom: solid 1px var(--border-default-grey);

  @media screen and (min-width: 992px) {
    box-shadow: none;
  }
`

export function Header() {
  const { data, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  const headerMenuClassName = classnames('fr-header__menu', 'fr-modal', 'fr-hidden-md', {
    'fr-modal--opened': isMenuOpen,
  })

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen)
  }, [isMenuOpen])

  return (
    <StyledHeader className="fr-header" role="banner" style={{ overflow: 'hidden' }}>
      <div className="fr-header__body">
        <div className="fr-container">
          <div className="fr-header__body-row">
            <Brand onToggleMenu={toggleMenu} />
            <Toolbar />
          </div>
        </div>
      </div>

      <div className={headerMenuClassName} id="header-menu" role="dialog">
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
                Les offres
              </NavLink>
              <NavLink
                aria-current={router.pathname === '/employeurs' ? 'page' : undefined}
                className="fr-nav__link"
                href="/employeurs"
                onClick={closeMenu}
              >
                Les employeurs
              </NavLink>
              <NavLink
                className="fr-nav__link"
                href="mailto:contact@metiers.numerique.gouv.fr"
                onClick={closeMenu}
                rel="noopener noreferrer"
                target="_blank"
              >
                Nous écrire
              </NavLink>
              {status === 'authenticated' && !!data?.user ? (
                <>
                  {data.user.role === UserRole.CANDIDATE && (
                    <>
                      <NavLink
                        aria-current={router.pathname === '/espace-candidat' ? 'page' : undefined}
                        className="fr-nav__link"
                        href="/espace-candidat"
                        onClick={closeMenu}
                      >
                        Mon espace candidat
                      </NavLink>
                      <NavLink
                        aria-current={router.pathname === '/profil' ? 'page' : undefined}
                        className="fr-nav__link"
                        href="/profil"
                        onClick={closeMenu}
                      >
                        Mon profil
                      </NavLink>
                      <NavLink
                        aria-current={router.pathname === '/candidature' ? 'page' : undefined}
                        className="fr-nav__link"
                        href="/candidature"
                        onClick={closeMenu}
                      >
                        Déposer une candidature spontanée
                      </NavLink>
                    </>
                  )}
                  <NavLink className="fr-nav__link" href="/" onClick={() => signOut()}>
                    Se déconnecter
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    aria-current={router.pathname === '/connexion' ? 'page' : undefined}
                    className="fr-nav__link"
                    href="/connexion"
                    onClick={closeMenu}
                  >
                    Se connecter
                  </NavLink>
                  <NavLink
                    aria-current={router.pathname === '/inscription' ? 'page' : undefined}
                    className="fr-nav__link"
                    href="/inscription"
                    onClick={closeMenu}
                  >
                    S&apos;inscrire
                  </NavLink>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </StyledHeader>
  )
}
