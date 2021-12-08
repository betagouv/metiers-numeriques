export default function Footer() {
  return (
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
              <a className="fr-footer__bottom-link" href="/mentions-legales">
                Mentions légales
              </a>
            </li>
            <li className="fr-footer__bottom-item">
              <a className="fr-footer__bottom-link" href="/donnees-personnelles-et-cookies">
                Données personnelles et cookies
              </a>
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
  )
}
