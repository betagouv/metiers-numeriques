import { Link } from '../../atoms/Link'

type BrandProps = {
  onToggleMenu: Common.FunctionLike
}

export function Brand({ onToggleMenu }: BrandProps) {
  return (
    <div className="fr-header__brand fr-enlarge-link">
      <div className="fr-header__brand-top">
        <div className="fr-header__logo">
          <p className="fr-logo" title="République Française">
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
            onClick={onToggleMenu}
            title="Menu"
            type="button"
          >
            Menu
          </button>
        </div>
      </div>
      <div className="fr-header__service">
        <p className="fr-header__service-title">
          <Link href="/">Métiers du Numérique</Link>
        </p>
        <p className="fr-header__service-tagline fr-text--sm">
          Découvrez les offres d’emploi du numérique dans l’État.
        </p>
      </div>
    </div>
  )
}
