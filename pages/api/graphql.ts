import permission from '@api/libs/permission'
import resolvers from '@api/resolvers'
import handleError from '@common/helpers/handleError'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchema } from '@graphql-tools/load'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { ApolloServer } from 'apollo-server-micro'
import { applyMiddleware } from 'graphql-middleware'
import { shield, or } from 'graphql-shield'
import { getUser } from 'nexauth'
import path from 'path'

import type { NextApiRequest, NextApiResponse } from 'next'

const { DOMAIN_URL } = process.env
const ALLOWED_ORIGINS = [DOMAIN_URL, 'https://studio.apollographql.com']

const permissions = shield({
  Mutation: {
    createFile: permission.isAdministrator,
    createLegacyEntity: permission.isAdministrator,
    createLegacyInstitution: permission.isAdministrator,
    createLegacyJob: permission.isAdministrator,
    createLegacyService: permission.isAdministrator,
    deleteFile: permission.isAdministrator,
    deleteLegacyEntity: permission.isAdministrator,
    deleteLegacyInstitution: permission.isAdministrator,
    deleteLegacyJob: permission.isAdministrator,
    deleteLegacyService: permission.isAdministrator,
    deleteUser: permission.isAdministrator,
    updateFile: permission.isAdministrator,
    updateLegacyEntity: permission.isAdministrator,
    updateLegacyInstitution: permission.isAdministrator,
    updateLegacyJob: permission.isAdministrator,
    updateLegacyService: permission.isAdministrator,
    updateUser: permission.isAdministrator,
  },
  Query: {
    getFile: permission.isPublic,
    getFiles: permission.isPublic,
    getLegacyEntities: permission.isPublic,
    getLegacyEntity: permission.isPublic,
    getLegacyInstitution: permission.isPublic,
    getLegacyInstitutions: permission.isPublic,
    getLegacyJob: permission.isPublic,
    getLegacyJobs: permission.isPublic,
    getLegacyService: permission.isPublic,
    getLegacyServices: permission.isPublic,
    getUser: or(permission.isAdministrator, permission.isMe),
    getUsers: permission.isAdministrator,
  },
})

// eslint-disable-next-line @typescript-eslint/naming-convention
const __GRAPHQL_SERVER: {
  apolloServer?: ApolloServer
} = {}
export default async function ApiGraphqlEndpoint(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (DOMAIN_URL === undefined) {
      throw new Error('`DOMAIN_URL` environment variable is undefined.')
    }

    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Headers', 'Accept, Content-Type, Origin, X-Requested-With')
    if (req.headers.origin !== undefined && ALLOWED_ORIGINS.includes(req.headers.origin)) {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
    }

    if (req.method === 'OPTIONS') {
      res.end()

      return false
    }

    if (!__GRAPHQL_SERVER.apolloServer) {
      // https://www.graphql-tools.com/docs/schema-loading#usage
      const typeDefs = await loadSchema(path.join(process.cwd(), 'api/schema.graphql'), {
        loaders: [new GraphQLFileLoader()],
      })

      const schema = makeExecutableSchema({ resolvers, typeDefs })
      const schemaWithPermissions = applyMiddleware(schema, permissions)

      __GRAPHQL_SERVER.apolloServer = new ApolloServer({
        context: async ({ req }: { req: NextApiRequest }) => {
          const user = await getUser(req)

          return {
            user,
          }
        },
        schema: schemaWithPermissions,
      })

      await __GRAPHQL_SERVER.apolloServer.start()
    }

    await (__GRAPHQL_SERVER.apolloServer as unknown as ApolloServer).createHandler({
      path: '/api/graphql',
    })(req, res)
  } catch (err) {
    handleError(err, 'pages/api/graphql.js', res)
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
