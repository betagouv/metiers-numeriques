import { theme } from '@app/theme'
import { UserRole } from '@prisma/client'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import styled from 'styled-components'

import { LinkItem } from './LinkItem'

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

export const UserMenu = () => {
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
            <>
              <LinkItem>
                <Link href="/espace-candidat">Mon espace candidat</Link>
              </LinkItem>
              <LinkItem>
                <Link href="/profil">Mon profil</Link>
              </LinkItem>
              <LinkItem>
                <Link href="/candidature">Déposer une candidature spontanée</Link>
              </LinkItem>
            </>
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
