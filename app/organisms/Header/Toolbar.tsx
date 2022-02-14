import { LinkAsButton } from '../../atoms/LinkAsButton'

export function Toolbar() {
  return (
    <div className="fr-header__tools fr-mr-4w">
      <div className="fr-header__tools-links">
        <ul className="fr-links-group">
          <li>
            <LinkAsButton
              href="https://www.demarches-simplifiees.fr/commencer/metiers-numerique-gouv-fr-candidature-spontanee"
              id="account-btn"
              isExternal
              isSecondary
              type="button"
            >
              Déposez une candidature spontanée
            </LinkAsButton>
          </li>
        </ul>
      </div>
    </div>
  )
}
