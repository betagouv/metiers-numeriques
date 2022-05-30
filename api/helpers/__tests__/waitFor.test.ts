/**
 * @jest-environment node
 */

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

import { waitFor } from '../waitFor'

describe('api/helpers/waitFor()', () => {
  beforeAll(() => {
    dayjs.extend(duration)
  })

  test(`should wait for 1s`, async () => {
    const inMs = 1000

    const start = dayjs()
    await waitFor(inMs)
    const end = dayjs()

    expect(dayjs.duration(end.diff(start)).asSeconds()).toBeGreaterThan(1)
  })
})
