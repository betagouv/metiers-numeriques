import { Link } from '@app/atoms/Link'
import styled from 'styled-components'

import { BackToTopButton } from './BackToTopButton'

const Brand = styled.div`
  align-items: flex-start;
`

export function Footer() {
  return (
    <>
      <footer className="fr-footer" role="contentinfo">
        <div className="fr-container">
          <div className="fr-footer__body fr-footer__body--operator">
            <Brand className="fr-footer__brand fr-enlarge-link">
              <Link className="fr-footer__brand-link" href="/" title="Retour à l’accueil">
                <p className="fr-logo">
                  République
                  <br />
                  française
                </p>
              </Link>

              {/* <p
                className="fr-logo fr-logo--lg d-none d-md-block fr-ml-5w"
                title="Ministère de la transformation et de la fonction publiques"
              >
                Ministère
                <br />
                de la transformation
                <br />
                et de la fonction
                <br />
                publiques
              </p> */}
            </Brand>

            <div className="fr-footer__content">
              <p className="fr-footer__content-desc">Découvre les offres d’emploi du numérique au sein de l’État.</p>
              <p className="fr-footer__content-desc">
                <a
                  href="https://github.com/betagouv/metiers-numeriques"
                  rel="noopener noreferrer"
                  target="_blank"
                  title="Voir le code source"
                >
                  Le code source est ouvert et les contributions sont bienvenues.
                </a>
              </p>

              <ul className="fr-footer__content-list">
                <li className="fr-footer__content-item">
                  <a
                    className="fr-footer__content-link"
                    href="https://beta.gouv.fr"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    beta.gouv.fr
                  </a>
                </li>
                <li className="fr-footer__content-item">
                  <a
                    className="fr-footer__content-link"
                    href="https://www.numerique.gouv.fr"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    numerique.gouv.fr
                  </a>
                </li>
                <li className="fr-footer__content-item">
                  <a
                    className="fr-footer__content-link"
                    href="https://www.gouvernement.fr"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    gouvernement.fr
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="fr-footer__bottom">
            <ul className="fr-footer__bottom-list">
              <li className="fr-footer__bottom-item">
                <Link className="fr-footer__bottom-link" href="/accessibilite">
                  Accessibilité : non conforme
                </Link>
              </li>
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

      <BackToTopButton />
    </>
  )
}
