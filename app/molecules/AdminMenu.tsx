import { VerticalMenu } from '@singularity/core'
import MaterialLogoutOutlined from '@singularity/core/icons/material/MaterialLogoutOutlined'
import { useAuth } from 'nexauth'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import Link from '../atoms/Link'

const Box = styled.div`
  background-color: #293042;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  min-width: 16rem;
  padding: ${p => p.theme.padding.layout.medium};
  position: fixed;
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
          <Link href="/admin/files">
            <VerticalMenu.Item
              isActive={router.pathname === '/admin/files' || router.pathname.startsWith('/admin/file/')}
              isDark
            >
              Fichiers
            </VerticalMenu.Item>
          </Link>
        </VerticalMenu>

        <MenuTitle>LEGACY</MenuTitle>

        <VerticalMenu>
          <Link href="/admin/legacy-jobs">
            <VerticalMenu.Item
              isActive={router.pathname === '/admin/legacy-jobs' || router.pathname.startsWith('/admin/legacy-job/')}
              isDark
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
          <Link href="/admin/legacy-entities">
            <VerticalMenu.Item
              isActive={
                router.pathname === '/admin/legacy-entities' || router.pathname.startsWith('/admin/legacy-entity/')
              }
              isDark
            >
              Entités
            </VerticalMenu.Item>
          </Link>
          <Link href="/admin/legacy-services">
            <VerticalMenu.Item
              isActive={
                router.pathname === '/admin/legacy-services' || router.pathname.startsWith('/admin/legacy-service/')
              }
              isDark
            >
              Services
            </VerticalMenu.Item>
          </Link>
        </VerticalMenu>

        <MenuTitle>ADMINISTRATION</MenuTitle>

        <VerticalMenu>
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
        <MaterialLogoutOutlined accent="secondary" onClick={auth.logOut} />
      </UserMenu>
    </Box>
  )
}
