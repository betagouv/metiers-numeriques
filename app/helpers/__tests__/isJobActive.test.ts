/**
 * @jest-environment jsdom
 */

import dayjs from 'dayjs'

import { isJobActive } from '../isJobActive'

describe('app/helpers/isJobActive()', () => {
  test(`with a draft job`, () => {
    const job = {
      state: 'DRAFT',
    }

    const result = isJobActive(job as any)

    expect(result).toStrictEqual(false)
  })

  test(`with a published expired job`, () => {
    const job = {
      expiredAt: dayjs().subtract(1, 'day'),
      state: 'PUBLISHED',
    }

    const result = isJobActive(job as any)

    expect(result).toStrictEqual(false)
  })

  test(`with a published non-expired job`, () => {
    const job = {
      expiredAt: dayjs(),
      state: 'PUBLISHED',
    }

    const result = isJobActive(job as any)

    expect(result).toStrictEqual(true)
  })
})
