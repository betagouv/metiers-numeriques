/**
 * @jest-environment jsdom
 */

import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder as any
global.TextDecoder = TextDecoder as any

// eslint-disable-next-line import/first
import { matomo, MatomoGoal } from '../matomo'

describe('app/libs/matomo', () => {
  test(`.getApplicationsCount()`, async () => {
    const result = await matomo.getApplicationsCount()

    expect(result).toStrictEqual(expect.any(Number))
  })

  test(`.getVisitsCount()`, async () => {
    const result = await matomo.getVisitsCount()

    expect(result).toStrictEqual(expect.any(Number))
  })

  describe('.trackGoal()', () => {
    test(`with NEW_JOB_APPLICATION`, () => {
      const matomoGoal = MatomoGoal.NEW_JOB_APPLICATION

      const call = () => matomo.trackGoal(matomoGoal)

      expect(call).not.toThrow()
    })

    test(`with JOB_OPENING`, () => {
      const matomoGoal = MatomoGoal.JOB_OPENING

      const call = () => matomo.trackGoal(matomoGoal)

      expect(call).not.toThrow()
    })
  })
})
