/**
 * @jest-environment jsdom
 */

import { isObjectEmpty } from '../isObjectEmpty'

describe('app/helpers/isObjectEmpty()', () => {
  test(`with no prop`, () => {
    const obj = {}

    const result = isObjectEmpty(obj)

    expect(result).toBe(true)
  })

  test(`with undefined props`, () => {
    const obj = {
      anEmptyArray: [],
      anotherProp: undefined,
      aProp: undefined,
    }

    const result = isObjectEmpty(obj)

    expect(result).toBe(true)
  })

  test(`with defined props`, () => {
    const obj = {
      anotherProp: 2,
      aProp: 4,
    }

    const result = isObjectEmpty(obj)

    expect(result).toBe(false)
  })

  test(`with some undefined props`, () => {
    const obj = {
      anotherProp: undefined,
      aProp: 4,
    }

    const result = isObjectEmpty(obj)

    expect(result).toBe(false)
  })
})
