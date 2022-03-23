import AdminBody from '@app/atoms/AdminBody'
import AdminMain from '@app/atoms/AdminMain'
import { WithGraphql } from '@app/hocs/WithGraphql'
import AdminMenu from '@app/molecules/AdminMenu'
import { AdminToaster } from '@app/molecules/AdminToaster'
import Loader from '@app/molecules/Loader'
import { Footer } from '@app/organisms/Footer'
import { Header } from '@app/organisms/Header'
import SignInDialog from '@app/organisms/SignInDialog'
import { CrispScript } from '@app/scripts/CrispScript'
import { MatomoScript } from '@app/scripts/MatomoScript'
import { GlobalStyle, ThemeProvider } from '@singularity/core'
import { AuthProvider } from 'nexauth/client'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { createGlobalStyle } from 'styled-components'

import '@fontsource/poppins/300.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/700.css'
import 'remixicon/fonts/remixicon.css'

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

export default function MetiersNumeriquesApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter()

  const isAdministrationSpace = router.pathname === '/admin' || router.pathname.startsWith('/admin/')

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

        {!isAdministrationSpace && (
          <>
            <link href="/dsfr.min.css" rel="stylesheet" />
            <link href="/legacy.css" rel="stylesheet" />
          </>
        )}
      </Head>

      <ThemeProvider>
        {isAdministrationSpace && <GlobalStyle />}
        {isAdministrationSpace && <GlobalStyleCustom />}

        <AuthProvider Loader={Loader} privatePaths={PRIVATE_PATHS} SignInDialog={SignInDialog}>
          <WithGraphql>
            {!isAdministrationSpace && (
              <>
                <Header />
                <main>
                  {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                  <Component {...pageProps} />
                </main>
                <Footer />

                <>
                  <MatomoScript />
                  <CrispScript />
                </>
              </>
            )}

            {isAdministrationSpace && (
              <AdminBody>
                <AdminMenu />

                <AdminMain>
                  <Component {...pageProps} />

                  <AdminToaster />
                </AdminMain>
              </AdminBody>
            )}
          </WithGraphql>
        </AuthProvider>
      </ThemeProvider>
    </>
  )
}
