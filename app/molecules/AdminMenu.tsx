import { ButtonAsLink } from '@app/atoms/ButtonAsLink'
import { UserRole } from '@prisma/client'
import { VerticalMenu } from '@singularity/core'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import { Link } from '../atoms/Link'

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

  a,
  button {
    text-decoration: none;
  }
`

const MenuTitle = styled.p`
  border-top: 1px solid ${p => p.theme.color.body.white};
  color: ${p => p.theme.color.body.white};
  font-size: 80%;
  font-weight: 500;
  margin: ${p => p.theme.padding.layout.large} 0 0;
  opacity: 0.35;
  padding: ${p => p.theme.padding.layout.small} 0;
`

export function AdminMenu() {
  const router = useRouter()
  const { data: auth } = useSession({ required: true })

  const isAdmin = auth?.user?.role === UserRole.ADMINISTRATOR
  const isRecruiter = auth?.user?.role === UserRole.RECRUITER

  return (
    <Box>
      <div>
        <VerticalMenu>
          <Link href="/admin">
            <VerticalMenu.Item isActive={router.pathname === '/admin'} isDark>
              Tableau de bord
            </VerticalMenu.Item>
          </Link>

          {isAdmin && (
            <Link href="/admin/contacts">
              <VerticalMenu.Item
                isActive={router.pathname === '/admin/contacts' || router.pathname.startsWith('/admin/contact/')}
                isDark
              >
                Contacts
              </VerticalMenu.Item>
            </Link>
          )}

          {isAdmin && (
            <Link href="/admin/institutions">
              <VerticalMenu.Item
                isActive={
                  router.pathname === '/admin/institutions' || router.pathname.startsWith('/admin/institution/')
                }
                isDark
              >
                Institutions
              </VerticalMenu.Item>
            </Link>
          )}

          {isAdmin && (
            <Link href="/admin/testimonies">
              <VerticalMenu.Item
                isActive={router.pathname === '/admin/testimonies' || router.pathname.startsWith('/admin/testimon/')}
                isDark
              >
                Témoignages
              </VerticalMenu.Item>
            </Link>
          )}

          {isRecruiter && (
            <Link href={`/admin/institution/${auth?.user?.institutionId}`}>
              <VerticalMenu.Item
                isActive={
                  router.pathname === '/admin/institutions' || router.pathname.startsWith('/admin/institution/')
                }
                isDark
              >
                Mon institution
              </VerticalMenu.Item>
            </Link>
          )}

          <Link href="/admin/jobs">
            <VerticalMenu.Item
              isActive={router.pathname === '/admin/jobs' || router.pathname.startsWith('/admin/job/')}
              isDark
            >
              Offres d’emploi
            </VerticalMenu.Item>
          </Link>

          <Link href="/admin/applications">
            <VerticalMenu.Item
              isActive={router.pathname === '/admin/applications' || router.pathname.startsWith('/admin/application/')}
              isDark
            >
              Mon vivier
            </VerticalMenu.Item>
          </Link>

          {isAdmin && (
            <Link href="/admin/domains">
              <VerticalMenu.Item
                isActive={router.pathname === '/admin/domains' || router.pathname.startsWith('/admin/domain/')}
                isDark
              >
                Domaines
              </VerticalMenu.Item>
            </Link>
          )}

          {isAdmin && (
            <Link href="/admin/professions">
              <VerticalMenu.Item
                isActive={router.pathname === '/admin/professions' || router.pathname.startsWith('/admin/profession/')}
                isDark
              >
                Compétences
              </VerticalMenu.Item>
            </Link>
          )}

          {isAdmin && (
            <Link href="/admin/recruiters">
              <VerticalMenu.Item
                isActive={router.pathname === '/admin/recruiters' || router.pathname.startsWith('/admin/recruiter/')}
                isDark
              >
                Services recruteurs
              </VerticalMenu.Item>
            </Link>
          )}

          <ButtonAsLink onClick={signOut}>
            <VerticalMenu.Item isDark>Déconnexion</VerticalMenu.Item>
          </ButtonAsLink>
        </VerticalMenu>

        <MenuTitle>ADMINISTRATION</MenuTitle>

        <VerticalMenu>
          {isAdmin && (
            <>
              <Link href="/admin/leads">
                <VerticalMenu.Item
                  isActive={router.pathname === '/admin/leads' || router.pathname.startsWith('/admin/lead/')}
                  isDark
                >
                  Abonné·es
                </VerticalMenu.Item>
              </Link>
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
            </>
          )}
        </VerticalMenu>

        {isAdmin && (
          <>
            <MenuTitle>LEGACY</MenuTitle>

            <VerticalMenu>
              <Link href="/admin/legacy-jobs">
                <VerticalMenu.Item
                  isActive={
                    router.pathname === '/admin/legacy-jobs' || router.pathname.startsWith('/admin/legacy-job/')
                  }
                  isDark
                  style={{
                    textDecoration: 'line-through',
                  }}
                >
                  Offres d’emploi
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
          </>
        )}
      </div>
    </Box>
  )
}
