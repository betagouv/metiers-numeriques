import { UserRole } from '@prisma/client'
import { GlobalStyle, ThemeProvider } from '@singularity/core'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { createGlobalStyle } from 'styled-components'

import { AdminBody } from '../atoms/AdminBody'
import { AdminMain } from '../atoms/AdminMain'
import { AdminMenu } from '../molecules/AdminMenu'
import { AdminToaster } from '../molecules/AdminToaster'
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

type AdminWrapperProps = {
  children: any
}

export function AdminWrapper({ children }: AdminWrapperProps) {
  const router = useRouter()
  const { data: auth } = useSession({ required: true })

  // TODO: handle it server side? Seems to be impossible right now due to the way middleware works: https://next-auth.js.org/configuration/nextjs#caveats
  if (auth?.user?.role === UserRole.CANDIDATE || !auth?.user?.isActive) {
    router.push('/404')

    return null
  }

  return (
    <>
      <Head>
        <title>Administration | Métiers du Numérique</title>

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

      <ThemeProvider>
        <GlobalStyle />
        <GlobalStyleCustom />

        <WithGraphql>
          <AdminBody>
            <AdminMenu />

            <AdminMain>
              {children}

              <AdminToaster />
            </AdminMain>
          </AdminBody>
        </WithGraphql>
      </ThemeProvider>
    </>
  )
}
