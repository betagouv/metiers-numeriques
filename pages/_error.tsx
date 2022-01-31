/**
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#create-a-custom-_error-page
 */

import * as Sentry from '@sentry/nextjs'
import NextErrorComponent from 'next/error'

import type { NextPageContext } from 'next'
import type { ErrorProps } from 'next/error'

export default function MetiersNumeriquesError({ err, hasGetInitialPropsRun, statusCode }) {
  if (!hasGetInitialPropsRun && err) {
    Sentry.captureException(err)
  }

  return <NextErrorComponent statusCode={statusCode} />
}

MetiersNumeriquesError.getInitialProps = async (context: NextPageContext) => {
  const errorInitialProps: ErrorProps & {
    hasGetInitialPropsRun?: boolean
  } = await NextErrorComponent.getInitialProps(context)

  const { asPath, err } = context

  errorInitialProps.hasGetInitialPropsRun = true

  if (err) {
    Sentry.captureException(err)

    // await Sentry.flush(2000)

    return errorInitialProps
  }

  Sentry.captureException(new Error(`_error.js getInitialProps missing data at path: ${asPath}`))
  await Sentry.flush(2000)

  return errorInitialProps
}
