import AdminBody from '@app/atoms/AdminBody'
import AdminMain from '@app/atoms/AdminMain'
import WithGraphql from '@app/hocs/WithGraphql'
import AdminMenu from '@app/molecules/AdminMenu'
import Footer from '@app/molecules/Footer'
import Header from '@app/molecules/Header'
import Loader from '@app/molecules/Loader'
import SignInDialog from '@app/organisms/SignInDialog'
import { GlobalStyle, ThemeProvider } from '@singularity/core'
import { AuthProvider } from 'nexauth'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { createGlobalStyle } from 'styled-components'

import 'remixicon/fonts/remixicon.css'

const PRIVATE_PATHS = [/^\/admin($|\/)/]

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
`

export default function MetiersNumeriquesApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter()

  const isAdministrationSpace = router.pathname === '/admin' || router.pathname.startsWith('/admin/')

  if (!isAdministrationSpace) {
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

          <link href="/dsfr.min.css" rel="stylesheet" />
          <link href="/legacy.css" rel="stylesheet" />
        </Head>

        <Header />
        <WithGraphql>
          <main>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Component {...pageProps} />
          </main>
        </WithGraphql>
        <Footer />

        <>
          <script defer src="/js/matomo.js" type="text/javascript" />
          <script defer src="/js/crisp.js" type="text/javascript" />
        </>
      </>
    )
  }

  return (
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

      <ThemeProvider>
        <GlobalStyle />
        <GlobalStyleCustom />

        <AuthProvider Loader={Loader} privatePaths={PRIVATE_PATHS} SignInDialog={SignInDialog}>
          <AdminBody>
            <AdminMenu />

            <AdminMain>
              <WithGraphql>
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <Component {...pageProps} />
              </WithGraphql>
            </AdminMain>
          </AdminBody>
        </AuthProvider>
      </ThemeProvider>
    </>
  )
}
