import { VerticalMenu } from '@singularity/core'
import { useAuth } from 'nexauth/client'
import { useRouter } from 'next/router'
import { LogOut } from 'react-feather'
import styled from 'styled-components'

import Link from '../atoms/Link'

const Box = styled.div`
  background-color: #293042;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  width: 14rem;
  padding: ${p => p.theme.padding.layout.medium};
  position: fixed;
  overflow-y: auto;

  a {
    text-decoration: none;
  }
`

const MenuTitle = styled.h4`
  border-top: 1px solid ${p => p.theme.color.body.white};
  color: ${p => p.theme.color.body.white};
  font-size: 80%;
  font-weight: 500;
  margin: ${p => p.theme.padding.layout.large} 0 0;
  opacity: 0.35;
  padding: ${p => p.theme.padding.layout.small} 0;
`

const UserMenu = styled.div`
  display: flex;
  justify-content: space-between;

  svg {
    cursor: pointer;
  }
  svg:hover {
    fill: white;
  }
`

export default function AdminMenu() {
  const router = useRouter()
  const auth = useAuth()

  return (
    <Box>
      <div>
        <VerticalMenu>
          <Link href="/admin">
            <VerticalMenu.Item isActive={router.pathname === '/admin'} isDark>
              Tableau de bord
            </VerticalMenu.Item>
          </Link>
          <Link href="/admin/contacts">
            <VerticalMenu.Item
              isActive={router.pathname === '/admin/contacts' || router.pathname.startsWith('/admin/contact/')}
              isDark
            >
              Contacts
            </VerticalMenu.Item>
          </Link>
          <Link href="/admin/jobs">
            <VerticalMenu.Item
              isActive={router.pathname === '/admin/jobs' || router.pathname.startsWith('/admin/job/')}
              isDark
            >
              Offres
            </VerticalMenu.Item>
          </Link>
          <Link href="/admin/professions">
            <VerticalMenu.Item
              isActive={router.pathname === '/admin/professions' || router.pathname.startsWith('/admin/profession/')}
              isDark
            >
              Métiers
            </VerticalMenu.Item>
          </Link>
          <Link href="/admin/recruiters">
            <VerticalMenu.Item
              isActive={router.pathname === '/admin/recruiters' || router.pathname.startsWith('/admin/recruiter/')}
              isDark
            >
              Recruteurs
            </VerticalMenu.Item>
          </Link>
        </VerticalMenu>

        <MenuTitle>LEGACY</MenuTitle>

        <VerticalMenu>
          <Link href="/admin/legacy-jobs">
            <VerticalMenu.Item
              isActive={router.pathname === '/admin/legacy-jobs' || router.pathname.startsWith('/admin/legacy-job/')}
              isDark
              style={{
                textDecoration: 'line-through',
              }}
            >
              Offres
            </VerticalMenu.Item>
          </Link>
          <Link href="/admin/legacy-institutions">
            <VerticalMenu.Item
              isActive={
                router.pathname === '/admin/legacy-institutions' ||
                router.pathname.startsWith('/admin/legacy-institution/')
              }
              isDark
            >
              Institutions
            </VerticalMenu.Item>
          </Link>
        </VerticalMenu>

        <MenuTitle>ADMINISTRATION</MenuTitle>

        <VerticalMenu>
          <Link href="/admin/addresses">
            <VerticalMenu.Item
              isActive={router.pathname === '/admin/addresses' || router.pathname.startsWith('/admin/address/')}
              isDark
            >
              Adresses
            </VerticalMenu.Item>
          </Link>
          <Link href="/admin/files">
            <VerticalMenu.Item
              isActive={router.pathname === '/admin/files' || router.pathname.startsWith('/admin/file/')}
              isDark
            >
              Fichiers
            </VerticalMenu.Item>
          </Link>
          <Link href="/admin/archived-jobs">
            <VerticalMenu.Item
              isActive={
                router.pathname === '/admin/archived-jobs' || router.pathname.startsWith('/admin/archived-job/')
              }
              isDark
            >
              Offres archivées
            </VerticalMenu.Item>
          </Link>
          <Link href="/admin/users">
            <VerticalMenu.Item
              isActive={router.pathname === '/admin/users' || router.pathname.startsWith('/admin/user/')}
              isDark
            >
              Utilisateur·rices
            </VerticalMenu.Item>
          </Link>
        </VerticalMenu>
      </div>

      <UserMenu>
        <LogOut onClick={auth.logOut} />
      </UserMenu>
    </Box>
  )
}
