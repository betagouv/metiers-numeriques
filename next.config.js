const { withSentryConfig } = require('@sentry/nextjs')

const { CI, NODE_ENV, npm_package_version: VERSION } = process.env
const IS_PRODUCTION_AND_NOT_CI = NODE_ENV === 'production' && !CI

const config = {
  compiler: {
    styledComponents: true,
  },
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
  debug: !IS_PRODUCTION_AND_NOT_CI,
  release: VERSION,
  silent: IS_PRODUCTION_AND_NOT_CI,
  tracesSampleRate: 0,
}

module.exports = IS_PRODUCTION_AND_NOT_CI ? withSentryConfig(config, sentryWebpackPluginOptions) : config
