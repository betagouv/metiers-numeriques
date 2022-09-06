// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
  dsn: SENTRY_DSN || 'https://53ba47eead7047d1b51347564faaf9a4@sentry.incubateur.net/55',
  environment: process.env.SENTRY_ENVIRONMENT,
  tracesSampleRate: 0.1,
})
