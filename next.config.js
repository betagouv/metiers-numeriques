const { withSentryConfig } = require('@sentry/nextjs')

const { NODE_ENV, npm_package_version: VERSION } = process.env
const IS_PRODUCTION = NODE_ENV === 'production'

const config = {
  eslint: {
    // https://nextjs.org/docs/api-reference/next.config.js/ignoring-eslint
    ignoreDuringBuilds: true,
  },
  headers: async () => [
    {
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
      ],
      source: '/:any*',
    },
  ],
  reactStrictMode: true,
  // Disable source maps uoloading via SentryWebpackPlugin
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#disable-sentrywebpackplugin
  sentry: {
    disableClientWebpackPlugin: true,
    disableServerWebpackPlugin: true,
  },
}

// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#extend-nextjs-configuration
const sentryWebpackPluginOptions = {
  debug: !IS_PRODUCTION,
  release: VERSION,
  silent: IS_PRODUCTION,
  tracesSampleRate: 1,
}

module.exports = withSentryConfig(config, sentryWebpackPluginOptions)
