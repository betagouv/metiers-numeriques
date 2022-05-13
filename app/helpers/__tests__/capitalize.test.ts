/**
 * @jest-environment jsdom
 */

import { capitalize } from '../capitalize'

describe('app/helpers/capitalize()', () => {
  test(`with "abajour"`, () => {
    const text = 'abajour'

    const result = capitalize(text)

    expect(result).toEqual('Abajour')
  })

  test(`with "état de fait"`, () => {
    const text = 'état de fait'

    const result = capitalize(text)

    expect(result).toEqual('État De Fait')
  })

  test(`with "abaJour"`, () => {
    const text = 'abaJour'

    const result = capitalize(text)

    expect(result).toEqual('Abajour')
  })

  test(`with "état DE FAIT"`, () => {
    const text = 'état DE FAIT'

    const result = capitalize(text)

    expect(result).toEqual('État De Fait')
  })

  test(`with "pier-pol-jak"`, () => {
    const text = 'pier-pol-jak'

    const result = capitalize(text)

    expect(result).toEqual('Pier-Pol-Jak')
  })

  test(`with undefined`, () => {
    const text = undefined

    const result = capitalize(text as any)

    expect(result).toEqual('')
  })
})
