import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import Footer from '@app/molecules/Footer'
import Header from '@app/molecules/Header'
import { CrispScript } from '@app/scripts/CrispScript'
import { MatomoScript } from '@app/scripts/MatomoScript'
import Head from 'next/head'
import { useRouter } from 'next/router'

const graphqlClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: '/api/graphql',
})

export default function MetiersNumeriquesApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter()

  const isAdministrationSpace = router.pathname === '/admin' || router.pathname.startsWith('/admin/')

  if (isAdministrationSpace) {
    return <Component {...pageProps} />
  }

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

      <ApolloProvider client={graphqlClient}>
        <Header />
        <main>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} />
        </main>
        <Footer />
      </ApolloProvider>

      <>
        {/* <script defer src="/js/matomo.js" type="text/javascript" /> */}
        <MatomoScript />
        <CrispScript />
      </>
    </>
  )
}
