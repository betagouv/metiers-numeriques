import { GlobalStyle, ThemeProvider } from '@singularity/core'
import { AuthProvider } from 'nexauth/client'
import Head from 'next/head'
import { createGlobalStyle } from 'styled-components'

import { AdminBody } from '../atoms/AdminBody'
import { AdminMain } from '../atoms/AdminMain'
import { AdminLoader } from '../molecules/AdminLoader'
import { AdminMenu } from '../molecules/AdminMenu'
import { AdminToaster } from '../molecules/AdminToaster'
import { SignInDialog } from '../organisms/SignInDialog'
import { WithGraphql } from './WithGraphql'

const GlobalStyleCustom = createGlobalStyle`
  html, body {
    height: 100%;
  }

  body,
  #__next {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-height: 0;
    min-width: 0;
  }

  body:after {
    display: none;
  }

  [href] {
    box-shadow: none;
  }

  textarea {
    cursor: auto;

    :focus {
      outline: none;
    }
  }
`

const PRIVATE_PATHS = [/^\/admin($|\/)/]

type AdminWrapperProps = {
  children: any
}
export function AdminWrapper({ children }: AdminWrapperProps) {
  return (
    <>
      <Head>
        <title>metiers.numeriques.gouv.fr</title>

        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1, shrink-to-fit=no" name="viewport" />
        <link href="/favicons/apple-touch-icon.png" rel="apple-touch-icon" />
        <link href="/favicons/favicon.svg" rel="icon" type="image/svg+xml" />
        <link href="/favicons/favicon.ico" rel="icon" type="image/x-icon" />
        <link crossOrigin="use-credentials" href="/manifest.webmanifest" rel="manifest" />

        <meta content="rbHd2NXOspK6-avguNFUvBzgddpFwWzph-a8Ebxepvo" name="google-site-verification" />

        <meta content="metiers.numerique.gouv.fr" property="og:title" />
        <meta
          content="L’État Numérique : Des projets à découvrir, des missions à pourvoir !"
          property="og:description"
        />
        <meta content="/images/main-illu.png" property="og:image" />
      </Head>

      <ThemeProvider>
        <GlobalStyle />
        <GlobalStyleCustom />

        <AuthProvider Loader={AdminLoader} privatePaths={PRIVATE_PATHS} SignInDialog={SignInDialog}>
          <WithGraphql>
            <AdminBody>
              <AdminMenu />

              <AdminMain>
                {children}

                <AdminToaster />
              </AdminMain>
            </AdminBody>
          </WithGraphql>
        </AuthProvider>
      </ThemeProvider>
    </>
  )
}
