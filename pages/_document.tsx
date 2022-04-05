import Document, { Head, Html, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

import type { DocumentContext } from 'next/document'

/**
 * @see https://github.com/vercel/next.js/blob/canary/examples/with-styled-components/pages/_document.js
 */
export default class TellMeDocument extends Document<{
  isWebsite: boolean
}> {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          // eslint-disable-next-line react/jsx-props-no-spreading
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      const isWebsite = ctx.pathname !== '/admin' && !ctx.pathname.startsWith('/admin/')

      return {
        ...initialProps,
        isWebsite,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render(): JSX.Element {
    const { isWebsite } = this.props

    return (
      <Html lang="fr-FR">
        <Head>
          {isWebsite && (
            <>
              <link href="/dsfr.min.css" rel="stylesheet" />
              <link href="/legacy.css" rel="stylesheet" />
            </>
          )}
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
