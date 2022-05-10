/**
 * @jest-environment jsdom
 */

import { capitalizeFirstLetter } from '../capitalizeFirstLetter'

describe('app/helpers/capitalizeFirstLetter()', () => {
  test(`with "abajour"`, () => {
    const text = 'abajour'

    const result = capitalizeFirstLetter(text)

    expect(result).toEqual('Abajour')
  })

  test(`with "état de fait"`, () => {
    const text = 'état de fait'

    const result = capitalizeFirstLetter(text)

    expect(result).toEqual('État de fait')
  })

  test(`with undefined`, () => {
    const text = undefined

    const result = capitalizeFirstLetter(text as any)

    expect(result).toEqual('')
  })
})
