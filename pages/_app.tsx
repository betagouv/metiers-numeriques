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

const PRIVATE_PATHS = [/^\/admin($|\/)/]

const GlobalStyleCustom = createGlobalStyle<{
  theme: {
    color: any
  }
}>`
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

          <meta content="initial-scale=1, width=device-width" name="viewport" />
          <link href="/index.bundle.css" rel="stylesheet" />
        </Head>

        <Header />
        <WithGraphql>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} />
        </WithGraphql>
        <Footer />

        <>
          <script defer src="/js/externals/matomo.js" type="text/javascript" />
          <script defer src="/js/externals/crisp.js" type="text/javascript" />
        </>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Espace d’administration</title>

        <meta content="initial-scale=1, width=device-width" name="viewport" />
      </Head>

      <ThemeProvider>
        <GlobalStyle />
        <GlobalStyleCustom />

        <AuthProvider Loader={Loader} privatePaths={PRIVATE_PATHS} SignInModal={SignInDialog}>
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
