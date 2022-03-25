import { GraphQLDateTime } from 'graphql-iso-date'
import { GraphQLJSONObject } from 'graphql-type-json'

import * as addresses from './addresses'
import * as archivedJobs from './archived-jobs'
import * as contacts from './contacts'
import * as files from './files'
import * as institutions from './institutions'
import * as jobs from './jobs'
import * as leads from './leads'
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
    ...archivedJobs.mutation,
    ...contacts.mutation,
    ...files.mutation,
    ...institutions.mutation,
    ...jobs.mutation,
    ...leads.mutation,
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
    ...archivedJobs.query,
    ...contacts.query,
    ...files.query,
    ...institutions.query,
    ...jobs.query,
    ...leads.query,
    ...legacyEntities.query,
    ...legacyInstitutions.query,
    ...legacyJobs.query,
    ...legacyServices.query,
    ...professions.query,
    ...recruiters.query,
    ...users.query,
  },
}
