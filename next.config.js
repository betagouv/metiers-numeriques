import { withSentryConfig } from '@sentry/nextjs'

const { CI } = process.env

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
  rewrites: () => [
    {
      destination: '/api/sitemap',
      source: '/sitemap.xml',
    },
  ],
  swcMinify: true,
}

// eslint-disable-next-line import/no-default-export
export default CI ? config : withSentryConfig(config, { silent: true })
