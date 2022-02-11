import Head from 'next/head'

import AdminBody from '../atoms/AdminBody'
import AdminMain from '../atoms/AdminMain'
import AdminMenu from '../molecules/AdminMenu'
import { AdminToaster } from '../molecules/AdminToaster'
import { withAuth } from './withAuth'
import { withGraphql } from './withGraphql'
import { withTheme } from './withTheme'

export function withAdminHocs(WrappedComponent: any) {
  const WrappedComponentWithLayout = (props: any) => (
    <>
      <Head>
        <title>Espace d’administration | metiers.numerique.gouv.fr</title>

        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1, shrink-to-fit=no" name="viewport" />
        <link href="/favicons/apple-touch-icon.png" rel="apple-touch-icon" />
        <link href="/favicons/favicon.svg" rel="icon" type="image/svg+xml" />
        <link href="/favicons/favicon.ico" rel="icon" type="image/x-icon" />
        <link crossOrigin="use-credentials" href="/manifest.webmanifest" rel="manifest" />
      </Head>

      <AdminBody>
        <AdminMenu />

        <AdminMain>
          <WrappedComponent {...props} />

          <AdminToaster />
        </AdminMain>
      </AdminBody>
    </>
  )

  return withTheme(withAuth(withGraphql(WrappedComponentWithLayout)))
}
