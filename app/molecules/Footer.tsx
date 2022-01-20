import { useEffect, useRef } from 'react'
import styled from 'styled-components'

import Link from '../atoms/Link'

const BackToTopButton = styled.button`
  background-color: #2943d1;
  border-radius: 50%;
  bottom: 6.25rem;
  box-shadow: none;
  color: white;
  height: 3.75rem !important;
  max-height: 3.75rem !important;
  max-width: 3.75rem !important;
  /* opacity: 0; */
  padding: 1.125rem !important;
  position: fixed;
  right: 1.5rem;
  width: 3.75rem !important;

  :hover {
    background-image: none;
  }
`

export default function Footer() {
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
    <>
      <footer className="fr-footer" id="footer" role="contentinfo">
        <div className="fr-container">
          <div className="fr-footer__body">
            <div className="fr-footer__brand fr-enlarge-link">
              <a href="/" title="Retour à l’accueil">
                <p className="fr-logo">
                  République
                  <br />
                  française
                </p>
              </a>
            </div>

            <div className="fr-footer__content">
              <p className="fr-footer__content-desc">Tout savoir sur les métiers du numérique au sein de l’État.</p>

              <p className="fr-footer__content-desc">
                Le code source est ouvert et les contributions sont bienvenues.
                <a
                  href="https://github.com/betagouv/metiers-numeriques"
                  rel="noopener noreferrer"
                  target="_blank"
                  title="Voir le code source"
                >
                  Voir le code source
                </a>
                .
              </p>

              <ul className="fr-footer__content-list">
                <li className="fr-footer__content-item">
                  <a
                    className="fr-footer__content-link"
                    href="mailto:contact@metiers.numerique.gouv.fr"
                    title="Contactez-nous"
                  >
                    Contactez-nous
                  </a>
                </li>
                <li className="fr-footer__content-item">
                  <a className="fr-footer__content-link" href="https://www.numerique.gouv.fr/">
                    numerique.gouv.fr
                  </a>
                </li>
                <li className="fr-footer__content-item">
                  <a className="fr-footer__content-link" href="https://beta.gouv.fr/">
                    beta.gouv.fr
                  </a>
                </li>
                <li className="fr-footer__content-item">
                  <a className="fr-footer__content-link" href="https://www.gouvernement.fr/">
                    gouvernement.fr
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="fr-footer__bottom">
            <ul className="fr-footer__bottom-list">
              <li className="fr-footer__bottom-item">
                <Link className="fr-footer__bottom-link" href="/mentions-legales">
                  Mentions légales
                </Link>
              </li>
              <li className="fr-footer__bottom-item">
                <Link className="fr-footer__bottom-link" href="/donnees-personnelles-et-cookies">
                  Données personnelles et cookies
                </Link>
              </li>
              <li className="fr-footer__bottom-item">
                <a
                  className="fr-footer__bottom-link"
                  href="mailto:contact@metiers.numerique.gouv.fr"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Contactez-nous
                </a>
              </li>
              <li className="fr-footer__bottom-item">
                <button
                  aria-controls="fr-theme-modal"
                  className="fr-footer__bottom-link fr-fi-sun-fill-line fr-link--icon-left"
                  data-fr-opened="false"
                  type="button"
                >
                  Paramètres d’affichage
                </button>
              </li>
            </ul>

            <div className="fr-footer__bottom-copy">
              <p>
                Sauf mention contraire, tous les textes de ce site sont sous{' '}
                <a
                  href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  licence etalab-2.0
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </footer>

      <BackToTopButton
        ref={$backToTopButton}
        className="fr-btn fr-fi-arrow-up-line"
        onClick={goToTop}
        title="Revenir en haut de la page"
      >
        Revenir en haut de la page
      </BackToTopButton>
    </>
  )
}
