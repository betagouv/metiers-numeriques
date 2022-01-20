import Head from 'next/head'
import { useRouter } from 'next/router'

import Link from '../atoms/Link'

export default function Header() {
  const router = useRouter()

  return (
    <>
      <Head>
        <link href="/index.bundle.css" rel="stylesheet" />
      </Head>
      <header className="fr-header" role="banner">
        <div className="fr-header__body">
          <div className="fr-container">
            <div className="fr-header__body-row">
              <div className="fr-header__brand fr-enlarge-link">
                <div className="fr-header__brand-top">
                  <div className="fr-header__logo">
                    <p className="fr-logo">
                      République
                      <br />
                      Française
                    </p>
                  </div>
                  <div className="fr-header__navbar">
                    <button
                      aria-controls="modal-menu"
                      aria-haspopup="menu"
                      className="fr-btn--menu fr-btn"
                      data-fr-opened="false"
                      title="Menu"
                      type="button"
                    >
                      Menu
                    </button>
                  </div>
                </div>
                <div className="fr-header__service">
                  <Link href="/">
                    <p className="fr-header__service-title">metiers.numerique.gouv.fr</p>
                  </Link>
                  <p className="fr-header__service-tagline">
                    Tout savoir sur les métiers du numérique au sein de l’État.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fr-container">
          <nav aria-label="Menu principal" className="fr-nav" role="navigation">
            <ul className="fr-nav__list">
              <li className="fr-nav__item">
                <Link aria-current={router.pathname === '/' ? 'page' : undefined} className="fr-nav__link" href="/">
                  Accueil
                </Link>
              </li>
              <li className="fr-nav__item">
                <Link
                  aria-current={router.pathname === '/emplois' ? 'page' : undefined}
                  className="fr-nav__link"
                  href="/emplois"
                >
                  Les offres d’emplois
                </Link>
              </li>
              <li className="fr-nav__item">
                <Link
                  aria-current={router.pathname === '/institutions' ? 'page' : undefined}
                  className="fr-nav__link"
                  href="/institutions"
                >
                  Les institutions
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  )
}
