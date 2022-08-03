import { LinkLikeButton } from '../../atoms/LinkLikeButton'

export function Toolbar() {
  return (
    <div className="fr-header__tools">
      <div className="fr-header__tools-links">
        <ul className="fr-links-group fr-pr-2w">
          <li>
            <LinkLikeButton
              href="https://www.demarches-simplifiees.fr/commencer/metiers-numerique-gouv-fr-candidature-spontanee"
              isExternal
              size="medium"
            >
              Déposer une candidature spontanée
            </LinkLikeButton>
          </li>
        </ul>
      </div>
    </div>
  )
}
