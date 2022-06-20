/**
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#create-initialization-config-files
 */

import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
  dsn: SENTRY_DSN || 'https://8455fc18afa143f8a6c01c9a62d99599@o1128337.ingest.sentry.io/6170892',
  tracesSampleRate: 0,
})
