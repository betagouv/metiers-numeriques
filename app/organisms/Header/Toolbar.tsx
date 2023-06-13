import { LinkLikeButton } from '@app/atoms/LinkLikeButton'
// import { BetaBanner } from '@app/molecules/BetaBanner'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

import { LinkItem } from './LinkItem'
import { UserMenu } from './UserMenu'

export function Toolbar() {
  const { status } = useSession()

  return (
    <div className="fr-header__tools" style={{ position: 'relative' }}>
      {/* <BetaBanner /> */}
      <div className="fr-header__tools-links">
        <ul className="fr-links-group fr-pr-2w">
          {/* <LinkItem> */}
          {/*  <Link href="/offres-emploi">Les offres</Link> */}
          {/* </LinkItem> */}
          <LinkItem>
            <Link href="/employeurs">Les employeurs</Link>
          </LinkItem>
          <LinkItem className="fr-mr-12v">
            <Link href="mailto:contact@metiers.numerique.gouv.fr" rel="noopener noreferrer" target="_blank">
              Nous écrire
            </Link>
          </LinkItem>
          {status === 'authenticated' && <UserMenu />}
          {status === 'unauthenticated' && (
            <>
              {/* <li className="fr-mr-4v"> */}
              {/*  <LinkLikeButton accent="tertiary" href="/inscription" size="medium"> */}
              {/*    S&apos;inscrire */}
              {/*  </LinkLikeButton> */}
              {/* </li> */}
              <li>
                <LinkLikeButton href="/connexion" size="medium">
                  Se connecter
                </LinkLikeButton>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  )
}
