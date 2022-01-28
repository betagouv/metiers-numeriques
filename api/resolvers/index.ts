import { GraphQLDateTime } from 'graphql-iso-date'
import { GraphQLJSONObject } from 'graphql-type-json'

import * as files from './files'
import * as legacyEntities from './legacy-entities'
import * as legacyInstitutions from './legacy-institutions'
import * as legacyJobs from './legacy-jobs'
import * as legacyServices from './legacy-services'
import * as recruiters from './recruiters'
import * as users from './users'

export default {
  DateTime: GraphQLDateTime,
  JSONObject: GraphQLJSONObject,
  Mutation: {
    ...files.mutation,
    ...legacyEntities.mutation,
    ...legacyInstitutions.mutation,
    ...legacyJobs.mutation,
    ...legacyServices.mutation,
    ...recruiters.mutation,
    ...users.mutation,
  },
  Query: {
    ...files.query,
    ...legacyEntities.query,
    ...legacyInstitutions.query,
    ...legacyJobs.query,
    ...legacyServices.query,
    ...recruiters.query,
    ...users.query,
  },
}
