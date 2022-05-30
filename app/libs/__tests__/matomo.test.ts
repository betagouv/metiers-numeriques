/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import ky from 'ky-universal'
import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder as any
global.TextDecoder = TextDecoder as any

const kyMock: any = ky
kyMock.get = jest.fn(() => ({
  json: () => Promise.resolve({}),
}))

// eslint-disable-next-line import/first
import { matomo, MatomoGoal } from '../matomo'

describe('app/libs/matomo', () => {
  beforeAll(() => {
    // eslint-disable-next-line no-underscore-dangle
    ;(window as any)._paq = {
      push: jest.fn(),
    }
  })

  test(`.getApplicationsCount()`, async () => {
    await matomo.getApplicationsCount()

    expect(kyMock.get).toHaveBeenCalledWith('https://stats.data.gouv.fr/index.php', {
      searchParams: {
        date: 'previous30',
        format: 'JSON',
        idGoal: '1',
        idSite: 191,
        method: 'Goals.get',
        module: 'API',
        period: 'range',
        token_auth: 'anonymous',
      },
    })
  })

  test(`.getVisitsCount()`, async () => {
    await matomo.getVisitsCount()

    expect(kyMock.get).toHaveBeenCalledWith('https://stats.data.gouv.fr/index.php', {
      searchParams: {
        date: 'previous30',
        format: 'JSON',
        idSite: 191,
        method: 'VisitsSummary.getVisits',
        module: 'API',
        period: 'range',
        token_auth: 'anonymous',
      },
    })
  })

  describe('.trackGoal()', () => {
    test(`with NEW_JOB_APPLICATION`, () => {
      const matomoGoal = MatomoGoal.NEW_JOB_APPLICATION

      matomo.trackGoal(matomoGoal)

      // eslint-disable-next-line no-underscore-dangle
      expect((window as any)._paq.push).toHaveBeenCalledWith(['trackGoal', 1])
    })

    test(`with JOB_OPENING`, () => {
      const matomoGoal = MatomoGoal.JOB_OPENING

      matomo.trackGoal(matomoGoal)

      // eslint-disable-next-line no-underscore-dangle
      expect((window as any)._paq.push).toHaveBeenCalledWith(['trackGoal', 2])
    })

    test(`with missing Matomo script`, () => {
      // eslint-disable-next-line no-underscore-dangle
      delete (window as any)._paq

      const matomoGoal = MatomoGoal.NEW_JOB_APPLICATION

      const call = () => matomo.trackGoal(matomoGoal)

      // eslint-disable-next-line no-underscore-dangle
      expect(call).not.toThrow()
    })
  })
})
