/**
 * @jest-environment jsdom
 */
import JsCookie from 'js-cookie'

import { cookie, CookieKey, COOKIE_STORE_ID } from '../cookie'

describe('app/libs/cookie', () => {
  describe('.set()', () => {
    test(`with an undefined cookie store`, () => {
      const key = CookieKey.HAS_SUBSCRIBED_TO_NEWSLETTER
      const value = 'aValue'

      cookie.set(key, value)

      expect(window.document.cookie).toStrictEqual(
        'METIERS_NUMERIQUE_CONFIG={%22HAS_SUBSCRIBED_TO_NEWSLETTER%22:%22aValue%22}',
      )
    })

    test(`with a non-JSON cookie store`, () => {
      JsCookie.set(COOKIE_STORE_ID, '')

      const key = CookieKey.HAS_SUBSCRIBED_TO_NEWSLETTER
      const value = 'aValue'

      cookie.set(key, value)

      expect(window.document.cookie).toStrictEqual(
        'METIERS_NUMERIQUE_CONFIG={%22HAS_SUBSCRIBED_TO_NEWSLETTER%22:%22aValue%22}',
      )
    })

    test(`with a non-JSON object cookie store`, () => {
      JsCookie.set(COOKIE_STORE_ID, '[]')

      const key = CookieKey.HAS_SUBSCRIBED_TO_NEWSLETTER
      const value = 'aValue'

      cookie.set(key, value)

      expect(window.document.cookie).toStrictEqual(
        'METIERS_NUMERIQUE_CONFIG={%22HAS_SUBSCRIBED_TO_NEWSLETTER%22:%22aValue%22}',
      )
    })

    test(`with a valid JSON object cookie store`, () => {
      JsCookie.set(
        COOKIE_STORE_ID,
        JSON.stringify({
          ANOTHER_KEY: 'anotherValue',
        }),
      )

      const key = CookieKey.HAS_SUBSCRIBED_TO_NEWSLETTER
      const value = 'aValue'

      cookie.set(key, value)

      expect(window.document.cookie).toStrictEqual(
        'METIERS_NUMERIQUE_CONFIG={%22ANOTHER_KEY%22:%22anotherValue%22%2C%22HAS_SUBSCRIBED_TO_NEWSLETTER%22:%22aValue%22}',
      )
    })
  })

  describe('.get()', () => {
    test(`with a valid JSON cookie store`, () => {
      const key = CookieKey.HAS_SUBSCRIBED_TO_NEWSLETTER

      const result = cookie.get(key)

      expect(result).toStrictEqual('aValue')
    })

    test(`with a non-JSON cookie store`, () => {
      JsCookie.set(COOKIE_STORE_ID, '')

      const key = CookieKey.HAS_SUBSCRIBED_TO_NEWSLETTER

      const result = cookie.get(key)

      expect(result).toBeUndefined()
    })

    test(`with an undefined cookie store`, () => {
      JsCookie.remove(COOKIE_STORE_ID)

      const key = CookieKey.HAS_SUBSCRIBED_TO_NEWSLETTER

      const result = cookie.get(key)

      expect(result).toBeUndefined()
    })
  })
})
