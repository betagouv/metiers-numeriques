import JsCookie from 'js-cookie'

type JsonValue = Common.BNS | Common.BNS[] | Common.Pojo | Common.Pojo[]

export const COOKIE_STORE_ID = 'METIERS_NUMERIQUE_CONFIG'

export enum CookieKey {
  HAS_SUBSCRIBED_TO_NEWSLETTER = 'HAS_SUBSCRIBED_TO_NEWSLETTER',
}

class Cookie {
  public get(key: CookieKey): JsonValue | undefined {
    const maybeCookieStoreAsJson = JsCookie.get(COOKIE_STORE_ID)
    if (maybeCookieStoreAsJson === undefined) {
      return
    }

    const maybeCookieStore = this.parse(maybeCookieStoreAsJson)
    if (maybeCookieStore === undefined) {
      return
    }

    return maybeCookieStore[key]
  }

  public set(key: CookieKey, value: JsonValue): void {
    const maybeCookieStoreAsJson = JsCookie.get(COOKIE_STORE_ID)
    if (maybeCookieStoreAsJson === undefined) {
      this.setFirst(key, value)

      return
    }

    const maybeCookieStore = this.parse(maybeCookieStoreAsJson)
    if (typeof maybeCookieStore !== 'object' || maybeCookieStore.constructor.name !== 'Object') {
      JsCookie.remove(COOKIE_STORE_ID)
      this.setFirst(key, value)

      return
    }

    maybeCookieStore[key] = value
    const configAsJson = JSON.stringify(maybeCookieStore)

    JsCookie.set(COOKIE_STORE_ID, configAsJson)
  }

  private setFirst(key: CookieKey, value: JsonValue): void {
    const cookieStore = {
      [key]: value,
    }
    const maybeCookieStoreAsString = JSON.stringify(cookieStore)

    JsCookie.set(COOKIE_STORE_ID, maybeCookieStoreAsString)
  }

  private parse(valueAsJson: string): Record<string, any> | undefined {
    try {
      return JSON.parse(valueAsJson)
    } catch (err) {
      return undefined
    }
  }
}

export const cookie = new Cookie()
