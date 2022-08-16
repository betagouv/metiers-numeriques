import { LinkLikeButton } from '@app/atoms/LinkLikeButton'
import { theme } from '@app/theme'
import { UserRole } from '@prisma/client'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import styled from 'styled-components'

const LinkItem = styled.li`
  position: relative;
  padding: 0 1rem;
  height: 2.75rem;
  cursor: pointer;
  white-space: nowrap;

  a {
    line-height: 2.5rem;

    &:hover {
      color: ${theme.color.primary.darkBlue};
    }
  }
`

const MenuButton = styled.span`
  height: 2.5rem;
  display: flex;
  align-items: center;

  &:hover {
    color: ${theme.color.primary.darkBlue};
  }

  i {
    margin-top: 1px;
    margin-left: 0.5rem;
  }
`

const Menu = styled.ul`
  position: absolute;
  right: 0;
  z-index: 10000;
  border-radius: 0.5rem;
  background-color: white;
  box-shadow: 0 0 0 1px ${theme.color.neutral.lightGrey};

  li {
    display: flex;
    align-items: center;

    &:not(:last-child) {
      border-bottom: 1px solid ${theme.color.neutral.lightGrey};
    }
  }
`

const UserMenu = () => {
  const { data } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  const user = data?.user

  if (!user) {
    return null
  }

  return (
    <LinkItem onClick={() => setIsOpen(open => !open)}>
      <MenuButton>
        {user.firstName} <i className="ri-user-fill" />
      </MenuButton>
      {isOpen && (
        <Menu>
          {user.role === UserRole.CANDIDATE && (
            <LinkItem>
              <Link href="/profil">Mon profil</Link>
            </LinkItem>
          )}
          {/* @ts-ignore TODO: dunno why TS yells here */}
          {[UserRole.RECRUITER, UserRole.ADMINISTRATOR].includes(user.role) && user.isActive && (
            <LinkItem>
              <Link href="/admin">Espace administrateur</Link>
            </LinkItem>
          )}
          <LinkItem onClick={() => signOut()}>
            <a href="/">Se déconnecter</a>
          </LinkItem>
        </Menu>
      )}
    </LinkItem>
  )
}

export function Toolbar() {
  const { status } = useSession()

  return (
    <div className="fr-header__tools">
      <div className="fr-header__tools-links">
        <ul className="fr-links-group fr-pr-2w">
          <LinkItem>
            <Link href="/offres-emploi">Les offres</Link>
          </LinkItem>
          <LinkItem>
            <Link href="/employeurs">Les employeurs</Link>
          </LinkItem>
          <LinkItem className="fr-mr-12v">
            <Link href="mailto:contact@metiers.numerique.gouv.fr" rel="noopener noreferrer" target="_blank">
              Nous écrire
            </Link>
          </LinkItem>
          {status === 'authenticated' ? (
            <UserMenu />
          ) : (
            <>
              <li className="fr-mr-4v">
                <LinkLikeButton accent="tertiary" href="/inscription" size="medium">
                  S&apos;inscrire
                </LinkLikeButton>
              </li>
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
