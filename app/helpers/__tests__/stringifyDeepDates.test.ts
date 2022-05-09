/**
 * @jest-environment jsdom
 */

import { stringifyDeepDates } from '../stringifyDeepDates'

describe('app/helpers/stringifyDeepDates()', () => {
  const nowAsIsoString = '2022-01-01T00:00:00.000Z'
  const nowAsDate = new Date(nowAsIsoString)
  const someOtherProps = {
    anotherBoolean: false,
    anotherDate: nowAsDate,
    anotherNull: null,
    anotherNumber: 2,
    anotherString: 'b',
  }
  const someProps = {
    aBoolean: true,
    aDate: nowAsDate,
    anArray: [someOtherProps],
    anObject: someOtherProps,
    aNull: null,
    aNumber: 1,
    aString: 'a',
  }

  test(`with an object`, () => {
    const input = someProps

    const result = stringifyDeepDates(input)

    expect(result).toStrictEqual({
      ...someProps,
      aDate: nowAsIsoString,
      anArray: [
        {
          ...someOtherProps,
          anotherDate: nowAsIsoString,
        },
      ],
      anObject: {
        ...someOtherProps,
        anotherDate: nowAsIsoString,
      },
    })
  })

  test(`with an array`, () => {
    const input = [
      {
        ...someProps,
      },
      {
        ...someOtherProps,
      },
    ]

    const result = stringifyDeepDates(input)

    expect(result).toStrictEqual([
      {
        ...someProps,
        aDate: nowAsIsoString,
        anArray: [
          {
            ...someOtherProps,
            anotherDate: nowAsIsoString,
          },
        ],
        anObject: {
          ...someOtherProps,
          anotherDate: nowAsIsoString,
        },
      },
      {
        ...someOtherProps,
        anotherDate: nowAsIsoString,
      },
    ])
  })
})
