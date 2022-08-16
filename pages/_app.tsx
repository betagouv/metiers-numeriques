import { WithGraphql } from '@app/hocs/WithGraphql'
import { Footer } from '@app/organisms/Footer'
import { Header } from '@app/organisms/Header'
import { CrispScript } from '@app/scripts/CrispScript'
import { MatomoScript } from '@app/scripts/MatomoScript'
import { SessionProvider } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'

import '@fontsource/poppins/300.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/700.css'
import 'remixicon/fonts/remixicon.css'

const DynamicAdminWrapper = dynamic(() => import('@app/hocs/AdminWrapper').then(module => module.AdminWrapper) as any, {
  ssr: false,
}) as any

export default function MetiersNumeriquesApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter()

  const isAdministrationSpace = router.pathname === '/admin' || router.pathname.startsWith('/admin/')

  if (isAdministrationSpace) {
    return (
      <SessionProvider session={session}>
        <DynamicAdminWrapper>
          <Component {...pageProps} />
        </DynamicAdminWrapper>
      </SessionProvider>
    )
  }

  return (
    <>
      <Head>
        <title>Métiers du Numérique</title>

        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1, shrink-to-fit=no" name="viewport" />
        <link href="/favicons/apple-touch-icon.png" rel="apple-touch-icon" />
        <link href="/favicons/favicon.svg" rel="icon" type="image/svg+xml" />
        <link href="/favicons/favicon.ico" rel="icon" type="image/x-icon" />
        <link crossOrigin="use-credentials" href="/manifest.webmanifest" rel="manifest" />

        <meta content="rbHd2NXOspK6-avguNFUvBzgddpFwWzph-a8Ebxepvo" name="google-site-verification" />

        <meta content="Métiers du Numérique" property="og:title" />
        <meta
          content="L’État Numérique : Des projets à découvrir, des missions à pourvoir !"
          property="og:description"
        />
        <meta content="/images/main-illu.png" property="og:image" />
      </Head>

      <SessionProvider session={session}>
        <WithGraphql>
          <Header />
          <main>
            <Component {...pageProps} />
          </main>
          <Footer />
          <div id="modal" />

          <>
            <MatomoScript />
            <CrispScript />
          </>
        </WithGraphql>
      </SessionProvider>
    </>
  )
}
