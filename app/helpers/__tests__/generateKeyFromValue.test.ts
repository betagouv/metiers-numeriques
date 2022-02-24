/**
 * @jest-environment jsdom
 */

import { generateKeyFromValues } from '../generateKeyFromValues'

describe('app/helpers/generateKeyFromValues()', () => {
  test(`with a number`, () => {
    const value = 123.456

    const result = generateKeyFromValues(value)

    expect(result).toEqual('7f9e52c9c35e8b9cf7c1efc58efabb97ab588f11')
  })

  test(`with "a string"`, () => {
    const value = 'a string'

    const result = generateKeyFromValues(value)

    expect(result).toEqual('6b15bcaf2e78c3aa6cbc4fa3853c108b1b0cb594')
  })

  test(`with an array`, () => {
    const value = ['an', 'array']

    const result = generateKeyFromValues(value)

    expect(result).toEqual('138d8e428959587fa6bd0602d56935290a208297')
  })

  test(`with an object`, () => {
    const value = {
      an: 'object',
    }

    const result = generateKeyFromValues(value)

    expect(result).toEqual('2b571b1cfcb2b25f0d445651119596e9f00c4c67')
  })

  test(`with null`, () => {
    const value = null

    const result = generateKeyFromValues(value)

    expect(result).toEqual('d44da22510de9a5eb7275b61a4beebd4d0cd6b5d')
  })

  test(`with undefined`, () => {
    const value = undefined

    const result = generateKeyFromValues(value)

    expect(result).toEqual('d44da22510de9a5eb7275b61a4beebd4d0cd6b5d')
  })

  test(`with an instance`, () => {
    const value = new Error()

    const result = generateKeyFromValues(value)

    expect(result).toEqual('4e9950a1f2305f56d358cad23f28203fb3aacbef')
  })

  test(`with a class`, () => {
    const value = Error

    const result = generateKeyFromValues(value)

    expect(result).toEqual('d44da22510de9a5eb7275b61a4beebd4d0cd6b5d')
  })

  test(`with no args`, () => {
    const result = generateKeyFromValues()

    expect(result).toEqual('')
  })
})
