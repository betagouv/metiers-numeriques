/* eslint-disable no-underscore-dangle */

import ky from 'ky-universal'

export enum MatomoGoal {
  NEW_JOB_APPLICATION = 1,
  JOB_OPENING = 2,
}

const API_COMMON_SEARCH_PARAMS = {
  format: 'JSON',
  idSite: 191,
  module: 'API',
  token_auth: 'anonymous',
}
const API_URL = 'https://stats.data.gouv.fr/index.php'

export const matomo = {
  getApplicationsCount: async (): Promise<number> => {
    const { nb_conversions: value } = await ky
      .get(API_URL, {
        searchParams: {
          ...API_COMMON_SEARCH_PARAMS,
          date: 'previous30',
          idGoal: '1',
          method: 'Goals.get',
          period: 'range',
        },
      })
      .json<{
        // Rates are formatted as "0.00%"
        conversion_rate: string
        conversion_rate_new_visit: string
        conversion_rate_returning_visit: string
        nb_conversions: number
        nb_conversions_new_visit: number
        nb_conversions_returning_visit: number
        nb_visits_converted: number
        nb_visits_converted_new_visit: number
        nb_visits_converted_returning_visit: number
        revenue: number
        revenue_new_visit: number
        revenue_returning_visit: number
      }>()

    return value
  },

  getVisitsCount: async (): Promise<number> => {
    const { value } = await ky
      .get(API_URL, {
        searchParams: {
          ...API_COMMON_SEARCH_PARAMS,
          date: 'previous30',
          method: 'VisitsSummary.getVisits',
          period: 'range',
        },
      })
      .json<{
        value: number
      }>()

    return value
  },

  trackGoal: (matomoGoal: MatomoGoal) => {
    if (window === undefined || (window as any)._paq === undefined) {
      return
    }

    ;(window as any)._paq.push(['trackGoal', matomoGoal])
  },
}
