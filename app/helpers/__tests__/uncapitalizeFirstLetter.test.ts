/**
 * @jest-environment jsdom
 */

import { uncapitalizeFirstLetter } from '../uncapitalizeFirstLetter'

describe('app/helpers/uncapitalizeFirstLetter()', () => {
  test(`with "Abajour"`, () => {
    const text = 'Abajour'

    const result = uncapitalizeFirstLetter(text)

    expect(result).toEqual('abajour')
  })

  test(`with "État de fait"`, () => {
    const text = 'État de fait'

    const result = uncapitalizeFirstLetter(text)

    expect(result).toEqual('état de fait')
  })

  test(`with null`, () => {
    const text = null

    const result = uncapitalizeFirstLetter(text)

    expect(result).toEqual('')
  })

  test(`with undefined`, () => {
    const text = undefined

    const result = uncapitalizeFirstLetter(text as any)

    expect(result).toEqual('')
  })
})
