/**
 * @jest-environment jsdom
 */

import generateKeyFromValue from '../generateKeyFromValue'

describe('app/helpers/generateKeyFromValue()', () => {
  test(`with a number`, () => {
    const value = 123.456

    const result = generateKeyFromValue(value)

    expect(result).toEqual('8ecf2acc686a468d922d11637d833cfcb9778957')
  })

  test(`with "a string"`, () => {
    const value = 'a string'

    const result = generateKeyFromValue(value)

    expect(result).toEqual('3ba59f8353a8c3a833783e85dee4cfacced42d5a')
  })

  test(`with an array`, () => {
    const value = ['an', 'array']

    const result = generateKeyFromValue(value)

    expect(result).toEqual('4a6f502fa72420d581f571c551797c18ce288a16')
  })

  test(`with an object`, () => {
    const value = {
      an: 'object',
    }

    const result = generateKeyFromValue(value)

    expect(result).toEqual('0b20f2a4324b794b752b0ec422d7285b00a73c49')
  })

  test(`with null`, () => {
    const value = null

    const result = generateKeyFromValue(value)

    expect(result).toEqual('2be88ca4242c76e8253ac62474851065032d6833')
  })

  test(`with undefined`, () => {
    const value = undefined

    const result = generateKeyFromValue(value)

    expect(result).toEqual('')
  })

  test(`with an instance`, () => {
    const value = new Error()

    const result = generateKeyFromValue(value)

    expect(result).toEqual('bf21a9e8fbc5a3846fb05b4fa0859e0917b2202f')
  })

  test(`with a class`, () => {
    const value = Error

    const result = generateKeyFromValue(value)

    expect(result).toEqual('')
  })
})
