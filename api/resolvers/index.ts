import { GraphQLDateTime } from 'graphql-iso-date'
import { GraphQLJSONObject } from 'graphql-type-json'

import * as addresses from './addresses'
import * as contacts from './contacts'
import * as files from './files'
import * as jobs from './jobs'
import * as legacyEntities from './legacy-entities'
import * as legacyInstitutions from './legacy-institutions'
import * as legacyJobs from './legacy-jobs'
import * as legacyServices from './legacy-services'
import * as professions from './professions'
import * as recruiters from './recruiters'
import * as users from './users'

export default {
  DateTime: GraphQLDateTime,
  JSONObject: GraphQLJSONObject,
  Mutation: {
    ...addresses.mutation,
    ...contacts.mutation,
    ...files.mutation,
    ...jobs.mutation,
    ...legacyEntities.mutation,
    ...legacyInstitutions.mutation,
    ...legacyJobs.mutation,
    ...legacyServices.mutation,
    ...professions.mutation,
    ...recruiters.mutation,
    ...users.mutation,
  },
  Query: {
    ...addresses.query,
    ...contacts.query,
    ...files.query,
    ...jobs.query,
    ...legacyEntities.query,
    ...legacyInstitutions.query,
    ...legacyJobs.query,
    ...legacyServices.query,
    ...professions.query,
    ...recruiters.query,
    ...users.query,
  },
}
