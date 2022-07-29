import { getApiSecretFromNextRequest } from '@api/helpers/getApiSecretFromNextRequest'
import { permission } from '@api/libs/permission'
import { resolvers } from '@api/resolvers'
import { handleError } from '@common/helpers/handleError'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchema } from '@graphql-tools/load'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { ApolloServer } from 'apollo-server-micro'
import { applyMiddleware } from 'graphql-middleware'
import { shield, or } from 'graphql-shield'
import { getToken } from 'next-auth/jwt'
import path from 'path'

import type { NextApiRequest, NextApiResponse } from 'next'

const { DOMAIN_URL } = process.env
const GRAPHQL_SCHEMA_PATH = path.join(process.cwd(), 'graphql/schema.graphql')

/* eslint-disable sort-keys-fix/sort-keys-fix */
const permissions = shield({
  Mutation: {
    createAddress: permission.isAdministratorOrManager,
    deleteAddress: permission.isAdministrator,
    updateAddress: permission.isAdministrator,

    createArchivedJob: permission.isAdministrator,
    deleteArchivedJob: permission.isAdministrator,
    updateArchivedJob: permission.isAdministrator,

    createContact: permission.isAdministratorOrManager,
    deleteContact: permission.isAdministrator,
    updateContact: permission.isAdministrator,

    createFile: permission.isAdministrator,
    deleteFile: permission.isAdministrator,
    updateFile: permission.isAdministrator,

    createJob: permission.isAdministratorOrManager,
    deleteJob: permission.isAdministrator,
    updateJob: permission.isAdministratorOrManager,

    deleteLead: permission.isAdministrator,
    updateLead: permission.isAdministrator,

    createLegacyJob: permission.isAdministrator,
    deleteLegacyJob: permission.isAdministrator,
    updateLegacyJob: permission.isAdministrator,

    createLegacyEntity: permission.isAdministrator,
    deleteLegacyEntity: permission.isAdministrator,
    updateLegacyEntity: permission.isAdministrator,

    createLegacyInstitution: permission.isAdministrator,
    deleteLegacyInstitution: permission.isAdministrator,
    updateLegacyInstitution: permission.isAdministrator,

    createLegacyService: permission.isAdministrator,
    deleteLegacyService: permission.isAdministrator,
    updateLegacyService: permission.isAdministrator,

    createProfession: permission.isAdministrator,
    deleteProfession: permission.isAdministrator,
    updateProfession: permission.isAdministrator,

    createRecruiter: permission.isAdministrator,
    deleteRecruiter: permission.isAdministrator,
    updateRecruiter: permission.isAdministrator,

    deleteUser: permission.isAdministrator,
    updateUser: permission.isAdministrator,
  },
  Query: {
    getAddress: permission.isAdministrator,
    getAddresses: permission.isAdministrator,

    getArchivedJob: permission.isAdministrator,
    getArchivedJobs: permission.isAdministrator,

    getContact: permission.isAdministrator,
    getContacts: permission.isAdministrator,
    getContactsList: permission.isAdministratorOrManager,

    getFile: permission.isAdministrator,
    getFiles: permission.isAdministrator,

    getInstitution: permission.isAdministratorOrManager,
    getInstitutions: permission.isAdministrator,
    getInstitutionsList: permission.isPublic,
    getAllInstitutions: permission.isAdministrator,
    getPublicInstitutions: permission.isPublic,

    getJob: permission.isAdministratorOrManager,
    getJobs: permission.isAdministratorOrManager,
    getAllJobs: permission.isAdministratorOrManager,
    getPublicJobs: permission.isPublic,

    getLead: permission.isAdministrator,
    getLeads: permission.isAdministrator,

    getLegacyEntity: permission.isAdministrator,
    getLegacyEntities: permission.isAdministrator,
    getLegacyEntitiesList: permission.isAdministrator,

    getLegacyInstitution: permission.isAdministrator,
    getLegacyInstitutions: permission.isAdministrator,

    getLegacyJob: permission.isAdministrator,
    getLegacyJobs: permission.isAdministrator,
    getAllLegacyJobs: permission.isAdministrator,
    getPublicLegacyJobs: permission.isPublic,

    getLegacyService: permission.isAdministrator,
    getLegacyServices: permission.isAdministrator,
    getLegacyServicesList: permission.isAdministrator,

    getProfession: permission.isAdministrator,
    getProfessions: permission.isAdministrator,
    getProfessionsList: permission.isPublic,

    getRecruiter: permission.isAdministratorOrManager,
    getRecruiters: permission.isAdministrator,
    getRecruitersList: permission.isAdministratorOrManager,

    getUser: or(permission.isAdministrator, permission.isMe),
    getUsers: permission.isAdministrator,
  },
})
/* eslint-enable sort-keys-fix/sort-keys-fix */

// eslint-disable-next-line @typescript-eslint/naming-convention
const GRAPHQL_SERVER: {
  apolloServer?: ApolloServer
} = {}

export default async function ApiGraphqlEndpoint(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (DOMAIN_URL === undefined) {
      throw new Error('`DOMAIN_URL` environment variable is undefined.')
    }

    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Headers', 'Accept, Content-Type, Origin, X-Requested-With')
    res.setHeader('Access-Control-Allow-Origin', DOMAIN_URL)

    if (req.method === 'OPTIONS') {
      res.end()

      return false
    }

    if (!GRAPHQL_SERVER.apolloServer) {
      // https://www.graphql-tools.com/docs/schema-loading#usage
      const typeDefs = await loadSchema(GRAPHQL_SCHEMA_PATH, {
        loaders: [new GraphQLFileLoader()],
      })

      const schema = makeExecutableSchema({ resolvers, typeDefs })
      const schemaWithPermissions = applyMiddleware(schema, permissions)

      GRAPHQL_SERVER.apolloServer = new ApolloServer({
        context: async ({ req }: { req: NextApiRequest }) => {
          const apiSecret = getApiSecretFromNextRequest(req)
          const { user } = await getToken({ req })

          return {
            apiSecret,
            user,
          }
        },
        schema: schemaWithPermissions,
      })

      await GRAPHQL_SERVER.apolloServer.start()
    }

    await (GRAPHQL_SERVER.apolloServer as unknown as ApolloServer).createHandler({
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
