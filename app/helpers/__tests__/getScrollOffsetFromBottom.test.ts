/**
 * @jest-environment jsdom
 */

import { getScrollOffsetFromBottom } from '../getScrollOffsetFromBottom'

describe('app/helpers/getScrollOffsetFromBottom()', () => {
  test(`with a draft job`, () => {
    Object.defineProperty(window.document.body, 'scrollHeight', {
      configurable: true,
      value: 3,
      writable: true,
    })

    window.innerHeight = 2
    window.scrollY = 1

    const result = getScrollOffsetFromBottom()

    expect(result).toStrictEqual(0)
  })
})
