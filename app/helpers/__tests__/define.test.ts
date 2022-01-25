/**
 * @jest-environment jsdom
 */

import { define } from '../define'

describe('app/helpers/define()', () => {
  test(`with a number`, () => {
    const value = 123.456

    const result = define(value)

    expect(result).toEqual(value)
  })

  test(`with a string`, () => {
    const value = 'a string'

    const result = define(value)

    expect(result).toEqual(value)
  })

  test(`with an empty string`, () => {
    const value = ''

    const result = define(value)

    expect(result).toBeUndefined()
  })

  test(`with an empty string (once trimmed)`, () => {
    const value = ' '

    const result = define(value)

    expect(result).toBeUndefined()
  })

  test(`with an array`, () => {
    const value = ['an', 'array']

    const result = define(value)

    expect(result).toEqual(value)
  })

  test(`with an empty array`, () => {
    const value = []

    const result = define(value)

    expect(result).toBeUndefined()
  })

  test(`with an object`, () => {
    const value = {
      an: 'object',
    }

    const result = define(value)

    expect(result).toEqual(value)
  })

  test(`with an empty object`, () => {
    const value = {}

    const result = define(value)

    expect(result).toBeUndefined()
  })

  test(`with null`, () => {
    const value = null

    const result = define(value)

    expect(result).toBeUndefined()
  })

  test(`with undefined`, () => {
    const value = undefined

    const result = define(value)

    expect(result).toBeUndefined()
  })
})
